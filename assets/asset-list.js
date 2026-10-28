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
      subject: '1챕터 판 배경. 스타벅스를 떠올리게 하는 카공 카페의 창가 바 좌석을 창 밖에서 들여다본 장면. 두 사람은 바 건너편에서 얼굴이 보이고, 창틀은 화면 아래 앞쪽에 있다. 옆자리 사람(빨간 후드, 헤드폰)은 칸막이 반대쪽인 오른쪽으로 고개를 돌려 얼굴이 정면에서 오른쪽으로 약 25도 틀어져 있고, 시선은 자기 랩탑이나 창 쪽을 향한다(주인공 쪽을 보지 않는다). 주인공은 오른손에 아이스 음료 컵을 들고 보통 길이의 빨대 하나를 물고 있다(바 위에 컵을 두지 않는다). 두 자리 사이 칸막이 중 퍼즐 판 뒤쪽 부분(바 뒤쪽 22cm)만 배경에 그리고, 판 옆 부분은 비워 둔다. 배치와 크기는 docs/art-brief.md의 "실제 크기 기준"과 "판 배경 배치" 표, 구도는 docs/layout-guide/scene-top.png를 따른다' },
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
      subject: '두 자리 사이 낮은 칸막이의 한 칸(바 위 한 줄 깊이 12cm)을 살짝 기울인 탑뷰로 본 모습. 그림 왼쪽 33%가 두께 4cm의 연한 회녹색 칸막이 판이고, '
        + '그 왼쪽 면에 한국식 둥근 콘센트 판(지름이 그림 높이의 60~65%, 둥근 구멍 두 개의 지름은 각각 그림 높이의 12% 이상)이 내 쪽을 향해 붙어 있다. 위아래로 이어 붙여 칸막이 하나가 된다' },
    { batch: 1, key: 'outlet-top-taken', path: 'assets/outlet/top-taken.png', width: 264, height: 180, refs: PIECE_REFS,
      subject: '같은 칸막이 칸인데, 콘센트에 옆자리 사람의 다른 기기 플러그(태블릿 충전기나 보조배터리 선)가 꽂혀 있다. 기기는 회색과 흰색 계열(벽돌색과 민트색 금지)이고, '
        + '판 위 물건보다 얇은 선으로 그려 배경처럼 보이게 한다. 상대 플러그(벽돌색 네모 어댑터)와 모양과 색이 모두 달라야 한다' },
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
      subject: '바 높이로 숙여서 본 장면. 바 앞 가장자리가 눈높이에 걸리고, 그 너머로 카페 안쪽과 앉아 있는 옆자리 사람이 보인다. 옆자리 사람은 주인공 쪽이 아니라 오른쪽(칸막이 반대쪽)을 보고 있다. 창틀은 화면 아래 앞쪽. 배치와 크기는 docs/art-brief.md의 "실제 크기 기준"과 "숙이기 배경 배치" 표, 구도는 docs/layout-guide/scene-side.png를 따른다' },
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
      subject: '칸막이를 바 높이에서 정면으로 본 한 칸(높이 12cm). 그림 왼쪽 33%가 칸막이 판의 앞쪽 끝이고, 그 왼쪽 면에 왼쪽을 향한 큰 콘센트 판(지름이 그림 높이의 60~65%)이 붙어 있다. 위아래로 이어 붙인다' },
    { batch: 2, key: 'outlet-side-taken', path: 'assets/outlet/side-taken.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '같은 칸막이 칸에 옆자리 사람의 회색 기기 플러그가 꽂혀 있다. 벽돌색과 민트색은 쓰지 않고, 강조하지 않는다' },
    { batch: 2, key: 'outlet-side-cap', path: 'assets/outlet/side-cap.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '칸막이의 맨 위 칸(바 위 24~36cm). 콘센트가 없고, 그림 왼쪽 33%의 칸막이 판과 그 윗면 가장자리만 보인다. 오른쪽 67%는 투명하다' },

    // 3차: 인물 일러스트와 프롤로그. 프롤로그는 말풍선, 기호, 글자 없이 그림만으로 읽혀야 한다.
    { batch: 3, key: 'portrait-me', path: 'assets/portrait/me.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '주인공 상반신. 헝클어진 검은 머리, 민트색 후드, 오른손에 든 아이스 음료 컵의 초록 빨대를 물고 있다. 지친 얼굴' },
    { batch: 3, key: 'portrait-me-determined', path: 'assets/portrait/me-determined.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '같은 주인공이 빨대를 문 채 눈을 가늘게 뜨고 조용히 결심한 표정' },
    { batch: 3, key: 'portrait-neighbor', path: 'assets/portrait/neighbor.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '옆자리 사람 상반신. 검은 머리, 크고 하얀 헤드폰, 벽돌색 후드, 자기 화면만 보는 무심한 표정. 얼굴은 정면에서 오른쪽으로 약 25도 틀어져 있고 주인공 쪽(왼쪽)을 보지 않는다' },
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
    { batch: 3, key: 'story-6', path: 'assets/story/6.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-6') },

    // 4차: 2챕터(옆자리 사람의 시선과 뜨거운 차)에 쓰는 그림. 규칙은 docs/design.md의 "2챕터 첫 구현" 절에 있다.
    { batch: 4, key: 'ui-drink-tea', path: 'assets/ui/drink-tea.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '김이 피어오르는 뜨거운 차 종이컵(뚜껑 없이 티백 줄이 걸려 있다). 버튼에 들어갈 아이콘. 다른 음료 아이콘과 같은 크기와 선 굵기' },
    { batch: 4, key: 'portrait-neighbor-caught', path: 'assets/portrait/neighbor-caught.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '같은 옆자리 사람 상반신(벽돌색 후드, 하얀 헤드폰)이 왼쪽(주인공 쪽)으로 고개를 홱 돌려 정면에 가깝게 이쪽을 쳐다본다. 헤드폰 한쪽을 손으로 내리고, 눈을 가늘게 뜬 의심하는 표정. 들킨 화면에 뜬다' },
  ];

  // 프롤로그 컷 내용은 src/story.js가 기준이다. 여기서는 그쪽을 가리키기만 한다.
  function src(key) {
    return `src/story.js의 ${key} 컷(scene 설명). 말풍선, 이모지, 만화 기호, 글자는 넣지 않고 표정과 몸짓과 소품으로만 보여 준다`;
  }

  if (typeof module === 'object' && module.exports) module.exports = ASSET_LIST;
  else root.ASSET_LIST = ASSET_LIST;
})(typeof window !== 'undefined' ? window : globalThis);
