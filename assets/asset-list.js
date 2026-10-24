// 게임에 필요한 그림 목록. docs/art-brief.md와 docs/art-check.html이 이 목록을 기준으로 삼는다.
// key는 assets/manifest.js에 등록하는 이름이고, 게임 코드도 이 이름으로 그림을 찾는다.
// width와 height는 그릴 크기이고, batch는 만드는 순서다. refs는 함께 넣을 레퍼런스(references/ 안의 파일 이름 앞부분)다.
//
// piece-로 시작하는 그림은 게임 중에 움직이는 물건이다. 흰 스티커 테두리와 그림자는 게임 코드가 붙이므로 그림에는 넣지 않는다.
(function (root) {
  'use strict';

  const PIECE_REFS = ['line-bugfables-1', 'view-cultofthelamb-1', 'line-castlecrashers-1'];
  const SCENE_REFS = ['view-cultofthelamb-1', 'view-dontstarve-1'];
  const PORTRAIT_REFS = ['portrait-helltaker-1', 'portrait-helltaker-2', 'portrait-helltaker-3', 'character-cultofthelamb-1'];

  const ASSET_LIST = [
    // 1차: 살짝 기울인 탑뷰로 1~6번 판을 플레이하는 데 필요한 그림
    { batch: 1, key: 'scene-top', path: 'assets/scene/top.png', width: 1920, height: 1080, refs: SCENE_REFS,
      subject: '1챕터 판 배경. 스타벅스를 떠올리게 하는 카공 카페의 창가 바 좌석을 창 밖에서 들여다본 장면. 두 사람은 바 건너편에서 얼굴이 보이고, 창틀은 화면 아래 앞쪽에 있다. 배치와 크기는 docs/art-brief.md의 "실제 크기 기준"과 "판 배경 배치" 표, 구도는 docs/layout-guide/scene-top.png를 따른다' },
    { batch: 1, key: 'piece-top-my-plug', path: 'assets/piece/top-my-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '내 노트북 충전기의 한국 220V 벽 플러그. 둥근 원통형 민트색 머리, 둥근 금속 핀 두 개가 오른쪽을 향하고, 굵은 전선이 왼쪽 가장자리에서 잘린다' },
    { batch: 1, key: 'piece-top-their-plug', path: 'assets/piece/top-their-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '옆자리 사람의 휴대폰 충전기. 벽돌색 네모난 어댑터에 둥근 금속 핀 두 개가 오른쪽을 향하고, 휴대폰 선이 왼쪽으로 나간다' },
    { batch: 1, key: 'piece-top-cup', path: 'assets/piece/top-cup.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '뜨거운 음료용 테이크아웃 종이컵. 납작한 플라스틱 뚜껑과 종이 홀더 슬리브, 컵 옆면이 보인다. 로고 없음' },
    { batch: 1, key: 'piece-top-book', path: 'assets/piece/top-book.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '두꺼운 전공책 세 권을 쌓은 더미. 무거워 보이고, 칸을 거의 꽉 채운다' },
    { batch: 1, key: 'piece-top-menu', path: 'assets/piece/top-menu.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '카페 테이블에 세워 두는 삼각 메뉴판(아크릴 스탠드). 왼쪽 아래에서 오른쪽 위로 비스듬히 놓여 있다. 반대 방향은 게임이 좌우를 뒤집어 쓴다. 글자 없음' },
    { batch: 1, key: 'outlet-top-free', path: 'assets/outlet/top-free.png', width: 264, height: 180, refs: PIECE_REFS,
      subject: '두 자리 사이 콘센트 기둥의 한 칸(바 위 한 줄 깊이)을 살짝 기울인 탑뷰로 본 모습. 내 쪽(왼쪽) 면에 빈 콘센트 하나. 위아래로 이어 붙여 기둥 하나가 된다' },
    { batch: 1, key: 'outlet-top-taken', path: 'assets/outlet/top-taken.png', width: 264, height: 180, refs: PIECE_REFS,
      subject: '같은 기둥 칸인데, 내 쪽 콘센트에 옆자리 사람의 다른 기기 선(태블릿 충전기나 이어폰 케이스 선)이 꽂혀 있다. 흐린 벽돌색으로, 판 위 물건처럼 굵게 강조하지 않는다' },
    { batch: 1, key: 'fx-bubble', path: 'assets/fx/bubble.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '물건 하나를 감싸는 반투명 탄산 거품 방울. 가운데는 비어 있고 굵은 테두리와 반짝임만 있다' },
    { batch: 1, key: 'fx-ice', path: 'assets/fx/ice.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '날아가는 작은 얼음 조각 하나' },
    { batch: 1, key: 'ui-drink-ice', path: 'assets/ui/drink-ice.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '얼음이 든 아이스 아메리카노 플라스틱 컵과 초록 빨대. 버튼에 들어갈 아이콘' },
    { batch: 1, key: 'ui-drink-soda', path: 'assets/ui/drink-soda.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '기포가 올라오는 초록빛 소다 플라스틱 컵과 빨대. 버튼에 들어갈 아이콘' },
    { batch: 1, key: 'ui-finger', path: 'assets/ui/finger.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '아래를 가리키는 만화풍 손가락. 튜토리얼에서 누를 곳을 짚는다' },

    // 2차: 숙이기(바 높이에서 앞으로 본 단면) 시점. 7, 8번 판에 쓴다.
    { batch: 2, key: 'scene-side', path: 'assets/scene/side.png', width: 1920, height: 1080, refs: SCENE_REFS,
      subject: '바 높이로 숙여서 본 장면. 바 앞 가장자리가 눈높이에 걸리고, 그 너머로 카페 안쪽과 앉아 있는 옆자리 사람이 보인다. 창틀은 화면 아래 앞쪽. 배치와 크기는 docs/art-brief.md의 "실제 크기 기준"과 "숙이기 배경 배치" 표, 구도는 docs/layout-guide/scene-side.png를 따른다' },
    { batch: 2, key: 'piece-side-my-plug', path: 'assets/piece/side-my-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '내 민트색 플러그를 바 높이에서 정면으로 본 모습. 핀이 오른쪽을 향하고, 그림 아래쪽에 바닥에 닿게 놓인다' },
    { batch: 2, key: 'piece-side-their-plug', path: 'assets/piece/side-their-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '상대의 벽돌색 휴대폰 충전기를 바 높이에서 정면으로 본 모습' },
    { batch: 2, key: 'piece-side-cup', path: 'assets/piece/side-cup.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '종이컵을 바 높이에서 정면으로 본 모습' },
    { batch: 2, key: 'piece-side-book', path: 'assets/piece/side-book.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '책 세 권 더미를 바 높이에서 정면으로 본 모습. 칸을 꽉 채워 위에 물건을 올릴 수 있어 보인다' },
    { batch: 2, key: 'piece-side-menu', path: 'assets/piece/side-menu.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '삼각 메뉴판을 바 높이에서 정면으로 본 모습. 칸의 아래쪽 한 칸 높이만 차지한다' },
    { batch: 2, key: 'outlet-side-free', path: 'assets/outlet/side-free.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '콘센트 기둥을 바 높이에서 정면으로 본 한 칸. 왼쪽을 향한 빈 콘센트 하나. 위아래로 이어 붙인다' },
    { batch: 2, key: 'outlet-side-taken', path: 'assets/outlet/side-taken.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '같은 기둥 칸에 옆자리 사람의 다른 기기 선이 꽂혀 있다. 흐린 벽돌색, 강조하지 않는다' },
    { batch: 2, key: 'outlet-side-cap', path: 'assets/outlet/side-cap.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '콘센트 기둥의 맨 위 칸. 콘센트가 없고 기둥 윗면이 보인다' },

    // 3차: 인물 일러스트와 프롤로그. 프롤로그는 글자 없이 그림과 기호만으로 읽혀야 한다.
    { batch: 3, key: 'portrait-me', path: 'assets/portrait/me.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '주인공 상반신. 헝클어진 검은 머리, 민트색 후드, 아이스 음료 컵에서 이어진 초록 빨대를 물고 있다. 지친 얼굴' },
    { batch: 3, key: 'portrait-me-determined', path: 'assets/portrait/me-determined.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '같은 주인공이 빨대를 문 채 눈을 가늘게 뜨고 조용히 결심한 표정' },
    { batch: 3, key: 'portrait-neighbor', path: 'assets/portrait/neighbor.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '옆자리 사람 상반신. 검은 머리, 크고 하얀 헤드폰, 벽돌색 후드, 자기 화면만 보는 무심한 표정' },
    { batch: 3, key: 'story-1', path: 'assets/story/1.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-1') },
    { batch: 3, key: 'story-2', path: 'assets/story/2.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-2') },
    { batch: 3, key: 'story-3', path: 'assets/story/3.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-3') },
    { batch: 3, key: 'story-4', path: 'assets/story/4.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-4') },
    { batch: 3, key: 'story-5', path: 'assets/story/5.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-5') },
  ];

  // 프롤로그 컷 내용은 src/story.js가 기준이다. 여기서는 그쪽을 가리키기만 한다.
  function src(key) {
    return `src/story.js의 ${key} 컷(scene 설명과 symbol 기호). 기호는 그림 안의 말풍선에 그리고, 글자는 넣지 않는다`;
  }

  if (typeof module === 'object' && module.exports) module.exports = ASSET_LIST;
  else root.ASSET_LIST = ASSET_LIST;
})(typeof window !== 'undefined' ? window : globalThis);
