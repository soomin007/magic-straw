// 콘센트 빌런 도감의 규칙. 목표 문장은 CLAUDE.md "확정한 방향", 콘셉트는 docs/concept-villains.md에 있다.
// 플레이어는 카페 바닥을 한 칸씩 자유롭게 걷고, 시행착오에는 벌칙이 없다(되돌리기와 처음부터는 언제든 공짜).
//
// 첫 판 "잠든 카공족"의 규칙(시제품에서 정한 것이라 바꿀 수 있다):
//   1. 상호작용할 수 있는 물건(진동벨, 의자)은 소코반처럼 한 칸씩 민다. 앞이 막히면 밀리지 않는다.
//   2. 화분과 테이블과 카운터는 배경이라 움직이지 않는다.
//   3. 진동벨을 잠든 빌런의 귀 옆 칸(*)에 밀어다 놓으면 진동벨이 울리고, 빌런이 깨어나 충전기를 챙겨 떠난다. 판을 깬다.
//
// 둘째 판 "라이브 방송 유튜버"의 규칙. 판 정의에 view가 있으면 이 규칙을 쓴다.
//   4. 유튜버는 테이블 위 폰 카메라를 보며 방송 중이라, 방송 화면에는 빌런 등 뒤의 카페가 비친다. 그 화각은 빌런 뒤로 뻗은 세 줄이다.
//      화각은 줄마다 처음 닿는 물건이나 사람에서 멈춘다. 그래서 의자 뒤는 화면에 비치지 않는 그늘이 된다.
//   5. 내가 화각에 들어가면 방송에 잡힐 뻔한 것이라, 벌칙 없이 그 걸음이 없던 일이 된다.
//   6. 쓰레기통이 화각에 비치면 유튜버가 방송을 접고 충전기를 챙겨 자리를 옮긴다. 판을 깬다.
//
// 지도 글자: 배경(움직이지 않음)은 T 테이블, L 화분, # 그 밖의 벽. . 바닥, P 나, V 빌런, b 진동벨, c 의자, t 쓰레기통, * 진동벨을 놓을 칸
// 배경 글자를 나눠 둔 것은 배치 안내 그림(make-guide.py)이 그 칸에 무엇을 그릴지 알게 하려는 것이다. 규칙에서는 셋 다 벽이다.
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
    let villain = null;
    let goal = null;
    const items = [];
    definition.map.forEach((line, y) => {
      [...line].forEach((char, x) => {
        if (char === '#' || char === 'T' || char === 'L') walls.add(`${x},${y}`);
        else if (char === 'P') player = { x, y };
        else if (char === 'V') villain = { x, y };
        else if (char === '*') goal = { x, y };
        else if (char === 'b') items.push({ kind: 'buzzer', x, y });
        else if (char === 'c') items.push({ kind: 'chair', x, y });
        else if (char === 't') items.push({ kind: 'trash', x, y });
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });
    if (!player || !villain) throw new Error(`${definition.id}: P와 V가 하나씩 있어야 합니다`);
    if (!goal && !definition.view) throw new Error(`${definition.id}: 진동벨을 놓을 칸(*)이나 화각(view) 중 하나가 있어야 합니다`);
    return {
      ...definition,
      width: definition.map[0].length,
      height: definition.map.length,
      walls,
      villain,
      goal,
      start: { player, items, facing: 'down' },
    };
  }

  function blocked(level, x, y) {
    return level.walls.has(`${x},${y}`) || x < 0 || y < 0 || x >= level.width || y >= level.height
      || (level.villain.x === x && level.villain.y === y);
  }

  function itemIndexAt(items, x, y) {
    return items.findIndex((item) => item.x === x && item.y === y);
  }

  // 카메라 화각. 빌런 뒤로 view.dir 방향을 따라 view.width 줄이 뻗고, 줄마다 처음 닿는 것에서 멈춘다.
  // cells는 화면에 비치는 칸들이고, hits는 줄마다 처음 닿은 것('player', 'trash', 'chair' 등)이다.
  function viewOf(level, state) {
    if (!level.view) return { cells: [], hits: [] };
    const d = DIRECTIONS[level.view.dir];
    const side = { dx: d.dy, dy: d.dx };
    const half = Math.floor(level.view.width / 2);
    const cells = [];
    const hits = [];
    for (let offset = -half; offset <= half; offset++) {
      let x = level.villain.x + d.dx + side.dx * offset;
      let y = level.villain.y + d.dy + side.dy * offset;
      let hit = null;
      while (!blocked(level, x, y)) {
        cells.push({ x, y });
        if (state.player.x === x && state.player.y === y) {
          hit = 'player';
          break;
        }
        const index = itemIndexAt(state.items, x, y);
        if (index >= 0) {
          hit = state.items[index].kind;
          break;
        }
        x += d.dx;
        y += d.dy;
      }
      hits.push(hit);
    }
    return { cells, hits };
  }

  // 한 걸음. 막혔으면 몸만 그쪽으로 돌린다(벌칙 없이 제자리). pushed는 민 물건의 번호다.
  // 화각에 들어가는 걸음이면 seen이 true이고, 상태는 바뀌지 않는다(attempted에 내디딘 모습이 있다).
  function step(level, state, direction) {
    const d = DIRECTIONS[direction];
    const tx = state.player.x + d.dx;
    const ty = state.player.y + d.dy;
    const turned = { ...state, facing: direction };
    if (blocked(level, tx, ty)) return { moved: false, state: turned, won: false };
    const index = itemIndexAt(state.items, tx, ty);
    let items = state.items;
    if (index >= 0) {
      const px = tx + d.dx;
      const py = ty + d.dy;
      if (blocked(level, px, py) || itemIndexAt(state.items, px, py) >= 0) return { moved: false, state: turned, won: false };
      items = state.items.map((item, i) => (i === index ? { ...item, x: px, y: py } : item));
    }
    const next = { player: { x: tx, y: ty }, items, facing: direction };
    if (viewOf(level, next).hits.includes('player')) return { moved: false, seen: true, state: turned, attempted: next, won: false };
    return { moved: true, pushed: index >= 0 ? index : null, state: next, won: won(level, next) };
  }

  function won(level, state) {
    if (level.view) return viewOf(level, state).hits.includes('trash');
    return state.items.some((item) => item.kind === 'buzzer' && item.x === level.goal.x && item.y === level.goal.y);
  }

  function stateKey(state) {
    const items = state.items.map((item) => `${item.kind}${item.x},${item.y}`).sort().join(';');
    return `${state.player.x},${state.player.y}|${items}`;
  }

  // 너비 우선 탐색으로 최소 걸음 수를 찾는다. pushes는 그 해법에서 민 횟수다. 해법이 없으면 moves가 null이다.
  function solve(level, limit = 400000) {
    const queue = [{ state: level.start, path: [], pushes: 0 }];
    const seen = new Set([stateKey(level.start)]);
    for (let head = 0; head < queue.length && seen.size < limit; head++) {
      const node = queue[head];
      for (const direction of Object.keys(DIRECTIONS)) {
        const result = step(level, node.state, direction);
        if (!result.moved) continue;
        const path = [...node.path, direction];
        const pushes = node.pushes + (result.pushed !== null ? 1 : 0);
        if (result.won) return { moves: path.length, pushes, path };
        const key = stateKey(result.state);
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push({ state: result.state, path, pushes });
      }
    }
    return { moves: null, pushes: null, path: null };
  }

  const api = { DIRECTIONS, parseLevel, viewOf, step, won, solve };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VillainEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
