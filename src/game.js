// 화면과 입력. 규칙은 engine.js가 맡고, 여기서는 그리고 연출하고 입력을 받는다.
// 장면 배치는 docs/mockup/index.html에서 확인받은 목업을 따른다.
(function () {
  'use strict';

  const Engine = window.Engine;
  const Assets = window.Assets;
  const Story = window.Story;
  const levels = window.LEVEL_DEFINITIONS.map(Engine.parseLevel);

  // 장면 좌표 (960 x 540 기준)
  const SCENE_WIDTH = 960;
  const SCENE_HEIGHT = 540;
  // 칸 크기와 장면 배치는 src/layout.js가 유일한 기준이다(실제 크기 기준도 거기 적혀 있다).
  // 탑뷰는 살짝 기울여 본 시점이라 한 줄의 깊이(ROW_HEIGHT)가 칸 너비(CELL)보다 짧다. 숙인 시점의 칸은 정사각형(CELL x CELL)이다.
  const LAYOUT = window.SCENE_LAYOUT;
  const CELL = LAYOUT.scale.cellWidthPx;
  const ROW_HEIGHT = LAYOUT.scale.rowHeightPx;
  const GRID_LEFT = LAYOUT.top.gridLeft;
  const GRID_TOP = LAYOUT.top.gridTop;
  const SIDE_FLOOR = LAYOUT.side.floor;
  const TOP_STRAW = LAYOUT.top.straw;
  const SIDE_STRAW = LAYOUT.side.straw;

  // 콘센트 칸막이는 줄마다 바 높이(z = 0)와 그 위(z = 1)에 콘센트가 고정돼 있다. 그보다 위는 칸막이 윗면이다.
  // 레벨에서 콘센트가 없는 자리는 옆자리 사람이 꽂아 둔 다른 기기(배경 그림, 건드릴 수 없음)로 그린다.
  const OUTLET_LEVELS = 2;

  // 꽂힌 플러그는 칸막이 바로 왼쪽 칸에 있다. 칸막이 칸의 왼쪽 29px(4cm)이 칸막이 판이고 콘센트는 그 왼쪽 면에 붙어 있어서,
  // 플러그를 오른쪽으로 14px 밀어 핀 끝이 콘센트에 박히게 놓는다.
  const INSERT_OFFSET = 14;
  const PARTITION_BRIDGE = 10;
  const TOP_LIFT = 26;

  const PIECE_MOVE_MS = 260;
  const LOW_BATTERY_SAVER = 2;
  const DEATHS_BEFORE_SKIP = 3;
  const STORAGE_KEY = 'magic-straw-progress-v2';

  const DRINK_ORDER = ['ice', 'soda'];
  // 음료 버튼에 붙이는 효과 기호. 글을 몰라도 얼음은 밀고, 소다는 띄운다는 것을 알 수 있게 한다.
  const DRINK_EFFECT = { ice: '→', soda: '↑' };
  // 얼음 조준선(줄마다의 경로 힌트와 올려 둔 줄의 경로선)은 처음 두 판에서만 보여 준다.
  const AIM_LINE_LEVELS = 2;
  const KIND_ASSET = { myPlug: 'my-plug', theirPlug: 'their-plug', cup: 'cup', book: 'book', menu: 'menu' };

  const byId = (id) => document.getElementById(id);
  const ui = {
    window: byId('window'),
    body: byId('window-body'),
    stage: byId('stage'),
    scene: byId('scene'),
    topView: byId('top-view'),
    sideView: byId('side-view'),
    board: byId('board'),
    divider: byId('divider'),
    aimBand: byId('aim-band'),
    aimPath: byId('aim-path'),
    aimHints: byId('aim-hints'),
    fxLayer: byId('fx-layer'),
    sideBar: byId('side-bar'),
    rowUp: byId('row-up'),
    rowDown: byId('row-down'),
    levelDots: byId('level-dots'),
    difficultyButton: byId('btn-difficulty'),
    undoButton: byId('btn-undo'),
    restartButton: byId('btn-restart'),
    drinks: byId('drinks'),
    tools: byId('tools'),
    duckButton: byId('btn-duck'),
    cameraButton: byId('btn-camera'),
    finger: byId('finger'),
    camera: byId('camera'),
    battery: byId('battery'),
    batteryFill: byId('battery-fill'),
    batteryText: byId('battery-text'),
    overlayDead: byId('overlay-dead'),
    overlayWon: byId('overlay-won'),
    wonNext: byId('won-next'),
    deadSkip: byId('dead-skip'),
    popupLow: byId('popup-low'),
    popupLowBar: byId('popup-low-bar'),
    prologue: byId('prologue'),
    prologueStage: byId('prologue-stage'),
    prologuePanel: byId('prologue-panel'),
    prologueArt: byId('prologue-art'),
    prologueNext: byId('prologue-next'),
  };

  const progress = loadProgress();
  const game = {
    levelIndex: Math.min(progress.current, levels.length - 1),
    level: null,
    state: null,
    history: [],
    selectedDrink: null,
    view: 'top',
    focusRow: 0,
    busy: false,
    deaths: {},
    lowPopupShown: false,
    prologueIndex: -1,
    pendingAction: null,
    lastPointerType: 'mouse',
    pieceElements: new Map(),
  };

  // 진행 저장. 저장소를 쓸 수 없는 환경에서도 게임은 그대로 돌아가야 한다.
  function loadProgress() {
    const fallback = { current: 0, unlocked: 0, cleared: [], difficulty: 'relaxed', seenPrologue: false, demosSeen: [] };
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

  // 탭이 가려지면 브라우저가 애니메이션을 멈추므로, 정해진 시간이 지나면 끝난 것으로 보고 넘어간다 (known-issues 2번).
  function animationDone(animation, duration) {
    return Promise.race([animation.finished, wait(duration + 50)]);
  }

  function hasTool(tool) {
    return (game.level.tools || []).includes(tool);
  }

  // 좌표 변환

  function topCellCenter(x, row) {
    return { x: GRID_LEFT + x * CELL + CELL / 2, y: GRID_TOP + row * ROW_HEIGHT + ROW_HEIGHT / 2 };
  }

  function sideCellCenter(x, z) {
    return { x: GRID_LEFT + x * CELL + CELL / 2, y: SIDE_FLOOR - z * CELL - CELL / 2 };
  }

  function sideBoardTop() {
    return SIDE_FLOOR - game.level.height * CELL;
  }

  // 장면 좌표를 창 본문(window-body) 기준 화면 좌표로 바꾼다. 손가락 안내를 놓을 때 쓴다.
  // 화면 좌표(getBoundingClientRect)를 쓰지 않고 배치 좌표(offsetLeft 등)로 계산한다.
  // 휴대폰 세로 화면에서는 게임 전체를 90도 돌려 보여 주는데, 화면 좌표는 그 회전 때문에 어긋나기 때문이다.
  function scenePointToBody(point) {
    const fit = game.sceneFit || { scale: 1, offsetX: 0, offsetY: 0 };
    return {
      x: ui.stage.offsetLeft + fit.offsetX + point.x * fit.scale,
      y: ui.stage.offsetTop + fit.offsetY + point.y * fit.scale,
    };
  }

  // 요소의 위치를 창 본문(window-body) 기준 배치 좌표로 구한다.
  function offsetWithinBody(element) {
    let x = 0;
    let y = 0;
    let current = element;
    while (current && current !== ui.body) {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent;
    }
    return { x, y };
  }

  // 레벨 시작

  function startLevel(index) {
    game.levelIndex = index;
    game.level = levels[index];
    game.state = Engine.initial(game.level, Engine.batteryFor(game.level, progress.difficulty));
    game.history = [];
    game.lowPopupShown = false;
    game.view = 'top';
    const myPlug = game.state.objects.find((obj) => obj.kind === 'myPlug');
    game.focusRow = myPlug ? myPlug.row : 0;
    if (!game.level.drinks.includes(game.selectedDrink)) game.selectedDrink = null;

    progress.current = index;
    saveProgress();

    hideOverlays();
    ui.camera.hidden = true;
    buildDrinks();
    buildView();
    updateHud();
    updateTutorial();
  }

  function buildDrinks() {
    ui.drinks.innerHTML = '';
    for (const drink of DRINK_ORDER) {
      if (!game.level.drinks.includes(drink)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'drink';
      button.dataset.drink = drink;
      button.innerHTML = `<span class="drink-icon">${Assets.html(`ui-drink-${drink}`)}<span class="effect" aria-hidden="true">${DRINK_EFFECT[drink]}</span></span>`;
      button.addEventListener('click', () => selectDrink(drink));
      ui.drinks.appendChild(button);
    }
    ui.duckButton.hidden = !hasTool('duck');
    ui.cameraButton.hidden = !hasTool('camera');
    ui.tools.hidden = ui.duckButton.hidden && ui.cameraButton.hidden;
  }

  function selectDrink(drink) {
    if (game.busy || game.state.status !== 'playing') return;
    game.selectedDrink = game.selectedDrink === drink ? null : drink;
    clearAim();
    updateControls();
    if (game.selectedDrink && !(progress.demosSeen || []).includes(drink)) playDemo(drink);
  }

  // 시점과 판 그리기

  // 판 배경. 그림이 있으면 한 장으로, 없으면 배치 표대로 회색 상자를 놓는다.
  function buildBackdrop(container, key, layout) {
    if (Assets.file(key)) {
      container.innerHTML = `<div class="placed backdrop">${Assets.html(key)}</div>`;
      return;
    }
    container.innerHTML = layout.map((item) => {
      const round = item.shape === 'rect' ? '' : ' gbox-round';
      const style = `left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px;`;
      return `<div class="placed" style="${style}"><div class="gbox gbox-${item.tone}${round}"><span>${item.label}</span></div></div>`;
    }).join('');
  }


  // 거품 그림이 등록돼 있으면 그 그림을, 없으면 CSS로 그린 거품을 쓴다.
  function bubbleHtml() {
    return Assets.file('fx-bubble')
      ? `<div class="piece-bubble has-art">${Assets.html('fx-bubble')}</div>`
      : '<div class="piece-bubble"></div>';
  }

  function buildView() {
    const { level } = game;
    const isTop = game.view === 'top';
    ui.topView.hidden = !isTop;
    ui.sideView.hidden = isTop;
    ui.sideBar.hidden = isTop;
    ui.board.classList.toggle('ducking', !isTop);

    const lineHeight = isTop ? ROW_HEIGHT : CELL;
    const boardHeight = isTop ? level.rows * ROW_HEIGHT : level.height * CELL;
    ui.board.style.left = `${GRID_LEFT}px`;
    ui.board.style.top = `${isTop ? GRID_TOP : sideBoardTop()}px`;
    ui.board.style.width = `${level.width * CELL}px`;
    ui.board.style.height = `${boardHeight}px`;
    ui.board.style.setProperty('--line-height', `${lineHeight}px`);
    ui.aimBand.style.width = `${(level.width - 1) * CELL}px`;
    ui.aimBand.style.height = `${lineHeight}px`;

    ui.divider.style.left = `${(level.width - 1) * CELL}px`;
    ui.divider.innerHTML = '';
    const segments = isTop ? level.rows : level.height;
    for (let index = 0; index < segments; index++) {
      const row = isTop ? index : game.focusRow;
      const z = isTop ? 0 : level.height - 1 - index;
      const segment = document.createElement('div');
      segment.className = 'divider-segment';
      segment.style.top = `${index * lineHeight}px`;
      segment.style.height = `${lineHeight}px`;
      segment.innerHTML = Assets.html(outletKey(isTop ? 'top' : 'side', row, z));
      ui.divider.appendChild(segment);
    }
    // 판 배경의 칸막이(퍼즐 판 뒤쪽 부분)는 퍼즐 판 위 끝보다 약 10px 위에서 끝난다(2026-10-25 그림 실측).
    // 첫 칸 그림의 윗부분을 그 틈에 이어 붙여 칸막이가 끊기지 않게 한다. 칸 그림은 위아래로 이어지게 그려져 있다.
    const bridgeArt = isTop && Assets.file(outletKey('top', 0, 0));
    if (bridgeArt) {
      const bridge = document.createElement('div');
      bridge.className = 'divider-bridge';
      bridge.style.top = `${-PARTITION_BRIDGE}px`;
      bridge.style.height = `${PARTITION_BRIDGE}px`;
      bridge.style.backgroundImage = `url("${bridgeArt}")`;
      bridge.style.backgroundSize = `${CELL}px ${ROW_HEIGHT}px`;
      ui.divider.appendChild(bridge);
    }

    for (const element of game.pieceElements.values()) element.remove();
    game.pieceElements.clear();
    for (const obj of game.state.objects) {
      const element = document.createElement('div');
      element.className = `piece piece-kind-${obj.kind}`;
      if (obj.mirror === '\\') element.classList.add('mirror-back');
      const assetKey = `piece-${isTop ? 'top' : 'side'}-${KIND_ASSET[obj.kind]}`;
      // 거품은 물건 뒤에 둔다. 앞에 두면 두꺼운 거품 테두리가 물건을 가린다.
      element.innerHTML = `<div class="piece-shadow"></div>${bubbleHtml()}<div class="piece-body">${Assets.html(assetKey)}</div>`;
      ui.board.appendChild(element);
      game.pieceElements.set(obj.id, element);
    }

    if (!isTop) {
      for (const image of ui.board.querySelectorAll('.piece-body .asset')) alignToFloor(image);
    }

    ui.rowUp.disabled = game.focusRow === 0;
    ui.rowDown.disabled = game.focusRow === level.rows - 1;
    ui.duckButton.setAttribute('aria-pressed', String(!isTop));

    clearAim();
    render(game.state, false);
  }

  // 숙인 시점에서는 물건이 칸 바닥(바 윗면이나 아래 물건의 윗면)에 닿아 보여야 한다.
  // 그림마다 아래쪽 투명 여백이 달라서, 그림을 불러온 뒤 실제로 그려진 아래 끝을 재서 그만큼 내린다.
  const floorOffsetCache = new Map();

  function measureBottomGap(image) {
    if (floorOffsetCache.has(image.src)) return floorOffsetCache.get(image.src);
    let gap = 0;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
      let lowest = height - 1;
      search: for (; lowest >= 0; lowest--) {
        for (let x = 0; x < width; x++) {
          if (data[(lowest * width + x) * 4 + 3] > 24) break search;
        }
      }
      gap = (height - 1 - lowest) / height;
    } catch (error) {
      // 파일을 직접 연 경우처럼 그림 픽셀을 읽을 수 없으면 맞추지 않고 그대로 둔다.
      gap = 0;
    }
    floorOffsetCache.set(image.src, gap);
    return gap;
  }

  function alignToFloor(image) {
    if (image.closest('.piece-kind-book')) return;
    const apply = () => {
      const gap = measureBottomGap(image);
      image.style.transform = `translateY(${gap * image.clientHeight + 6}px)`;
    };
    if (image.complete && image.naturalWidth) apply();
    else image.addEventListener('load', apply, { once: true });
  }

  // 콘센트 칸막이 한 칸의 그림 이름. 레벨에 콘센트가 있으면 빈 콘센트(상대 플러그가 꽂혀 있을 수도 있다),
  // 없으면 옆자리 사람의 다른 기기가 꽂힌 콘센트, 콘센트 높이보다 위는 칸막이 윗면이다.
  function outletKey(view, row, z) {
    if (z >= OUTLET_LEVELS) return `outlet-${view}-cap`;
    const free = game.level.sockets.some((socket) => socket.row === row && socket.z === z);
    return `outlet-${view}-${free ? 'free' : 'taken'}`;
  }

  // 탑뷰에서 물건 하나를 놓는다.
  // 물건 그림(CELL x CELL)은 줄보다 키가 커서, 아래 끝을 줄 아래 끝에 맞추고 위로 솟게 둔다.
  // 앞줄(창 쪽, row가 큰 줄)이 뒷줄을 가리도록 앞줄일수록 위에 그린다.
  function applyTopTransform(element, obj) {
    const body = element.querySelector('.piece-body');
    const offsetX = obj.x * CELL + (obj.inserted ? INSERT_OFFSET : 0);
    element.style.transform = `translate(${offsetX}px, ${(obj.row + 1) * ROW_HEIGHT - CELL}px)`;
    element.style.zIndex = String(10 + obj.row * 3 + obj.z);
    body.style.transform = obj.z > 0 ? `translate(0, ${-obj.z * TOP_LIFT}px) scale(${1 + obj.z * 0.08})` : '';
    element.classList.toggle('lifted', obj.z > 0);
  }

  function render(snapshot, animate) {
    const isTop = game.view === 'top';
    ui.board.classList.toggle('instant', !animate);

    for (const obj of snapshot.objects) {
      const element = game.pieceElements.get(obj.id);
      const body = element.querySelector('.piece-body');
      const offsetX = obj.x * CELL + (obj.inserted ? INSERT_OFFSET : 0);

      if (isTop) {
        element.hidden = false;
        element.classList.remove('ghost');
        applyTopTransform(element, obj);
      } else {
        // 보고 있는 줄이 아닌 물건도 흐리게 보여 주어, 숙였을 때 판이 텅 빈 것처럼 보이지 않게 한다.
        element.hidden = false;
        element.classList.toggle('ghost', obj.row !== game.focusRow);
        element.style.transform = `translate(${offsetX}px, ${(game.level.height - 1 - obj.z) * CELL}px)`;
        element.style.zIndex = String(obj.row === game.focusRow ? 20 : 5);
        body.style.transform = '';
        element.classList.remove('lifted');
      }
      element.classList.toggle('floating', obj.bubble > 0);
    }

    if (!animate) {
      // 한 번 배치를 계산해 두어야 다음 움직임부터 다시 부드럽게 옮겨진다.
      void ui.board.offsetWidth;
      ui.board.classList.remove('instant');
    }
  }

  function fitScene() {
    const width = ui.stage.clientWidth;
    const height = ui.stage.clientHeight;
    const scale = Math.min(width / SCENE_WIDTH, height / SCENE_HEIGHT);
    const offsetX = (width - SCENE_WIDTH * scale) / 2;
    const offsetY = (height - SCENE_HEIGHT * scale) / 2;
    ui.scene.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    game.sceneFit = { scale, offsetX, offsetY };
    updateTutorial();
  }

  function setView(view) {
    if (game.busy || game.view === view) return;
    if (view === 'side' && !hasTool('duck')) return;
    if (view === 'side' && !game.state.objects.some((obj) => obj.row === game.focusRow && obj.kind !== 'menu')) {
      const myPlug = game.state.objects.find((obj) => obj.kind === 'myPlug');
      if (myPlug) game.focusRow = myPlug.row;
    }
    game.view = view;
    buildView();
    updateControls();
  }

  function moveFocusRow(delta) {
    const next = game.focusRow + delta;
    if (game.busy || next < 0 || next >= game.level.rows) return;
    game.focusRow = next;
    buildView();
  }

  // 화면 정보

  function updateControls() {
    for (const button of ui.drinks.querySelectorAll('.drink')) {
      button.setAttribute('aria-pressed', String(button.dataset.drink === game.selectedDrink));
    }
    ui.board.classList.toggle('aim-ice', game.selectedDrink === 'ice');
    ui.board.classList.toggle('aim-soda', game.selectedDrink === 'soda');
    updateHints();
    updateTutorial();
  }

  // 음료를 고르면 마우스를 올리지 않아도 쓸 수 있는 곳을 흐리게 보여 준다.
  // 얼음은 줄마다 날아갈 경로를, 소다는 띄울 수 있는 물건의 거품 테두리를 보여 준다.
  function showsAimLine() {
    return game.levelIndex < AIM_LINE_LEVELS;
  }

  function clearHints() {
    ui.aimHints.innerHTML = '';
    for (const element of game.pieceElements.values()) element.classList.remove('can-lift');
  }

  function updateHints() {
    clearHints();
    if (!game.level || game.busy || game.state.status !== 'playing' || !game.selectedDrink) return;
    if (game.selectedDrink === 'ice') {
      if (!showsAimLine()) return;
      const lines = game.view === 'top' ? game.level.rows : game.level.height;
      for (let line = 0; line < lines; line++) {
        const action = game.view === 'top'
          ? { drink: 'ice', row: line, z: 0 }
          : { drink: 'ice', row: game.focusRow, z: line };
        const preview = Engine.step(game.level, game.state, action);
        if (!preview.ok) continue;
        const hint = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        hint.setAttribute('class', 'aim-hint');
        hint.setAttribute('points', icePathPoints(preview.effect).map((point) => `${point.x},${point.y}`).join(' '));
        ui.aimHints.appendChild(hint);
      }
      return;
    }
    for (const obj of game.state.objects) {
      const element = game.pieceElements.get(obj.id);
      if (element.classList.contains('ghost')) continue;
      if (Engine.check(game.level, game.state, { drink: 'soda', target: obj.id }).ok) element.classList.add('can-lift');
    }
  }

  // 음료를 처음 고를 때 한 번, 반투명한 유령 연출로 그 음료가 무엇을 하는지 보여 준다. 배터리는 쓰지 않는다.
  async function playDemo(drink) {
    progress.demosSeen = [...(progress.demosSeen || []), drink];
    saveProgress();
    if (game.view !== 'top') return;

    const myPlug = game.state.objects.find((obj) => obj.kind === 'myPlug');
    let demo = null;
    if (drink === 'ice') {
      const rows = [...Array(game.level.rows).keys()].sort((a, b) => (a === myPlug.row ? -1 : b === myPlug.row ? 1 : 0));
      for (const row of rows) {
        const preview = Engine.step(game.level, game.state, { drink: 'ice', row, z: 0 });
        if (!preview.ok || !preview.effect.hitId) continue;
        const before = Engine.findObject(game.state, preview.effect.hitId);
        const after = Engine.findObject(preview.frames[0], preview.effect.hitId);
        if (before.x !== after.x || before.row !== after.row) {
          demo = { preview, id: preview.effect.hitId, after };
          break;
        }
      }
    } else {
      const canLift = (obj) => Engine.check(game.level, game.state, { drink: 'soda', target: obj.id }).ok;
      const target = game.state.objects.find((obj) => obj.kind !== 'myPlug' && canLift(obj))
        || game.state.objects.find(canLift);
      if (target) demo = { id: target.id, after: { ...target, z: target.z + 1, bubble: 2 } };
    }
    if (!demo) return;

    game.busy = true;
    clearHints();
    updateTutorial();
    const source = game.pieceElements.get(demo.id);
    const ghost = source.cloneNode(true);
    ghost.classList.add('demo-ghost');
    ghost.classList.remove('targeted', 'can-lift');
    ui.board.appendChild(ghost);
    await wait(250);
    if (drink === 'ice') {
      await shootIce(demo.preview.effect, true);
    } else {
      await shootBubble(demo.id, true);
      ghost.classList.add('floating');
    }
    ghost.style.transition = 'transform 0.45s cubic-bezier(0.3, 0.8, 0.4, 1)';
    ghost.querySelector('.piece-body').style.transition = 'transform 0.45s cubic-bezier(0.3, 0.8, 0.4, 1)';
    applyTopTransform(ghost, demo.after);
    await wait(900);
    ghost.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
    await wait(320);
    ghost.remove();
    game.busy = false;
    updateControls();
  }

  function updateHud() {
    const { level, state } = game;
    ui.levelDots.innerHTML = '';
    levels.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'level-dot';
      dot.textContent = String(index + 1);
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

    updateControls();
  }

  // 손가락 안내

  function pointFinger(target) {
    if (!target) {
      ui.finger.hidden = true;
      return;
    }
    let point;
    if (target instanceof Element) {
      const offset = offsetWithinBody(target);
      point = { x: offset.x + target.offsetWidth / 2, y: offset.y };
    } else {
      point = scenePointToBody(target);
    }
    ui.finger.style.left = `${point.x}px`;
    ui.finger.style.top = `${point.y}px`;
    ui.finger.hidden = false;
  }

  function updateTutorial() {
    if (!game.level) return;
    const { state } = game;
    const playing = state.status === 'playing' && game.prologueIndex < 0 && !game.busy;
    const fresh = state.used === 0;
    let target = null;

    if (playing && fresh && game.level.tutorial === 'full') {
      if (game.selectedDrink !== 'ice') {
        target = ui.drinks.querySelector('[data-drink="ice"]');
      } else {
        // 마우스가 있는 줄이 아니라 내 플러그가 있는 줄을 짚어야 첫 판에서 헷갈리지 않는다.
        const myPlug = state.objects.find((obj) => obj.kind === 'myPlug');
        const center = topCellCenter(0, myPlug.row);
        target = { x: center.x, y: center.y - ROW_HEIGHT / 2 };
      }
    } else if (playing && fresh && game.level.tutorial === 'drink' && game.selectedDrink !== 'soda') {
      target = ui.drinks.querySelector('[data-drink="soda"]');
    } else if (playing && fresh && game.level.tutorial === 'duck' && game.view === 'top') {
      target = ui.duckButton;
    }

    pointFinger(target);
  }

  // 연출

  function shakeBoard() {
    ui.board.classList.remove('shake');
    void ui.board.offsetWidth;
    ui.board.classList.add('shake');
  }

  // 얼음이 지나간 칸을 지금 시점의 장면 좌표로 바꾼다. 숙인 시점에서는 보고 있는 줄 안의 구간만 그린다.
  function icePathPoints(effect) {
    if (game.view === 'top') {
      return [TOP_STRAW, ...effect.path.map((cell) => topCellCenter(cell.x, cell.row))];
    }
    const points = [SIDE_STRAW];
    for (const cell of effect.path) {
      points.push(sideCellCenter(cell.x, effect.z));
      if (cell.row !== game.focusRow) break;
    }
    return points;
  }

  function travelKeyframes(points) {
    const lengths = [0];
    for (let index = 1; index < points.length; index++) {
      const dx = points[index].x - points[index - 1].x;
      const dy = points[index].y - points[index - 1].y;
      lengths.push(lengths[index - 1] + Math.hypot(dx, dy));
    }
    const total = lengths[lengths.length - 1] || 1;
    const frames = points.map((point, index) => ({
      transform: `translate(${point.x}px, ${point.y}px)`,
      offset: lengths[index] / total,
    }));
    return { frames, total };
  }

  async function shootIce(effect, ghost = false) {
    const shot = document.createElement('div');
    shot.className = ghost ? 'ice-shot demo-ghost' : 'ice-shot';
    if (Assets.file('fx-ice')) shot.innerHTML = Assets.html('fx-ice');
    ui.fxLayer.appendChild(shot);
    const { frames, total } = travelKeyframes(icePathPoints(effect));
    const duration = 120 + total * 0.9;
    const animation = shot.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
    await animationDone(animation, duration);
    shot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    setTimeout(() => shot.remove(), 200);
  }

  async function shootBubble(targetId, ghost = false) {
    const target = Engine.findObject(game.state, targetId);
    const shot = document.createElement('div');
    shot.className = ghost ? 'bubble-shot demo-ghost' : 'bubble-shot';
    if (Assets.file('fx-bubble')) {
      shot.classList.add('has-art');
      shot.innerHTML = Assets.html('fx-bubble');
    }
    ui.fxLayer.appendChild(shot);
    const start = game.view === 'top' ? TOP_STRAW : SIDE_STRAW;
    const end = game.view === 'top' ? topCellCenter(target.x, target.row) : sideCellCenter(target.x, target.z);
    const peak = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 70 };
    const duration = 380;
    const animation = shot.animate([
      { transform: `translate(${start.x}px, ${start.y}px) scale(0.5)` },
      { transform: `translate(${peak.x}px, ${peak.y}px) scale(0.9)` },
      { transform: `translate(${end.x}px, ${end.y}px) scale(1.4)`, opacity: 0.2 },
    ], { duration, easing: 'ease-out', fill: 'forwards' });
    await animationDone(animation, duration);
    shot.remove();
  }

  // 조준과 입력

  // 판 안의 위치는 판 자신의 좌표(offsetX, offsetY)로 구한다. 판에 확대, 축소, 회전이 걸려 있어도 맞는다.
  // 판 위의 물건과 장식은 pointer-events: none이라 이벤트는 항상 판에서 받는다.
  function cellFromPointer(event) {
    const { width } = game.level;
    const rows = game.view === 'top' ? game.level.rows : game.level.height;
    let fractionX;
    let fractionY;
    if (event.target === ui.board) {
      fractionX = event.offsetX / ui.board.offsetWidth;
      fractionY = event.offsetY / ui.board.offsetHeight;
    } else {
      const box = ui.board.getBoundingClientRect();
      fractionX = (event.clientX - box.left) / box.width;
      fractionY = (event.clientY - box.top) / box.height;
    }
    const column = Math.floor(fractionX * width);
    const line = Math.floor(fractionY * rows);
    if (column < 0 || column >= width || line < 0 || line >= rows) return null;
    if (game.view === 'top') return { x: column, row: line };
    return { x: column, z: rows - 1 - line };
  }

  // 탑뷰에서는 같은 칸에 쌓인 물건 중 맨 위의 것을 고른다.
  function objectForCell(cell) {
    if (game.view === 'side') return Engine.objectAt(game.state, cell.x, game.focusRow, cell.z);
    const stack = game.state.objects.filter((obj) => obj.x === cell.x && obj.row === cell.row);
    return stack.sort((a, b) => b.z - a.z)[0] || null;
  }

  function actionForCell(cell) {
    if (game.selectedDrink === 'ice') {
      return game.view === 'top'
        ? { drink: 'ice', row: cell.row, z: 0 }
        : { drink: 'ice', row: game.focusRow, z: cell.z };
    }
    if (game.selectedDrink === 'soda') {
      const obj = objectForCell(cell);
      return obj ? { drink: 'soda', target: obj.id } : null;
    }
    return null;
  }

  function clearAim() {
    ui.aimBand.classList.remove('visible');
    ui.aimPath.setAttribute('points', '');
    for (const element of game.pieceElements.values()) element.classList.remove('targeted');
    game.pendingAction = null;
  }

  // 같은 행동인지 비교한다. 터치 화면에서 "같은 곳을 다시 눌렀는지" 판단할 때 쓴다.
  function sameAction(a, b) {
    return Boolean(a && b) && a.drink === b.drink && a.row === b.row && a.z === b.z && a.target === b.target;
  }

  // 행동을 실행하지 않고 미리 보여 준다. 얼음은 날아갈 경로와 맞을 물건을, 소다는 거품을 붙일 물건을 표시한다.
  function showAim(action) {
    clearAim();
    if (action.drink === 'ice') {
      const preview = Engine.step(game.level, game.state, action);
      if (showsAimLine()) {
        const bandLine = game.view === 'top' ? action.row : game.level.height - 1 - action.z;
        ui.aimBand.style.top = `${bandLine * (game.view === 'top' ? ROW_HEIGHT : CELL)}px`;
        ui.aimBand.classList.add('visible');
      }
      if (!preview.ok) return;
      if (showsAimLine()) {
        const points = icePathPoints(preview.effect).map((point) => `${point.x},${point.y}`).join(' ');
        ui.aimPath.setAttribute('points', points);
      }
      if (preview.effect.hitId) game.pieceElements.get(preview.effect.hitId).classList.add('targeted');
    } else if (Engine.check(game.level, game.state, action).ok) {
      game.pieceElements.get(action.target).classList.add('targeted');
    }
  }

  // 마우스는 올려 두기만 해도 미리보기를 보여 준다. 터치에는 올려 두기가 없으므로 onBoardClick에서 다룬다.
  function onBoardMove(event) {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') return;
    if (game.busy || game.state.status !== 'playing') return;
    clearAim();
    const cell = cellFromPointer(event);
    if (!cell) return;
    // 보고 있는 줄은 얼음으로 조준할 때만 바꾼다. 숙이기 버튼으로 가는 길에 다른 줄을 지나가도 바뀌지 않게 한다.
    if (game.view === 'top' && game.selectedDrink === 'ice' && game.focusRow !== cell.row) {
      game.focusRow = cell.row;
      updateTutorial();
    }
    const action = actionForCell(cell);
    if (action) showAim(action);
  }

  // 마우스는 한 번 클릭하면 바로 뱉는다. 터치 화면은 한 번 누르면 미리보기, 같은 곳을 다시 누르면 뱉는다.
  // 행동마다 배터리를 쓰는 퍼즐이라, 미리보기 없이 잘못 눌러 배터리를 날리지 않게 하려는 것이다.
  function onBoardClick(event) {
    if (game.busy || game.state.status !== 'playing') return;
    const cell = cellFromPointer(event);
    if (!cell) return;
    if (!game.selectedDrink) return;
    const action = actionForCell(cell);
    if (!action) return;

    if (game.lastPointerType !== 'touch' && game.lastPointerType !== 'pen') {
      perform(action);
      return;
    }

    if (sameAction(game.pendingAction, action)) {
      perform(action);
      return;
    }
    const verdict = Engine.check(game.level, game.state, action);
    if (!verdict.ok) {
      shakeBoard();
      return;
    }
    if (game.view === 'top') game.focusRow = cell.row;
    showAim(action);
    game.pendingAction = action;
  }

  async function perform(action) {
    if (game.busy) return;
    const result = Engine.step(game.level, game.state, action);
    if (!result.ok) {
      shakeBoard();
      return;
    }

    game.busy = true;
    clearAim();
    clearHints();
    updateTutorial();
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
    if (state.battery === 1 && !game.lowPopupShown) {
      game.lowPopupShown = true;
      showLowBatteryPopup();
    }
  }

  function onWin() {
    const { level } = game;
    if (!progress.cleared.includes(level.id)) progress.cleared.push(level.id);
    progress.unlocked = Math.max(progress.unlocked, Math.min(game.levelIndex + 1, levels.length - 1));
    saveProgress();
    updateHud();

    const isLast = game.levelIndex === levels.length - 1;
    ui.wonNext.textContent = isLast ? '↻' : '▶';
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
    clearAim();
    hideOverlays();
    render(game.state, true);
    updateHud();
  }

  function restart() {
    if (game.busy) return;
    startLevel(game.levelIndex);
  }

  function nextLevel() {
    startLevel(game.levelIndex + 1 < levels.length ? game.levelIndex + 1 : 0);
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
      const parent = ui.body.getBoundingClientRect();
      drag = { dx: event.clientX - box.left, dy: event.clientY - box.top, parent };
      ui.popupLowBar.setPointerCapture(event.pointerId);
    });
    ui.popupLowBar.addEventListener('pointermove', (event) => {
      if (!drag) return;
      ui.popupLow.style.transform = 'none';
      ui.popupLow.style.left = `${event.clientX - drag.parent.left - drag.dx}px`;
      ui.popupLow.style.top = `${event.clientY - drag.parent.top - drag.dy}px`;
    });
    ui.popupLowBar.addEventListener('pointerup', () => {
      drag = null;
    });
  }

  // 휴대폰 카메라. 판을 바꾸지 않고 멀리 있는 것을 확대해 보여 준다.
  function toggleCamera(open) {
    if (!hasTool('camera') || game.busy) return;
    const shouldOpen = open !== undefined ? open : ui.camera.hidden;
    ui.camera.hidden = !shouldOpen;
    if (shouldOpen) byId('camera-art').innerHTML = Assets.html('top-their-laptop');
  }

  // 프롤로그

  function openPrologue() {
    game.prologueIndex = 0;
    ui.prologue.hidden = false;
    showProloguePanel();
  }

  // 컷을 4:3 비율로 창 안에 가장 크게 맞춘다.
  function fitPrologue() {
    const width = ui.prologueStage.clientWidth - 32;
    const height = ui.prologueStage.clientHeight - 24;
    const panelWidth = Math.max(0, Math.min(width, (height * 4) / 3));
    ui.prologuePanel.style.width = `${panelWidth}px`;
    ui.prologuePanel.style.height = `${(panelWidth * 3) / 4}px`;
  }

  function showProloguePanel() {
    const panels = Story.prologue;
    const index = game.prologueIndex;
    ui.prologuePanel.classList.remove('enter');
    void ui.prologuePanel.offsetWidth;
    ui.prologuePanel.classList.add('enter');

    if (index < panels.length) {
      const panel = panels[index];
      ui.prologuePanel.classList.remove('title');
      ui.prologueArt.innerHTML = Assets.html(panel.key, panel.scene);
      ui.prologueNext.textContent = '▶';
    } else {
      ui.prologuePanel.classList.add('title');
      ui.prologueArt.innerHTML = '<div class="title-card"><h1>내 자리, 내 충전기</h1></div>';
      ui.prologueNext.textContent = '▶';
    }
    fitPrologue();
  }

  function nextProloguePanel() {
    game.prologueIndex += 1;
    if (game.prologueIndex > Story.prologue.length) closePrologue();
    else showProloguePanel();
  }

  function closePrologue() {
    game.prologueIndex = -1;
    ui.prologue.hidden = true;
    progress.seenPrologue = true;
    saveProgress();
    updateTutorial();
  }

  function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();

    if (game.prologueIndex >= 0) {
      if (key === ' ' || key === 'enter' || key === 'arrowright') {
        event.preventDefault();
        nextProloguePanel();
      } else if (key === 'escape') {
        closePrologue();
      }
      return;
    }

    if (key === 'z' || key === 'backspace') {
      event.preventDefault();
      undo();
    } else if (key === 'r') {
      restart();
    } else if (key === 's') {
      setView(game.view === 'top' ? 'side' : 'top');
    } else if (key === 'c') {
      toggleCamera();
    } else if (key === 'arrowup' && game.view === 'side') {
      event.preventDefault();
      moveFocusRow(-1);
    } else if (key === 'arrowdown' && game.view === 'side') {
      event.preventDefault();
      moveFocusRow(1);
    } else if (key === 'escape') {
      toggleCamera(false);
      if (game.selectedDrink) selectDrink(game.selectedDrink);
    } else if (key === '1' || key === '2') {
      const drink = DRINK_ORDER[Number(key) - 1];
      if (game.level.drinks.includes(drink)) selectDrink(drink);
    } else if ((key === 'enter' || key === ' ') && !ui.overlayWon.hidden) {
      event.preventDefault();
      nextLevel();
    }
  }

  function bindEvents() {
    ui.board.addEventListener('pointermove', onBoardMove);
    ui.board.addEventListener('pointerleave', (event) => {
      // 터치는 손을 뗄 때마다 pointerleave가 와서, 그때 지우면 두 번 누르기 미리보기가 사라진다.
      if (event.pointerType === 'mouse') clearAim();
    });
    ui.board.addEventListener('click', onBoardClick);
    // click 이벤트만으로는 터치인지 알 수 없는 브라우저가 있어서, 누르기 시작할 때의 입력 종류를 기억해 둔다.
    ui.board.addEventListener('pointerdown', (event) => {
      game.lastPointerType = event.pointerType;
    });
    ui.undoButton.addEventListener('click', undo);
    ui.restartButton.addEventListener('click', restart);
    ui.difficultyButton.addEventListener('click', cycleDifficulty);
    ui.duckButton.addEventListener('click', () => setView(game.view === 'top' ? 'side' : 'top'));
    ui.cameraButton.addEventListener('click', () => toggleCamera());
    byId('camera-close').addEventListener('click', () => toggleCamera(false));
    ui.rowUp.addEventListener('click', () => moveFocusRow(-1));
    ui.rowDown.addEventListener('click', () => moveFocusRow(1));
    byId('dead-undo').addEventListener('click', undo);
    byId('dead-restart').addEventListener('click', restart);
    ui.deadSkip.addEventListener('click', skipLevel);
    ui.wonNext.addEventListener('click', nextLevel);
    byId('won-undo').addEventListener('click', undo);
    byId('popup-low-close').addEventListener('click', () => {
      ui.popupLow.hidden = true;
    });
    ui.prologueNext.addEventListener('click', nextProloguePanel);
    byId('prologue-skip').addEventListener('click', closePrologue);
    ui.prologuePanel.addEventListener('click', nextProloguePanel);
    enablePopupDrag();
    document.addEventListener('keydown', onKey);
    new ResizeObserver(fitScene).observe(ui.stage);
    new ResizeObserver(fitPrologue).observe(ui.prologueStage);
  }

  function init() {
    buildBackdrop(ui.topView, 'scene-top', LAYOUT.top.boxes);
    buildBackdrop(ui.sideView, 'scene-side', LAYOUT.side.boxes);
    const finger = Assets.file('ui-finger') ? Assets.html('ui-finger') : '<div class="finger-default"></div>';
    ui.finger.querySelector('.finger-art').innerHTML = finger;
    bindEvents();
    startLevel(game.levelIndex);
    fitScene();
    if (!progress.seenPrologue) openPrologue();
  }

  init();
})();
