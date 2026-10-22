(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FlashcardOrder = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SESSION_SIZES = ['10', '20', '30', '50', 'all'];

  function normalizeSearchText(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pl-PL')
      .replace(/ł/g, 'l')
      .trim();
  }

  function filterCards(cards, options) {
    const opts = options || {};
    const categories = Array.isArray(opts.categories) ? opts.categories.filter(v => v && v !== 'all') : [];
    const status = opts.status || 'all';
    const source = opts.source || 'all';
    const sourceInfo = typeof opts.sourceInfo === 'function' ? opts.sourceInfo : function () { return null; };
    const q = normalizeSearchText(opts.search || '');
    const tokens = q.split(/\s+/).filter(Boolean);
    return (cards || []).filter(function (card) {
      if (categories.length && !categories.includes(card.category)) return false;
      if (status !== 'all' && card.status !== status) return false;
      if (source !== 'all' && card.source_id !== source) return false;
      if (!q) return true;
      const info = sourceInfo(card.source_id);
      const tags = Array.isArray(card.tags) ? card.tags.join(' ') : String(card.tags || '');
      const searchable = [
        card.question, card.answer, card.example, card.takeaway, card.expanded_answer,
        card.misconception, card.watch, card.interview_focus, card.pedagogy, card.why,
        card.code_explanation, card.stuck_tip, card.category, card.source_deck, card.source_id,
        tags, info && info.title, info && info.desc
      ].join(' ');
      const normalized = normalizeSearchText(searchable);
      return tokens.every(function (token) { return normalized.includes(token); });
    });
  }

  function normalizeSessionSize(value) {
    const raw = String(value == null ? '10' : value).trim();
    if (SESSION_SIZES.includes(raw)) return raw;
    const count = Number(raw);
    if (!Number.isFinite(count)) return '10';
    if (count === 100) return '50';
    if (count >= 200 || count > 50) return 'all';
    if (count >= 40) return '50';
    if (count >= 25) return '30';
    if (count >= 15) return '20';
    return '10';
  }

  function effectiveSessionCount(poolLength, size) {
    const available = Math.max(0, Number(poolLength) || 0);
    if (!available) return 0;
    const normalized = normalizeSessionSize(size);
    if (normalized === 'all') return available;
    return Math.min(available, Math.max(1, Number(normalized) || 10));
  }

  function buildStudyQueue(pool, review, now, sessionSize) {
    const source = Array.isArray(pool) ? pool : [];
    const schedule = review || {};
    const moment = Number(now) || 0;
    const due = source
      .filter(function (card) { return schedule[card.id] && (!schedule[card.id].due || schedule[card.id].due <= moment); })
      .sort(function (a, b) { return (schedule[a.id] && schedule[a.id].due || 0) - (schedule[b.id] && schedule[b.id].due || 0); });
    const fresh = source.filter(function (card) { return !schedule[card.id] && card.status !== 'known'; });
    const fallback = source.filter(function (card) { return !due.includes(card) && !fresh.includes(card); });
    const candidates = due.concat(fresh, fallback);
    const buckets = new Map();
    candidates.forEach(function (card, index) {
      const key = card.category || 'Inne';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push({ c: card, i: index });
    });
    const ordered = [];
    let lastCategory = '';
    while (ordered.length < candidates.length) {
      let choices = [...buckets.entries()].filter(function (entry) { return entry[1].length && entry[0] !== lastCategory; });
      if (!choices.length) choices = [...buckets.entries()].filter(function (entry) { return entry[1].length; });
      choices.sort(function (a, b) { return a[1][0].i - b[1][0].i; });
      const chosen = choices[0];
      if (!chosen) break;
      ordered.push(chosen[1].shift().c);
      lastCategory = chosen[0];
    }
    return ordered.slice(0, effectiveSessionCount(ordered.length, sessionSize));
  }

  return {
    SESSION_SIZES: SESSION_SIZES,
    normalizeSearchText: normalizeSearchText,
    filterCards: filterCards,
    normalizeSessionSize: normalizeSessionSize,
    effectiveSessionCount: effectiveSessionCount,
    buildStudyQueue: buildStudyQueue
  };
});
