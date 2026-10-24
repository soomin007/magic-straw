// 화면과 입력. 규칙은 engine.js가 맡고, 여기서는 그리고 연출하고 입력을 받는다.
(function () {
  'use strict';

  // 장면 좌표 (960 x 540 기준)
  const SCENE_WIDTH = 960;
  const SCENE_HEIGHT = 540;
  const CELL = 88;
  const TABLE_TOP = 400;
  const BOARD_LEFT = 210;
  const STRAW_TIP = { x: 205, y: 318 };
  const CABLE_END = { x: 150, y: 404 };
  const INSERT_OFFSET = 14;

  const PIECE_MOVE_MS = 260;
  const LOW_BATTERY_SAVER = 2;
  const DEATHS_BEFORE_SKIP = 3;
  const STORAGE_KEY = 'magic-straw-progress';

  const DRINK_ORDER = ['ice', 'soda'];
  const DRINK_LABELS = { ice: '아이스 아메리카노', soda: '소다' };

  const levels = window.LEVEL_DEFINITIONS.map(window.Engine.parseLevel);
  const Engine = window.Engine;
  const Art = window.Art;

  const byId = (id) => document.getElementById(id);
  const ui = {
    window: byId('window'),
    stage: byId('stage'),
    scene: byId('scene'),
    board: byId('board'),
    strip: byId('strip'),
    rowHighlight: byId('row-highlight'),
    fxLayer: byId('fx-layer'),
    cable: byId('my-cable'),
    levelName: byId('level-name'),
    levelDots: byId('level-dots'),
    difficultyButton: byId('btn-difficulty'),
    undoButton: byId('btn-undo'),
    restartButton: byId('btn-restart'),
    helpButton: byId('btn-help'),
    drinks: byId('drinks'),
    trayHint: byId('tray-hint'),
    toast: byId('toast'),
    notify: byId('notify'),
    battery: byId('battery'),
    batteryFill: byId('battery-fill'),
    batteryText: byId('battery-text'),
    overlayDead: byId('overlay-dead'),
    overlayWon: byId('overlay-won'),
    wonText: byId('won-text'),
    wonNext: byId('won-next'),
    deadSkip: byId('dead-skip'),
    popupLow: byId('popup-low'),
    popupLowBar: byId('popup-low-bar'),
    helpPanel: byId('help-panel'),
  };

  const progress = loadProgress();
  const game = {
    levelIndex: Math.min(progress.current, levels.length - 1),
    level: null,
    state: null,
    history: [],
    selectedDrink: null,
    busy: false,
    deaths: {},
    saverNoticeShown: false,
    lowPopupShown: false,
    pieceElements: new Map(),
  };

  // 진행 저장. 저장소를 쓸 수 없는 환경에서도 게임은 그대로 돌아가야 한다.
  function loadProgress() {
    const fallback = { current: 0, unlocked: 0, cleared: [], difficulty: 'relaxed' };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? { ...fallback, ...saved } : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // 저장하지 못해도 이번 플레이에는 영향이 없다.
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 탭이 가려지면 브라우저가 애니메이션을 멈추므로, 정해진 시간이 지나면 끝난 것으로 보고 넘어간다.
  function animationDone(animation, duration) {
    return Promise.race([animation.finished, wait(duration + 50)]);
  }

  // 레벨 시작과 판 구성

  function startLevel(index) {
    game.levelIndex = index;
    game.level = levels[index];
    game.state = Engine.initial(game.level, Engine.batteryFor(game.level, progress.difficulty));
    game.history = [];
    game.saverNoticeShown = false;
    game.lowPopupShown = false;
    if (!game.level.drinks.includes(game.selectedDrink)) game.selectedDrink = null;

    progress.current = index;
    saveProgress();

    hideOverlays();
    buildBoard();
    buildDrinks();
    render(game.state, false);
    updateHud();
  }

  function boardTop() {
    return TABLE_TOP - game.level.height * CELL;
  }

  function buildBoard() {
    const { level } = game;
    ui.board.style.left = `${BOARD_LEFT}px`;
    ui.board.style.top = `${boardTop()}px`;
    ui.board.style.width = `${level.width * CELL}px`;
    ui.board.style.height = `${level.height * CELL}px`;

    ui.rowHighlight.style.width = `${(level.width - 1) * CELL}px`;
    ui.strip.style.left = `${(level.width - 1) * CELL}px`;
    ui.strip.innerHTML = Art.image('powerStrip', Art.powerStrip(level.height, level.sockets, CELL));

    for (const element of game.pieceElements.values()) element.remove();
    game.pieceElements.clear();

    for (const obj of game.state.objects) {
      const element = document.createElement('div');
      element.className = `piece piece-${obj.kind}`;
      element.innerHTML = `${Art.image(obj.kind, Art.objects[obj.kind])}<div class="bubble">${Art.bubble}</div>`;
      ui.board.appendChild(element);
      game.pieceElements.set(obj.id, element);
    }
  }

  function buildDrinks() {
    ui.drinks.innerHTML = '';
    for (const drink of DRINK_ORDER) {
      if (!game.level.drinks.includes(drink)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'drink';
      button.dataset.drink = drink;
      const key = DRINK_ORDER.indexOf(drink) + 1;
      button.innerHTML = `${Art.image(`drink-${drink}`, Art.drinks[drink])}<span>${DRINK_LABELS[drink]}</span><span class="key">${key}</span>`;
      button.addEventListener('click', () => selectDrink(drink));
      ui.drinks.appendChild(button);
    }
    updateDrinks();
  }

  function selectDrink(drink) {
    if (game.busy) return;
    game.selectedDrink = game.selectedDrink === drink ? null : drink;
    updateDrinks();
    clearAim();
  }

  // 그리기

  function piecePosition(obj) {
    const x = obj.x * CELL + (obj.inserted ? INSERT_OFFSET : 0);
    const y = obj.y * CELL;
    return { x, y };
  }

  function render(snapshot, animate) {
    ui.board.classList.toggle('instant', !animate);
    for (const obj of snapshot.objects) {
      const element = game.pieceElements.get(obj.id);
      const { x, y } = piecePosition(obj);
      element.style.transform = `translate(${x}px, ${-y}px)`;
      element.classList.toggle('floating', obj.bubble > 0);
      element.classList.toggle('inserted', obj.inserted);
    }
    if (!animate) {
      // 강제로 한 번 배치를 계산해 두어야 다음 움직임부터 다시 부드럽게 옮겨진다.
      void ui.board.offsetWidth;
      ui.board.classList.remove('instant');
    }
  }

  // 내 플러그에서 내 자리 쪽으로 이어지는 충전선. 움직이는 동안에도 따라가도록 매 프레임 다시 그린다.
  function drawCable() {
    const plug = game.state && game.state.objects.find((obj) => obj.kind === 'myPlug');
    const element = plug && game.pieceElements.get(plug.id);
    const sceneBox = ui.scene.getBoundingClientRect();
    const scale = sceneBox.width / SCENE_WIDTH;
    if (element && scale > 0) {
      const box = element.getBoundingClientRect();
      const startX = (box.left - sceneBox.left) / scale + 2;
      const startY = (box.top - sceneBox.top) / scale + CELL * 0.84;
      const bend = Math.max(40, (startX - CABLE_END.x) * 0.5);
      ui.cable.setAttribute('d',
        `M ${startX} ${startY} C ${startX - bend} ${startY + 30}, ${CABLE_END.x + 40} ${CABLE_END.y + 10}, ${CABLE_END.x} ${CABLE_END.y}`);
    }
    requestAnimationFrame(drawCable);
  }

  function fitScene() {
    const width = ui.stage.clientWidth;
    const height = ui.stage.clientHeight;
    const scale = Math.min(width / SCENE_WIDTH, height / SCENE_HEIGHT);
    const offsetX = (width - SCENE_WIDTH * scale) / 2;
    const offsetY = (height - SCENE_HEIGHT * scale) / 2;
    ui.scene.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  function updateDrinks() {
    for (const button of ui.drinks.querySelectorAll('.drink')) {
      const selected = button.dataset.drink === game.selectedDrink;
      button.setAttribute('aria-pressed', String(selected));
      const firstLevel = game.levelIndex === 0;
      button.classList.toggle('beckon', firstLevel && !game.selectedDrink && game.state.used === 0);
    }
    ui.board.classList.toggle('aim-ice', game.selectedDrink === 'ice');
    ui.board.classList.toggle('aim-soda', game.selectedDrink === 'soda');

    let hint = '';
    if (game.levelIndex === 0 && game.state.status === 'playing') {
      hint = game.selectedDrink ? '테이블에서 뱉을 높이를 누르세요' : '컵을 눌러 한 모금 마셔 보세요';
    }
    ui.trayHint.textContent = hint;
  }

  function updateHud() {
    const { level, state } = game;
    const levelNumber = game.levelIndex + 1;
    ui.levelName.textContent = `${levelNumber}. ${level.title}`;
    document.title = `${level.title} | 내 자리, 내 충전기`;

    ui.levelDots.innerHTML = '';
    levels.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'level-dot';
      dot.textContent = String(index + 1);
      dot.title = item.title;
      dot.disabled = index > progress.unlocked;
      dot.classList.toggle('current', index === game.levelIndex);
      dot.classList.toggle('cleared', progress.cleared.includes(item.id));
      dot.addEventListener('click', () => {
        if (!game.busy) startLevel(index);
      });
      ui.levelDots.appendChild(dot);
    });

    const difficulty = Engine.DIFFICULTIES.find((item) => item.id === progress.difficulty);
    ui.difficultyButton.innerHTML = `<span class="label-long">난이도 </span>${difficulty.label}`;
    ui.difficultyButton.title = `난이도 ${difficulty.label}`;
    ui.undoButton.disabled = game.history.length === 0;

    const full = Engine.batteryFor(level, progress.difficulty);
    const charging = state.status === 'won';
    // 빠듯 난이도는 처음부터 배터리가 적으므로, 한 번이라도 행동한 뒤에만 절전 모드를 켠다.
    const saver = state.status === 'playing' && state.used > 0 && state.battery <= LOW_BATTERY_SAVER;
    ui.batteryText.textContent = `${state.battery}%`;
    ui.batteryFill.style.width = charging ? '100%' : `${Math.max(0, state.battery / full) * 100}%`;
    ui.battery.classList.toggle('low', !charging && state.battery <= LOW_BATTERY_SAVER);
    ui.battery.classList.toggle('charging', charging);
    ui.window.classList.toggle('power-saver', saver);

    updateDrinks();
  }

  // 연출

  let toastTimer = null;
  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove('visible'), 1800);
  }

  let notifyTimer = null;
  function showNotification(message) {
    ui.notify.textContent = message;
    ui.notify.classList.add('visible');
    clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => ui.notify.classList.remove('visible'), 2600);
  }

  function shakeBoard() {
    ui.board.classList.remove('shake');
    void ui.board.offsetWidth;
    ui.board.classList.add('shake');
  }

  function rowCenterY(row) {
    return boardTop() + (game.level.height - 1 - row) * CELL + CELL / 2;
  }

  async function shootIce(effect) {
    const shot = document.createElement('div');
    shot.className = 'ice-shot';
    ui.fxLayer.appendChild(shot);
    const rowY = rowCenterY(effect.row);
    const entryX = BOARD_LEFT + 10;
    const hitX = BOARD_LEFT + effect.hitX * CELL - 10;
    const travel = Math.max(1, effect.hitX);
    const duration = 160 + travel * 55;
    const animation = shot.animate([
      { transform: `translate(${STRAW_TIP.x}px, ${STRAW_TIP.y}px) rotate(0deg)` },
      { transform: `translate(${entryX}px, ${rowY}px) rotate(90deg)`, offset: 0.25 },
      { transform: `translate(${hitX}px, ${rowY}px) rotate(360deg)` },
    ], { duration, easing: 'linear', fill: 'forwards' });
    await animationDone(animation, duration);
    shot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    setTimeout(() => shot.remove(), 200);
  }

  async function shootBubble(targetId) {
    const target = Engine.findObject(game.state, targetId);
    const shot = document.createElement('div');
    shot.className = 'bubble-shot';
    ui.fxLayer.appendChild(shot);
    const targetX = BOARD_LEFT + target.x * CELL + CELL / 2;
    const targetY = rowCenterY(target.y);
    const peakX = (STRAW_TIP.x + targetX) / 2;
    const peakY = Math.min(STRAW_TIP.y, targetY) - 70;
    const animation = shot.animate([
      { transform: `translate(${STRAW_TIP.x}px, ${STRAW_TIP.y}px) scale(0.5)` },
      { transform: `translate(${peakX}px, ${peakY}px) scale(0.9)` },
      { transform: `translate(${targetX}px, ${targetY}px) scale(1.4)`, opacity: 0.2 },
    ], { duration: 380, easing: 'ease-out', fill: 'forwards' });
    await animationDone(animation, 380);
    shot.remove();
  }

  // 조준과 입력

  function cellFromPointer(event) {
    const box = ui.board.getBoundingClientRect();
    const { width, height } = game.level;
    const x = Math.floor(((event.clientX - box.left) / box.width) * width);
    const y = height - 1 - Math.floor(((event.clientY - box.top) / box.height) * height);
    if (x < 0 || x >= width || y < 0 || y >= height) return null;
    return { x, y };
  }

  function firstInRow(row) {
    for (let x = 0; x < game.level.width - 1; x++) {
      const obj = Engine.objectAt(game.state, x, row);
      if (obj) return obj;
    }
    return null;
  }

  function clearAim() {
    ui.rowHighlight.classList.remove('visible');
    for (const element of game.pieceElements.values()) element.classList.remove('targeted');
  }

  function actionForCell(cell) {
    if (game.selectedDrink === 'ice') return { drink: 'ice', row: cell.y };
    if (game.selectedDrink === 'soda') {
      const obj = Engine.objectAt(game.state, cell.x, cell.y);
      return obj ? { drink: 'soda', target: obj.id } : null;
    }
    return null;
  }

  function onBoardMove(event) {
    if (game.busy || game.state.status !== 'playing') return;
    clearAim();
    const cell = cellFromPointer(event);
    if (!cell) return;

    if (game.selectedDrink === 'ice') {
      ui.rowHighlight.style.top = `${(game.level.height - 1 - cell.y) * CELL}px`;
      ui.rowHighlight.classList.add('visible');
      const target = firstInRow(cell.y);
      if (target) game.pieceElements.get(target.id).classList.add('targeted');
    } else if (game.selectedDrink === 'soda') {
      const action = actionForCell(cell);
      if (action && Engine.check(game.level, game.state, action).ok) {
        game.pieceElements.get(action.target).classList.add('targeted');
      }
    }
  }

  function onBoardClick(event) {
    if (game.busy || game.state.status !== 'playing') return;
    const cell = cellFromPointer(event);
    if (!cell) return;

    if (!game.selectedDrink) {
      showToast('먼저 아래에서 음료를 고르세요');
      return;
    }
    const action = actionForCell(cell);
    if (!action) {
      showToast('거품은 물건에 붙여야 합니다');
      return;
    }
    perform(action);
  }

  async function perform(action) {
    if (game.busy) return;
    const result = Engine.step(game.level, game.state, action);
    if (!result.ok) {
      showToast(result.reason);
      shakeBoard();
      return;
    }

    game.busy = true;
    clearAim();
    if (action.drink === 'ice') await shootIce(result.effect);
    else await shootBubble(result.effect.targetId);

    render(result.frames[0], true);
    await wait(PIECE_MOVE_MS);
    render(result.frames[1], true);
    await wait(PIECE_MOVE_MS);

    game.history.push(game.state);
    game.state = result.state;
    game.busy = false;
    afterMove();
  }

  function afterMove() {
    updateHud();
    const { state } = game;

    if (state.status === 'won') {
      onWin();
      return;
    }
    if (state.status === 'dead') {
      onDead();
      return;
    }
    if (state.battery <= LOW_BATTERY_SAVER && !game.saverNoticeShown) {
      game.saverNoticeShown = true;
      showNotification('배터리가 얼마 남지 않아 절전 모드를 켰습니다');
    }
    if (state.battery === 1 && !game.lowPopupShown) {
      game.lowPopupShown = true;
      showLowBatteryPopup();
    }
  }

  function onWin() {
    const { level, state } = game;
    if (!progress.cleared.includes(level.id)) progress.cleared.push(level.id);
    progress.unlocked = Math.max(progress.unlocked, Math.min(game.levelIndex + 1, levels.length - 1));
    saveProgress();
    updateHud();
    showNotification('전원에 연결됨, 충전 중');

    const isLast = game.levelIndex === levels.length - 1;
    const best = state.used === level.optimal ? ' 가장 짧은 방법으로 풀었습니다.' : '';
    ui.wonText.textContent = isLast
      ? `${state.used}번 만에 되찾았습니다.${best} 1챕터의 마지막 판이었습니다.`
      : `${state.used}번 만에 되찾았습니다.${best}`;
    ui.wonNext.textContent = isLast ? '처음 판으로' : '다음 판';
    setTimeout(() => {
      ui.popupLow.hidden = true;
      ui.overlayWon.hidden = false;
    }, 500);
  }

  function onDead() {
    const id = game.level.id;
    game.deaths[id] = (game.deaths[id] || 0) + 1;
    ui.popupLow.hidden = true;
    ui.deadSkip.hidden = game.deaths[id] < DEATHS_BEFORE_SKIP || game.levelIndex === levels.length - 1;
    ui.overlayDead.hidden = false;
  }

  function hideOverlays() {
    ui.overlayDead.hidden = true;
    ui.overlayWon.hidden = true;
    ui.popupLow.hidden = true;
  }

  function undo() {
    if (game.busy || game.history.length === 0) return;
    game.state = game.history.pop();
    hideOverlays();
    render(game.state, true);
    updateHud();
  }

  function restart() {
    if (game.busy) return;
    startLevel(game.levelIndex);
  }

  function nextLevel() {
    const next = game.levelIndex + 1 < levels.length ? game.levelIndex + 1 : 0;
    startLevel(next);
  }

  function skipLevel() {
    progress.unlocked = Math.max(progress.unlocked, game.levelIndex + 1);
    saveProgress();
    nextLevel();
  }

  function cycleDifficulty() {
    if (game.busy) return;
    const ids = Engine.DIFFICULTIES.map((item) => item.id);
    progress.difficulty = ids[(ids.indexOf(progress.difficulty) + 1) % ids.length];
    saveProgress();
    startLevel(game.levelIndex);
    const label = Engine.DIFFICULTIES.find((item) => item.id === progress.difficulty).label;
    showToast(`난이도를 ${label}${withRo(label)} 바꾸고 판을 처음부터 시작합니다`);
  }

  // '여유로', '보통으로'처럼 받침에 맞는 조사를 고른다.
  function withRo(word) {
    const code = word.charCodeAt(word.length - 1) - 0xac00;
    const finalConsonant = code >= 0 && code <= 11171 ? code % 28 : 0;
    return finalConsonant === 0 || finalConsonant === 8 ? '로' : '으로';
  }

  // 배터리 부족 팝업. 판을 가리지만 제목 줄을 잡고 끌어서 치울 수 있다.
  function showLowBatteryPopup() {
    ui.popupLow.style.left = '50%';
    ui.popupLow.style.top = '30%';
    ui.popupLow.style.transform = 'translate(-50%, 0)';
    ui.popupLow.hidden = false;
  }

  function enablePopupDrag() {
    let drag = null;
    ui.popupLowBar.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      const box = ui.popupLow.getBoundingClientRect();
      const parent = ui.popupLow.offsetParent.getBoundingClientRect();
      drag = { dx: event.clientX - box.left, dy: event.clientY - box.top, parent };
      ui.popupLowBar.setPointerCapture(event.pointerId);
    });
    ui.popupLowBar.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const left = event.clientX - drag.parent.left - drag.dx;
      const top = event.clientY - drag.parent.top - drag.dy;
      ui.popupLow.style.transform = 'none';
      ui.popupLow.style.left = `${left}px`;
      ui.popupLow.style.top = `${top}px`;
    });
    ui.popupLowBar.addEventListener('pointerup', () => {
      drag = null;
    });
  }

  function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'z' || key === 'backspace') {
      event.preventDefault();
      undo();
    } else if (key === 'r') {
      restart();
    } else if (key === 'escape') {
      ui.helpPanel.hidden = true;
      if (game.selectedDrink) selectDrink(game.selectedDrink);
    } else if (key === '1' || key === '2') {
      const drink = DRINK_ORDER[Number(key) - 1];
      if (game.level.drinks.includes(drink) && game.state.status === 'playing') selectDrink(drink);
    } else if ((key === 'enter' || key === ' ') && !ui.overlayWon.hidden) {
      event.preventDefault();
      nextLevel();
    }
  }

  function bindEvents() {
    ui.board.addEventListener('pointermove', onBoardMove);
    ui.board.addEventListener('pointerleave', clearAim);
    ui.board.addEventListener('click', onBoardClick);
    ui.undoButton.addEventListener('click', undo);
    ui.restartButton.addEventListener('click', restart);
    ui.difficultyButton.addEventListener('click', cycleDifficulty);
    ui.helpButton.addEventListener('click', () => {
      ui.helpPanel.hidden = !ui.helpPanel.hidden;
    });
    byId('help-close').addEventListener('click', () => {
      ui.helpPanel.hidden = true;
    });
    byId('dead-undo').addEventListener('click', undo);
    byId('dead-restart').addEventListener('click', restart);
    ui.deadSkip.addEventListener('click', skipLevel);
    ui.wonNext.addEventListener('click', nextLevel);
    byId('won-undo').addEventListener('click', undo);
    byId('popup-low-close').addEventListener('click', () => {
      ui.popupLow.hidden = true;
    });
    enablePopupDrag();
    document.addEventListener('keydown', onKey);
    new ResizeObserver(fitScene).observe(ui.stage);
  }

  function init() {
    document.querySelector('.player').innerHTML = Art.image('player', Art.player);
    document.querySelector('.neighbor').innerHTML = Art.image('neighbor', Art.neighbor);
    bindEvents();
    fitScene();
    startLevel(game.levelIndex);
    requestAnimationFrame(drawCable);
  }

  init();
})();
