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
