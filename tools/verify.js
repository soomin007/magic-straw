// 규칙과 레벨 검증 도구.
// 브라우저에서는 tools/verify.html을 열면 되고, Node가 있으면 `node tools/verify.js`로도 돌린다.
(function (root) {
  'use strict';

  const inNode = typeof module === 'object' && module.exports && typeof require === 'function';
  const Engine = inNode ? require('../src/engine.js') : root.Engine;
  const LEVEL_DEFINITIONS = inNode ? require('../src/levels.js') : root.LEVEL_DEFINITIONS;

  const SEARCH_DEPTH_LIMIT = 10;

  // 너비 우선 탐색으로 최소 행동 수와, 그 수로 끝나는 해법 하나를 찾는다.
  function solve(level) {
    const start = Engine.initial(level, SEARCH_DEPTH_LIMIT + 1);
    const seen = new Set([Engine.boardKey(start)]);
    let frontier = [{ state: start, path: [] }];

    for (let depth = 0; depth < SEARCH_DEPTH_LIMIT; depth++) {
      const nextFrontier = [];
      for (const node of frontier) {
        for (const action of Engine.possibleActions(level, node.state)) {
          const result = Engine.step(level, node.state, action);
          if (!result.ok) continue;
          const path = [...node.path, action];
          if (result.state.status === 'won') return { moves: path.length, path, explored: seen.size };
          const key = Engine.boardKey(result.state);
          if (seen.has(key)) continue;
          seen.add(key);
          nextFrontier.push({ state: result.state, path });
        }
      }
      frontier = nextFrontier;
    }
    return { moves: null, path: null, explored: seen.size };
  }

  function describe(action) {
    return action.drink === 'ice' ? `얼음→${action.row}층` : `소다→${action.target}`;
  }

  function play(level, battery, actions) {
    let state = Engine.initial(level, battery);
    for (const action of actions) {
      const result = Engine.step(level, state, action);
      if (!result.ok) return { state, rejected: result.reason };
      state = result.state;
    }
    return { state };
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

    for (const level of levels) {
      const result = solve(level);
      const route = result.path ? result.path.map(describe).join(', ') : '해법 없음';
      expect(result.moves === level.optimal,
        `${level.title}: 최소 ${result.moves}수 (기록된 값 ${level.optimal}) [${route}]`);

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
      const level = byId.take;
      const iceFirst = play(level, 5, [{ drink: 'ice', row: 0 }]);
      expect(iceFirst.state.status === 'playing', '빼앗기: 상대 플러그를 띄우지 않고 밀면 꽂히지 않음');
      const myPlug = iceFirst.state.objects.find((obj) => obj.kind === 'myPlug');
      expect(myPlug.x === 4, '빼앗기: 내 플러그는 상대 플러그 앞에서 멈춤');
    }
    {
      const level = byId.take;
      const theirId = level.objects.find((obj) => obj.kind === 'theirPlug').id;
      const lifted = play(level, 5, [{ drink: 'soda', target: theirId }]);
      const theirs = Engine.findObject(lifted.state, theirId);
      expect(theirs.y === 1 && !theirs.inserted && theirs.bubble === 1, '거품: 뱉은 직후에는 떠 있음');
      const later = play(level, 5, [{ drink: 'soda', target: theirId }, { drink: 'ice', row: 2 }]);
      const fallen = Engine.findObject(later.state, theirId);
      expect(fallen.y === 0 && fallen.inserted, '거품: 다음 행동이 끝나면 터지고, 상대 플러그는 다시 꽂힘');
    }
    {
      const level = byId.ledge;
      const books = level.objects.filter((obj) => obj.kind === 'book');
      const verdict = Engine.check(level, Engine.initial(level, 5), { drink: 'soda', target: books[0].id });
      expect(!verdict.ok, '책 더미는 너무 무거워서 띄울 수 없음');
    }
    {
      const level = byId.under;
      const dead = play(level, 1, [{ drink: 'ice', row: 0 }]);
      expect(dead.state.status === 'dead', '배터리가 0이 되면 끝남');
      const after = play(level, 1, [{ drink: 'ice', row: 0 }, { drink: 'ice', row: 0 }]);
      expect(after.rejected !== undefined, '끝난 판에서는 더 행동할 수 없음');
    }
    {
      const level = byId.ice;
      const verdict = Engine.check(level, Engine.initial(level, 3), { drink: 'soda', target: 'myPlug-0' });
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
