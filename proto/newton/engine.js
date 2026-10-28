// 운동량 보존 퍼즐 시제품의 규칙. 장소와 인물은 아직 정하지 않았다(2026-10-28, known-issues 17번).
// 화면 코드와 분리해서, 같은 규칙으로 해법을 찾고 최소 수를 셀 수 있게 한다.
//
// 플레이어는 Baba Is You처럼 한 칸씩 자유롭게 걷는다. 행동 수 제한이 없고, 되돌리기와 처음부터는 언제든 공짜다(사용자 결정).
// 물건만 뉴턴 법칙을 칸 단위로 따른다.
//   1. 마찰이 없는 바닥이라, 움직이는 물건은 무언가에 부딪칠 때까지 같은 방향으로 계속 미끄러진다(관성).
//   2. 플레이어가 물건 쪽으로 걸어 들어가면 물건을 찬다. 찬 물건은 그 방향으로 미끄러져 나가고 플레이어는 제자리에 남는다.
//   3. 미끄러지던 물건이 멈춰 있는 물건에 부딪치면, 부딪친 쪽은 멈추고 맞은 쪽이 같은 속도로 나간다(무게가 같은 탄성 충돌, 뉴턴의 요람).
//      마주 오던 둘이 부딪치면 서로의 속도를 바꿔 가진다.
//   4. 벽은 움직이지 않는 아주 무거운 것이라, 벽에 부딪치면 그 자리에 멈춘다. 미끄러지던 물건이 플레이어에 부딪쳐도 멈춘다.
//
// 칸 단위로 옮기면서 정한 것: 물건은 한 차례에 한 칸씩 움직이고, 모든 물건이 멈춘 뒤에 다음 걸음을 받는다.
// 벽에 부딪치면 튕겨 나오지 않고 멈춘다(튕기면 끝없이 오가는 판이 생긴다). 모든 물건의 무게가 같다.
//
// 지도 글자: # 벽, . 바닥, P 플레이어, o 물건, * 물건이 멈춰야 할 곳, @ 물건이 처음부터 놓인 목표 칸
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
    const goals = [];
    let player = null;
    const blocks = [];
    definition.map.forEach((line, y) => {
      [...line].forEach((char, x) => {
        if (char === '#') walls.add(`${x},${y}`);
        else if (char === 'P') player = { x, y };
        else if (char === 'o') blocks.push({ x, y });
        else if (char === '*') goals.push({ x, y });
        else if (char === '@') {
          goals.push({ x, y });
          blocks.push({ x, y });
        } else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });
    if (!player) throw new Error(`${definition.id}: 플레이어(P)가 없습니다`);
    return {
      ...definition,
      width: definition.map[0].length,
      height: definition.map.length,
      walls,
      goals,
      start: { player, blocks },
    };
  }

  function isWall(level, x, y) {
    return level.walls.has(`${x},${y}`) || x < 0 || y < 0 || x >= level.width || y >= level.height;
  }

  function blockIndexAt(blocks, x, y) {
    return blocks.findIndex((block) => block.x === x && block.y === y);
  }

  // 미끄러지는 물건들의 한 차례. 앞이 비어 있는 것부터 움직이고, 막힌 것은 부딪친 상대에 따라 멈추거나 속도를 넘긴다.
  function tick(level, player, bodies) {
    const occupied = (x, y) => (player.x === x && player.y === y) || bodies.some((body) => body.x === x && body.y === y);
    const pending = new Set(bodies.filter((body) => body.vx !== 0 || body.vy !== 0));
    let progressed = true;
    while (progressed) {
      progressed = false;
      for (const body of [...pending]) {
        const nx = body.x + body.vx;
        const ny = body.y + body.vy;
        if (isWall(level, nx, ny) || (player.x === nx && player.y === ny)) {
          body.vx = 0;
          body.vy = 0;
          pending.delete(body);
          progressed = true;
        } else if (!occupied(nx, ny)) {
          body.x = nx;
          body.y = ny;
          pending.delete(body);
          progressed = true;
        }
      }
    }
    // 남은 것은 다른 물건에 막힌 것이다.
    const exchanged = new Set();
    for (const body of pending) {
      if (exchanged.has(body)) continue;
      const other = bodies.find((item) => item.x === body.x + body.vx && item.y === body.y + body.vy);
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

  // 한 걸음. 빈칸이면 걷고, 물건이면 찬다. 벽이면 아무 일도 없다(벌칙 없이 제자리).
  // frames는 화면 연출용으로, 차례마다의 물건 위치다. kicked는 찼는지, moved는 무엇이든 바뀌었는지다.
  function step(level, state, direction) {
    const d = DIRECTIONS[direction];
    const tx = state.player.x + d.dx;
    const ty = state.player.y + d.dy;
    if (isWall(level, tx, ty)) return { moved: false, state };

    const index = blockIndexAt(state.blocks, tx, ty);
    if (index < 0) {
      const next = { player: { x: tx, y: ty }, blocks: state.blocks };
      return { moved: true, kicked: false, state: next, frames: [] };
    }

    const bodies = state.blocks.map((block) => ({ x: block.x, y: block.y, vx: 0, vy: 0 }));
    bodies[index].vx = d.dx;
    bodies[index].vy = d.dy;
    const frames = [bodies.map((body) => ({ x: body.x, y: body.y }))];
    let ticks = 0;
    while (bodies.some((body) => body.vx !== 0 || body.vy !== 0) && ticks < TICK_LIMIT) {
      tick(level, state.player, bodies);
      frames.push(bodies.map((body) => ({ x: body.x, y: body.y })));
      ticks += 1;
    }
    const blocks = bodies.map((body) => ({ x: body.x, y: body.y }));
    const moved = blocks.some((block, i) => block.x !== state.blocks[i].x || block.y !== state.blocks[i].y);
    return { moved, kicked: true, state: { player: state.player, blocks }, frames };
  }

  function won(level, state) {
    return level.goals.every((goal) => state.blocks.some((block) => block.x === goal.x && block.y === goal.y));
  }

  function stateKey(state) {
    const blocks = state.blocks.map((block) => `${block.x},${block.y}`).sort().join(';');
    return `${state.player.x},${state.player.y}|${blocks}`;
  }

  // 너비 우선 탐색으로 최소 걸음 수와 그 순서를 찾는다. kicks는 그 해법에서 찬 횟수다. 해법이 없으면 moves가 null이다.
  function solve(level, limit = 200000) {
    const start = level.start;
    const queue = [{ state: start, path: [], kicks: 0 }];
    const seen = new Set([stateKey(start)]);
    for (let head = 0; head < queue.length && seen.size < limit; head++) {
      const node = queue[head];
      if (won(level, node.state)) return { moves: node.path.length, kicks: node.kicks, path: node.path };
      for (const direction of Object.keys(DIRECTIONS)) {
        const result = step(level, node.state, direction);
        if (!result.moved) continue;
        const key = stateKey(result.state);
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push({ state: result.state, path: [...node.path, direction], kicks: node.kicks + (result.kicked ? 1 : 0) });
      }
    }
    return { moves: null, kicks: null, path: null };
  }

  const api = { DIRECTIONS, parseLevel, step, won, solve };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NewtonEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
