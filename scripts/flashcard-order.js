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

  // Card categories are very granular ("JS BUG • REGEXP", "CASE STUDY / Database"), so the
  // filter groups them by their leading topic to keep the picker short and the counts meaningful.
  function categoryTopic(category) {
    const raw = String(category ?? '').replace(/^\s*\d+\s*•\s*/, '').trim();
    const head = raw.split(/\s*[•/—–]\s*|\s+-\s+|:\s+/)[0].trim();
    return (head || raw || 'Inne').toLocaleUpperCase('pl-PL');
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
      if (categories.length && !categories.includes(card.category) && !categories.includes(categoryTopic(card.category))) return false;
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

  // SM-2-inspired heuristic shared by grading and the interval preview on the grade buttons.
  // It is intentionally simple and not a claim of a validated SM-2 implementation.
  function scheduleReview(previous, grade, confidence, now) {
    const prev = previous || {};
    let reps = Number(prev.reps) || 0;
    let lapses = Number(prev.lapses) || 0;
    let ease = Math.max(1.3, Number(prev.ease) || 2.5);
    const quality = { again: 1, partial: 2, good: 4, easy: 5 }[grade] ?? 2;
    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    let intervalDays;
    if (grade === 'again') { intervalDays = 0; reps = 0; lapses++; }
    else if (grade === 'partial') { intervalDays = 0.5; }
    else if (grade === 'good') { intervalDays = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(3, (Number(prev.interval) || 3) * ease); reps++; }
    else { intervalDays = reps === 0 ? 2 : reps === 1 ? 5 : Math.max(5, (Number(prev.interval) || 5) * (ease + 0.3)); reps++; }
    // High confidence + weak recall is a stronger warning than either signal alone.
    let calibration = 'neutral';
    if (confidence === 3 && (grade === 'again' || grade === 'partial')) { calibration = 'overconfident'; intervalDays = grade === 'again' ? 0 : Math.min(intervalDays, 0.25); }
    else if (confidence === 1 && (grade === 'good' || grade === 'easy')) { calibration = 'underconfident'; intervalDays = Math.min(intervalDays, grade === 'easy' ? 3 : 2); }
    else if (confidence === 2 && (grade === 'again' || grade === 'partial')) { calibration = 'uncertain'; intervalDays = Math.min(intervalDays, grade === 'again' ? 0 : 0.5); }
    const moment = Number(now) || 0;
    const due = grade === 'again' ? moment + 10 * 60 * 1000 : moment + Math.max(0.25, intervalDays) * 86400000;
    return { reps: reps, interval: intervalDays, ease: ease, lapses: lapses, due: due, calibration: calibration };
  }

  function formatInterval(ms) {
    const minutes = Math.max(1, Math.round((Number(ms) || 0) / 60000));
    if (minutes < 60) return minutes + ' min';
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + ' h';
    const days = Math.round(hours / 24);
    if (days < 14) return days + ' d';
    if (days < 60) return Math.round(days / 7) + ' tyg.';
    return Math.round(days / 30) + ' mies.';
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
    categoryTopic: categoryTopic,
    scheduleReview: scheduleReview,
    formatInterval: formatInterval,
    filterCards: filterCards,
    normalizeSessionSize: normalizeSessionSize,
    effectiveSessionCount: effectiveSessionCount,
    buildStudyQueue: buildStudyQueue
  };
});
