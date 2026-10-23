const test = require('node:test');
const assert = require('node:assert/strict');
const order = require('./flashcard-order.js');

function card(id, category, status) {
  return { id: id, category: category, status: status || 'review', question: id + ' question', answer: id + ' answer' };
}

test('search text folds Polish diacritics', function () {
  assert.equal(order.normalizeSearchText('  Żółć Łódź  '), 'zolc lodz');
  assert.equal(order.normalizeSearchText('ĄĘ'), 'ae');
});

test('filters combine category, status, source and every search token', function () {
  const cards = [
    Object.assign(card('a', 'React', 'review'), { source_id: 'mdn', question: 'Closure w React' }),
    Object.assign(card('b', 'React', 'known'), { source_id: 'mdn', question: 'Closure cache' }),
    Object.assign(card('c', 'CSS', 'review'), { source_id: 'mdn', question: 'Closure grid' }),
    Object.assign(card('d', 'React', 'review'), { source_id: 'rfc', question: 'Closure render' })
  ];
  const found = order.filterCards(cards, {
    search: 'clósure',
    categories: ['React'],
    status: 'review',
    source: 'mdn',
    sourceInfo: function () { return { title: 'MDN', desc: 'docs' }; }
  });
  assert.deepEqual(found.map(function (item) { return item.id; }), ['a']);
});

test('empty search keeps the category boundary', function () {
  const cards = [card('a', 'React'), card('b', 'CSS')];
  const found = order.filterCards(cards, { search: '   ', categories: ['CSS'], status: 'all', source: 'all' });
  assert.deepEqual(found.map(function (item) { return item.id; }), ['b']);
});

test('legacy session sizes snap to the visible choices', function () {
  assert.equal(order.normalizeSessionSize('10'), '10');
  assert.equal(order.normalizeSessionSize('30'), '30');
  assert.equal(order.normalizeSessionSize('all'), 'all');
  assert.equal(order.normalizeSessionSize('5'), '10');
  assert.equal(order.normalizeSessionSize(15), '20');
  assert.equal(order.normalizeSessionSize(25), '30');
  assert.equal(order.normalizeSessionSize(40), '50');
  assert.equal(order.normalizeSessionSize('100'), '50');
  assert.equal(order.normalizeSessionSize('200'), 'all');
  assert.equal(order.normalizeSessionSize(80), 'all');
  assert.equal(order.normalizeSessionSize('nope'), '10');
  assert.equal(order.normalizeSessionSize(undefined), '10');
});

test('a smaller set than the chosen size uses the whole set', function () {
  assert.equal(order.effectiveSessionCount(0, '50'), 0);
  assert.equal(order.effectiveSessionCount(3, '50'), 3);
  assert.equal(order.effectiveSessionCount(3, 'all'), 3);
  assert.equal(order.effectiveSessionCount(80, '20'), 20);
  assert.equal(order.effectiveSessionCount(80, '100'), 50);
});

test('study queue is due, then fresh, then fallback, interleaved by category', function () {
  const pool = [
    card('A1', 'A'),
    card('A2', 'A'),
    card('B1', 'B'),
    card('C1', 'C', 'known'),
    card('D1', 'D', 'known')
  ];
  const review = {
    A1: { due: 100 },
    A2: { due: 200 },
    D1: { due: 50 }
  };
  const queue = order.buildStudyQueue(pool, review, 150, 'all');
  assert.deepEqual(queue.map(function (item) { return item.id; }), ['D1', 'A1', 'B1', 'A2', 'C1']);
  const ids = queue.map(function (item) { return item.id; });
  assert.equal(new Set(ids).size, ids.length);
});

test('future reviews stay out of due and known cards without a review are fallback', function () {
  const pool = [card('soon', 'A', 'review'), card('known', 'B', 'known'), card('fresh', 'C', 'unknown')];
  const queue = order.buildStudyQueue(pool, { soon: { due: 999 } }, 10, 'all');
  assert.deepEqual(queue.map(function (item) { return item.id; }), ['fresh', 'soon', 'known']);
});

test('session size caps the queue and never invents cards', function () {
  const pool = [card('only', 'A')];
  assert.deepEqual(order.buildStudyQueue(pool, {}, 0, '50').map(function (item) { return item.id; }), ['only']);
  assert.deepEqual(order.buildStudyQueue([], {}, 0, '10'), []);
  const many = [];
  for (let i = 0; i < 12; i++) many.push(card('c' + i, i % 2 ? 'B' : 'A'));
  assert.equal(order.buildStudyQueue(many, {}, 0, '10').length, 10);
  assert.equal(order.buildStudyQueue(many, {}, 0, 'all').length, 12);
});

test('category topics group granular categories under their leading topic', function () {
  assert.equal(order.categoryTopic('JS BUG • REGEXP'), 'JS BUG');
  assert.equal(order.categoryTopic('CASE STUDY / Microfrontends'), 'CASE STUDY');
  assert.equal(order.categoryTopic('GraphQL — batching'), 'GRAPHQL');
  assert.equal(order.categoryTopic('04 • CSS STANDARD 2026'), 'CSS STANDARD 2026');
  assert.equal(order.categoryTopic('Next.js 16'), 'NEXT.JS 16');
  assert.equal(order.categoryTopic(''), 'INNE');
});

test('filtering by a topic includes every category under it', function () {
  const cards = [card('a', 'JS BUG • REGEXP'), card('b', 'JS BUG • JSON'), card('c', 'CSS')];
  const found = order.filterCards(cards, { categories: ['JS BUG'] });
  assert.deepEqual(found.map(function (item) { return item.id; }), ['a', 'b']);
});

test('schedule: again comes back in 10 minutes and counts a lapse', function () {
  const next = order.scheduleReview({ reps: 3, interval: 10, lapses: 1, ease: 2.5 }, 'again', 0, 1000);
  assert.equal(next.due, 1000 + 10 * 60 * 1000);
  assert.equal(next.reps, 0);
  assert.equal(next.lapses, 2);
  assert.ok(next.ease < 2.5);
});

test('schedule: first good is one day, then three, then grows with ease', function () {
  const day = 86400000;
  const first = order.scheduleReview(null, 'good', 0, 0);
  assert.equal(first.due, day);
  const second = order.scheduleReview(first, 'good', 0, 0);
  assert.equal(second.due, 3 * day);
  const third = order.scheduleReview(second, 'good', 0, 0);
  assert.ok(third.interval > 3);
  assert.ok(order.scheduleReview(null, 'easy', 0, 0).due > first.due);
});

test('schedule: confident but wrong is flagged and kept short', function () {
  const next = order.scheduleReview({ reps: 4, interval: 20, ease: 2.5 }, 'partial', 3, 0);
  assert.equal(next.calibration, 'overconfident');
  assert.equal(next.interval, 0.25);
});

test('interval labels are short and human readable', function () {
  assert.equal(order.formatInterval(10 * 60 * 1000), '10 min');
  assert.equal(order.formatInterval(12 * 3600 * 1000), '12 h');
  assert.equal(order.formatInterval(3 * 86400000), '3 d');
  assert.equal(order.formatInterval(21 * 86400000), '3 tyg.');
  assert.equal(order.formatInterval(90 * 86400000), '3 mies.');
});
