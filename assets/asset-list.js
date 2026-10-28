// 게임에 필요한 그림 목록. docs/art-brief.md와 docs/art-check.html이 이 목록을 기준으로 삼는다.
// key는 assets/manifest.js에 등록하는 이름이고, 게임 코드도 이 이름으로 그림을 찾는다.
// width와 height는 그릴 크기이고, batch는 만드는 순서다. refs는 함께 넣을 레퍼런스(references/ 안의 파일 이름 앞부분)다.
//
// piece-로 시작하는 그림은 게임 중에 움직이는 물건이다. 흰 스티커 테두리와 그림자는 게임 코드가 붙이므로 그림에는 넣지 않는다.
//
// 이름 대응(2026-10-28). 게임을 카페에서 "샘을 빼앗긴 물의 정령" 세계로 옮겼지만, key와 경로는 카페 때 이름을 그대로 둔다.
// 게임 코드와 manifest가 이 이름으로 그림을 찾기 때문이다. Codex는 같은 경로에 새 그림을 덮어쓴다.
//   my-plug     물길 돌               their-plug  펌프 관 끝
//   cup         양동이                book        바위
//   menu        비스듬히 박힌 석판     outlet-     샘 입구 돌벽의 홈(free 빈 홈, taken 다른 관이 박힌 홈, cap 돌벽 맨 위)
//   drink-ice   얼음                  drink-soda  물방울 거품          drink-tea  안개
//   portrait-me 물의 정령             portrait-neighbor  샘지기(-caught는 정령을 알아챈 얼굴)
//   scene-top   샘가를 물 쪽에서 본 판 배경   scene-side  물속에서 수면 높이로 본 배경
//   ui-spirit   트레이의 정령 몸(새로 더한 그림. 남은 행동 수를 몸의 크기와 투명도로 보여 준다)
(function (root) {
  'use strict';

  const PIECE_REFS = ['line-bugfables-1', 'view-cultofthelamb-1', 'line-castlecrashers-1'];
  const SCENE_REFS = ['view-cultofthelamb-1', 'view-dontstarve-1'];
  const PORTRAIT_REFS = ['portrait-helltaker-1', 'portrait-helltaker-2', 'portrait-helltaker-3', 'character-cultofthelamb-1'];

  // 묶음 순서는 다음 수업(2026-11-04)에서 처음 하는 사람이 10분 동안 보는 순서를 따른다(2026-10-28).
  // 1차는 1~6번 판의 플레이 화면, 2차는 프롤로그와 들킨 화면(역시 처음 10분 안에 보인다), 3차는 10분 뒤의 물속에서 보기 판이다.
  // 4차의 얼음, 거품, 손가락은 카페 때 그림이 세계와 상관없어서 지금 그대로 쓰고, 여유가 있을 때만 다시 그린다.
  // 공통 색: 정령의 것(정령의 몸, 물길 돌)은 물빛과 민트, 마을 사람들의 것(펌프 관 끝, 샘지기의 옷)은 녹슨 벽돌색이다.
  const ASSET_LIST = [
    // 1차: 1~6번 판의 플레이 화면. 맨 앞 세 장(scene-top, portrait-me, piece-top-my-plug)은 배경, 인물, 물건을 하나씩 담은 시험 한 벌이다.
    { batch: 1, key: 'scene-top', path: 'assets/scene/top.png', width: 1920, height: 1080, refs: SCENE_REFS,
      subject: '판 배경. 숲속 작은 샘가를 앞쪽 물가에서 살짝 기울여 들여다본 장면. 화면 위쪽은 이끼 낀 바위와 고사리, 나무뿌리가 있는 숲이고, '
        + '왼쪽 뒤에는 물의 정령이 샘물에 허리까지 잠긴 채 상반신을 내놓고 있다(정령 앞을 샘 가장자리의 둥근 돌 턱이 가린다). 정령은 오른손을 입 앞에 반쯤 올리고 있다. '
        + '오른쪽 뒤에는 샘지기가 서서 오른쪽(마을 쪽)으로 고개를 돌려 얼굴이 정면에서 오른쪽으로 약 25도 틀어져 있고, 정령 쪽을 보지 않는다. '
        + '샘지기 앞에는 나무 물통이 있고, 그 위에 코르크 마개를 연 빈 유리병이 놓여 있다. '
        + '화면 가운데 띠는 평평한 판석과 자갈이 깔린 샘가 땅이고, 오른쪽에 물길 홈이 파인 얇은 돌벽(샘 입구 돌벽)이 앞뒤로 서 있다. '
        + '돌벽은 퍼즐 판 뒤쪽 부분만 배경에 그리고, 판 옆 부분은 비워 둔다. 화면 맨 아래는 앞쪽 물가의 수면과 풀이다. '
        + '배치와 크기는 docs/art-brief.md의 "물의 정령 버전" 절의 표, 구도는 docs/layout-guide/scene-top.png를 따른다' },
    { batch: 1, key: 'portrait-me', path: 'assets/portrait/me.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '물의 정령 상반신. 몸 전체가 맑은 물빛(하늘색)의 물로 되어 있어 몸 안이 살짝 비치고, 머리카락은 물줄기처럼 어깨 뒤로 흘러내린다. '
        + '사람과 같은 크기의 어른 체형, 크고 둥근 눈, 머리카락에 민트색 물풀 잎 장식이 하나 있다. 샘을 빼앗겨 지친 표정. '
        + '이후 모든 컷과 화면에서 이 생김새를 그대로 쓴다' },
    { batch: 1, key: 'piece-top-my-plug', path: 'assets/piece/top-my-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '정령의 물길 돌. 강가의 둥근 회색 차돌 하나(가로 12cm)인데, 오른쪽 끝이 쐐기처럼 깎여 홈에 끼우기 좋은 모양이다. '
        + '돌을 가로로 두르는 민트색 물결 무늬가 은은하게 빛나 정령의 것임을 보여 준다. 깎인 쐐기 끝이 오른쪽 가장자리에 닿는다' },
    { batch: 1, key: 'portrait-neighbor', path: 'assets/portrait/neighbor.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '샘지기 상반신. 마을의 중년 사람, 낡은 밀짚모자, 녹슨 벽돌색 작업 조끼, 허리띠에 코르크 마개 유리병을 매달았다. '
        + '악당이 아니라 마을에 물을 대느라 바쁜 평범한 사람의 무심한 표정. 얼굴은 정면에서 오른쪽으로 약 25도 틀어져 있고 왼쪽(정령 쪽)을 보지 않는다' },
    { batch: 1, key: 'ui-spirit', path: 'assets/ui/spirit.png', width: 256, height: 304, refs: PORTRAIT_REFS,
      subject: '아래 트레이와 증발 화면, 다시 차오르는 화면에 쓰는 작은 정령 전신. portrait-me와 같은 정령을 아이콘처럼 단순하게, 정면으로 서서 두 손을 모은 자세. '
        + '물방울처럼 아래가 둥근 실루엣이라 크기를 줄이거나 흐리게 해도 정령으로 읽힌다. 게임이 크기와 투명도를 바꾸므로 그림은 가득 찬 상태 하나만 그린다' },
    { batch: 1, key: 'piece-top-their-plug', path: 'assets/piece/top-their-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '마을 사람들이 샘 입구 홈에 박아 둔 펌프 관 끝. 녹슨 벽돌색 무쇠 관 토막(가로 12cm)으로, 오른쪽 끝에 둥근 테두리(플랜지)가 있고 '
        + '왼쪽으로 마을까지 이어지는 관이 왼쪽 가장자리에서 잘린다. 플랜지 끝이 오른쪽 가장자리에 닿는다' },
    { batch: 1, key: 'piece-top-cup', path: 'assets/piece/top-cup.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '샘가에 놓인 작은 나무 양동이(지름 12cm 안쪽). 쇠테 두 줄과 손잡이 줄이 있고, 가벼워 보인다. 안은 비어 있다' },
    { batch: 1, key: 'piece-top-book', path: 'assets/piece/top-book.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '이끼가 조금 낀 납작하고 무거운 바위. 윗면이 평평해서 물건을 올릴 수 있어 보이고, 칸을 거의 꽉 채운다' },
    { batch: 1, key: 'piece-top-menu', path: 'assets/piece/top-menu.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '땅에 비스듬히 박힌 얇은 석판(판석) 하나. 위에서 보면 왼쪽 아래에서 오른쪽 위로 기운 "/" 모양이고, 반대 방향은 게임이 좌우를 뒤집어 쓴다. 글자나 문양 없음' },
    { batch: 1, key: 'outlet-top-free', path: 'assets/outlet/top-free.png', width: 264, height: 180, refs: PIECE_REFS,
      subject: '샘 입구 돌벽의 한 칸(샘가 한 줄 깊이 12cm)을 살짝 기울인 탑뷰로 본 모습. 그림 왼쪽 33%가 두께 4cm의 회색 판석 돌벽이고, '
        + '그 왼쪽 면에 물이 고인 둥근 물길 홈(지름이 그림 높이의 60~65%)이 정령 쪽을 향해 파여 있다. 홈 안쪽은 어둡고 물빛이 비친다. '
        + '위아래로 이어 붙여 돌벽 하나가 된다' },
    { batch: 1, key: 'outlet-top-taken', path: 'assets/outlet/top-taken.png', width: 264, height: 180, refs: PIECE_REFS,
      subject: '같은 돌벽 칸인데, 홈에 다른 마을 사람이 박아 둔 낡은 회색 대나무 관이 꽂혀 있다. 관은 회색과 흰색 계열(벽돌색과 민트색 금지)이고, '
        + '판 위 물건보다 얇은 선으로 그려 배경처럼 보이게 한다. 펌프 관 끝(벽돌색 무쇠)과 모양과 색이 모두 달라야 한다' },
    { batch: 1, key: 'ui-drink-ice', path: 'assets/ui/drink-ice.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '정령이 몸의 물을 얼려 만든 얼음 덩어리 하나. 물빛이 비치는 반투명한 각진 얼음. 버튼에 들어갈 아이콘' },
    { batch: 1, key: 'ui-drink-soda', path: 'assets/ui/drink-soda.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '물빛 물방울 거품 세 개가 모여 떠오르는 모습. 굵은 테두리와 반짝임이 있다. 버튼에 들어갈 아이콘. 얼음 아이콘과 같은 크기와 선 굵기' },
    { batch: 1, key: 'ui-drink-tea', path: 'assets/ui/drink-tea.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '하얗게 피어오르는 안개 덩어리(뭉게뭉게한 세 겹). 버튼에 들어갈 아이콘. 다른 아이콘과 같은 크기와 선 굵기' },

    // 2차: 프롤로그 여섯 컷과 들킨 화면. 처음 10분 안에 보이지만, 1차의 정령과 샘지기 생김새가 정해진 뒤에 그려야 컷마다 같은 인물로 알아볼 수 있다.
    { batch: 2, key: 'story-1', path: 'assets/story/1.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-1') },
    { batch: 2, key: 'story-2', path: 'assets/story/2.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-2') },
    { batch: 2, key: 'story-3', path: 'assets/story/3.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-3') },
    { batch: 2, key: 'story-4', path: 'assets/story/4.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-4') },
    { batch: 2, key: 'story-5', path: 'assets/story/5.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-5') },
    { batch: 2, key: 'story-6', path: 'assets/story/6.png', width: 1600, height: 1200, refs: PORTRAIT_REFS,
      subject: src('story-6') },
    { batch: 2, key: 'portrait-neighbor-caught', path: 'assets/portrait/neighbor-caught.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '같은 샘지기 상반신(밀짚모자, 벽돌색 조끼)이 왼쪽(정령 쪽)으로 고개를 홱 돌려 정면에 가깝게 이쪽을 쳐다본다. '
        + '한 손으로 코르크 마개를 연 유리병을 이쪽으로 내밀고, 눈을 크게 뜬 놀란 표정. 들킨 화면에 뜬다' },
    { batch: 2, key: 'portrait-me-determined', path: 'assets/portrait/me-determined.png', width: 1024, height: 1024, refs: PORTRAIT_REFS,
      subject: '같은 물의 정령이 눈을 가늘게 뜨고 볼에 물을 머금은 채 조용히 결심한 표정. 입가에 하얀 얼음 결정이 맺혀 있다. 프롤로그 5번 컷의 인물 기준' },

    // 3차: 물속에서 보기(수면 높이에서 앞으로 본 단면) 시점. 10, 11번 판에 쓴다.
    { batch: 3, key: 'scene-side', path: 'assets/scene/side.png', width: 1920, height: 1080, refs: SCENE_REFS,
      subject: '정령이 물속으로 가라앉아 수면 높이에서 앞을 본 장면. 샘가 땅의 앞 가장자리가 눈높이에 걸리고, 그 너머로 숲과 서 있는 샘지기가 보인다. '
        + '샘지기는 정령 쪽이 아니라 오른쪽을 보고 있다. 왼쪽 아래에는 물에 잠긴 정령이 눈과 머리 윗부분만 수면 위로 내놓는다. '
        + '화면 아래 앞쪽은 물속(푸른 물과 물풀)이다. '
        + '배치와 크기는 docs/art-brief.md의 "물의 정령 버전" 절의 물속 배경 표, 구도는 docs/layout-guide/scene-side.png를 따른다' },
    { batch: 3, key: 'piece-side-my-plug', path: 'assets/piece/side-my-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '물길 돌을 땅 높이에서 정면으로 본 모습. 쐐기 끝이 오른쪽을 향하고, 민트색 물결 무늬가 보이며, 그림 아래쪽이 바닥에 닿는다' },
    { batch: 3, key: 'piece-side-their-plug', path: 'assets/piece/side-their-plug.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '녹슨 벽돌색 펌프 관 끝을 땅 높이에서 정면으로 본 모습. 플랜지가 오른쪽을 향한다' },
    { batch: 3, key: 'piece-side-cup', path: 'assets/piece/side-cup.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '나무 양동이를 땅 높이에서 정면으로 본 모습' },
    { batch: 3, key: 'piece-side-book', path: 'assets/piece/side-book.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '납작한 바위를 땅 높이에서 정면으로 본 모습. 칸을 꽉 채우고 윗면이 평평해 위에 물건을 올릴 수 있어 보인다' },
    { batch: 3, key: 'piece-side-menu', path: 'assets/piece/side-menu.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '비스듬히 박힌 석판을 땅 높이에서 정면으로 본 모습. 칸의 아래쪽 한 칸 높이만 차지한다' },
    { batch: 3, key: 'outlet-side-free', path: 'assets/outlet/side-free.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '샘 입구 돌벽을 땅 높이에서 정면으로 본 한 칸(높이 12cm). 그림 왼쪽 33%가 판석의 앞쪽 끝이고, '
        + '그 왼쪽 면에 왼쪽을 향한 둥근 물길 홈(지름이 그림 높이의 60~65%)이 파여 있다. 위아래로 이어 붙인다' },
    { batch: 3, key: 'outlet-side-taken', path: 'assets/outlet/side-taken.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '같은 돌벽 칸의 홈에 회색 대나무 관이 꽂혀 있다. 벽돌색과 민트색은 쓰지 않고, 강조하지 않는다' },
    { batch: 3, key: 'outlet-side-cap', path: 'assets/outlet/side-cap.png', width: 256, height: 256, refs: PIECE_REFS,
      subject: '돌벽의 맨 위 칸(땅 위 24~36cm). 홈이 없고, 그림 왼쪽 33%의 판석과 그 윗면 가장자리만 보인다. 오른쪽 67%는 투명하다' },

    // 4차: 세계와 상관없어 카페 때 그림을 그대로 쓰는 것. 여유가 있을 때 정령의 물빛에 맞춰 다시 그린다.
    { batch: 4, key: 'fx-bubble', path: 'assets/fx/bubble.png', width: 512, height: 512, refs: PIECE_REFS,
      subject: '물건 하나를 감싸는 반투명 물방울 거품. 가운데는 비어 있고 굵은 테두리와 반짝임만 있다. 정령의 물빛(하늘색)이 살짝 돈다' },
    { batch: 4, key: 'fx-ice', path: 'assets/fx/ice.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '날아가는 작은 얼음 조각 하나. 정령의 물빛이 비친다' },
    { batch: 4, key: 'ui-finger', path: 'assets/ui/finger.png', width: 192, height: 192, refs: PIECE_REFS,
      subject: '아래를 가리키는 만화풍 손가락. 튜토리얼에서 누를 곳을 짚는다' },
  ];

  // 프롤로그 컷 내용은 src/story.js가 기준이다. 여기서는 그쪽을 가리키기만 한다.
  function src(key) {
    return `src/story.js의 ${key} 컷(scene 설명). 말풍선, 이모지, 만화 기호, 글자는 넣지 않고 표정과 몸짓과 소품으로만 보여 준다`;
  }

  if (typeof module === 'object' && module.exports) module.exports = ASSET_LIST;
  else root.ASSET_LIST = ASSET_LIST;
})(typeof window !== 'undefined' ? window : globalThis);
