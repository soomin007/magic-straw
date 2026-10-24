// 게임에 필요한 그림 목록. docs/art-brief.md와 docs/art-check.html이 이 목록을 기준으로 삼는다.
// key는 assets/manifest.js에 등록하는 이름이고, 게임 코드도 이 이름으로 그림을 찾는다.
// width와 height는 그릴 크기(게임 안 크기의 3배)이고, batch는 만드는 순서다.
(function (root) {
  'use strict';

  const ASSET_LIST = [
    // 1차: 탑뷰로 1챕터를 플레이하는 데 필요한 그림
    { batch: 1, key: 'top-my-plug', path: 'assets/top/my-plug.png', width: 264, height: 264, subject: '내 충전기 플러그를 바로 위에서 본 모습. 민트색 몸통, 금속 핀 두 개가 오른쪽을 향하고, 왼쪽 가장자리로 짧은 선이 이어진다' },
    { batch: 1, key: 'top-their-plug', path: 'assets/top/their-plug.png', width: 264, height: 264, subject: '같은 모양의 벽돌색 플러그를 바로 위에서 본 모습' },
    { batch: 1, key: 'top-cup', path: 'assets/top/cup.png', width: 264, height: 264, subject: '뚜껑 덮인 종이 커피컵을 바로 위에서 본 모습. 둥근 뚜껑과 마시는 구멍이 보인다' },
    { batch: 1, key: 'top-book', path: 'assets/top/book.png', width: 264, height: 264, subject: '두꺼운 전공책 세 권을 쌓은 더미를 바로 위에서 본 모습. 칸을 거의 꽉 채우고 무거워 보인다' },
    { batch: 1, key: 'top-menu', path: 'assets/top/menu.png', width: 264, height: 264, subject: '테이블에 세워 둔 삼각 메뉴판을 바로 위에서 본 모습. 칸의 왼쪽 아래에서 오른쪽 위로 비스듬히 놓여 있다. 반대 방향은 게임이 좌우를 뒤집어 쓴다' },
    { batch: 1, key: 'top-strip-socket', path: 'assets/top/strip-socket.png', width: 264, height: 264, subject: '테이블에 눕혀 둔 길쭉한 멀티탭의 한 구간을 위에서 본 모습. 콘센트 구멍 하나가 왼쪽을 향한다. 위아래로 이어 붙이면 멀티탭 하나가 되어야 한다' },
    { batch: 1, key: 'top-strip-plain', path: 'assets/top/strip-plain.png', width: 264, height: 264, subject: '같은 멀티탭의 콘센트가 없는 구간. 위아래로 다른 구간과 이어 붙는다' },
    { batch: 1, key: 'top-table', path: 'assets/top/table.png', width: 2280, height: 1260, subject: '카페의 긴 나무 테이블 윗면을 바로 위에서 본 모습. 물건은 하나도 없고, 나뭇결과 가장자리만 있다' },
    { batch: 1, key: 'top-me', path: 'assets/top/me.png', width: 480, height: 480, subject: '테이블 왼쪽 끝에 앉은 대학생을 바로 위에서 본 모습. 헝클어진 머리와 어깨가 보이고, 입에 문 빨대가 오른쪽을 향한다' },
    { batch: 1, key: 'top-neighbor', path: 'assets/top/neighbor.png', width: 480, height: 480, subject: '큰 헤드폰을 쓴 옆자리 사람을 바로 위에서 본 모습. 후드티를 입었고 왼쪽 아래를 향해 앉아 있다' },
    { batch: 1, key: 'top-my-laptop', path: 'assets/top/my-laptop.png', width: 300, height: 420, subject: '열어 둔 내 랩탑을 위에서 본 모습. 민트색 스티커가 붙어 있다' },
    { batch: 1, key: 'top-their-laptop', path: 'assets/top/their-laptop.png', width: 300, height: 420, subject: '열어 둔 옆자리 사람의 랩탑을 위에서 본 모습. 벽돌색 스티커가 붙어 있다. 화면은 비워 둔다(게임이 글자를 그린다)' },
    { batch: 1, key: 'fx-bubble', path: 'assets/fx/bubble.png', width: 264, height: 264, subject: '물건 하나를 감싸는 반투명 탄산 거품 방울. 가운데는 비어 있고 테두리와 반짝임만 있다' },
    { batch: 1, key: 'fx-ice', path: 'assets/fx/ice.png', width: 96, height: 96, subject: '날아가는 작은 얼음 조각 하나' },
    { batch: 1, key: 'ui-drink-ice', path: 'assets/ui/drink-ice.png', width: 192, height: 192, subject: '얼음이 든 아이스 아메리카노 컵과 빨대. 버튼에 들어갈 아이콘' },
    { batch: 1, key: 'ui-drink-soda', path: 'assets/ui/drink-soda.png', width: 192, height: 192, subject: '기포가 올라오는 투명한 초록빛 소다 컵과 빨대. 버튼에 들어갈 아이콘' },
    { batch: 1, key: 'ui-finger', path: 'assets/ui/finger.png', width: 192, height: 192, subject: '아래를 가리키는 만화풍 손가락. 튜토리얼에서 누를 곳을 짚는다' },

    // 2차: 숙이기(옆에서 본 단면) 시점에 필요한 그림
    { batch: 2, key: 'side-my-plug', path: 'assets/side/my-plug.png', width: 264, height: 264, subject: '내 민트색 플러그를 정확히 옆에서 본 모습. 핀이 오른쪽을 향하고, 칸 아래쪽 바닥에 놓인 높이로 그린다' },
    { batch: 2, key: 'side-their-plug', path: 'assets/side/their-plug.png', width: 264, height: 264, subject: '벽돌색 플러그를 정확히 옆에서 본 모습' },
    { batch: 2, key: 'side-cup', path: 'assets/side/cup.png', width: 264, height: 264, subject: '뚜껑 덮인 종이 커피컵을 정확히 옆에서 본 모습' },
    { batch: 2, key: 'side-book', path: 'assets/side/book.png', width: 264, height: 264, subject: '책 세 권을 쌓은 더미를 정확히 옆에서 본 모습. 칸을 꽉 채워서 위에 물건을 올릴 수 있어 보인다' },
    { batch: 2, key: 'side-menu', path: 'assets/side/menu.png', width: 264, height: 264, subject: '삼각 메뉴판을 정확히 옆에서 본 모습. 칸의 아래쪽 한 칸 높이만 차지한다' },
    { batch: 2, key: 'side-strip-socket', path: 'assets/side/strip-socket.png', width: 264, height: 264, subject: '멀티탭 옆면의 한 구간, 콘센트 구멍 하나가 왼쪽을 향한다. 위아래로 이어 붙는다' },
    { batch: 2, key: 'side-strip-plain', path: 'assets/side/strip-plain.png', width: 264, height: 264, subject: '멀티탭 옆면의 콘센트 없는 구간' },
    { batch: 2, key: 'side-table-edge', path: 'assets/side/table-edge.png', width: 2880, height: 150, subject: '옆에서 본 나무 테이블의 윗면 띠. 가로로 길다' },
    { batch: 2, key: 'side-me', path: 'assets/side/me.png', width: 600, height: 600, subject: '테이블 높이로 몸을 숙여 오른쪽을 엿보는 대학생. 눈과 머리 윗부분만 테이블 위로 나오고, 빨대를 물고 있다' },
    { batch: 2, key: 'side-neighbor', path: 'assets/side/neighbor.png', width: 450, height: 600, subject: '헤드폰을 쓰고 자기 화면만 보는 옆자리 사람을 옆에서 본 모습. 왼쪽을 향해 앉아 있다' },

    // 3차: 프롤로그 만화 다섯 컷. 대사는 게임이 컷 안에 만화 말풍선으로 얹으므로 그림에는 글자를 넣지 않는다.
    // 말풍선이 놓일 자리(src/story.js의 bubble, noticeAt 위치)는 인물 얼굴이나 중요한 물건이 가리지 않게 비워 둔다.
    { batch: 3, key: 'story-1', path: 'assets/story/1.png', width: 1600, height: 1200, subject: '새벽 카페. 노트북 앞에 전공책을 펴 놓고 지친 얼굴로 공부하는 대학생. 창밖은 깜깜하다' },
    { batch: 3, key: 'story-2', path: 'assets/story/2.png', width: 1600, height: 1200, subject: '충전기를 멀티탭에 꽂아 둔 채 자리에서 일어나 화장실 쪽으로 가는 대학생의 뒷모습' },
    { batch: 3, key: 'story-3', path: 'assets/story/3.png', width: 1600, height: 1200, subject: '돌아와서 본 테이블. 민트색 플러그는 뽑혀서 테이블 위에 굴러 있고, 멀티탭은 헤드폰 쓴 옆자리 사람의 벽돌색 플러그가 전부 차지했다. 대학생은 얼어붙은 표정' },
    { batch: 3, key: 'story-4', path: 'assets/story/4.png', width: 1600, height: 1200, subject: '옆자리 사람에게 말을 걸려고 손을 들다가 멈춘 대학생. 노트북 화면 구석에 빨간 경고 알림 상자가 떠 있다(상자 안은 비워 둔다)' },
    { batch: 3, key: 'story-5', path: 'assets/story/5.png', width: 1600, height: 1200, subject: '음료 컵에 꽂힌 빨대를 크게 클로즈업. 빨대가 마법처럼 은은하게 빛난다. 결심한 눈빛이 컵 너머로 비친다' },
  ];

  if (typeof module === 'object' && module.exports) module.exports = ASSET_LIST;
  else root.ASSET_LIST = ASSET_LIST;
})(typeof window !== 'undefined' ? window : globalThis);
