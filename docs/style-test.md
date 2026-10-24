# 그림체 시험 의뢰서 (2차)

1차 시험(A와 B)은 둘 다 사실적인 일러스트로 나와서 사용자가 원하는 카툰과 거리가 멀었다. 원인은 지시문이 그림체를 말로 설명하면서
사실적인 쪽으로 끄는 말만 썼기 때문이다(`known-issues.md` 8번). 이번에는 그림체를 말로 설명하지 않고 레퍼런스 이미지로 맞춘다.

## 정해진 방향

| 항목 | 내용 |
|---|---|
| 그림체 | Cult of the Lamb 느낌. `references/`의 레퍼런스 이미지를 생성할 때 함께 넣어 그림체를 맞춘다. 키 에셋(플러그, 컵, 인물)은 굵고 거친 선의 카툰이다. 배경은 조금 더 사실적이어도 된다 |
| 시점 | 살짝 기울인 탑뷰. Stardew Valley처럼 위에서 내려다보되 물건의 앞면이 조금 보인다. 아이소메트릭은 아니고, 판의 칸은 그대로 직사각형이다 |
| 장소 | 한국의 대중적인 카공 카페, 스타벅스를 떠올리게 하는 곳. 밝은 나무의 긴 공용 테이블, 짙은 초록 포인트, 펜던트 조명, 밤 유리창. 로고, 상표, 가게 이름, 사이렌 그림은 넣지 않는다 |

## 레퍼런스 이미지

사용자가 `references/` 폴더에 레퍼런스 이미지를 넣는다. 이 폴더의 이미지는 GitHub에 올라가지 않는다.
Codex는 그림을 생성할 때마다 이 폴더의 이미지 중 맞는 것을 참고 이미지로 함께 넣는다.
레퍼런스는 그림체와 분위기를 맞추는 데만 쓰고, 그 안의 캐릭터, 동물, 장면을 베끼지 않는다.

지시문에서 그림체는 "첨부한 레퍼런스 이미지의 그림체를 따른다" 한 줄로만 적는다. 그 밖에 그림체를 꾸미는 형용사(고급스러운, 정교한, 질감이 풍부한 등)는 쓰지 않는다.
다만 "사실적인 묘사, 3D 렌더, 사진 같은 질감은 쓰지 않는다"는 한 줄과, 아래 "선 굵기" 기준은 넣는다.

그림마다 넣을 레퍼런스는 아래처럼 짝짓는다. 파일 목록과 각 이미지에서 볼 점은 `references/README.md`에 있다.

| 만들 그림 | 함께 넣을 레퍼런스 |
|---|---|
| 내 플러그, 컵 | `line-bugfables-1`, `view-cultofthelamb-1`, `line-castlecrashers-1`(선 굵기 비교 기준) |
| 판 배경 | `view-cultofthelamb-1`, `view-dontstarve-1` |
| 주인공, 옆자리 사람 일러스트 | `portrait-helltaker-1`, `portrait-helltaker-2`, `portrait-helltaker-3`, `character-cultofthelamb-1` |

## 선 굵기

사용자는 레퍼런스 중 가장 굵은 Castle Crashers조차 원하는 두께의 절반도 안 된다고 했다. 그래서 키 에셋(플러그, 컵, 인물)의 선은 레퍼런스보다 훨씬 굵고 진하게 그린다.
말로만 "굵게"라고 하면 생성기가 적당히 줄이므로 숫자로 정한다.

| 항목 | 기준 |
|---|---|
| 바깥 외곽선 | 물건 짧은 변의 8~10%. 512 x 512 그림의 물건이면 40~50px이고, 게임의 88px 칸에서는 6~8px로 보인다. Castle Crashers 레퍼런스의 두 배 이상 |
| 안쪽 선 | 바깥 외곽선의 절반 정도 |
| 선 색 | 거의 순수한 검정(#111 정도). 회색이나 갈색 선은 쓰지 않는다 |
| 흰 테두리 | 이번 시험에서는 넣지 않는다. 배경 위에서 잘 안 보이면 `outline-papermario-1`처럼 바깥에 흰 테두리를 두르는 방법을 따로 시험한다 |

판 배경은 키 에셋보다 선을 가늘게 해도 된다. 배경의 선이 키 에셋보다 굵으면 퍼즐 조각이 배경에 묻힌다.

## 실제 사물 기준

지난번에는 사물을 막연하게 적어서 생성기가 미국식 기본값을 골랐다. 이번에는 아래 기준을 지시문에 그대로 옮긴다.

| 사물 | 기준 |
|---|---|
| 내 플러그 | 한국 220V 노트북 충전기의 벽 플러그. 둥근 원통형 머리에 둥근 금속 핀 두 개가 나란히 오른쪽을 향한다(납작한 핀이 아니다). 머리 뒤로 굵은 전선이 이어져 그림 왼쪽 가장자리에서 잘린다. 몸통은 민트색 |
| 컵 | 카페의 뜨거운 음료용 테이크아웃 종이컵. 납작한 플라스틱 뚜껑, 종이 홀더 슬리브가 끼워져 있다. 살짝 기울인 시점이라 뚜껑과 함께 컵 옆면이 보인다. 로고는 없다 |
| 주인공 | 헝클어진 검은 머리의 대학생, 민트색 후드. 손에 아이스 음료 컵을 들고, 컵에서 이어진 길고 색 있는 빨대를 물고 있다. 빨대가 짧은 흰 막대처럼 보이면 담배로 오해받으므로 반드시 컵과 이어지게 그린다 |
| 옆자리 사람 | 검은 머리에 크고 하얀 헤드폰, 벽돌색 후드. 자기 랩탑 화면만 보는 무심한 표정. 주인공과 같은 그림체와 같은 선 굵기로 그린다 |
| 판 배경 | 위 장소 기준의 카페에서, 긴 공용 테이블을 살짝 기울인 탑뷰로 본 장면. 사람과 랩탑의 자리는 1차 의뢰서의 배치 표와 같다. 퍼즐 칸 자리(가로 20~84%, 세로 26~74%)와 멀티탭 자리는 비워 두고, 랩탑이 퍼즐 칸 자리를 넘어오지 않게 한다 |

판 배경의 사람과 물건 자리는 아래 비율을 따른다(그림 전체 1920 x 1080 기준).

| 무엇 | 위치 (가로, 세로) |
|---|---|
| 테이블 윗면 | 가로 11~91%, 세로 11~89% |
| 퍼즐 칸 자리 (비움) | 가로 20~84%, 세로 26~74% |
| 멀티탭 자리 (비움) | 가로 75~84%, 세로 26~74% |
| 나 | 가로 0~17%, 세로 31~61% |
| 내 랩탑 | 가로 3~18%, 세로 62~88% |
| 옆자리 사람 | 가로 85~100%, 세로 59~86% |
| 상대 랩탑 | 가로 86~97%, 세로 14~40% |

## 순서

레퍼런스가 사물, 인물, 배경에 모두 먹혔는지 한 번에 볼 수 있도록 아래 다섯 장을 한 벌로 만든다.

| 파일 | 크기 |
|---|---|
| `assets/style-test/r2-my-plug.png` | 512 x 512, 투명 배경 |
| `assets/style-test/r2-cup.png` | 512 x 512, 투명 배경 |
| `assets/style-test/r2-portrait.png` (주인공) | 1024 x 1024, 투명 배경 |
| `assets/style-test/r2-neighbor-portrait.png` (옆자리 사람) | 1024 x 1024, 투명 배경 |
| `assets/style-test/r2-scene.png` (판 배경) | 1920 x 1080 |

1. `references/`에 레퍼런스 이미지가 있는지 확인한다. 없으면 사용자에게 넣어 달라고 하고 멈춘다.
2. 위 다섯 장을 같은 기준으로 만든다. 그림마다 "레퍼런스 이미지" 절의 짝짓기 표대로 레퍼런스를 넣는다.
3. `docs/style-test.html`의 "2차 시험" 칸에서 다섯 장이 한 장면에 어울리는지, 휴대폰 폭에서 선이 살아 있는지 확인한다.
4. `assets/style-test/notes.json`에 2차 지시문과, 어떤 레퍼런스 파일을 썼는지 파일 이름만 덧붙인다. 로컬 절대 경로는 적지 않는다.
5. 세션 로그에 "커밋 대기" 목록을 남기고 멈춘다. 커밋은 하지 않는다. `references/` 안의 이미지는 커밋 대기 목록에 넣지 않는다.

## 지시문 틀

```text
Follow the art style of the attached reference images exactly. Cartoon game asset.
Do not use realistic rendering, 3D render, or photographic texture.
Extremely thick, very dark black outlines: the outer outline is 8-10% of the object's shortest side
(about 40-50px on a 512px image), at least twice as thick as the thickest attached reference. Inner lines about half that.
Slightly tilted top-down view: seen from above, with a little of the front side visible (like Stardew Valley). Not isometric.
No text, no letters, no logos, no brand marks.
The player's things are mint green, the neighbor's things are brick red.
Subject: <위 사물 기준 표의 내용을 영어로>
```

투명 배경 그림에는 "Single object, centered, transparent background, no ground shadow." 한 줄을 덧붙인다.
판 배경을 만들 때는 굵은 선 문장을 "Outlines thinner than the key objects so the puzzle pieces stand out." 한 줄로 바꾼다.
