// 그림 찾기. assets/manifest.js에 그림이 등록돼 있으면 그 그림을, 없으면 이름이 적힌 회색 상자를 돌려준다.
// 그림 이름(key)과 크기는 assets/asset-list.js가 기준이다.
(function (root) {
  'use strict';

  // 회색 상자에 적을 짧은 이름과 색 계열. mine은 민트, theirs는 벽돌색, 나머지는 회색이다.
  const PLACEHOLDERS = {
    'top-my-plug': { label: '내 플러그', tone: 'mine' },
    'top-their-plug': { label: '상대 플러그', tone: 'theirs' },
    'top-cup': { label: '컵', tone: 'light' },
    'top-book': { label: '책 더미', tone: 'heavy' },
    'top-menu': { label: '메뉴판', tone: 'menu' },
    'top-strip-socket': { label: '콘센트', tone: 'strip' },
    'top-strip-plain': { label: '', tone: 'strip' },
    'top-table': { label: '', tone: 'table' },
    'top-me': { label: '나', tone: 'mine', round: true },
    'top-neighbor': { label: '옆자리 사람', tone: 'theirs', round: true },
    'top-my-laptop': { label: '내 랩탑', tone: 'mine' },
    'top-their-laptop': { label: '상대 랩탑', tone: 'theirs' },
    'side-my-plug': { label: '내 플러그', tone: 'mine' },
    'side-their-plug': { label: '상대 플러그', tone: 'theirs' },
    'side-cup': { label: '컵', tone: 'light' },
    'side-book': { label: '책 더미', tone: 'heavy' },
    'side-menu': { label: '메뉴판', tone: 'heavy' },
    'side-strip-socket': { label: '콘센트', tone: 'strip' },
    'side-strip-plain': { label: '', tone: 'strip' },
    'side-table-edge': { label: '테이블', tone: 'table' },
    'side-me': { label: '숙인 나', tone: 'mine', round: true },
    'side-neighbor': { label: '옆자리 사람', tone: 'theirs', round: true },
    'ui-drink-ice': { label: '얼음', tone: 'light' },
    'ui-drink-soda': { label: '소다', tone: 'light' },
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
  }

  function file(key) {
    const manifest = root.ASSET_MANIFEST || {};
    return manifest[key] || null;
  }

  // label을 주면 기본 이름 대신 그 글을 회색 상자에 적는다 (프롤로그 장면 설명 등).
  function html(key, label) {
    const path = file(key);
    if (path) return `<img class="asset" src="${path}" alt="" draggable="false">`;
    const placeholder = PLACEHOLDERS[key] || { label: key, tone: 'plain' };
    const text = label !== undefined ? label : placeholder.label;
    const round = placeholder.round ? ' gbox-round' : '';
    return `<div class="gbox gbox-${placeholder.tone}${round}"><span>${escapeHtml(text)}</span></div>`;
  }

  root.Assets = { html, file };
})(window);
