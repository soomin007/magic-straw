// 프롤로그, 튜토리얼 혼잣말, 판마다 시작할 때 나오는 혼잣말.
// 그림은 assets/asset-list.js의 story-1 ~ story-5이고, 그림이 없으면 scene 설명이 회색 상자에 적힌다.
(function (root) {
  'use strict';

  const prologue = [
    {
      key: 'story-1',
      scene: '새벽 카페. 노트북 앞에 전공책을 펴 놓은 주인공. 창밖은 깜깜하다.',
      line: '시험은 내일 아침 9시. 3단원까지만 오늘 끝내자.',
    },
    {
      key: 'story-2',
      scene: '충전기를 멀티탭에 꽂아 둔 채 자리에서 일어나는 뒷모습.',
      line: '잠깐 화장실만.',
    },
    {
      key: 'story-3',
      scene: '돌아와서 본 테이블. 내 플러그는 뽑혀 굴러 있고, 멀티탭은 헤드폰 낀 옆자리 사람의 플러그가 전부 차지했다.',
      line: '……어?',
    },
    {
      key: 'story-4',
      scene: '말을 걸려고 손을 들다가 멈춘 주인공. 노트북 화면 구석에 경고 알림이 떠 있다.',
      line: '따지면 길어진다. 나한테는 그럴 시간이 없다.',
      notice: '배터리 7% 남음',
    },
    {
      key: 'story-5',
      scene: '음료 컵에 꽂힌 빨대가 은은하게 빛난다.',
      line: '조용히, 아무도 모르게 되찾는다.',
    },
  ];

  // 튜토리얼 혼잣말. 손가락이 어디를 가리킬지는 game.js가 판의 tutorial 값에 따라 정한다.
  const tutorialLines = {
    pickIce: '일단 한 모금.',
    pickRow: '저 줄로 뱉으면……',
    pickSoda: '거품이면 들어 올릴 수 있을지도.',
    duck: '멀티탭 옆면이 잘 안 보이는데.',
    ducked: '숙이니까 높은 콘센트가 보인다.',
  };

  // 판을 시작할 때 잠깐 떠오르는 혼잣말
  const levelLines = {
    menu: '메뉴판이 비스듬하네.',
    take: '저 콘센트, 원래 내 자리였어.',
    sideways: '저 줄에는 콘센트가 없잖아.',
    order: '뭘 먼저 해야 하지.',
    ledge: '책을 발판으로 쓸 수 있을까.',
  };

  const camera = {
    title: '옆자리 랩탑 화면',
    lines: ['배터리 100% 충전 완료', '드라마 재생 중'],
    thought: '이미 다 찼잖아.',
  };

  root.Story = { prologue, tutorialLines, levelLines, camera };
})(window);
