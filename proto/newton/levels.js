// 운동량 보존 시제품의 판. 지도 글자는 engine.js 머리말에 있다.
// optimal은 최소 걸음 수(차기 포함), kicks는 그 해법에서 차는 횟수다. verify.html이 실제 탐색 결과와 같은지 확인한다.
// 걸음 수 제한은 없다. optimal은 판의 크기를 가늠하려고 적는 값이다.
// 앞의 세 판은 손으로 만들었고 하나씩 가르친다. 뒤의 두 판은 해법 탐색으로 만든 후보에서 골랐다(2026-10-28).
(function (root) {
  'use strict';

  const NEWTON_LEVELS = [
    {
      // 물건을 차면 벽에 닿을 때까지 미끄러진다.
      id: 'kick',
      optimal: 2,
      kicks: 1,
      map: [
        '#########',
        '#P.o...*#',
        '#########',
      ],
    },
    {
      // 미끄러지던 물건이 다른 물건에 부딪치면, 자신은 멈추고 맞은 물건이 대신 날아간다. 뒤쪽 물건에는 손이 닿지 않는다.
      id: 'cradle',
      optimal: 2,
      kicks: 1,
      map: [
        '#########',
        '#...#####',
        '#P.o.o.*#',
        '#...#####',
        '#########',
      ],
    },
    {
      // 벽에 붙은 물건은 더 밀려날 곳이 없어서, 부딪쳐 온 물건이 그 앞에 멈춘다.
      id: 'stopper',
      optimal: 2,
      kicks: 1,
      map: [
        '#########',
        '#P.o..*o#',
        '#########',
      ],
    },
    {
      id: 'search-96',
      optimal: 7,
      kicks: 3,
      map: [
        '########',
        '#*o....#',
        '#....o.#',
        '#.##...#',
        '##*.oP.#',
        '########',
      ],
    },
    {
      id: 'search-49',
      optimal: 11,
      kicks: 3,
      map: [
        '########',
        '#.##...#',
        '#.o..#.#',
        '#...o..#',
        '#P.o.**#',
        '########',
      ],
    },
  ];

  if (typeof module === 'object' && module.exports) module.exports = NEWTON_LEVELS;
  else root.NEWTON_LEVELS = NEWTON_LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
