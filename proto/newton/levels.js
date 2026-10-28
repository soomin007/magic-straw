// 운동량 보존 시제품의 판. 지도 글자는 engine.js 머리말에 있다.
// throws는 던질 수 있는 물건의 개수이고, optimal은 최소 던지기 수다. verify.html이 실제 탐색 결과와 같은지 확인한다.
// 판은 해법 탐색으로 후보를 많이 만든 뒤, 가르치는 것이 하나씩 늘어나는 순서로 골랐다(2026-10-28).
(function (root) {
  'use strict';

  const NEWTON_LEVELS = [
    {
      // 던지면 반대로 밀려나고, 벽에 닿을 때까지 미끄러진다.
      id: 'recoil',
      throws: 2,
      optimal: 1,
      map: [
        '#######',
        '#X..P.#',
        '#######',
      ],
    },
    {
      // 미끄러지다 물건에 부딪치면 나는 멈추고 물건이 대신 날아간다.
      id: 'cradle',
      throws: 2,
      optimal: 1,
      map: [
        '#########',
        '#*.o..P.#',
        '#########',
      ],
    },
    {
      // 벽에 붙은 물건은 더 밀려날 곳이 없어서 멈추개가 된다. 먼저 옆으로 비켜서야 그 줄로 들어갈 수 있다.
      id: 'stopper',
      throws: 3,
      optimal: 2,
      map: [
        '#######',
        '#.....#',
        '#...P.#',
        '#oX...#',
        '#######',
      ],
    },
    {
      // 던진 물건도 멈추개가 된다. 벽에 붙은 물건에 다시 던지면 그 앞에 멈춘다.
      id: 'build',
      throws: 4,
      optimal: 3,
      map: [
        '#######',
        '#.X..o#',
        '#.oP..#',
        '#....##',
        '#.....#',
        '#######',
      ],
    },
  ];

  if (typeof module === 'object' && module.exports) module.exports = NEWTON_LEVELS;
  else root.NEWTON_LEVELS = NEWTON_LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
