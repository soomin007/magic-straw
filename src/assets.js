// 그림 찾기. assets/manifest.js에 그림이 등록돼 있으면 그 그림을, 없으면 이름이 적힌 회색 상자를 돌려준다.
// 그림 이름(key)과 크기는 assets/asset-list.js가 기준이다.
(function (root) {
  'use strict';

  // 회색 상자에 적을 짧은 이름과 색 계열. mine은 민트(정령의 것), theirs는 벽돌색(마을 사람들의 것), spirit은 물빛, 나머지는 회색이다.
  // key는 카페 때 이름 그대로이고, 물의 정령 세계와의 대응은 assets/asset-list.js 머리말에 있다.
  const PLACEHOLDERS = {
    'piece-top-my-plug': { label: '물길 돌', tone: 'mine' },
    'piece-top-their-plug': { label: '펌프 관', tone: 'theirs' },
    'piece-top-cup': { label: '양동이', tone: 'light' },
    'piece-top-book': { label: '바위', tone: 'heavy' },
    'piece-top-menu': { label: '석판', tone: 'menu' },
    'piece-side-my-plug': { label: '물길 돌', tone: 'mine' },
    'piece-side-their-plug': { label: '펌프 관', tone: 'theirs' },
    'piece-side-cup': { label: '양동이', tone: 'light' },
    'piece-side-book': { label: '바위', tone: 'heavy' },
    'piece-side-menu': { label: '석판', tone: 'heavy' },
    'outlet-top-free': { label: '', tone: 'socket' },
    'outlet-top-taken': { label: '', tone: 'taken' },
    'outlet-side-free': { label: '', tone: 'socket' },
    'outlet-side-taken': { label: '', tone: 'taken' },
    'outlet-side-cap': { label: '', tone: 'partition-cap' },
    'portrait-me': { label: '정령', tone: 'mine', round: true },
    'portrait-me-determined': { label: '정령', tone: 'mine', round: true },
    'portrait-neighbor': { label: '샘지기', tone: 'theirs', round: true },
    'portrait-neighbor-caught': { label: '샘지기', tone: 'theirs', round: true },
    'ui-drink-ice': { label: '얼음', tone: 'light' },
    'ui-drink-soda': { label: '거품', tone: 'light' },
    'ui-drink-tea': { label: '안개', tone: 'light' },
    'ui-spirit': { label: '', tone: 'spirit', round: true },
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
