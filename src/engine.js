// 게임 규칙. 화면 코드와 분리해서 브라우저와 Node 양쪽에서 검증할 수 있게 한다.
//
// 무대는 카페 테이블을 옆에서 본 격자다. x는 왼쪽(플레이어 쪽)에서 오른쪽(멀티탭 쪽)으로 커지고,
// y는 테이블 면(0)에서 위로 커진다. 맨 오른쪽 열은 세워 둔 타워형 멀티탭이고, 콘센트 구멍이 있는 높이만 꽂을 수 있다.
// 플러그는 멀티탭 바로 왼쪽 칸(x = width - 2)에 있을 때 꽂힌 것으로 본다.
(function (root) {
  'use strict';

  // 거품이 붙은 사물은 뱉은 행동과 그다음 행동이 끝날 때까지 떠 있다가 터진다.
  const BUBBLE_LIFETIME = 2;

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

  const KIND_RULES = {
    myPlug: { pushable: true, liftable: true, plug: true },
    theirPlug: { pushable: true, liftable: true, plug: true },
    cup: { pushable: true, liftable: true, plug: false },
    book: { pushable: false, liftable: false, plug: false },
  };

  // 레벨 지도에 쓰는 글자. 맨 오른쪽 열은 멀티탭이라 '#'(막힌 면)과 'S'(콘센트 구멍)만 쓴다.
  const MAP_LEGEND = { P: 'myPlug', N: 'theirPlug', c: 'cup', B: 'book' };

  function parseLevel(definition) {
    const height = definition.map.length;
    const width = definition.map[0].length;
    const sockets = [];
    const objects = [];

    definition.map.forEach((line, row) => {
      if (line.length !== width) {
        throw new Error(`${definition.id}: 지도 ${row}번 줄의 길이가 다릅니다`);
      }
      const y = height - 1 - row;
      [...line].forEach((char, x) => {
        if (x === width - 1) {
          if (char === 'S') sockets.push(y);
          else if (char !== '#') throw new Error(`${definition.id}: 멀티탭 열에는 # 또는 S만 씁니다`);
          return;
        }
        const kind = MAP_LEGEND[char];
        if (kind) objects.push({ id: `${kind}-${objects.length}`, kind, x, y });
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });

    return { ...definition, width, height, sockets, objects };
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

  function objectAt(state, x, y) {
    return state.objects.find((obj) => obj.x === x && obj.y === y) || null;
  }

  function findObject(state, id) {
    return state.objects.find((obj) => obj.id === id) || null;
  }

  function isWall(level, x, y) {
    return x < 0 || x >= level.width - 1 || y < 0 || y >= level.height;
  }

  function isBlocked(level, state, x, y) {
    return isWall(level, x, y) || objectAt(state, x, y) !== null;
  }

  function isSocketFree(level, state, y) {
    if (!level.sockets.includes(y)) return false;
    return !state.objects.some((obj) => obj.inserted && obj.y === y);
  }

  function isSupported(state, obj) {
    if (obj.inserted || obj.bubble > 0 || obj.y === 0) return true;
    return objectAt(state, obj.x, obj.y - 1) !== null;
  }

  // 받침이 없는 사물을 떨어뜨리고, 빈 콘센트 앞에 내려앉은 플러그를 꽂는다.
  function settle(level, state) {
    const lowestFirst = [...state.objects].sort((a, b) => a.y - b.y);
    for (const obj of lowestFirst) {
      while (!isSupported(state, obj)) obj.y -= 1;
    }
    for (const obj of state.objects) {
      const canInsert = KIND_RULES[obj.kind].plug && !obj.inserted && obj.bubble === 0;
      if (canInsert && obj.x === level.width - 2 && isSocketFree(level, state, obj.y)) {
        obj.inserted = true;
      }
    }
  }

  // 얼음에 맞은 사물은 막힐 때까지 오른쪽으로 미끄러진다.
  // 떠 있지 않은 사물은 받침이 없는 칸에 들어서면 그대로 떨어지고, 떨어진 자리에서 멈춘다.
  // 플러그가 멀티탭에 부딪히면 그 높이의 콘센트가 비어 있을 때 꽂힌다.
  function slide(level, state, obj) {
    for (;;) {
      const nextX = obj.x + 1;
      if (nextX === level.width - 1) {
        if (KIND_RULES[obj.kind].plug && isSocketFree(level, state, obj.y)) {
          obj.inserted = true;
          obj.bubble = 0;
        }
        return;
      }
      if (objectAt(state, nextX, obj.y)) return;
      obj.x = nextX;
      if (!isSupported(state, obj)) {
        while (!isSupported(state, obj)) obj.y -= 1;
        return;
      }
    }
  }

  // 얼음은 플레이어 쪽(왼쪽 끝)에서 고른 높이로 날아가 처음 만나는 사물에 부딪힌다.
  function fireIce(level, state, row) {
    for (let x = 0; x < level.width - 1; x++) {
      const target = objectAt(state, x, row);
      if (!target) continue;
      if (KIND_RULES[target.kind].pushable && !target.inserted) slide(level, state, target);
      return { row, hitX: x, hitId: target.id };
    }
    return { row, hitX: level.width - 1, hitId: null };
  }

  function check(level, state, action) {
    if (state.status !== 'playing') return { ok: false, reason: '이미 끝난 판입니다' };
    if (!level.drinks.includes(action.drink)) return { ok: false, reason: '이 판에는 없는 음료입니다' };

    if (action.drink === 'ice') {
      const validRow = Number.isInteger(action.row) && action.row >= 0 && action.row < level.height;
      return validRow ? { ok: true } : { ok: false, reason: '그 높이로는 뱉을 수 없습니다' };
    }

    if (action.drink === 'soda') {
      const target = findObject(state, action.target);
      if (!target) return { ok: false, reason: '거품을 붙일 물건이 없습니다' };
      if (!KIND_RULES[target.kind].liftable) return { ok: false, reason: '너무 무거워서 뜨지 않습니다' };
      if (isBlocked(level, state, target.x, target.y + 1)) return { ok: false, reason: '위가 막혀서 뜰 수 없습니다' };
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
      effect = { drink: 'ice', ...fireIce(level, next, action.row) };
    } else {
      const target = findObject(next, action.target);
      target.y += 1;
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
  function possibleActions(level, state) {
    const actions = [];
    if (level.drinks.includes('ice')) {
      for (let row = 0; row < level.height; row++) actions.push({ drink: 'ice', row });
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
      .map((obj) => `${obj.id}:${obj.x},${obj.y},${obj.bubble},${obj.inserted ? 1 : 0}`)
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
