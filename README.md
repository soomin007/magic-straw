# 내 자리, 내 충전기

> 이 저장소는 기록이다(2026-10-29). 여기서 여러 번 방향을 바꾼 끝에 나온 게임 "콘센트 빌런 도감"은
> [soomin007/outlet-villains](https://github.com/soomin007/outlet-villains)로 옮겼고, https://soomin007.github.io/outlet-villains/ 에서 할 수 있다.
> 아래 내용은 카페 버전(마법 빨대) 때의 설명이다.

시험 전날 카페에서 벼락치기를 하던 중, 잠깐 자리를 비운 사이 옆자리 사람이 내 충전기를 뽑고 콘센트를 차지해 버렸다.
일을 크게 만들 시간은 없으니, 마법 빨대로 마신 음료를 뱉어 주변 물건을 움직이고 조용히 내 자리를 되찾아야 한다.

시리어스 게임 강의 실습으로 만드는 퍼즐 게임이다. 주어진 동사는 "빼앗다"와 "뱉다"이고,
Baba Is You와 There Is No Game, Helltaker를 참고해 적은 규칙을 조합해서 한 차례씩 푸는 퍼즐을 목표로 한다.

지금은 프롤로그와 1챕터 여덟 판을 탑뷰로 플레이할 수 있다. 그림은 아직 회색 상자이고, 그림이 준비되는 대로 하나씩 바뀐다.
화면 전체가 내 랩탑 바탕화면이고, 작업 표시줄의 배터리가 남은 행동 수다.
단축키는 1과 2가 음료, S가 숙이기, C가 휴대폰 카메라, Z가 되돌리기, R이 처음부터다.

플레이 주소: https://soomin007.github.io/magic-straw/

## 파일 안내

| 파일 | 내용 |
|---|---|
| `index.html` | 게임 화면 |
| `src/engine.js` | 게임 규칙. 화면 코드와 분리되어 있다 |
| `src/levels.js` | 1챕터 레벨 지도 |
| `src/game.js` | 판 그리기, 입력, 연출, 튜토리얼, 프롤로그 |
| `src/assets.js` | 그림을 찾고, 없으면 회색 상자로 대신한다 |
| `src/story.js` | 프롤로그 컷 목록 |
| `tools/verify.html` | 레벨마다 최소 행동 수를 탐색해 확인하는 검증 도구 |
| `docs/design.md` | 규칙, 레벨, 시작 흐름, 확장 계획 |
| `docs/playtest.md` | 다른 사람에게 해 보게 할 때 쓰는 플레이 테스트 기록지 |
| `docs/workflow.md` | 사용자, Claude Code, Codex의 역할과 작업 순서, 두 컴퓨터에서 작업하는 방법 |
| `docs/mockup/index.html` | 화면 배치와 프롤로그 목업 |
| `docs/art-brief.md` | 그림 의뢰서 |
| `assets/asset-list.js` | 만들 그림 목록 |
| `assets/manifest.js` | 만들어 둔 그림 목록 |
| `docs/art-check.html` | 그림을 실제 크기로 모아 보는 확인 페이지 |
