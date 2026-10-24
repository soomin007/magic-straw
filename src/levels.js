// 1챕터 레벨. floor는 테이블을 위에서 본 지도(테이블 면 높이)이고, 위쪽 줄이 탑뷰 화면의 위쪽이다.
//
//   P  내 플러그(초록)       N  상대 플러그(빨강)
//   c  컵(가볍다)            B  책 더미(무겁다, 위에 물건을 올릴 수 있다)
//   /  \  비스듬히 세운 메뉴판(얼음을 90도 꺾는다)
//   .  빈칸                  맨 오른쪽 열: # 콘센트 없음, S 콘센트
//
// highSockets는 멀티탭 옆면의 높은 콘센트이고, above는 테이블 면보다 높이 놓인 물건이다.
// 지도에서 '\'는 자바스크립트 문자열이라 '\\'로 적는다. 화면에서는 한 칸이다.
// needsDuck이 true인 판은 숙이기로 높이를 조준해야만 풀린다. tutorial은 손가락 안내를 어디까지 보여 줄지 정한다.
// tools는 그 판에서 쓸 수 있는 보기 도구(휴대폰 카메라, 숙이기)다. 도구는 처음 필요한 판부터 하나씩 늘어난다.
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
  ];

  if (typeof module === 'object' && module.exports) module.exports = LEVEL_DEFINITIONS;
  else root.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
})(typeof window !== 'undefined' ? window : globalThis);
