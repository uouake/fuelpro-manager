import test from 'node:test';
import assert from 'node:assert/strict';

import { authenticatePin } from '../src/lib/auth.js';

const demoUsers = [
  { id: '1', name: 'Admin Système', role: 'admin', pin: '0000' },
  { id: '2', name: 'Kouamé Jean', role: 'gérant', pin: '1234' },
  { id: '3', name: 'Traoré Fatou', role: 'vendeur', pin: '2222' },
];

test('les 3 logins démo restent fonctionnels', () => {
  assert.equal(authenticatePin(demoUsers, 'admin', '0000')?.name, 'Admin Système');
  assert.equal(authenticatePin(demoUsers, 'gérant', '1234')?.name, 'Kouamé Jean');
  assert.equal(authenticatePin(demoUsers, 'vendeur', '2222')?.name, 'Traoré Fatou');
});

test('le login refuse un PIN valide sur le mauvais rôle', () => {
  assert.equal(authenticatePin(demoUsers, 'vendeur', '0000'), null);
});

test('le login accepte aussi pin_hash pour compatibilité Supabase', () => {
  const usersFromSupabase = [
    { id: '2', name: 'Kouamé Jean', role: 'gérant', pin_hash: '1234' },
  ];

  assert.equal(authenticatePin(usersFromSupabase, 'gérant', '1234')?.name, 'Kouamé Jean');
});
