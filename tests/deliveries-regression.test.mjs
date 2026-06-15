import test from 'node:test';
import assert from 'node:assert/strict';

import { planDeliveryWithClient } from '../src/lib/db.js';

function createSupabaseSpy() {
  const calls = [];
  const client = {
    from(table) {
      const query = {
        insert(payload) {
          calls.push({ table, action: 'insert', payload });
          return {
            select() {
              return {
                single: async () => ({ data: { id: 42, ...payload }, error: null }),
              };
            },
          };
        },
        update(payload) {
          calls.push({ table, action: 'update', payload });
          return {
            eq(column, value) {
              calls[calls.length - 1].eq = { column, value };
              return Promise.resolve({ error: null });
            },
          };
        },
      };
      return query;
    },
  };

  return { client, calls };
}

test('planifier une livraison passe automatiquement le camion en livraison', async () => {
  const { client, calls } = createSupabaseSpy();

  await planDeliveryWithClient(client, {
    truckId: 7,
    stationId: 3,
    volume: 12000,
    date: '2026-06-15',
  });

  assert.deepEqual(calls, [
    {
      table: 'deliveries',
      action: 'insert',
      payload: {
        truck_id: 7,
        station_id: 3,
        volume_liters: 12000,
        planned_date: '2026-06-15',
        status: 'en cours',
      },
    },
    {
      table: 'trucks',
      action: 'update',
      payload: { status: 'en livraison' },
      eq: { column: 'id', value: 7 },
    },
  ]);
});
