# 그림 의뢰서

이 문서는 이미지 생성이 가능한 에이전트(Codex 등)에게 게임 그림을 맡길 때 넘기는 문서다.
지금 게임은 `src/art.js`에서 코드로 그린 SVG를 쓰고 있다. 여기 적힌 그림 파일을 만들어 `assets/manifest.js`에 등록하면,
게임이 그 이름의 SVG 대신 그림 파일을 쓴다. 등록하지 않은 그림은 SVG가 그대로 남으므로 한 장씩 바꿔도 된다.

## 작업 순서

1. `AGENTS.md`를 먼저 읽는다. 특히 게임 규칙과 코드에는 손대지 않는다.
2. 아래 그림체 기준을 지켜 그림을 만들고, 표에 적힌 경로와 크기로 저장한다.
3. `assets/manifest.js`에 이름과 경로를 한 줄씩 추가한다.
4. 브라우저로 `index.html`을 열어 모든 판에서 그림이 칸에 맞게 보이는지, 서로 다른 그림이 한 장면처럼 보이는지 확인한다.
5. 어떤 그림을 바꿨는지 세션 로그에 남기고 커밋한다.

## 그림체 기준

모든 그림은 같은 사람이 그린 것처럼 보여야 한다. Codex MVP 0.1에서는 배경 그림과 사물 그림의 그림체가 달라서 한 장면으로 보이지 않았다.
그러니 한 번에 전부 같은 기준으로 만들고, 한 장만 다른 방식으로 만들지 않는다.

그림체는 단순한 플랫 카툰이다. 굵고 둥근 갈색 외곽선(#3b2f2a)을 쓰고, 그림자는 한 단계만 넣는다.
색은 크림색 바탕에 민트(#7fc8a9), 벽돌색(#e0796b), 하늘색(#7cc3e3), 나무색(#c08a5a)을 포인트로 쓴다.
내 물건은 민트 계열, 옆자리 사람의 물건은 벽돌색 계열로 칠해서 누구 것인지 색만 보고 알 수 있게 한다.
실루엣이 단순해야 한다. 판에서 물건 하나는 휴대폰 화면에서 30px 남짓으로 작게 보이므로, 작은 장식은 보이지 않는다.

모든 사물과 인물은 배경이 투명한 PNG로 만든다. 그림 안에 다른 물건, 테이블, 그림자 바닥을 함께 그리지 않는다.
게임이 물건 하나하나를 따로 움직이기 때문에, 한 장에 여러 물건을 그려 넣으면 쓸 수 없다.

## 만들 그림

크기는 게임 안 크기의 3배로 그린다. 사물 한 칸은 게임 안에서 88 x 88이므로 264 x 264로 그린다.

| 이름 (manifest 키) | 경로 | 크기 | 내용 |
|---|---|---|---|
| myPlug | assets/objects/my-plug.png | 264 x 264 | 민트색 충전기 플러그. 금속 핀 두 개가 오른쪽을 향하고, 왼쪽 아래로 짧은 선이 나간다 |
| theirPlug | assets/objects/their-plug.png | 264 x 264 | 같은 모양의 벽돌색 플러그 |
| cup | assets/objects/cup.png | 264 x 264 | 뚜껑 있는 종이 커피컵. 가벼워 보이게 |
| book | assets/objects/book.png | 264 x 264 | 책 세 권을 쌓은 더미. 무거워 보이게, 칸을 꽉 채운다 |
| drink-ice | assets/drinks/ice.png | 192 x 192 | 얼음이 든 아이스 아메리카노 컵과 빨대 |
| drink-soda | assets/drinks/soda.png | 192 x 192 | 기포가 보이는 초록빛 소다 컵과 빨대 |
| player | assets/people/player.png | 600 x 900 | 의자에 앉은 대학생, 오른쪽을 본다. 입에 빨대를 물고, 빨대 끝이 그림 오른쪽 가장자리, 위에서 약 45% 높이에 온다 |
| neighbor | assets/people/neighbor.png | 450 x 900 | 헤드폰을 끼고 자기 화면만 보는 옆자리 사람, 왼쪽을 향해 앉아 있다 |

플러그는 핀 끝이 그림 오른쪽 가장자리에 닿아야 멀티탭에 꽂혔을 때 자연스럽다.
인물 그림은 게임이 테이블 앞에 겹쳐 놓으므로, 허리 아래가 테이블에 가려진다고 생각하고 그린다.

멀티탭은 판마다 콘센트 높이가 달라서 코드로 그린다. 지금은 그림 파일로 바꾸지 않는다.

## 이미지 생성 지시문 틀

같은 문장을 앞에 붙여서 모든 그림의 그림체를 맞춘다.

```text
Flat cartoon game asset, thick rounded dark brown outline (#3b2f2a), one-step cel shading,
cream and mint (#7fc8a9) palette with brick red (#e0796b) accents, simple readable silhouette,
centered, transparent background, no ground shadow, no text, single object only.
Subject: <여기에 표의 내용을 영어로>
```
