// 장면에 쓰는 그림. 모두 코드로 그린 SVG라 외부 이미지가 필요 없다.
// 사물 그림은 한 칸(88 x 88) 기준이고, 인물과 멀티탭은 장면 좌표에 맞춘 크기다.
(function (root) {
  'use strict';

  const INK = '#3b2f2a';
  const STROKE = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

  function plug(body, shade) {
    return `
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <rect x="70" y="44" width="16" height="5" rx="2" fill="#c9c4bb" ${STROKE}/>
        <rect x="70" y="58" width="16" height="5" rx="2" fill="#c9c4bb" ${STROKE}/>
        <rect x="22" y="34" width="50" height="40" rx="10" fill="${body}" ${STROKE}/>
        <rect x="28" y="40" width="10" height="28" rx="5" fill="${shade}"/>
        <path d="M22 60 C 10 60, 6 70, 0 74" fill="none" ${STROKE}/>
      </svg>`;
  }

  const objects = {
    myPlug: plug('#7fc8a9', '#a9dcc6'),
    theirPlug: plug('#e0796b', '#eea197'),
    cup: `
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <path d="M24 30 L64 30 L58 84 L30 84 Z" fill="#f3e3c7" ${STROKE}/>
        <rect x="20" y="22" width="48" height="10" rx="4" fill="#fff8ec" ${STROKE}/>
        <path d="M27 50 L61 50 L59 66 L29 66 Z" fill="#c98f5a" stroke="none"/>
        <circle cx="44" cy="58" r="4" fill="#fff8ec"/>
      </svg>`,
    book: `
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <rect x="6" y="58" width="76" height="26" rx="3" fill="#6f8fbf" ${STROKE}/>
        <rect x="12" y="62" width="64" height="5" fill="#fff8ec" stroke="none"/>
        <rect x="2" y="32" width="80" height="26" rx="3" fill="#d9a441" ${STROKE}/>
        <rect x="8" y="36" width="68" height="5" fill="#fff8ec" stroke="none"/>
        <rect x="10" y="6" width="70" height="26" rx="3" fill="#a36a8e" ${STROKE}/>
        <rect x="16" y="10" width="58" height="5" fill="#fff8ec" stroke="none"/>
      </svg>`,
  };

  const bubble = `
    <svg viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="46" r="40" fill="rgba(190, 228, 245, 0.35)" stroke="#7cc3e3" stroke-width="3"/>
      <path d="M22 30 Q 30 18, 44 16" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    </svg>`;

  // 세워 둔 타워형 멀티탭. sockets는 콘센트 구멍이 있는 높이 목록이다.
  function powerStrip(rows, sockets, cell) {
    const height = rows * cell;
    let parts = `<rect x="8" y="2" width="${cell - 16}" height="${height - 4}" rx="14" fill="#f4f1ea" ${STROKE}/>`;
    for (let y = 0; y < rows; y++) {
      const top = height - (y + 1) * cell;
      if (sockets.includes(y)) {
        parts += `
          <rect x="20" y="${top + 16}" width="${cell - 40}" height="${cell - 32}" rx="10" fill="#e4ded2" ${STROKE}/>
          <rect x="34" y="${top + 34}" width="5" height="12" rx="2" fill="${INK}"/>
          <rect x="49" y="${top + 34}" width="5" height="12" rx="2" fill="${INK}"/>`;
      } else {
        parts += `<circle cx="${cell / 2}" cy="${top + cell / 2}" r="5" fill="#d8d1c4"/>`;
      }
    }
    return `<svg viewBox="0 0 ${cell} ${height}" width="${cell}" height="${height}" aria-hidden="true">${parts}</svg>`;
  }

  // 왼쪽에 앉은 나. 빨대 끝은 그림 오른쪽 가장자리(장면 좌표로는 약 205, 318)에 온다.
  const player = `
    <svg viewBox="0 0 200 300" aria-hidden="true">
      <rect x="18" y="120" width="34" height="180" rx="10" fill="#b98756" ${STROKE}/>
      <path d="M40 300 C 40 220, 60 190, 100 186 C 140 190, 158 220, 160 300 Z" fill="#8fbf9f" ${STROKE}/>
      <path d="M100 186 L100 210" ${STROKE}/>
      <path d="M150 238 C 170 236, 180 228, 186 214" fill="none" ${STROKE}/>
      <circle cx="104" cy="120" r="58" fill="#f7d9bf" ${STROKE}/>
      <path d="M48 112 C 40 60, 90 40, 120 52 C 150 40, 172 76, 160 104 C 150 86, 130 80, 112 88
               C 100 70, 70 74, 60 96 Z" fill="#4a3528" ${STROKE}/>
      <path d="M118 112 Q 128 106, 138 112" fill="none" ${STROKE}/>
      <path d="M146 112 Q 154 106, 160 112" fill="none" ${STROKE}/>
      <circle cx="129" cy="122" r="4.5" fill="${INK}"/>
      <circle cx="153" cy="122" r="4.5" fill="${INK}"/>
      <ellipse cx="114" cy="140" rx="9" ry="5" fill="#f2b5a0"/>
      <path d="M144 146 Q 150 150, 156 146" fill="none" ${STROKE}/>
      <path d="M154 148 L200 136" stroke="#e0796b" stroke-width="7" stroke-linecap="round"/>
      <path d="M154 148 L200 136" stroke="#fff8ec" stroke-width="2.5" stroke-dasharray="5 6" stroke-linecap="round"/>
    </svg>`;

  // 오른쪽 옆자리 사람. 헤드폰을 끼고 자기 화면만 본다.
  const neighbor = `
    <svg viewBox="0 0 150 300" aria-hidden="true">
      <path d="M10 300 C 10 230, 36 196, 80 192 C 124 196, 146 230, 146 300 Z" fill="#c4705f" ${STROKE}/>
      <circle cx="78" cy="128" r="54" fill="#efcdb0" ${STROKE}/>
      <path d="M26 120 C 24 70, 70 56, 96 64 C 128 66, 140 96, 132 120 C 120 100, 70 96, 40 120 Z" fill="#2f2a33" ${STROKE}/>
      <path d="M22 128 C 18 70, 138 70, 134 128" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <rect x="10" y="112" width="24" height="40" rx="10" fill="#5d6b8a" ${STROKE}/>
      <rect x="122" y="112" width="24" height="40" rx="10" fill="#5d6b8a" ${STROKE}/>
      <path d="M50 132 L64 132" ${STROKE}/>
      <path d="M86 132 L100 132" ${STROKE}/>
      <path d="M68 156 L84 156" ${STROKE}/>
    </svg>`;

  const drinks = {
    ice: `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 14 L50 14 L46 60 L18 60 Z" fill="#d6ecf5" ${STROKE}/>
        <path d="M16 30 L48 30 L46 58 L18 58 Z" fill="#6b4a33" stroke="none"/>
        <rect x="21" y="22" width="11" height="11" rx="2" transform="rotate(-12 26 27)" fill="#ffffff" ${STROKE}/>
        <rect x="32" y="27" width="11" height="11" rx="2" transform="rotate(10 37 32)" fill="#ffffff" ${STROKE}/>
        <path d="M38 14 L46 2" stroke="#e0796b" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
    soda: `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 14 L50 14 L46 60 L18 60 Z" fill="#e9f6ee" ${STROKE}/>
        <path d="M16 24 L48 24 L46 58 L18 58 Z" fill="#9fd9b8" stroke="none"/>
        <circle cx="26" cy="46" r="4" fill="#ffffff"/>
        <circle cx="37" cy="36" r="3" fill="#ffffff"/>
        <circle cx="34" cy="50" r="2.5" fill="#ffffff"/>
        <path d="M38 14 L46 2" stroke="#e0796b" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
  };

  // 그림 파일이 assets/manifest.js에 등록돼 있으면 그 파일을, 없으면 SVG를 돌려준다.
  function image(name, fallbackSvg) {
    const manifest = root.ASSET_MANIFEST || {};
    const file = manifest[name];
    return file ? `<img src="${file}" alt="" draggable="false">` : fallbackSvg;
  }

  root.Art = { objects, bubble, powerStrip, player, neighbor, drinks, image };
})(window);
