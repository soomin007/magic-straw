// 장면 배치의 유일한 기준. 게임 화면(src/game.js), 그림 확인 페이지(docs/art-check.html),
// 배치 안내 그림(tools/make-layout-guide.py가 만드는 docs/layout-guide/*.png)이 모두 이 숫자를 읽는다.
// 좌표는 960 x 540 장면 기준 px이고, 그림을 그릴 때는 2배(1920 x 1080)로 키운다.
// 아래 = 기호 사이는 JSON이어야 한다(Python이 그대로 읽는다). 주석과 끝 쉼표를 넣지 않는다.
//
// 실제 크기 기준: 퍼즐 칸 하나 = 가로 12cm(종이컵 하나), 장면에서 88px. 1cm = 약 7.33px.
//   사람 어깨너비 44cm = 323px(칸 3.7개), 머리 너비 16cm = 116px, 랩탑 너비 31cm = 227px(칸 2.6개),
//   퍼즐 판 6칸 = 72cm, 바 깊이 = 랩탑 놓는 뒤쪽 22cm + 퍼즐 36cm = 58cm, 두 자리 중심 간격 = 700px(약 95cm).
//   살짝 기울여 본 시점이라 앞뒤 깊이는 1cm = 5px로 줄여 그린다(한 줄 12cm = 60px).
window.SCENE_LAYOUT = {
  "scale": { "cellWidthPx": 88, "rowHeightPx": 60, "cellCm": 12, "pxPerCm": 7.33, "depthPxPerCm": 5 },
  "top": {
    "gridLeft": 190,
    "gridTop": 300,
    "straw": { "x": 279, "y": 133 },
    "boxes": [
      { "label": "카페 안쪽", "tone": "window", "shape": "rect", "x": 0, "y": 0, "width": 960, "height": 232 },
      { "label": "", "tone": "table", "shape": "rect", "x": 0, "y": 230, "width": 960, "height": 252 },
      { "label": "나 (상반신)", "tone": "mine", "shape": "round", "x": 38, "y": 170, "width": 324, "height": 132 },
      { "label": "나 (얼굴)", "tone": "mine", "shape": "ellipse", "x": 142, "y": 43, "width": 116, "height": 144 },
      { "label": "옆자리 (상반신)", "tone": "theirs", "shape": "round", "x": 738, "y": 170, "width": 324, "height": 132 },
      { "label": "옆자리 (얼굴, 헤드폰)", "tone": "theirs", "shape": "ellipse", "x": 842, "y": 43, "width": 116, "height": 144 },
      { "label": "내 랩탑 (뚜껑 뒷면)", "tone": "laptop", "shape": "rect", "x": 90, "y": 188, "width": 227, "height": 102 },
      { "label": "", "tone": "mine", "shape": "rect", "x": 183, "y": 222, "width": 40, "height": 34 },
      { "label": "상대 랩탑 (뚜껑 뒷면)", "tone": "laptop", "shape": "rect", "x": 790, "y": 188, "width": 227, "height": 102 },
      { "label": "", "tone": "theirs", "shape": "rect", "x": 883, "y": 222, "width": 40, "height": 34 },
      { "label": "내 음료", "tone": "light", "shape": "rect", "x": 330, "y": 222, "width": 50, "height": 78 },
      { "label": "", "tone": "edge", "shape": "rect", "x": 0, "y": 480, "width": 960, "height": 26 },
      { "label": "창틀 (앞쪽)", "tone": "window", "shape": "rect", "x": 0, "y": 506, "width": 960, "height": 34 }
    ]
  },
  "side": {
    "floor": 400,
    "straw": { "x": 228, "y": 390 },
    "boxes": [
      { "label": "카페 안쪽", "tone": "window", "shape": "rect", "x": 0, "y": 0, "width": 960, "height": 400 },
      { "label": "옆자리 (상반신)", "tone": "theirs", "shape": "round", "x": 760, "y": 222, "width": 260, "height": 178 },
      { "label": "옆자리 (얼굴, 헤드폰)", "tone": "theirs", "shape": "ellipse", "x": 842, "y": 78, "width": 116, "height": 144 },
      { "label": "숙인 나 (눈만 바 위로)", "tone": "mine", "shape": "ellipse", "x": 50, "y": 285, "width": 120, "height": 150 },
      { "label": "", "tone": "edge", "shape": "rect", "x": 0, "y": 400, "width": 960, "height": 50 },
      { "label": "창틀 (앞쪽)", "tone": "window", "shape": "rect", "x": 0, "y": 450, "width": 960, "height": 90 }
    ]
  }
};
