// 만들어 둔 그림 파일 목록. 그림을 만들면 assets/asset-list.js의 key와 path를 그대로 여기 한 줄씩 적는다.
// 등록하지 않은 그림은 게임이 회색 상자로 대신한다. 그림 확인은 docs/art-check.html에서 한다.
// 1차 그림체(평면 벡터)의 그림, 그리고 뒤에서 본 구도의 판 배경과 칸막이 그림은 구도를 바꾸면서 지웠다. git 기록에는 남아 있다.
//
// 2026-10-28 물의 정령 컨셉으로 옮기면서 카페 그림(판 배경, 인물, 프롤로그, 플러그와 컵과 책과 메뉴판, 콘센트, 음료 아이콘)의 등록을 뺐다.
// 카페 그림과 물의 정령 프롤로그가 섞여 보이면 처음 하는 사람이 세계를 읽지 못하기 때문이다. 파일은 그대로 두었고,
// Codex가 같은 경로에 물의 정령 그림을 덮어쓴 뒤 한 줄씩 다시 등록한다. 세계와 상관없는 얼음, 거품, 손가락만 남겼다.
//
// 예: 'piece-top-my-plug': 'assets/piece/top-my-plug.png',
window.ASSET_MANIFEST = {
  'scene-top': 'assets/scene/top.png',
  'portrait-me': 'assets/portrait/me.png',
  'piece-top-my-plug': 'assets/piece/top-my-plug.png',
  'fx-bubble': 'assets/fx/bubble.png',
  'fx-ice': 'assets/fx/ice.png',
  'ui-finger': 'assets/ui/finger.png',
};
