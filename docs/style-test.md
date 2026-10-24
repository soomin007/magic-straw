# 그림체 시험 의뢰서

1차 그림이 평면 벡터처럼 나와서, 게임 그림을 본격적으로 다시 만들기 전에 그림체를 먼저 고른다.
같은 대상 네 가지를 두 그림체로 한 벌씩, 모두 여덟 장을 만든다. 사용자가 `docs/style-test.html`에서 두 벌을 나란히 보고 하나를 고른다.
이번 시험 그림은 게임에 등록하지 않는다. `assets/manifest.js`와 `assets/asset-list.js`는 고치지 않는다.

## 이번에 바뀐 점

지난 의뢰서는 "단색 면, 그림자 한 단계, 그라데이션과 질감 금지"를 요구했다. 이번에는 그 조건을 모두 뺀다.
이미지 생성이 잘하는 풍부한 명암, 질감, 조명을 그대로 살린다. 사용자가 원하는 수준은 Helltaker나 Hades 같은 완성도 높은 게임 일러스트다.
작은 칸에서 읽히게 하는 일은 그림을 납작하게 만드는 대신 굵은 외곽선, 분명한 실루엣, 명암 대비, 테두리 빛으로 해결한다.

## 두 그림체

| 이름 | 방향 |
|---|---|
| A (Helltaker 방향) | 깔끔하고 자신 있는 애니메이션풍 선화. 검은 선이 또렷하고, 셀 채색에 명암 두세 단계를 매끈하게 넣는다. 배경은 어둡고 대비가 강하며, 캐릭터는 세련되고 표정이 살아 있다. 화면이 정돈되고 그래픽 디자인처럼 깔끔하다 |
| B (Hades 방향) | 굵은 잉크 외곽선 위에 붓 질감이 보이는 회화풍 채색. 따뜻한 조명과 차가운 그림자가 극적으로 대비되고, 물건 가장자리에 테두리 빛이 돈다. 디테일과 질감이 풍부하고, 화면 전체가 한 장의 그림처럼 꽉 차 보인다 |

두 그림체 모두 공통으로 지킨다. 내 물건은 민트색 계열, 옆자리 사람의 물건은 벽돌색 계열이라 색만 보고 누구 것인지 알 수 있어야 한다.
배경은 새벽 카페 실내이고, 조명은 왼쪽 위의 펜던트 조명에서 따뜻하게 떨어진다. 그림에 글자를 넣지 않는다.
특정 게임의 캐릭터나 장면을 베끼지 않고, 그 게임들이 가진 완성도와 분위기만 참고한다.

## 만들 그림

| 파일 | 크기 | 대상 |
|---|---|---|
| `assets/style-test/a-scene.png`, `b-scene.png` | 1920 x 1080 | 판 배경. 아래 "판 배경 배치"를 지킨다 |
| `assets/style-test/a-my-plug.png`, `b-my-plug.png` | 512 x 512, 투명 배경 | 내 민트색 충전기 플러그를 바로 위에서 본 모습. 금속 핀 두 개가 오른쪽을 향하고, 왼쪽으로 짧은 선이 나간다 |
| `assets/style-test/a-cup.png`, `b-cup.png` | 512 x 512, 투명 배경 | 뚜껑 덮인 종이 커피컵을 바로 위에서 본 모습 |
| `assets/style-test/a-portrait.png`, `b-portrait.png` | 1024 x 1024, 투명 배경 | 주인공 상반신 일러스트. 대화 장면에서 혼잣말과 함께 화면 옆에 크게 뜨는 그림이다. 헝클어진 검은 머리, 민트색 옷, 입에 빨대를 문 채 조용히 결심한 표정 |

플러그와 컵은 판에서 88px 칸 하나에 들어가고, 휴대폰에서는 30px 남짓까지 작아진다. 크게 그리되, 작게 줄여도 실루엣으로 알아볼 수 있어야 한다.
투명 배경 그림에는 바닥 그림자를 넣지 않는다. 게임이 그림자를 따로 그린다.

## 판 배경 배치

판 배경은 탑뷰라서, 테이블을 바로 위에서 내려다본 평행 투영으로 그린다. 비스듬한 각도나 아이소메트릭으로 그리지 않는다.
게임이 그 위에 플러그, 컵, 책, 메뉴판 같은 움직이는 조각과 멀티탭을 따로 올리므로, 퍼즐 칸이 놓일 자리는 비워 둔다.
위치는 그림 전체 크기(1920 x 1080)에 대한 비율이다.

| 무엇 | 위치 (가로, 세로) | 설명 |
|---|---|---|
| 테이블 윗면 | 가로 11~91%, 세로 11~89% | 카페의 긴 나무 테이블. 물건이 놓이지 않은 넓은 면 |
| 퍼즐 칸 자리 | 가로 20~84%, 세로 26~74% | 아무것도 그리지 않는다. 나뭇결과 조명만 있다 |
| 멀티탭 자리 | 가로 75~84%, 세로 26~74% | 비워 둔다. 게임이 멀티탭을 따로 그린다 |
| 나 | 가로 0~17%, 세로 31~61% | 테이블 왼쪽 끝에 앉은 대학생을 위에서 본 모습. 머리와 어깨, 오른쪽을 향한 빨대 |
| 내 랩탑 | 가로 9~19%, 세로 61~87% | 열어 둔 랩탑, 민트색 스티커 |
| 옆자리 사람 | 가로 85~100%, 세로 59~86% | 크고 하얀 헤드폰, 벽돌색 후드, 자기 화면을 보는 자세 |
| 상대 랩탑 | 가로 86~97%, 세로 14~40% | 열어 둔 랩탑, 벽돌색 스티커, 화면은 밝게 빛나지만 글자는 없다 |

## 생성 지시문 틀

두 그림체가 공정하게 비교되도록, 그림체 문장만 바꾸고 나머지는 같게 쓴다.

```text
<STYLE>
Late-night cafe interior mood, warm pendant light from the upper left.
The player's things are mint green (#6cc3a0), the neighbor's things are brick red (#d9534a).
No text, no letters, no logos.
<VIEW>
Subject: ...
```

```text
A: High-end 2D game illustration, clean confident anime line art with crisp black lines, polished cel shading
   with two or three smooth tones, strong contrast, stylish and graphic composition.
B: High-end 2D game illustration, painterly rendering with visible brush texture over thick ink outlines,
   dramatic warm and cool lighting, glowing rim light on edges, rich detail and material texture.

scene     : Strict top-down orthographic view of a long cafe table seen from directly above, no perspective. (위 배치 표를 영어로 함께 적는다)
sprite    : Strict top-down orthographic view, single object, centered, transparent background, no ground shadow.
portrait  : Bust portrait facing slightly to the right, transparent background, expressive face.
```

## 마칠 때

1. 여덟 장을 `assets/style-test/`에 저장한다.
2. `assets/style-test/notes.json`에 그림마다 쓴 지시문을 남긴다. 원본 이미지의 로컬 경로는 적지 않는다.
3. 브라우저로 `docs/style-test.html`을 열어 두 벌이 나란히 보이는지, 게임 크기 미리보기에서 조각이 칸에 맞는지 확인한다.
4. 세션 로그에 무엇을 만들었는지와 "커밋 대기" 목록을 남기고 멈춘다. 커밋은 하지 않는다.
