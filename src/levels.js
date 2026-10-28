// 1챕터 레벨. floor는 테이블을 위에서 본 지도(테이블 면 높이)이고, 위쪽 줄이 탑뷰 화면의 위쪽이다.
//
//   P  내 플러그(초록)       N  상대 플러그(빨강)
//   c  컵(가볍다)            B  책 더미(무겁다, 위에 물건을 올릴 수 있다)
//   /  \  비스듬히 세운 메뉴판(얼음을 90도 꺾는다)
//   .  빈칸                  맨 오른쪽 열(콘센트 칸막이): # 다른 기기로 막힘, S 쓸 수 있음
//
// highSockets는 콘센트 칸막이 위쪽의 콘센트이고, above는 테이블 면보다 높이 놓인 물건이다.
// 지도에서 '\'는 자바스크립트 문자열이라 '\\'로 적는다. 화면에서는 한 칸이다.
// needsDuck이 true인 판은 숙이기로 높이를 조준해야만 풀린다. tutorial은 손가락 안내를 어디까지 보여 줄지 정한다.
// tools는 그 판에서 쓸 수 있는 보기 도구(휴대폰 카메라, 숙이기)다. 도구는 처음 필요한 판부터 하나씩 늘어난다.
// chapter는 판이 속한 챕터다(없으면 1). gaze는 옆자리 사람의 시선 순서이고, 규칙은 src/engine.js 머리말에 있다.
// needsTea가 true인 판은 차로 시선을 가려야만 풀린다.
// 2챕터 판은 임시로 1챕터의 창가 바를 그대로 쓴다(2026-10-28). 무대를 벽쪽 테이블로 바꿀지는 목업으로 정한다.
// aimLine이 true인 판은 얼음 조준선(줄마다의 경로 힌트와 올려 둔 줄의 경로선)을 보여 준다.
// 얼음의 새 동작을 처음 가르치는 판에만 켜고, 그 동작을 응용하는 판에서는 끈다.
// optimal은 최소 행동 수다. tools/verify.js가 실제 탐색 결과와 같은지 확인한다.
(function (root) {
  'use strict';

  const LEVEL_DEFINITIONS = [
    {
      id: 'sip',
      title: '한 모금',
      drinks: ['ice'],
      optimal: 1,
      tutorial: 'full',
      aimLine: true,
      floor: [
        '......#',
        '.P....S',
        '......#',
      ],
    },
    {
      id: 'under',
      title: '거품 아래로',
      drinks: ['ice', 'soda'],
      optimal: 2,
      tutorial: 'drink',
      aimLine: true,
      floor: [
        '......#',
        '.c.P..S',
        '......#',
      ],
    },
    {
      id: 'menu',
      title: '메뉴판',
      drinks: ['ice'],
      optimal: 1,
      aimLine: true,
      floor: [
        '.\\....#',
        '......#',
        'B\\.P..S',
      ],
    },
    {
      id: 'take',
      title: '빼앗기',
      tools: ['camera'],
      drinks: ['ice', 'soda'],
      optimal: 2,
      floor: [
        '......#',
        '.P...NS',
        '......#',
      ],
    },
    {
      id: 'sideways',
      title: '옆 줄로',
      tools: ['camera'],
      drinks: ['ice', 'soda'],
      optimal: 2,
      aimLine: true,
      floor: [
        '...\\..#',
        '...P..#',
        '......S',
      ],
    },
    {
      id: 'order',
      title: '순서',
      tools: ['camera'],
      drinks: ['ice', 'soda'],
      optimal: 3,
      floor: [
        '...\\..#',
        '...P..#',
        '.....NS',
      ],
    },
    {
      id: 'duck',
      title: '숙여서 보기',
      tools: ['camera', 'duck'],
      drinks: ['ice', 'soda'],
      optimal: 2,
      needsDuck: true,
      tutorial: 'duck',
      aimLine: true,
      floor: [
        '......#',
        '.P....#',
        '......#',
      ],
      highSockets: [{ row: 1, z: 1 }],
    },
    {
      id: 'ledge',
      title: '발판',
      tools: ['camera', 'duck'],
      drinks: ['ice', 'soda'],
      optimal: 4,
      needsDuck: true,
      floor: [
        '......#',
        '.P..BB#',
        '......#',
      ],
      highSockets: [{ row: 1, z: 1 }],
      above: [{ kind: 'theirPlug', x: 5, row: 1, z: 1 }],
    },

    // 2챕터. 옆자리 사람이 가끔 칸막이 쪽을 본다.
    {
      // 시선이 처음 나오는 판. 상대가 보고 있을 때 바로 빼앗으면 들키므로, 한 번 기다리거나 다른 준비를 먼저 한다.
      id: 'glance',
      chapter: 2,
      title: '눈치',
      tools: ['camera'],
      drinks: ['ice', 'soda'],
      optimal: 3,
      gaze: [3, null],
      floor: [
        '......#',
        '.P...NS',
        '......#',
      ],
    },
    {
      // 상대가 칸막이 쪽만 보고 있어서, 차의 김으로 시선을 가려야 빼앗을 수 있다.
      id: 'steam',
      chapter: 2,
      title: '김',
      tools: ['camera'],
      drinks: ['ice', 'soda', 'tea'],
      optimal: 3,
      needsTea: true,
      tutorial: 'tea',
      gaze: [3],
      floor: [
        '......#',
        '.P...NS',
        '......#',
      ],
    },
    {
      // 1챕터 "순서" 판에 시선을 더했다. 플러그를 옮기는 일, 김을 피우는 일, 빼앗는 일의 순서를 짜야 한다.
      id: 'cover',
      chapter: 2,
      title: '틈타기',
      tools: ['camera'],
      drinks: ['ice', 'soda', 'tea'],
      optimal: 4,
      gaze: [null, 3, 3],
      floor: [
        '...\\..#',
        '...P..#',
        '.....NS',
      ],
    },
  ];

  if (typeof module === 'object' && module.exports) module.exports = LEVEL_DEFINITIONS;
  else root.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
})(typeof window !== 'undefined' ? window : globalThis);
