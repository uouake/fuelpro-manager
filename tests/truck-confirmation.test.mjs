import test from 'node:test';
import assert from 'node:assert/strict';

import { confirmTruckDeletion } from '../src/lib/confirmations.js';

test('la suppression camion demande une confirmation avec la plaque', () => {
  const messages = [];
  const confirmed = confirmTruckDeletion({ plate: 'AB-1234-CI' }, (message) => {
    messages.push(message);
    return true;
  });

  assert.equal(confirmed, true);
  assert.deepEqual(messages, ['Supprimer le camion AB-1234-CI ? Cette action est définitive.']);
});

test('la suppression camion est annulée si le pop-up est refusé', () => {
  const confirmed = confirmTruckDeletion({ plate: 'AB-1234-CI' }, () => false);

  assert.equal(confirmed, false);
});
