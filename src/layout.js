// 장면 배치의 유일한 기준. 게임 화면(src/game.js), 그림 확인 페이지(docs/art-check.html),
// 배치 안내 그림(tools/make-layout-guide.py가 만드는 docs/layout-guide/*.png)이 모두 이 숫자를 읽는다.
// 좌표는 960 x 540 장면 기준 px이고, 그림을 그릴 때는 2배(1920 x 1080)로 키운다.
// 아래 = 기호 사이는 JSON이어야 한다(Python이 그대로 읽는다). 주석과 끝 쉼표를 넣지 않는다.
//
// 실제 크기 기준(물의 정령 세계, 2026-10-28): 퍼즐 칸 하나 = 가로 12cm(물길 돌이나 양동이 하나), 장면에서 88px. 1cm = 약 7.33px.
//   정령과 샘지기는 사람과 같은 크기로 그린다. 어깨너비 44cm = 323px(칸 3.7개), 머리 너비 16cm = 116px.
//   샘 가장자리 돌과 샘지기의 물통 = 너비 31cm = 227px(칸 2.6개). 정령의 손 = 너비 8cm(60px), 높이 15cm.
//   퍼즐 판 6칸 = 72cm, 샘가 깊이 = 뒤쪽 22cm + 퍼즐 36cm = 58cm, 정령과 샘지기의 중심 간격 = 약 95cm.
//   샘 입구 돌벽 = 판석 두께 4cm(29px), 높이 36cm, 샘가 깊이 전체. 맨 오른쪽 열의 왼쪽 29px에 서고,
//   물길 홈은 그 왼쪽 면(정령 쪽)에 파여 있다. 열의 나머지는 샘지기 쪽 땅이다.
//   살짝 기울여 본 시점이라 앞뒤 깊이는 1cm = 5px로 줄여 그린다(한 줄 12cm = 60px).
//   straw는 얼음과 거품이 출발하는 자리(정령의 입 앞)다. 카페 때 빨대 끝이라 이름이 straw로 남았다.
window.SCENE_LAYOUT = {
  "scale": { "cellWidthPx": 88, "rowHeightPx": 60, "cellCm": 12, "pxPerCm": 7.33, "depthPxPerCm": 5 },
  "top": {
    "gridLeft": 190,
    "gridTop": 300,
    "straw": { "x": 274, "y": 139 },
    "boxes": [
      { "label": "숲 (샘 뒤편)", "tone": "window", "shape": "rect", "x": 0, "y": 0, "width": 960, "height": 232 },
      { "label": "", "tone": "table", "shape": "rect", "x": 0, "y": 230, "width": 960, "height": 252 },
      { "label": "정령 (몸)", "tone": "mine", "shape": "round", "x": 38, "y": 170, "width": 324, "height": 132 },
      { "label": "정령 (얼굴)", "tone": "mine", "shape": "ellipse", "x": 142, "y": 43, "width": 116, "height": 144 },
      { "label": "샘지기 (상반신)", "tone": "theirs", "shape": "round", "x": 762, "y": 170, "width": 324, "height": 132 },
      { "label": "샘지기 (얼굴)", "tone": "theirs", "shape": "ellipse", "x": 866, "y": 43, "width": 116, "height": 144 },
      { "label": "샘 가장자리 돌", "tone": "laptop", "shape": "rect", "x": 30, "y": 188, "width": 227, "height": 102 },
      { "label": "", "tone": "mine", "shape": "rect", "x": 123, "y": 222, "width": 40, "height": 34 },
      { "label": "샘지기의 물통", "tone": "laptop", "shape": "rect", "x": 814, "y": 188, "width": 227, "height": 102 },
      { "label": "", "tone": "theirs", "shape": "rect", "x": 907, "y": 222, "width": 40, "height": 34 },
      { "label": "샘 입구 돌벽 (뒤쪽)", "tone": "partition", "shape": "rect", "x": 718, "y": 190, "width": 29, "height": 110 },
      { "label": "정령의 손", "tone": "light", "shape": "rect", "x": 270, "y": 192, "width": 60, "height": 82 },
      { "label": "", "tone": "edge", "shape": "rect", "x": 0, "y": 480, "width": 960, "height": 26 },
      { "label": "물가 (앞쪽)", "tone": "window", "shape": "rect", "x": 0, "y": 506, "width": 960, "height": 34 }
    ]
  },
  "side": {
    "floor": 400,
    "straw": { "x": 228, "y": 390 },
    "boxes": [
      { "label": "숲 (샘 뒤편)", "tone": "window", "shape": "rect", "x": 0, "y": 0, "width": 960, "height": 400 },
      { "label": "샘지기 (상반신)", "tone": "theirs", "shape": "round", "x": 784, "y": 222, "width": 260, "height": 178 },
      { "label": "샘지기 (얼굴)", "tone": "theirs", "shape": "ellipse", "x": 866, "y": 78, "width": 116, "height": 144 },
      { "label": "가라앉은 정령 (눈만 물 위로)", "tone": "mine", "shape": "ellipse", "x": 50, "y": 285, "width": 120, "height": 150 },
      { "label": "", "tone": "edge", "shape": "rect", "x": 0, "y": 400, "width": 960, "height": 50 },
      { "label": "물가 (앞쪽)", "tone": "window", "shape": "rect", "x": 0, "y": 450, "width": 960, "height": 90 }
    ]
  }
};
