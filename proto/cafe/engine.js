// 카페 시제품의 규칙. 목표 문장은 CLAUDE.md "확정한 방향"에 있다(2026-10-28 사용자 확정):
// 플레이어는 카페에서 한 칸씩 자유롭게 움직이고, 시행착오에는 벌칙이 없다. 목표는 옆자리 사람이 스스로 플러그를 뽑게 만드는 것이다.
//
// 이 판의 이야기: 옆자리 사람은 휴대폰을 충전하려고 콘센트를 쓰고 있다. 내 보조배터리는 랩탑을 충전하지 못하지만 휴대폰은 충전할 수 있다.
// 보조배터리를 상대 손이 닿는 곳에 두고 상대가 그것을 보게 만들면, 상대는 휴대폰을 보조배터리에 꽂고 콘센트에서 플러그를 뽑는다.
// 다만 헤드폰을 낀 상대에게 말을 걸 수는 없고, 상대가 내가 하는 짓을 보면 안 된다(일이 커지면 공부할 시간이 없다).
//
// 규칙(시제품에서 정한 것이라 바꿀 수 있다):
//   1. 한 번 움직이면 한 차례가 지난다. 제자리 기다리기도 한 차례다.
//   2. 물건(보조배터리, 의자)은 소코반처럼 한 칸씩 민다. 앞이 막히면 밀리지 않는다.
//   3. 상대는 정해진 순서로 고개를 돌리며 한 방향을 본다. 시선은 벽, 테이블, 의자, 물건, 나에게 닿으면 거기서 멈춘다.
//   4. 내가 시선에 닿으면 상대가 고개를 들어 나를 본다. 벌칙은 없고, 그 걸음이 없던 일이 되어 한 걸음 전으로 돌아간다.
//   5. 보조배터리가 시선에 닿고 상대 바로 옆 칸에 있으면, 상대가 그것을 집어 휴대폰을 옮겨 꽂고 콘센트에서 플러그를 뽑는다. 판을 깬다.
//   의자는 시선을 가린다. 같은 규칙(시선이 처음 닿는 것에서 멈춘다)이 나를 숨기는 데도, 보조배터리를 보여 주는 데도 쓰인다.
//
// 지도 글자: # 벽이나 테이블, . 바닥, P 나, N 옆자리 사람, b 보조배터리, c 의자
(function (root) {
  'use strict';

  const DIRECTIONS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  };

  function parseLevel(definition) {
    const walls = new Set();
    let player = null;
    let neighbor = null;
    let bank = null;
    const chairs = [];
    definition.map.forEach((line, y) => {
      [...line].forEach((char, x) => {
        if (char === '#') walls.add(`${x},${y}`);
        else if (char === 'P') player = { x, y };
        else if (char === 'N') neighbor = { x, y };
        else if (char === 'b') bank = { x, y };
        else if (char === 'c') chairs.push({ x, y });
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });
    if (!player || !neighbor || !bank) throw new Error(`${definition.id}: P, N, b가 하나씩 있어야 합니다`);
    return {
      ...definition,
      width: definition.map[0].length,
      height: definition.map.length,
      walls,
      neighbor,
      start: { player, bank, chairs, turn: 0 },
    };
  }

  function isWall(level, x, y) {
    return level.walls.has(`${x},${y}`) || x < 0 || y < 0 || x >= level.width || y >= level.height
      || (level.neighbor.x === x && level.neighbor.y === y);
  }

  function itemAt(state, x, y) {
    if (state.bank.x === x && state.bank.y === y) return 'bank';
    const index = state.chairs.findIndex((chair) => chair.x === x && chair.y === y);
    return index >= 0 ? index : null;
  }

  // 지금 차례에 상대가 보는 방향과, 시선이 지나가는 칸들. hit은 시선이 처음 닿은 것('player', 'bank', 'chair' 또는 null)이다.
  function gazeAt(level, state, turn = state.turn) {
    const direction = level.gaze[turn % level.gaze.length];
    const d = DIRECTIONS[direction];
    const cells = [];
    let x = level.neighbor.x + d.dx;
    let y = level.neighbor.y + d.dy;
    while (!isWall(level, x, y)) {
      cells.push({ x, y });
      if (state.player.x === x && state.player.y === y) return { direction, cells, hit: 'player', at: { x, y } };
      const item = itemAt(state, x, y);
      if (item === 'bank') return { direction, cells, hit: 'bank', at: { x, y } };
      if (item !== null) return { direction, cells, hit: 'chair', at: { x, y } };
      x += d.dx;
      y += d.dy;
    }
    return { direction, cells, hit: null, at: null };
  }

  function bankTaken(level, state) {
    const gaze = gazeAt(level, state);
    if (gaze.hit !== 'bank') return false;
    return Math.abs(state.bank.x - level.neighbor.x) + Math.abs(state.bank.y - level.neighbor.y) === 1;
  }

  // 한 차례. direction이 'wait'이면 제자리에서 기다린다.
  // 결과: moved(무엇이든 바뀌었나), seen(들켜서 없던 일이 되었나), state(다음 상태, 들켰거나 막혔으면 원래 상태), won
  function step(level, state, direction) {
    let next;
    if (direction === 'wait') {
      next = { ...state, turn: state.turn + 1 };
    } else {
      const d = DIRECTIONS[direction];
      const tx = state.player.x + d.dx;
      const ty = state.player.y + d.dy;
      if (isWall(level, tx, ty)) return { moved: false, seen: false, state, won: false };
      const item = itemAt(state, tx, ty);
      let bank = state.bank;
      let chairs = state.chairs;
      if (item !== null) {
        const px = tx + d.dx;
        const py = ty + d.dy;
        if (isWall(level, px, py) || itemAt(state, px, py) !== null) return { moved: false, seen: false, state, won: false };
        if (item === 'bank') bank = { x: px, y: py };
        else chairs = chairs.map((chair, index) => (index === item ? { x: px, y: py } : chair));
      }
      next = { player: { x: tx, y: ty }, bank, chairs, turn: state.turn + 1 };
    }
    if (gazeAt(level, next).hit === 'player') {
      return { moved: false, seen: true, state, attempted: next, won: false };
    }
    return { moved: true, seen: false, state: next, won: bankTaken(level, next) };
  }

  function stateKey(level, state) {
    const chairs = state.chairs.map((chair) => `${chair.x},${chair.y}`).sort().join(';');
    return `${state.player.x},${state.player.y}|${state.bank.x},${state.bank.y}|${chairs}|${state.turn % level.gaze.length}`;
  }

  const ACTIONS = ['up', 'down', 'left', 'right', 'wait'];

  // 너비 우선 탐색으로 최소 차례 수를 찾는다. 해법이 없으면 moves가 null이다.
  function solve(level, limit = 300000) {
    const start = level.start;
    const queue = [{ state: start, path: [] }];
    const seen = new Set([stateKey(level, start)]);
    for (let head = 0; head < queue.length && seen.size < limit; head++) {
      const node = queue[head];
      for (const action of ACTIONS) {
        const result = step(level, node.state, action);
        if (!result.moved) continue;
        const path = [...node.path, action];
        if (result.won) return { moves: path.length, path };
        const key = stateKey(level, result.state);
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push({ state: result.state, path });
      }
    }
    return { moves: null, path: null };
  }

  const api = { DIRECTIONS, ACTIONS, parseLevel, gazeAt, step, solve };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CafeEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
