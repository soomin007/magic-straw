// 콘센트 빌런 도감의 그림 등록. 테마(a: 흑백과 빨강, 초록 / b: 굵은 선 카툰)마다 같은 key로 그림을 등록한다.
// 게임은 고른 테마의 그림을 쓰고, 등록되지 않은 그림은 회색 상자로 대신한다. 그림 목록과 크기는 docs/concept-villains.md의 "첫 판 그림 의뢰" 절에 있다.
// Codex가 그림을 저장하면 그 테마에 한 줄씩 적는다. 예: 'bg-sleeper': 'assets/villain/a/bg-sleeper.png',
window.VILLAIN_ASSETS = {
  a: {
    'bg-sleeper': 'assets/villain/a/bg-sleeper.png',
    'player-down': 'assets/villain/a/player-down.png',
    'player-up': 'assets/villain/a/player-up.png',
    'player-left': 'assets/villain/a/player-left.png',
    'player-right': 'assets/villain/a/player-right.png',
    'villain-sleep': 'assets/villain/a/villain-sleep.png',
    'buzzer': 'assets/villain/a/buzzer.png',
    'outlet-theirs': 'assets/villain/a/outlet-theirs.png',
    'villain-wake': 'assets/villain/a/villain-wake.png',
    'villain-portrait': 'assets/villain/a/villain-portrait.png',
    'chair': 'assets/villain/a/chair.png',
    'outlet-mine': 'assets/villain/a/outlet-mine.png',
  },
  b: {
    'bg-sleeper': 'assets/villain/b/bg-sleeper.png',
    'player-down': 'assets/villain/b/player-down.png',
    'villain-sleep': 'assets/villain/b/villain-sleep.png',
    'villain-wake': 'assets/villain/b/villain-wake.png',
    'villain-portrait': 'assets/villain/b/villain-portrait.png',
    'buzzer': 'assets/villain/b/buzzer.png',
    'chair': 'assets/villain/b/chair.png',
    'outlet-theirs': 'assets/villain/b/outlet-theirs.png',
    'player-up': 'assets/villain/b/player-up.png',
    'player-left': 'assets/villain/b/player-left.png',
    'player-right': 'assets/villain/b/player-right.png',
    'outlet-mine': 'assets/villain/b/outlet-mine.png',
  },
};
