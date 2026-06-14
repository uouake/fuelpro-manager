import { supabase } from './supabase'

const DEMO_DB = {
  stations: [
    { id: 1, name: 'Station Plateau', city: 'Abidjan', address: 'Rue du Commerce, Plateau', lat: 5.3203, lng: -4.0185, pricePerLiter: 750, stock: 12000, capacity: 30000 },
    { id: 2, name: 'Station Cocody', city: 'Abidjan', address: 'Av. Christiani, Cocody', lat: 5.3467, lng: -3.9870, pricePerLiter: 745, stock: 8000, capacity: 25000 },
    { id: 3, name: 'Station Yopougon', city: 'Abidjan', address: 'Bd de Marseille, Yopougon', lat: 5.3274, lng: -4.0742, pricePerLiter: 740, stock: 5000, capacity: 20000 },
  ],
  users: [
    { id: 1, name: 'Admin Système', pin: '0000', role: 'admin', stationId: null },
    { id: 2, name: 'Kouamé Jean', pin: '1234', role: 'gérant', stationId: 1 },
    { id: 3, name: 'Traoré Fatou', pin: '2222', role: 'vendeur', stationId: 1 },
  ],
  trucks: [
    { id: 1, plate: 'AB-1234-CI', capacity: 15000, driver: 'Koné Mamadou', status: 'disponible', stationId: 1 },
    { id: 2, plate: 'CD-5678-CI', capacity: 20000, driver: 'Ouédraogo Issouf', status: 'en livraison', stationId: 1 },
    { id: 3, plate: 'EF-9012-CI', capacity: 10000, driver: 'Touré Sékou', status: 'disponible', stationId: 2 },
  ],
  deliveries: [],
  sales: [],
}

function normalizeDb({ stations, users, trucks, deliveries, sales }) {
  return {
    stations: (stations || []).map(s => ({
      id: s.id,
      name: s.name,
      city: s.city,
      address: s.address,
      lat: parseFloat(s.latitude),
      lng: parseFloat(s.longitude),
      pricePerLiter: parseFloat(s.price_per_liter),
      stock: parseFloat(s.stock_liters),
      capacity: parseFloat(s.capacity_liters),
    })),
    users: (users || []).map(u => ({
      id: u.id,
      name: u.name,
      pin: u.pin ?? u.pin_hash,
      role: u.role,
      stationId: u.station_id,
    })),
    trucks: (trucks || []).map(t => ({
      id: t.id,
      plate: t.plate,
      capacity: parseFloat(t.capacity_liters),
      driver: t.driver_name,
      status: t.status,
      stationId: t.station_id,
    })),
    deliveries: (deliveries || []).map(d => ({
      id: d.id,
      truckId: d.truck_id,
      stationId: d.station_id,
      volume: parseFloat(d.volume_liters),
      date: d.planned_date,
      status: d.status,
      confirmedBy: d.confirmed_by,
    })),
    sales: (sales || []).map(s => ({
      id: s.id,
      stationId: s.station_id,
      vendorId: s.vendor_id,
      volume: parseFloat(s.volume_liters),
      amount: parseFloat(s.total_amount),
      date: s.sale_date,
      time: s.sale_time,
      method: s.payment_method,
    })),
  }
}

function withDemoFallback(data) {
  return data.users.length ? data : DEMO_DB
}

// ─── LOAD ALL DATA ────────────────────────────────────────────────────────────
export async function loadDb() {
  try {
    if (!supabase) throw new Error('Configuration Supabase absente')

    const [stationsRes, usersRes, trucksRes, deliveriesRes, salesRes] = await Promise.all([
      supabase.from('stations').select('*').order('id'),
      supabase.from('users').select('*').order('id'),
      supabase.from('trucks').select('*').order('id'),
      supabase.from('deliveries').select('*').order('id'),
      supabase.from('sales').select('*').order('id'),
    ])

    const firstError = [stationsRes, usersRes, trucksRes, deliveriesRes, salesRes].find(res => res.error)?.error
    if (firstError) throw firstError

    // Normaliser les noms de colonnes snake_case → camelCase pour compatibilité avec le code existant
    return withDemoFallback(normalizeDb({
      stations: stationsRes.data,
      users: usersRes.data,
      trucks: trucksRes.data,
      deliveries: deliveriesRes.data,
      sales: salesRes.data,
    }))
  } catch (error) {
    console.warn('FuelPro: base distante indisponible, utilisation des données démo.', error)
    return DEMO_DB
  }
}

// ─── STATIONS ─────────────────────────────────────────────────────────────────
export async function updateStation(id, patch) {
  const row = {}
  if (patch.name !== undefined)          row.name = patch.name
  if (patch.city !== undefined)          row.city = patch.city
  if (patch.address !== undefined)       row.address = patch.address
  if (patch.lat !== undefined)           row.latitude = patch.lat
  if (patch.lng !== undefined)           row.longitude = patch.lng
  if (patch.pricePerLiter !== undefined) row.price_per_liter = patch.pricePerLiter
  if (patch.stock !== undefined)         row.stock_liters = patch.stock
  if (patch.capacity !== undefined)      row.capacity_liters = patch.capacity
  row.updated_at = new Date().toISOString()
  await supabase.from('stations').update(row).eq('id', id)
}

export async function insertStation(data) {
  const { data: row } = await supabase.from('stations').insert({
    name: data.name, city: data.city, address: data.address,
    latitude: data.lat, longitude: data.lng,
    price_per_liter: data.pricePerLiter,
    stock_liters: data.stock || 0,
    capacity_liters: data.capacity,
  }).select().single()
  return row
}

export async function deleteStation(id) {
  await supabase.from('stations').delete().eq('id', id)
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export async function insertUser(data) {
  const { data: row } = await supabase.from('users').insert({
    name: data.name, pin: data.pin, role: data.role,
    station_id: data.stationId || null,
  }).select().single()
  return row
}

export async function updateUser(id, patch) {
  const row = {}
  if (patch.name !== undefined)      row.name = patch.name
  if (patch.pin !== undefined)       row.pin = patch.pin
  if (patch.role !== undefined)      row.role = patch.role
  if (patch.stationId !== undefined) row.station_id = patch.stationId || null
  await supabase.from('users').update(row).eq('id', id)
}

export async function deleteUser(id) {
  await supabase.from('users').delete().eq('id', id)
}

// ─── TRUCKS ───────────────────────────────────────────────────────────────────
export async function insertTruck(data) {
  const { data: row } = await supabase.from('trucks').insert({
    plate: data.plate, capacity_liters: data.capacity,
    driver_name: data.driver, status: data.status || 'disponible',
    station_id: data.stationId || null,
  }).select().single()
  return row
}

export async function updateTruck(id, patch) {
  const row = {}
  if (patch.plate !== undefined)     row.plate = patch.plate
  if (patch.capacity !== undefined)  row.capacity_liters = patch.capacity
  if (patch.driver !== undefined)    row.driver_name = patch.driver
  if (patch.status !== undefined)    row.status = patch.status
  if (patch.stationId !== undefined) row.station_id = patch.stationId || null
  await supabase.from('trucks').update(row).eq('id', id)
}

export async function deleteTruck(id) {
  await supabase.from('trucks').delete().eq('id', id)
}

// ─── DELIVERIES ───────────────────────────────────────────────────────────────
export async function insertDelivery(data) {
  const { data: row } = await supabase.from('deliveries').insert({
    truck_id: data.truckId, station_id: data.stationId,
    volume_liters: data.volume, planned_date: data.date,
    status: 'en cours',
  }).select().single()
  return row
}

export async function updateDelivery(id, patch) {
  const row = {}
  if (patch.status !== undefined)      row.status = patch.status
  if (patch.confirmedBy !== undefined) row.confirmed_by = patch.confirmedBy
  if (patch.confirmedAt !== undefined) row.confirmed_at = patch.confirmedAt
  await supabase.from('deliveries').update(row).eq('id', id)
}

// ─── SALES ────────────────────────────────────────────────────────────────────
export async function insertSale(data) {
  const { data: row } = await supabase.from('sales').insert({
    station_id: data.stationId, vendor_id: data.vendorId,
    volume_liters: data.volume, price_per_liter: data.pricePerLiter,
    total_amount: data.amount, payment_method: data.paymentMethod || 'espèces',
    sale_date: data.date, sale_time: data.time,
  }).select().single()
  return row
}

// ─── STOCK ADJUSTMENTS ────────────────────────────────────────────────────────
export async function insertStockAdjustment({ stationId, adminId, oldStock, newStock, reason }) {
  await supabase.from('stock_adjustments').insert({
    station_id: stationId,
    admin_id: adminId,
    old_stock: oldStock,
    new_stock: newStock,
    reason: reason || null,
  });
}

export async function loadStockAdjustments(stationId = null) {
  let q = supabase
    .from('stock_adjustments')
    .select('*, stations(name), users(name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (stationId) q = q.eq('station_id', stationId);
  const { data } = await q;
  return (data || []).map(r => ({
    id: r.id,
    stationName: r.stations?.name,
    adminName: r.users?.name,
    oldStock: parseFloat(r.old_stock),
    newStock: parseFloat(r.new_stock),
    delta: parseFloat(r.delta),
    reason: r.reason,
    createdAt: r.created_at,
  }));
}
