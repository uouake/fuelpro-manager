import test from 'node:test';
import assert from 'node:assert/strict';

import { canAdjustStock } from '../src/lib/permissions.js';

test('les admins peuvent ajuster le stock', () => {
  assert.equal(canAdjustStock({ role: 'admin' }), true);
});

test('les gérants peuvent ajuster le stock de leur station', () => {
  assert.equal(canAdjustStock({ role: 'gérant' }), true);
});

test('les vendeurs ne peuvent pas ajuster le stock', () => {
  assert.equal(canAdjustStock({ role: 'vendeur' }), false);
});
