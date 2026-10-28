// 운동량 보존 퍼즐 시제품의 규칙. 장소와 인물은 아직 정하지 않았다(2026-10-28, known-issues 17번).
// 화면 코드와 분리해서, 같은 규칙으로 해법을 찾고 최소 수를 셀 수 있게 한다.
//
// 규칙은 뉴턴의 운동 법칙 하나를 칸 단위로 옮긴 것이다.
//   1. 마찰이 없는 바닥이라, 움직이는 것은 무언가에 부딪칠 때까지 같은 방향으로 계속 간다(관성).
//   2. 플레이어는 스스로 걷지 못한다. 가진 물건을 한 방향으로 던지면 같은 무게인 자신은 반대 방향으로 밀려난다(작용과 반작용).
//      던질 물건의 개수가 곧 행동 수다.
//   3. 움직이는 것이 멈춰 있는 것에 부딪치면, 부딪친 쪽은 멈추고 맞은 쪽이 같은 속도로 나간다(무게가 같은 탄성 충돌, 뉴턴의 요람).
//      마주 오던 둘이 부딪치면 서로의 속도를 바꿔 가진다.
//   4. 벽은 움직이지 않는 아주 무거운 것이라, 벽에 부딪치면 그 자리에 멈춘다.
//
// 칸 단위로 옮기면서 정한 것: 모든 것은 한 차례에 한 칸씩 움직이고, 모든 것이 멈춘 뒤에만 다음에 던질 수 있다.
// 벽에 부딪치면 튕겨 나오지 않고 멈춘다(튕기면 끝없이 오가는 판이 생긴다).
//
// 지도 글자: # 벽, . 바닥, P 플레이어, o 멈춰 있는 물건, X 플레이어가 멈춰야 할 곳, * 물건이 멈춰야 할 곳
(function (root) {
  'use strict';

  const DIRECTIONS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  };
  const TICK_LIMIT = 400;

  function parseLevel(definition) {
    const walls = new Set();
    const playerGoals = [];
    const blockGoals = [];
    let player = null;
    const blocks = [];
    definition.map.forEach((line, y) => {
      [...line].forEach((char, x) => {
        if (char === '#') walls.add(`${x},${y}`);
        else if (char === 'P') player = { x, y };
        else if (char === 'o') blocks.push({ x, y });
        else if (char === 'X') playerGoals.push({ x, y });
        else if (char === '*') blockGoals.push({ x, y });
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });
    if (!player) throw new Error(`${definition.id}: 플레이어(P)가 없습니다`);
    return {
      ...definition,
      width: definition.map[0].length,
      height: definition.map.length,
      walls,
      playerGoals,
      blockGoals,
      start: { player, blocks, throwsLeft: definition.throws },
    };
  }

  // 상태 안의 몸체 목록. 0번이 플레이어이고 나머지는 물건이다. vx, vy는 한 차례에 움직이는 칸 수(-1, 0, 1)다.
  function bodiesFrom(state) {
    return [
      { kind: 'player', x: state.player.x, y: state.player.y, vx: 0, vy: 0 },
      ...state.blocks.map((block) => ({ kind: 'block', x: block.x, y: block.y, vx: 0, vy: 0 })),
    ];
  }

  function stateFrom(bodies, throwsLeft) {
    const player = bodies.find((body) => body.kind === 'player');
    const blocks = bodies.filter((body) => body.kind === 'block').map((body) => ({ x: body.x, y: body.y }));
    return { player: { x: player.x, y: player.y }, blocks, throwsLeft };
  }

  function isWall(level, x, y) {
    return level.walls.has(`${x},${y}`) || x < 0 || y < 0 || x >= level.width || y >= level.height;
  }

  function bodyAt(bodies, x, y) {
    return bodies.find((body) => body.x === x && body.y === y) || null;
  }

  // 한 차례. 앞이 비어 있는 것부터 움직이고, 막힌 것은 부딪친 상대에 따라 멈추거나 속도를 넘긴다.
  function tick(level, bodies) {
    const pending = new Set(bodies.filter((body) => body.vx !== 0 || body.vy !== 0));
    let progressed = true;
    while (progressed) {
      progressed = false;
      for (const body of [...pending]) {
        const nx = body.x + body.vx;
        const ny = body.y + body.vy;
        if (isWall(level, nx, ny)) {
          body.vx = 0;
          body.vy = 0;
          pending.delete(body);
          progressed = true;
        } else if (!bodyAt(bodies, nx, ny)) {
          body.x = nx;
          body.y = ny;
          pending.delete(body);
          progressed = true;
        }
      }
    }
    // 남은 것은 다른 몸체에 막힌 것이다.
    const exchanged = new Set();
    for (const body of pending) {
      if (exchanged.has(body)) continue;
      const other = bodyAt(bodies, body.x + body.vx, body.y + body.vy);
      if (pending.has(other) && other.vx === -body.vx && other.vy === -body.vy) {
        // 마주 오던 둘: 속도를 바꿔 가진다.
        [body.vx, other.vx] = [other.vx, body.vx];
        [body.vy, other.vy] = [other.vy, body.vy];
        exchanged.add(other);
      } else if (other.vx === 0 && other.vy === 0) {
        // 멈춰 있던 것: 속도를 그대로 넘기고 자신은 멈춘다.
        other.vx = body.vx;
        other.vy = body.vy;
        body.vx = 0;
        body.vy = 0;
      } else {
        // 옆에서 오던 것에 막혔다: 이번 차례에는 그 자리에 멈춘다.
        body.vx = 0;
        body.vy = 0;
      }
    }
  }

  function moving(bodies) {
    return bodies.some((body) => body.vx !== 0 || body.vy !== 0);
  }

  function canThrow(level, state, direction) {
    const d = DIRECTIONS[direction];
    if (!d || state.throwsLeft <= 0) return false;
    const tx = state.player.x + d.dx;
    const ty = state.player.y + d.dy;
    if (isWall(level, tx, ty)) return false;
    return !state.blocks.some((block) => block.x === tx && block.y === ty);
  }

  // 던지기 하나를 끝까지 계산한다. frames는 화면 연출용으로, 차례마다의 몸체 위치다.
  function throwIn(level, state, direction) {
    if (!canThrow(level, state, direction)) return { ok: false };
    const d = DIRECTIONS[direction];
    const bodies = bodiesFrom(state);
    const player = bodies[0];
    bodies.push({ kind: 'block', x: player.x + d.dx, y: player.y + d.dy, vx: d.dx, vy: d.dy, thrown: true });
    player.vx = -d.dx;
    player.vy = -d.dy;
    const frames = [bodies.map((body) => ({ x: body.x, y: body.y }))];
    let ticks = 0;
    while (moving(bodies) && ticks < TICK_LIMIT) {
      tick(level, bodies);
      frames.push(bodies.map((body) => ({ x: body.x, y: body.y })));
      ticks += 1;
    }
    const next = stateFrom(bodies, state.throwsLeft - 1);
    return { ok: true, state: next, frames, kinds: bodies.map((body) => body.kind), status: status(level, next) };
  }

  function status(level, state) {
    const playerDone = level.playerGoals.every((goal) => goal.x === state.player.x && goal.y === state.player.y);
    const blocksDone = level.blockGoals.every((goal) => state.blocks.some((block) => block.x === goal.x && block.y === goal.y));
    if (playerDone && blocksDone) return 'won';
    if (state.throwsLeft <= 0) return 'stuck';
    return 'playing';
  }

  function stateKey(state) {
    const blocks = state.blocks.map((block) => `${block.x},${block.y}`).sort().join(';');
    return `${state.player.x},${state.player.y}|${blocks}|${state.throwsLeft}`;
  }

  // 너비 우선 탐색으로 최소 던지기 수와 그 순서를 찾는다. 해법이 없으면 moves가 null이다.
  function solve(level) {
    const start = level.start;
    const queue = [{ state: start, path: [] }];
    const seen = new Set([stateKey(start)]);
    while (queue.length) {
      const node = queue.shift();
      if (status(level, node.state) === 'won') return { moves: node.path.length, path: node.path };
      for (const direction of Object.keys(DIRECTIONS)) {
        const result = throwIn(level, node.state, direction);
        if (!result.ok) continue;
        const key = stateKey(result.state);
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push({ state: result.state, path: [...node.path, direction] });
      }
    }
    return { moves: null, path: null };
  }

  const api = { DIRECTIONS, parseLevel, canThrow, throwIn, status, solve };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NewtonEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
