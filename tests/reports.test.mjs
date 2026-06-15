import test from 'node:test';
import assert from 'node:assert/strict';
import { computeRangeDates, filterSalesByRange, groupSalesByDate } from '../src/lib/reports.js';

test('filtre 24h ne garde que les ventes récentes', () => {
  const now = new Date('2026-06-15T12:00:00');
  const sales = [
    { id: 1, date: '2026-06-15', time: '08:00', volume: 10, amount: 100 },
    { id: 2, date: '2026-06-14', time: '11:59', volume: 20, amount: 200 },
    { id: 3, date: '2026-06-15', time: '10:30', volume: 30, amount: 300 },
  ];
  const result = filterSalesByRange(sales, '24h', '', '', now);
  assert.deepEqual(result.map((s) => s.id), [1, 3]);
});

test('filtre 7 jours exclut les ventes trop anciennes', () => {
  const now = new Date('2026-06-15T12:00:00');
  const sales = [
    { id: 1, date: '2026-06-14', volume: 10, amount: 100 },
    { id: 2, date: '2026-06-08', volume: 20, amount: 200 },
    { id: 3, date: '2026-06-07', volume: 30, amount: 300 },
  ];
  const result = filterSalesByRange(sales, '7d', '', '', now);
  assert.deepEqual(result.map((s) => s.id), [1, 2]);
});

test('filtre personnalisé par dates inclusives', () => {
  const sales = [
    { id: 1, date: '2026-06-10', volume: 10, amount: 100 },
    { id: 2, date: '2026-06-12', volume: 20, amount: 200 },
    { id: 3, date: '2026-06-15', volume: 30, amount: 300 },
  ];
  const result = filterSalesByRange(sales, 'custom', '2026-06-12', '2026-06-15');
  assert.deepEqual(result.map((s) => s.id), [2, 3]);
});

test('groupe les ventes par date', () => {
  const sales = [
    { id: 1, date: '2026-06-15', volume: 10, amount: 100 },
    { id: 2, date: '2026-06-15', volume: 20, amount: 200 },
    { id: 3, date: '2026-06-14', volume: 30, amount: 300 },
  ];
  const result = groupSalesByDate(sales);
  assert.equal(result.length, 2);
  assert.deepEqual(result[0], { date: '2026-06-15', count: 2, volume: 30, amount: 300 });
  assert.deepEqual(result[1], { date: '2026-06-14', count: 1, volume: 30, amount: 300 });
});

test('calcule les dates des presets', () => {
  const now = new Date('2026-06-15T12:00:00');
  assert.deepEqual(computeRangeDates('24h', now), { startDate: '2026-06-14', endDate: '2026-06-15' });
  assert.deepEqual(computeRangeDates('7d', now), { startDate: '2026-06-08', endDate: '2026-06-15' });
  assert.deepEqual(computeRangeDates('30d', now), { startDate: '2026-05-16', endDate: '2026-06-15' });
  assert.deepEqual(computeRangeDates('all', now), { startDate: '', endDate: '' });
});
