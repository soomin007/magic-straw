// 게임 규칙. 화면 코드와 분리해서 브라우저와 Node 양쪽에서 검증할 수 있게 한다.
//
// 판은 작은 3차원 격자다.
//   x    왼쪽(내 자리)에서 오른쪽(옆자리)으로 커진다. 맨 오른쪽 열(x = width - 1)은 두 자리 사이 칸막이다.
//   row  탑뷰 화면의 위에서 아래로 커진다.
//   z    테이블 면(0)에서 위로 커진다. 탑뷰에서는 z = 0 높이로만 조준할 수 있고, 숙이기를 해야 더 높이 조준할 수 있다.
// 콘센트는 (row, z) 자리마다 있거나 없다. 플러그는 칸막이 바로 왼쪽 칸에 있을 때 꽂힌 것으로 본다.
(function (root) {
  'use strict';

  // 거품이 붙은 물건은 뱉은 행동과 그다음 행동이 끝날 때까지 떠 있다가 터진다.
  const BUBBLE_LIFETIME = 2;
  const DEFAULT_HEIGHT = 3;
  const ICE_STEP_LIMIT = 200;

  // 난이도는 배터리 양으로 정한다. 최소 행동 수에 더해 주는 여유분이다 (Helltaker의 걸음 수 제한 참고).
  const DIFFICULTIES = [
    { id: 'relaxed', label: '여유', extraBattery: 3 },
    { id: 'normal', label: '보통', extraBattery: 1 },
    { id: 'tight', label: '빠듯', extraBattery: 0 },
  ];

  function batteryFor(level, difficultyId) {
    const difficulty = DIFFICULTIES.find((d) => d.id === difficultyId) || DIFFICULTIES[0];
    return level.optimal + difficulty.extraBattery;
  }

  // deflects: 얼음이 부딪히면 방향을 꺾는다. 메뉴판만 그렇다.
  const KIND_RULES = {
    myPlug: { pushable: true, liftable: true, plug: true, deflects: false },
    theirPlug: { pushable: true, liftable: true, plug: true, deflects: false },
    cup: { pushable: true, liftable: true, plug: false, deflects: false },
    book: { pushable: false, liftable: false, plug: false, deflects: false },
    menu: { pushable: false, liftable: false, plug: false, deflects: true },
  };

  // 탑뷰 지도에 쓰는 글자 (테이블 면, z = 0). 맨 오른쪽 열은 칸막이라 '#'(콘센트 없음)과 'S'(콘센트)만 쓴다.
  // 메뉴판 '/'와 '\'는 비스듬히 세워 둔 삼각 메뉴판이고, 그 모양대로 얼음을 90도 꺾는다.
  const MAP_LEGEND = { P: 'myPlug', N: 'theirPlug', c: 'cup', B: 'book', '/': 'menu', '\\': 'menu' };

  const RIGHT = { dx: 1, dr: 0 };

  function reflect(direction, mirror) {
    // 화면 기준으로 row가 아래로 커지므로 '/'는 오른쪽에서 오는 얼음을 위로 보낸다.
    if (mirror === '/') return { dx: -direction.dr, dr: -direction.dx };
    return { dx: direction.dr, dr: direction.dx };
  }

  function parseLevel(definition) {
    const rows = definition.floor.length;
    const width = definition.floor[0].length;
    const height = definition.height || DEFAULT_HEIGHT;
    const sockets = [];
    const objects = [];

    function addObject(kind, x, row, z, mirror) {
      const obj = { id: `${kind}-${objects.length}`, kind, x, row, z };
      if (mirror) obj.mirror = mirror;
      objects.push(obj);
    }

    definition.floor.forEach((line, row) => {
      if (line.length !== width) throw new Error(`${definition.id}: 지도 ${row}번 줄의 길이가 다릅니다`);
      [...line].forEach((char, x) => {
        if (x === width - 1) {
          if (char === 'S') sockets.push({ row, z: 0 });
          else if (char !== '#') throw new Error(`${definition.id}: 칸막이 열에는 # 또는 S만 씁니다`);
          return;
        }
        const kind = MAP_LEGEND[char];
        if (kind) addObject(kind, x, row, 0, kind === 'menu' ? char : undefined);
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });

    for (const socket of definition.highSockets || []) sockets.push({ row: socket.row, z: socket.z });
    for (const item of definition.above || []) addObject(item.kind, item.x, item.row, item.z);

    return { ...definition, width, rows, height, sockets, objects };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function initial(level, battery) {
    const state = {
      objects: level.objects.map((obj) => ({ ...obj, bubble: 0, inserted: false })),
      battery,
      used: 0,
      status: 'playing',
    };
    settle(level, state);
    return state;
  }

  function objectAt(state, x, row, z) {
    return state.objects.find((obj) => obj.x === x && obj.row === row && obj.z === z) || null;
  }

  function findObject(state, id) {
    return state.objects.find((obj) => obj.id === id) || null;
  }

  // 칸막이 열을 뺀 테이블 위 공간 안인지
  function isInside(level, x, row, z) {
    return x >= 0 && x < level.width - 1 && row >= 0 && row < level.rows && z >= 0 && z < level.height;
  }

  function hasSocket(level, row, z) {
    return level.sockets.some((socket) => socket.row === row && socket.z === z);
  }

  function isSocketFree(level, state, row, z) {
    if (!hasSocket(level, row, z)) return false;
    return !state.objects.some((obj) => obj.inserted && obj.row === row && obj.z === z);
  }

  function isSupported(state, obj) {
    if (obj.inserted || obj.bubble > 0 || obj.z === 0) return true;
    return objectAt(state, obj.x, obj.row, obj.z - 1) !== null;
  }

  function dropUntilSupported(state, obj) {
    while (!isSupported(state, obj)) obj.z -= 1;
  }

  // 받침이 없는 물건을 떨어뜨리고, 빈 콘센트 앞에 내려앉은 플러그를 꽂는다.
  function settle(level, state) {
    const lowestFirst = [...state.objects].sort((a, b) => a.z - b.z);
    for (const obj of lowestFirst) dropUntilSupported(state, obj);
    for (const obj of state.objects) {
      const canInsert = KIND_RULES[obj.kind].plug && !obj.inserted && obj.bubble === 0;
      if (canInsert && obj.x === level.width - 2 && isSocketFree(level, state, obj.row, obj.z)) {
        obj.inserted = true;
      }
    }
  }

  // 얼음에 맞은 물건은 얼음이 날아가던 방향으로, 막힐 때까지 미끄러진다.
  // 테이블 가장자리, 다른 물건, 메뉴판에 막히면 멈춘다. 떠 있지 않은 물건은 받침이 없는 칸에 들어서면 떨어지고 거기서 멈춘다.
  // 플러그가 오른쪽으로 미끄러져 칸막이에 닿으면, 그 자리의 콘센트가 비어 있을 때 꽂힌다.
  function slide(level, state, obj, direction) {
    for (;;) {
      const nextX = obj.x + direction.dx;
      const nextRow = obj.row + direction.dr;
      if (direction.dx === 1 && nextX === level.width - 1) {
        if (KIND_RULES[obj.kind].plug && isSocketFree(level, state, obj.row, obj.z)) {
          obj.inserted = true;
          obj.bubble = 0;
        }
        return;
      }
      if (!isInside(level, nextX, nextRow, obj.z)) return;
      if (objectAt(state, nextX, nextRow, obj.z)) return;
      obj.x = nextX;
      obj.row = nextRow;
      if (!isSupported(state, obj)) {
        dropUntilSupported(state, obj);
        return;
      }
    }
  }

  // 얼음은 내 자리(왼쪽 끝 바깥)에서 고른 줄과 높이로 날아간다.
  // 메뉴판을 만나면 꺾이고, 처음 만나는 다른 물건에 부딪힌다. 떠 있는 물건의 아래나 위로는 그냥 지나간다.
  // path는 화면 연출용으로, 얼음이 지나간 칸 목록이다.
  function fireIce(level, state, row, z) {
    let x = -1;
    let currentRow = row;
    let direction = RIGHT;
    const path = [{ x, row: currentRow }];

    for (let stepCount = 0; stepCount < ICE_STEP_LIMIT; stepCount++) {
      const nextX = x + direction.dx;
      const nextRow = currentRow + direction.dr;
      if (!isInside(level, nextX, nextRow, z)) {
        path.push({ x: nextX, row: nextRow });
        return { row, z, path, hitId: null };
      }
      const obj = objectAt(state, nextX, nextRow, z);
      x = nextX;
      currentRow = nextRow;
      path.push({ x, row: currentRow });
      if (!obj) continue;
      if (KIND_RULES[obj.kind].deflects) {
        direction = reflect(direction, obj.mirror);
        continue;
      }
      if (KIND_RULES[obj.kind].pushable && !obj.inserted) slide(level, state, obj, direction);
      return { row, z, path, hitId: obj.id };
    }
    return { row, z, path, hitId: null };
  }

  function check(level, state, action) {
    if (state.status !== 'playing') return { ok: false, reason: '이미 끝난 판입니다' };
    if (!level.drinks.includes(action.drink)) return { ok: false, reason: '이 판에는 없는 음료입니다' };

    if (action.drink === 'ice') {
      const validRow = Number.isInteger(action.row) && action.row >= 0 && action.row < level.rows;
      const validZ = Number.isInteger(action.z) && action.z >= 0 && action.z < level.height;
      if (!validRow || !validZ) return { ok: false, reason: '그쪽으로는 뱉을 수 없습니다' };
      // 높이를 골라 쏘려면 숙여야 하고, 숙이기는 그 판에서 쓸 수 있을 때만 된다.
      if (action.z > 0 && !(level.tools || []).includes('duck')) {
        return { ok: false, reason: '숙여야 높이를 골라 쏠 수 있습니다' };
      }
      return { ok: true };
    }

    if (action.drink === 'soda') {
      const target = findObject(state, action.target);
      if (!target) return { ok: false, reason: '거품을 붙일 물건이 없습니다' };
      if (!KIND_RULES[target.kind].liftable) return { ok: false, reason: '너무 무거워서 뜨지 않습니다' };
      const aboveBlocked = !isInside(level, target.x, target.row, target.z + 1)
        || objectAt(state, target.x, target.row, target.z + 1) !== null;
      if (aboveBlocked) return { ok: false, reason: '위가 막혀서 뜰 수 없습니다' };
      return { ok: true };
    }

    return { ok: false, reason: '모르는 음료입니다' };
  }

  // 행동 하나를 적용한다. 원래 상태는 바꾸지 않는다.
  // frames는 화면 연출용으로, 효과 직후와 거품이 터지고 떨어진 뒤의 두 장면이다.
  function step(level, state, action) {
    const verdict = check(level, state, action);
    if (!verdict.ok) return verdict;

    const next = clone(state);
    let effect;

    if (action.drink === 'ice') {
      effect = { drink: 'ice', ...fireIce(level, next, action.row, action.z) };
    } else {
      const target = findObject(next, action.target);
      target.z += 1;
      target.bubble = BUBBLE_LIFETIME;
      target.inserted = false;
      effect = { drink: 'soda', targetId: target.id };
    }
    const afterEffect = clone(next);

    for (const obj of next.objects) {
      if (obj.bubble > 0) obj.bubble -= 1;
    }
    settle(level, next);

    next.used += 1;
    next.battery -= 1;
    const myPlugIn = next.objects.some((obj) => obj.kind === 'myPlug' && obj.inserted);
    if (myPlugIn) next.status = 'won';
    else if (next.battery <= 0) next.status = 'dead';

    return { ok: true, state: next, effect, frames: [afterEffect, clone(next)] };
  }

  // 지금 상태에서 가능한 모든 행동. 검증 도구가 해법을 찾을 때 쓴다.
  // canDuck이 false면 숙이기 없이 탑뷰에서 할 수 있는 행동(z = 0 조준)만 돌려준다.
  function possibleActions(level, state, canDuck = true) {
    const actions = [];
    if (level.drinks.includes('ice')) {
      const maxZ = canDuck ? level.height : 1;
      for (let row = 0; row < level.rows; row++) {
        for (let z = 0; z < maxZ; z++) actions.push({ drink: 'ice', row, z });
      }
    }
    if (level.drinks.includes('soda')) {
      for (const obj of state.objects) {
        const action = { drink: 'soda', target: obj.id };
        if (check(level, state, action).ok) actions.push(action);
      }
    }
    return actions;
  }

  // 배터리와 사용 횟수를 뺀, 판의 모양만 나타내는 문자열
  function boardKey(state) {
    return state.objects
      .map((obj) => `${obj.id}:${obj.x},${obj.row},${obj.z},${obj.bubble},${obj.inserted ? 1 : 0}`)
      .sort()
      .join('|');
  }

  const Engine = {
    BUBBLE_LIFETIME,
    DIFFICULTIES,
    batteryFor,
    KIND_RULES,
    parseLevel,
    initial,
    check,
    step,
    clone,
    objectAt,
    findObject,
    possibleActions,
    boardKey,
  };

  if (typeof module === 'object' && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
