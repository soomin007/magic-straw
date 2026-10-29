// 배경 그림마다 실제로 그려진 바닥 격자의 바깥 경계(그림 좌표 1920 x 1080 기준 px).
// 이미지 생성기는 배치 안내 그림을 넣어도 바닥을 몇십 px씩 옮겨 그린다. 그래서 그림을 다시 그리거나 늘이지 않고,
// 게임이 이 숫자로 칸의 크기와 위치를 그림에 맞춘다(proto/villain/index.html의 applyGrid, known-issues 19번).
// 배경을 새로 그리면 그린 쪽(Codex)이 타일 줄을 재서 한 줄씩 적는다. 잰 방법: 바닥 가운데 띠의 밝기를 가로, 세로로 훑어
// 타일 줄(어두운 선)의 위치를 찾고, 첫 줄과 끝 줄을 left, right(가로 12칸), top, bottom(세로 7칸)으로 적는다.
window.VILLAIN_BG_GRID = {
  a: {
    'bg-sleeper': { left: 371, top: 178.5, right: 1548, bottom: 875 },
  },
  b: {
    'bg-sleeper': { left: 371, top: 178, right: 1547, bottom: 875 },
  },
};
