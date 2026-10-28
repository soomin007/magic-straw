// 레벨 목록. floor는 샘가를 위에서 본 지도(땅 높이)이고, 위쪽 줄이 탑뷰 화면의 위쪽이다.
// 엔진 이름과 물의 정령 세계의 대응은 src/engine.js 머리말에 있다.
//
//   P  물길 돌(정령의 것)    N  펌프 관 끝(마을 사람들이 박아 둔 것)
//   c  양동이(가볍다)        B  바위(무겁다, 위에 물건을 올릴 수 있다)
//   /  \  비스듬히 박힌 석판(얼음을 90도 꺾는다)
//   .  빈칸                  맨 오른쪽 열(샘 입구 돌벽): # 다른 관으로 막힌 홈, S 비어 있는 홈
//
// highSockets는 샘 입구 돌벽 위쪽의 홈이고, above는 땅보다 높이 놓인 물건이다.
// 지도에서 '\'는 자바스크립트 문자열이라 '\\'로 적는다. 화면에서는 한 칸이다.
// needsDuck이 true인 판은 물속에서 보기(옆에서 본 단면)로 높이를 조준해야만 풀린다. tutorial은 손가락 안내를 어디까지 보여 줄지 정한다.
// tools는 그 판에서 쓸 수 있는 보기 도구다. 지금은 물속에서 보기(duck) 하나뿐이고, 처음 필요한 판부터 나온다.
// gaze는 샘지기의 시선 순서이고, 규칙은 src/engine.js 머리말에 있다. needsTea가 true인 판은 안개로 시선을 가려야만 풀린다.
// aimLine이 true인 판은 얼음 조준선(줄마다의 경로 힌트와 올려 둔 줄의 경로선)을 보여 준다.
// 얼음의 새 동작을 처음 가르치는 판에만 켜고, 그 동작을 응용하는 판에서는 끈다.
// optimal은 최소 행동 수다. tools/verify.js가 실제 탐색 결과와 같은지 확인한다.
//
// 판 순서(2026-10-28 결정). 다음 수업에서 처음 하는 사람이 10분 동안(프롤로그 1분, 판마다 1~2분) 시선 규칙까지 겪게,
// "들키면 잡혀간다"가 처음 나오는 눈치 판을 4번째에 둔다. 1~3번 판은 밀기, 띄우기, 빼앗기를 하나씩 가르친다.
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
      id: 'take',
      title: '빼앗기',
      drinks: ['ice', 'soda'],
      optimal: 2,
      floor: [
        '......#',
        '.P...NS',
        '......#',
      ],
    },
    {
      // 시선이 처음 나오는 판. 상대가 보고 있을 때 바로 빼앗으면 들키므로, 한 번 기다리거나 다른 준비를 먼저 한다.
      id: 'glance',
      title: '눈치',
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
      // 상대가 칸막이 쪽만 보고 있어서, 차의 김으로 시선을 가려야 빼앗을 수 있다.
      id: 'steam',
      title: '김',
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
      id: 'sideways',
      title: '옆 줄로',
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
      drinks: ['ice', 'soda'],
      optimal: 3,
      floor: [
        '...\\..#',
        '...P..#',
        '.....NS',
      ],
    },
    {
      // "순서" 판에 시선을 더했다. 플러그를 옮기는 일, 김을 피우는 일, 빼앗는 일의 순서를 짜야 한다.
      id: 'cover',
      title: '틈타기',
      drinks: ['ice', 'soda', 'tea'],
      optimal: 4,
      gaze: [null, 3, 3],
      floor: [
        '...\\..#',
        '...P..#',
        '.....NS',
      ],
    },
    {
      id: 'duck',
      title: '숙여서 보기',
      tools: ['duck'],
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
      tools: ['duck'],
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
