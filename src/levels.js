// 1챕터 레벨. 지도는 위쪽 줄이 높은 칸이고, 맨 아래 줄이 테이블 면이다.
//
//   P  내 플러그(초록)       N  상대 플러그(빨강)
//   c  컵(가볍다)            B  책 더미(무겁다)
//   .  빈칸                  맨 오른쪽 열: # 멀티탭 면, S 콘센트 구멍
//
// optimal은 최소 행동 수다. tools/verify.js가 실제 탐색 결과와 같은지 확인한다.
(function (root) {
  'use strict';

  const LEVEL_DEFINITIONS = [
    {
      id: 'ice',
      title: '얼음 한 조각',
      drinks: ['ice'],
      optimal: 1,
      map: [
        '......#',
        '......#',
        '..P...S',
      ],
    },
    {
      id: 'under',
      title: '거품 아래로',
      drinks: ['ice', 'soda'],
      optimal: 2,
      map: [
        '......#',
        '......#',
        '.c.P..S',
      ],
    },
    {
      id: 'up',
      title: '한 칸 위',
      drinks: ['ice', 'soda'],
      optimal: 2,
      map: [
        '......#',
        '......S',
        '..P...#',
      ],
    },
    {
      id: 'take',
      title: '빼앗기',
      drinks: ['ice', 'soda'],
      optimal: 2,
      map: [
        '......#',
        '......#',
        '..P..NS',
      ],
    },
    {
      id: 'twice',
      title: '두 번 띄우기',
      drinks: ['ice', 'soda'],
      optimal: 3,
      map: [
        '......S',
        '......#',
        '..P...#',
      ],
    },
    {
      id: 'ledge',
      title: '발판',
      drinks: ['ice', 'soda'],
      optimal: 4,
      map: [
        '......#',
        '.....NS',
        '.P..BB#',
      ],
    },
  ];

  if (typeof module === 'object' && module.exports) module.exports = LEVEL_DEFINITIONS;
  else root.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
})(typeof window !== 'undefined' ? window : globalThis);
