// 규칙과 레벨 검증 도구.
// 브라우저에서는 tools/verify.html을 열면 되고, Node가 있으면 `node tools/verify.js`로도 돌린다.
(function (root) {
  'use strict';

  const inNode = typeof module === 'object' && module.exports && typeof require === 'function';
  const Engine = inNode ? require('../src/engine.js') : root.Engine;
  const LEVEL_DEFINITIONS = inNode ? require('../src/levels.js') : root.LEVEL_DEFINITIONS;

  const SEARCH_DEPTH_LIMIT = 9;

  // 너비 우선 탐색으로 최소 행동 수와, 그 수로 끝나는 해법 하나를 찾는다.
  // canDuck이 false면 숙이기 없이 탑뷰에서 할 수 있는 행동만 쓴다.
  function solve(level, canDuck = true) {
    const start = Engine.initial(level, SEARCH_DEPTH_LIMIT + 1);
    const seen = new Set([Engine.boardKey(start)]);
    let frontier = [{ state: start, path: [] }];

    for (let depth = 0; depth < SEARCH_DEPTH_LIMIT; depth++) {
      const nextFrontier = [];
      for (const node of frontier) {
        for (const action of Engine.possibleActions(level, node.state, canDuck)) {
          const result = Engine.step(level, node.state, action);
          if (!result.ok) continue;
          const path = [...node.path, action];
          if (result.state.status === 'won') return { moves: path.length, path };
          const key = Engine.boardKey(result.state);
          if (seen.has(key)) continue;
          seen.add(key);
          nextFrontier.push({ state: result.state, path });
        }
      }
      frontier = nextFrontier;
    }
    return { moves: null, path: null };
  }

  function describe(action) {
    if (action.drink === 'ice') return action.z === 0 ? `얼음→${action.row}줄` : `얼음→${action.row}줄 ${action.z}층(숙여서)`;
    return `소다→${action.target}`;
  }

  function play(level, battery, actions) {
    let state = Engine.initial(level, battery);
    const effects = [];
    for (const action of actions) {
      const result = Engine.step(level, state, action);
      if (!result.ok) return { state, effects, rejected: result.reason };
      state = result.state;
      effects.push(result.effect);
    }
    return { state, effects };
  }

  function runAll() {
    const lines = [];
    let failures = 0;

    function expect(condition, message) {
      if (condition) {
        lines.push(`PASS  ${message}`);
      } else {
        failures += 1;
        lines.push(`FAIL  ${message}`);
      }
    }

    const levels = LEVEL_DEFINITIONS.map(Engine.parseLevel);
    const byId = Object.fromEntries(levels.map((level) => [level.id, level]));
    const ice = (row, z = 0) => ({ drink: 'ice', row, z });
    const soda = (target) => ({ drink: 'soda', target });

    for (const level of levels) {
      const result = solve(level);
      const route = result.path ? result.path.map(describe).join(', ') : '해법 없음';
      expect(result.moves === level.optimal,
        `${level.title}: 최소 ${result.moves}수 (기록된 값 ${level.optimal}) [${route}]`);

      // 숙이기가 필요한 판은 탑뷰만으로는 풀리지 않아야 하고, 나머지 판은 탑뷰만으로 풀려야 한다.
      const topOnly = solve(level, false);
      if (level.needsDuck) {
        expect(topOnly.moves === null, `${level.title}: 숙이기 없이는 풀리지 않음`);
      } else {
        expect(topOnly.moves === level.optimal, `${level.title}: 숙이기 없이 탑뷰만으로 풀림`);
      }

      // 빠듯 난이도에서도 깰 수 있고, 배터리가 한 칸 모자라면 깰 수 없어야 한다.
      if (result.path) {
        const tight = play(level, Engine.batteryFor(level, 'tight'), result.path);
        expect(tight.state.status === 'won', `${level.title}: 빠듯 난이도 배터리로 깰 수 있음`);
        if (level.optimal > 1) {
          const short = play(level, level.optimal - 1, result.path);
          expect(short.state.status !== 'won', `${level.title}: 배터리가 한 칸 모자라면 못 깸`);
        }
      }
    }

    // 규칙 단위 검사
    {
      const level = byId.menu;
      const result = play(level, 3, [ice(0)]);
      const turns = result.effects[0].path.map((cell) => `${cell.x},${cell.row}`).join(' ');
      expect(turns.includes('1,0 1,1 1,2 2,2'), '메뉴판: 오른쪽으로 가던 얼음이 \\ 두 개를 지나 아래로, 다시 오른쪽으로 꺾임');
      expect(result.state.status === 'won', '메뉴판: 꺾인 얼음이 플러그를 밀어 꽂음');
    }
    {
      const level = byId.sideways;
      const result = play(level, 3, [ice(0)]);
      const plug = result.state.objects.find((obj) => obj.kind === 'myPlug');
      expect(plug.x === 3 && plug.row === 2, '옆 줄로: 아래로 꺾인 얼음은 플러그를 아래 줄로 밀어냄');
      const trap = play(level, 3, [ice(1)]);
      const trapped = trap.state.objects.find((obj) => obj.kind === 'myPlug');
      expect(trapped.x === 5 && trap.state.status === 'playing', '옆 줄로: 콘센트 없는 줄로 밀면 콘센트 칸막이 앞에서 멈춤');
    }
    {
      const level = byId.under;
      const cupId = level.objects.find((obj) => obj.kind === 'cup').id;
      const result = play(level, 3, [soda(cupId), ice(1)]);
      expect(result.state.status === 'won', '거품: 떠 있는 컵 아래로 얼음이 지나감');
      const cup = Engine.findObject(result.state, cupId);
      expect(cup.z === 0 && cup.x === 1, '거품: 다음 행동이 끝나면 터지고 컵은 제자리에 떨어짐');
    }
    {
      const level = byId.take;
      const theirId = level.objects.find((obj) => obj.kind === 'theirPlug').id;
      const later = play(level, 5, [soda(theirId), ice(0)]);
      const fallen = Engine.findObject(later.state, theirId);
      expect(fallen.z === 0 && fallen.inserted, '빼앗기: 거품이 터질 때까지 차지하지 못하면 상대 플러그가 다시 꽂힘');
      const iceFirst = play(level, 5, [ice(1)]);
      expect(iceFirst.state.status === 'playing', '빼앗기: 상대 플러그를 띄우지 않고 밀면 꽂히지 않음');
    }
    {
      const level = byId.order;
      const theirId = level.objects.find((obj) => obj.kind === 'theirPlug').id;
      const wrongOrder = play(level, 5, [soda(theirId), ice(0), ice(2)]);
      expect(wrongOrder.state.status === 'playing', '순서: 상대 플러그를 먼저 띄우면 플러그를 옮기는 사이에 거품이 터짐');
    }
    {
      const level = byId.duck;
      const plugId = level.objects.find((obj) => obj.kind === 'myPlug').id;
      const low = play(level, 5, [soda(plugId), ice(1, 0)]);
      expect(low.state.status === 'playing', '숙여서 보기: 탑뷰 높이로 쏘면 떠 있는 플러그 아래로 지나감');
      const high = play(level, 5, [soda(plugId), ice(1, 1)]);
      expect(high.state.status === 'won', '숙여서 보기: 숙여서 1층 높이로 쏘면 높은 콘센트에 꽂힘');
    }
    {
      const level = byId.ledge;
      const book = level.objects.find((obj) => obj.kind === 'book');
      const menuLevel = byId.menu;
      const menu = menuLevel.objects.find((obj) => obj.kind === 'menu');
      const start = Engine.initial(level, 5);
      expect(!Engine.check(level, start, soda(book.id)).ok, '책 더미는 너무 무거워서 띄울 수 없음');
      expect(!Engine.check(menuLevel, Engine.initial(menuLevel, 5), soda(menu.id)).ok, '메뉴판은 띄울 수 없음');
      const theirs = start.objects.find((obj) => obj.kind === 'theirPlug');
      expect(theirs.inserted, '발판: 책 위의 상대 플러그는 처음부터 높은 콘센트에 꽂혀 있음');
    }
    {
      const level = byId.under;
      const dead = play(level, 1, [ice(0)]);
      expect(dead.state.status === 'dead', '배터리가 0이 되면 끝남');
      const after = play(level, 1, [ice(0), ice(0)]);
      expect(after.rejected !== undefined, '끝난 판에서는 더 행동할 수 없음');
    }
    {
      const level = byId.under;
      const verdict = Engine.check(level, Engine.initial(level, 3), ice(1, 1));
      expect(!verdict.ok, '숙이기를 쓸 수 없는 판에서는 높이를 골라 쏠 수 없음');
    }
    {
      const level = byId.sip;
      const verdict = Engine.check(level, Engine.initial(level, 3), soda('myPlug-0'));
      expect(!verdict.ok, '첫 판에는 소다가 없음');
    }

    return { failures, lines };
  }

  if (inNode && require.main === module) {
    const { failures, lines } = runAll();
    console.log(lines.join('\n'));
    console.log(failures === 0 ? '\n모든 검증 통과' : `\n실패 ${failures}개`);
    process.exit(failures === 0 ? 0 : 1);
  } else if (!inNode) {
    root.Verify = { runAll, solve };
  }
})(typeof window !== 'undefined' ? window : globalThis);
