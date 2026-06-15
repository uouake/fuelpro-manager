import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getPersonnelDeletionConfirmation, getTruckDeletionConfirmation } from '../src/lib/confirmations.js';

test('la suppression camion prépare le contenu de la modale avec la plaque', () => {
  assert.deepEqual(getTruckDeletionConfirmation({ plate: 'AB-1234-CI' }), {
    title: 'Supprimer le camion ?',
    message: 'Confirmez la suppression définitive du camion AB-1234-CI.',
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
  });
});

test('la suppression personnel prépare le contenu de la modale avec le nom', () => {
  assert.deepEqual(getPersonnelDeletionConfirmation({ name: 'Kouamé Jean' }), {
    title: 'Supprimer le membre du personnel ?',
    message: 'Confirmez la suppression définitive de Kouamé Jean.',
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
  });
});

test('les suppressions sensibles n’utilisent pas de pop-up navigateur native', () => {
  const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const confirmationSource = readFileSync(new URL('../src/lib/confirmations.js', import.meta.url), 'utf8');

  assert.equal(appSource.includes('window.confirm'), false);
  assert.equal(confirmationSource.includes('window.confirm'), false);
  assert.equal(appSource.includes('confirmTruckDeletion('), false);
});
