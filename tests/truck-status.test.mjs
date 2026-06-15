import test from 'node:test';
import assert from 'node:assert/strict';

function isTruckStatusEditable(truck, deliveries) {
  return !deliveries.some((d) => d.truckId === truck.id && d.status === 'en cours');
}

test('camion disponible peut changer de statut', () => {
  const truck = { id: 1, status: 'disponible' };
  const deliveries = [{ truckId: 1, status: 'terminée' }];
  assert.equal(isTruckStatusEditable(truck, deliveries), true);
});

test('camion en livraison ne peut pas changer de statut manuellement', () => {
  const truck = { id: 2, status: 'en livraison' };
  const deliveries = [{ truckId: 2, status: 'en cours' }];
  assert.equal(isTruckStatusEditable(truck, deliveries), false);
});

test('camion avec plusieurs livraisons mais aucune en cours peut changer de statut', () => {
  const truck = { id: 3, status: 'disponible' };
  const deliveries = [
    { truckId: 3, status: 'terminée' },
    { truckId: 3, status: 'annulée' },
  ];
  assert.equal(isTruckStatusEditable(truck, deliveries), true);
});
