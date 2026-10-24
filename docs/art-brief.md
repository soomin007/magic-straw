# 그림 의뢰서

이 문서는 이미지 생성이 가능한 에이전트(Codex 등)에게 게임의 본 그림을 맡길 때 넘기는 문서다.
그림체는 두 번의 시험(`docs/style-test.md`)을 거쳐 2차 시험 결과로 정했다. 만들 그림의 목록은 `assets/asset-list.js`가 기준이다.
그림이 없어도 게임은 회색 상자로 돌아가고, 그림을 등록할 때마다 그 자리가 그림으로 바뀐다.

## 작업 순서

1. `AGENTS.md`와 `docs/workflow.md`를 먼저 읽는다. 그림 작업에서는 게임 코드(`src/`)를 고치지 않고, 커밋하지 않는다.
2. `references/`에 레퍼런스 이미지가 있는지 확인한다. 이 폴더는 GitHub에 없으므로, 없으면 `references/README.md`의 목록을 보고 사용자에게 넣어 달라고 하고 멈춘다.
3. 한 묶음씩 만든다. 그림마다 `assets/asset-list.js`의 `refs`에 적힌 레퍼런스를 함께 넣는다.
4. 저장한 그림은 `assets/manifest.js`에 key와 경로를 한 줄씩 등록한다.
5. 브라우저로 `docs/art-check.html`과 `index.html`을 열어 실제 게임 크기와 휴대폰 폭에서 확인한다.
6. `assets/generation.json`에 그림마다 쓴 지시문과 레퍼런스 파일 이름을 남긴다. 로컬 절대 경로는 적지 않는다.
7. 세션 로그에 "커밋 대기" 목록을 남기고 멈춘다. 검토와 커밋은 Claude Code가 한다.

## 그림체

그림체는 말로 꾸며 설명하지 않고 레퍼런스 이미지로 맞춘다(`known-issues.md` 7, 8번).
지시문에는 "첨부한 레퍼런스 이미지의 그림체를 따른다"와 "사실적인 묘사, 3D 렌더, 사진 같은 질감은 쓰지 않는다"만 적는다.
2차 시험의 인물 두 장과 물건 두 장이 기준 그림이다. 다음 그림을 만들 때 그 그림들도 참고 이미지로 함께 넣어 같은 게임처럼 보이게 한다.

선 굵기는 숫자로 정한다. 사용자가 2차 시험을 보고 정한 기준이다.

| 그림 | 바깥 외곽선 | 비고 |
|---|---|---|
| 판 위 물건(`piece-`), 칸막이(`divider-`), 효과, 버튼 | 물건 짧은 변의 8~10% | 생성기가 그만큼 굵게 못 그리면 덧그려도 되지만, 가장자리를 흐리게 번지게 하지 않는다. 덧그린 선의 바깥 경계는 또렷해야 한다 |
| 인물 일러스트(`portrait-`), 프롤로그 컷 | 생성된 선 그대로 | 덧그리지 않는다. 2차 시험에서 덧그린 인물 외곽선은 너무 두꺼웠다 |
| 판 배경(`scene-`) | 판 위 물건보다 가늘게 | 배경 선이 더 굵으면 퍼즐 조각이 묻힌다 |

선 색은 거의 순수한 검정(#111 정도)이다. 내 물건은 민트색, 옆자리 사람의 물건은 벽돌색으로 칠해 색만 보고 누구 것인지 알 수 있게 한다.

## 스티커는 그리지 않는다

게임 중에 움직이는 물건(`piece-`)에는 게임 코드가 흰 테두리와 약한 그림자를 붙여 스티커처럼 보이게 한다. 그래서 그림에는 흰 테두리도, 바닥 그림자도 넣지 않는다.
스티커는 "이것만 움직일 수 있다"는 힌트라서, 배경이나 칸막이에 스티커처럼 보이는 흰 테두리를 그리면 안 된다.

## 시점과 장소

판은 살짝 기울인 탑뷰로 그린다. Stardew Valley처럼 위에서 내려다보되 물건의 앞면이 조금 보이고, 아이소메트릭은 아니다.
숙이기 그림(`scene-side`, `piece-side-`, `divider-side-`)은 바 높이에서 정면으로 본 모습이다.

1챕터 장소는 스타벅스를 떠올리게 하는 한국 카공 카페의 창가 바 좌석이다. 밝은 나무의 좁고 긴 바, 짙은 초록 포인트, 펜던트 조명, 밤거리가 보이는 유리창이 있다.
로고, 상표, 가게 이름, 사이렌 그림은 넣지 않는다. 사물은 한국 기준으로 그린다(220V 둥근 두 핀 플러그 등).

두 자리 사이에는 낮은 나무 칸막이가 있고, 칸막이 양면에 콘센트가 붙어 있다. 판에서 칸막이는 판 오른쪽 끝에 세로로 놓인다.
칸막이는 판마다 콘센트 자리가 달라서 게임 코드가 구간 그림(`divider-`)을 이어 붙여 그린다. 그래서 판 배경에는 칸막이를 그리지 않고 그 자리를 비워 둔다.

## 판 배경 배치 (`scene-top`)

위치는 그림 전체 크기(1920 x 1080)에 대한 비율이다. 게임이 이 자리에 물건과 칸막이를 올리므로, 비워 두라는 자리에는 아무것도 그리지 않는다.

| 무엇 | 위치 (가로, 세로) | 설명 |
|---|---|---|
| 유리창과 벽 | 가로 0~100%, 세로 0~20% | 밤거리가 보이는 큰 창, 짙은 초록 창틀 |
| 바 윗면 | 가로 4~98%, 세로 22~77% | 좁고 긴 밝은 나무 바 |
| 퍼즐 칸 자리 (비움) | 가로 20~75%, 세로 26~74% | 나뭇결과 조명만 있다 |
| 칸막이 자리 (비움) | 가로 75~84%, 세로 22~77% | 게임이 칸막이를 그린다 |
| 내 랩탑 | 가로 6~19%, 세로 28~56% | 열어 둔 랩탑, 민트색 스티커 |
| 내 음료 자리 | 가로 7~15%, 세로 58~71% | 아이스 음료 컵 하나 |
| 상대 랩탑 | 가로 86~97%, 세로 28~56% | 열어 둔 랩탑, 벽돌색 스티커, 밝은 화면(글자 없음) |
| 나 | 가로 4~25%, 세로 76~100% | 바에 앉은 대학생의 뒤통수와 어깨, 민트색 후드, 오른쪽 위로 향한 초록 빨대 |
| 옆자리 사람 | 가로 79~100%, 세로 76~100% | 큰 하얀 헤드폰과 벽돌색 후드의 뒤통수와 어깨 |

## 숙이기 배경 배치 (`scene-side`)

| 무엇 | 위치 (가로, 세로) | 설명 |
|---|---|---|
| 창과 밤거리 | 가로 0~100%, 세로 0~74% | 바 너머로 보이는 유리창 |
| 퍼즐 칸 자리 (비움) | 가로 20~75%, 세로 25~74% | 바 위 공간. 아무것도 그리지 않는다 |
| 칸막이 자리 (비움) | 가로 75~84%, 세로 25~74% | 게임이 칸막이 옆면을 그린다 |
| 바 앞 가장자리 | 가로 0~100%, 세로 74~83% | 눈높이에 걸린 바의 나무 가장자리 |
| 숙인 나 | 가로 0~19%, 세로 44~77% | 바 가장자리 위로 눈과 머리 윗부분만 보이고, 빨대가 오른쪽을 향한다 |
| 옆자리 사람 | 가로 87~100%, 세로 31~61% | 칸막이 너머 앉은 모습, 헤드폰 |

## 프롤로그

프롤로그는 말을 몰라도 읽혀야 한다. 컷마다 장면 설명(`scene`)과 말풍선 기호(`symbol`)가 `src/story.js`에 있다.
말풍선과 기호는 그림 안에 직접 그리고, 글자는 한 자도 넣지 않는다. 시계, 화장실 표지판, 느낌표와 물음표, 빈 배터리 같은 기호만 쓴다.
말풍선 자리는 `src/story.js`의 `bubble` 위치를 따른다. 컷의 인물은 인물 일러스트와 같은 사람으로 알아볼 수 있어야 한다.

## 묶음

| 묶음 | 내용 | 장수 |
|---|---|---|
| 1차 | 판 배경, 판 위 물건 다섯, 칸막이 두 구간, 효과 둘, 버튼 셋 | 13 |
| 2차 | 숙이기 배경, 숙인 시점의 물건 다섯, 칸막이 두 구간 | 8 |
| 3차 | 인물 일러스트 셋, 프롤로그 다섯 컷 | 8 |

1차가 끝나면 1~6번 판이 그림으로 보인다. 7, 8번 판의 숙이기 화면은 2차, 인물과 프롤로그는 3차가 끝나야 그림으로 바뀐다.

## 형식

판 배경과 프롤로그 컷은 꽉 찬 그림이고, 나머지는 모두 배경이 투명한 PNG다. 투명 PNG에는 물건 하나만 담고 바닥 그림자를 넣지 않는다.
판 위 물건은 그림 크기를 넉넉히 채우되 가장자리에 여백을 조금 둔다. 플러그만은 핀 끝이 오른쪽 가장자리에 닿게 그린다.
칸막이 구간은 위아래로 이어 붙여 쓰므로, 위쪽과 아래쪽 가장자리가 끊김 없이 맞아야 한다.

## 지시문 틀

```text
Follow the art style of the attached reference images exactly. Cartoon game asset.
Do not use realistic rendering, 3D render, or photographic texture.
<LINE>
<VIEW>
No text, no letters, no logos, no brand marks.
The player's things are mint green, the neighbor's things are brick red.
Subject: <assets/asset-list.js의 subject를 영어로>
```

```text
LINE (piece-, divider-, fx-, ui-):
  Extremely thick, very dark black outlines: the outer outline is 8-10% of the object's shortest side, with a crisp outer edge (no blur, no glow).
LINE (portrait-, story-): Keep natural line weight. Do not add an extra outer outline.
LINE (scene-): Outlines thinner than the puzzle objects so the pieces stand out.

VIEW (top, scene-top): Slightly tilted top-down view, seen from above with a little of the front side visible (like Stardew Valley). Not isometric.
VIEW (side-): Eye-level front view at bar-counter height, orthographic.
VIEW (portrait-): Bust portrait, transparent background.
VIEW (story-): Full comic panel with background, wordless. Speech bubbles contain only pictograms and symbols, never letters.

Transparent PNG items add: Single object, centered, transparent background, no ground shadow, no white border.
```

## 의뢰 문구

사용자가 Codex에게 아래 문구를 전달한다.

```text
AGENTS.md와 docs/art-brief.md를 읽고, assets/asset-list.js의 1차 묶음 13장을 만들어 줘.
그림마다 refs에 적힌 레퍼런스와 2차 시험 그림(assets/style-test/r2-*)을 함께 넣어서 같은 그림체로 맞춰 줘.
manifest에 등록하고 docs/art-check.html과 index.html로 확인한 다음, 세션 로그에 커밋 대기 목록을 남기고 멈춰 줘. 커밋은 하지 마.
```
