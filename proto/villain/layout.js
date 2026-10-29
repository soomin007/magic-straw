// 콘센트 빌런 도감 화면 배치의 유일한 기준. 게임 화면(index.html)과 배치 안내 그림(make-guide.py)이 모두 이 숫자를 읽는다.
// 아래 = 기호 사이는 JSON이어야 한다(Python이 그대로 읽는다). 주석과 끝 쉼표를 넣지 않는다.
//
// 시점은 RPG Maker(쯔꾸르)처럼 위에서 살짝 비스듬히 본 시점이다. 바닥 칸은 화면과 나란한 정사각형이고, 소실점이 없다(2026-10-29 사용자 결정).
// 그림 좌표는 1920 x 1080이고 칸 하나는 96px이다. 게임은 이것을 960 x 540 장면으로 줄여 그리므로 장면에서 칸은 48px이다.
// 판은 가로 12칸, 세로 7칸(1152 x 672px)이고 왼쪽 위 모서리가 (384, 240)이다. 판 위쪽 0~240px은 카페 안쪽 벽과 카운터,
// 판 아래쪽 912~1080px은 버튼 줄 자리, 판 좌우 0~384px과 1536~1920px은 카페 옆벽과 창이다.
// 사람 그림은 칸 하나 너비에 칸 하나 반 높이(96 x 144px)이고, 발이 칸 아래쪽에 닿는다. 그림 파일은 그 두 배로 그린다.
// 판마다 villain은 빌런 그림 key 세 가지(평소, 반응, 반응 일러스트)와 그림 크기(heightTiles), 그림 아래쪽이 닿는 칸(anchorRow, 빌런 칸 기준)이다.
// 콘센트는 언제나 빌런 칸 바로 위 줄의 벽(판 밖 -1번 줄)에 붙는다. view가 있는 판은 카메라 화각 규칙을 쓴다(engine.js 머리말).
window.VILLAIN_LAYOUT = {
  "art": { "width": 1920, "height": 1080, "tile": 96, "originX": 384, "originY": 240, "columns": 12, "rows": 7, "uiTop": 912 },
  "sprite": { "personWidthTiles": 1, "personHeightTiles": 1.5 },
  "levels": [
    {
      "id": "sleeper",
      "optimal": 17,
      "pushes": 7,
      "villain": { "idle": "villain-sleep", "react": "villain-wake", "portrait": "villain-portrait", "heightTiles": 2.5, "anchorRow": 1 },
      "map": [
        "......LL.LV.",
        "..c.....L*T.",
        "....c...c...",
        ".TT.........",
        ".TT..b......",
        ".......LL...",
        "P..........."
      ]
    },
    {
      "id": "streamer",
      "optimal": 17,
      "pushes": 6,
      "view": { "dir": "down", "width": 3 },
      "villain": { "idle": "streamer-idle", "react": "streamer-react", "portrait": "streamer-portrait", "heightTiles": 1.5, "anchorRow": 0 },
      "map": [
        "....LTL.....",
        "L....V....L.",
        "............",
        "....ccc.....",
        "............",
        ".........t..",
        "P..........."
      ]
    },
    {
      "id": "encore",
      "optimal": 19,
      "pushes": 7,
      "view": { "dir": "down", "width": 3 },
      "villain": { "idle": "streamer-idle", "react": "streamer-react", "portrait": "streamer-portrait", "heightTiles": 1.5, "anchorRow": 0 },
      "map": [
        "....LTL.....",
        "....LVL.....",
        "...L...L....",
        "....c.c.....",
        ".....c......",
        ".....t......",
        "P..........."
      ]
    }
  ]
};
