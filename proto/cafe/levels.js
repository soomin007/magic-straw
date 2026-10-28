// 카페 시제품의 판. 지도 글자와 규칙은 engine.js 머리말에 있다.
// gaze는 상대가 차례마다 돌아가며 보는 방향이다. optimal은 최소 차례 수이고, verify.html이 실제 탐색 결과와 같은지 확인한다.
(function (root) {
  'use strict';

  const CAFE_LEVELS = [
    {
      // 상대는 자기 줄(콘센트 쪽에서 내 자리 쪽으로)을 계속 보고 있다. 그 줄에 그냥 들어가면 들킨다.
      // 보조배터리를 먼저 그 줄에 밀어 넣고 그 뒤에 숨어서 밀고 가면, 상대 눈에는 보조배터리만 보인다.
      // 배달할 물건이 곧 나를 가리는 방패라는 것이 이 판의 "아하"다. 탐색으로 확인하면, 보조배터리 없이 그 줄에 서 있을 수 있는 상태는 하나도 없다.
      id: 'shield',
      optimal: 9,
      gaze: ['left'],
      map: [
        '##########',
        '#P.......#',
        '#...b.##.#',
        '#.......N#',
        '##########',
      ],
    },
  ];

  if (typeof module === 'object' && module.exports) module.exports = CAFE_LEVELS;
  else root.CAFE_LEVELS = CAFE_LEVELS;
})(typeof window !== 'undefined' ? window : globalThis);
