// 만들어 둔 그림 파일 목록. 그림을 만들면 assets/asset-list.js의 key와 path를 그대로 여기 한 줄씩 적는다.
// 등록하지 않은 그림은 게임이 회색 상자로 대신한다. 그림 확인은 docs/art-check.html에서 한다.
// 1차 그림체(평면 벡터)의 그림, 그리고 뒤에서 본 구도의 판 배경과 칸막이 그림은 구도를 바꾸면서 지웠다. git 기록에는 남아 있다.
// 콘센트 기둥 그림(outlet-)은 좌석 사이 칸막이로 바꾸면서 등록을 뺐다. 새 그림을 같은 경로에 덮어쓴 뒤 다시 등록한다.
//
// 예: 'piece-top-my-plug': 'assets/piece/top-my-plug.png',
window.ASSET_MANIFEST = {
  'portrait-me': 'assets/portrait/me.png',
  'portrait-me-determined': 'assets/portrait/me-determined.png',
  'portrait-neighbor': 'assets/portrait/neighbor.png',
  'story-1': 'assets/story/1.png',
  'story-2': 'assets/story/2.png',
  'story-3': 'assets/story/3.png',
  'story-4': 'assets/story/4.png',
  'story-5': 'assets/story/5.png',
  'scene-side': 'assets/scene/side.png',
  'piece-side-my-plug': 'assets/piece/side-my-plug.png',
  'piece-side-their-plug': 'assets/piece/side-their-plug.png',
  'piece-side-cup': 'assets/piece/side-cup.png',
  'piece-side-book': 'assets/piece/side-book.png',
  'piece-side-menu': 'assets/piece/side-menu.png',
  'scene-top': 'assets/scene/top.png',
  'piece-top-my-plug': 'assets/piece/top-my-plug.png',
  'piece-top-their-plug': 'assets/piece/top-their-plug.png',
  'piece-top-cup': 'assets/piece/top-cup.png',
  'piece-top-book': 'assets/piece/top-book.png',
  'piece-top-menu': 'assets/piece/top-menu.png',
  'fx-bubble': 'assets/fx/bubble.png',
  'fx-ice': 'assets/fx/ice.png',
  'ui-drink-ice': 'assets/ui/drink-ice.png',
  'ui-drink-soda': 'assets/ui/drink-soda.png',
  'ui-finger': 'assets/ui/finger.png',
};
