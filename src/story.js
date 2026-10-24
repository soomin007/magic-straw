// 프롤로그, 튜토리얼 혼잣말, 판마다 시작할 때 나오는 혼잣말.
// 퍼즐 게임은 말을 몰라도 할 수 있어야 하므로, 프롤로그는 글 없이 그림만 보고 이해할 수 있게 만든다.
// 컷 그림(assets/asset-list.js의 story-1 ~ story-5)이 말풍선과 기호까지 그림 안에 담는다.
// 그림이 오기 전에는 game.js가 회색 상자 위에 symbol을 말풍선으로 얹어서 흐름을 미리 보여 준다.
(function (root) {
  'use strict';

  // scene은 그림을 그릴 때의 장면 설명이다(게임에는 그림이 없을 때만 보인다).
  // symbol은 그 컷의 말풍선에 들어갈 기호이고, bubble은 컷 안의 말풍선 자리(x, y, width는 퍼센트, tail은 꼬리 방향)다.
  // notice는 컷 안의 노트북 화면에 뜨는 경고 기호이고, noticeAt은 그 자리다.
  const prologue = [
    {
      key: 'story-1',
      scene: '새벽 카페 창가 바. 노트북 앞에 전공책을 펴 놓은 주인공. 창밖은 깜깜하고, 벽시계는 새벽 2시를 가리킨다.',
      symbol: '⏰📚',
      bubble: { x: 52, y: 8, width: 26, tail: 'left' },
    },
    {
      key: 'story-2',
      scene: '노트북 충전기를 콘센트 기둥에 꽂아 둔 채 자리에서 일어나, 화장실 표지판 쪽으로 가는 뒷모습.',
      symbol: '🚻',
      bubble: { x: 8, y: 10, width: 16, tail: 'right' },
    },
    {
      key: 'story-3',
      scene: '돌아와서 본 자리. 내 플러그는 뽑혀 바 위에 굴러 있고, 그 콘센트에는 헤드폰 낀 옆자리 사람의 휴대폰 충전기가 꽂혀 있다.',
      symbol: '?!',
      bubble: { x: 64, y: 8, width: 16, tail: 'left' },
    },
    {
      key: 'story-4',
      scene: '옆자리 사람에게 말을 걸려고 손을 들다가 멈춘 주인공. 상대는 헤드폰을 끼고 모른다. 노트북 화면에는 빨간 배터리 경고가 떠 있다.',
      symbol: '💢…',
      bubble: { x: 8, y: 8, width: 22, tail: 'right' },
      notice: '🪫',
      noticeAt: { x: 62, y: 56 },
    },
    {
      key: 'story-5',
      scene: '음료 컵에 꽂힌 빨대가 은은하게 빛난다. 컵 너머로 결심한 주인공의 눈빛.',
      symbol: '🤫',
      bubble: { x: 40, y: 8, width: 16, tail: 'none' },
    },
  ];

  // 튜토리얼 혼잣말. 손가락이 어디를 가리킬지는 game.js가 판의 tutorial 값에 따라 정한다.
  const tutorialLines = {
    pickIce: '일단 한 모금.',
    pickRow: '저 줄로 뱉으면……',
    pickSoda: '거품이면 들어 올릴 수 있을지도.',
    duck: '기둥 위쪽이 잘 안 보이는데.',
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
