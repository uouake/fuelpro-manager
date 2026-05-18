import { useState, useEffect, useCallback } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
--gold: #C9A84C;
--gold-light: #E8C97A;
--gold-dark: #8B6914;
--black: #0A0A0A;
--black-mid: #141414;
--black-soft: #1E1E1E;
--black-card: #242424;
--white: #F5F5F0;
--white-dim: #BDBDB5;
--border: rgba(201,168,76,0.25);
--border-strong: rgba(201,168,76,0.6);
--shadow: 0 4px 30px rgba(0,0,0,0.8);
--radius: 8px;
--font-display: 'Playfair Display', serif;
--font-body: 'Rajdhani', sans-serif;
}

body { background: var(--black); color: var(--white); font-family: var(--font-body); }

/* ── PIN SCREEN ── */
.pin-screen {
min-height: 100vh; display: flex; align-items: center; justify-content: center;
background: radial-gradient(ellipse at 50% 0%, #1a1200 0%, var(--black) 60%);
position: relative; overflow: hidden;
}
.pin-screen::before {
content:''; position:absolute; inset:0;
background: repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(201,168,76,0.03) 80px,rgba(201,168,76,0.03) 81px),
repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(201,168,76,0.03) 80px,rgba(201,168,76,0.03) 81px);
}
.pin-box {
position:relative; background: var(--black-mid); border: 1px solid var(--border-strong);
border-radius:16px; padding:48px 40px; width:380px; box-shadow: 0 0 80px rgba(201,168,76,0.12);
text-align:center;
}
.pin-logo { font-family:var(--font-display); font-size:2rem; color:var(--gold); letter-spacing:2px; margin-bottom:4px; }
.pin-sub { font-size:0.8rem; color:var(--white-dim); letter-spacing:4px; text-transform:uppercase; margin-bottom:32px; }
.pin-role-tabs { display:flex; gap:8px; margin-bottom:28px; }
.pin-role-tab {
flex:1; padding:8px 4px; background:transparent; border:1px solid var(--border); border-radius:6px;
color:var(--white-dim); font-family:var(--font-body); font-size:0.75rem; letter-spacing:2px;
text-transform:uppercase; cursor:pointer; transition:all .2s;
}
.pin-role-tab.active { background:var(--gold); color:var(--black); border-color:var(--gold); font-weight:700; }
.pin-dots { display:flex; gap:16px; justify-content:center; margin-bottom:28px; }
.pin-dot {
width:14px; height:14px; border-radius:50%; border:2px solid var(--gold-dark);
transition:all .2s;
}
.pin-dot.filled { background:var(--gold); border-color:var(--gold); box-shadow:0 0 10px rgba(201,168,76,0.5); }
.pin-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
.pin-btn {
padding:18px; background:var(--black-soft); border:1px solid var(--border); border-radius:8px;
color:var(--white); font-family:var(--font-body); font-size:1.4rem; font-weight:600;
cursor:pointer; transition:all .15s;
}
.pin-btn:hover { background:var(--black-card); border-color:var(--gold); color:var(--gold); }
.pin-btn:active { transform:scale(.95); }
.pin-btn.wide { grid-column:1/-1; font-size:0.9rem; letter-spacing:2px; padding:14px; }
.pin-error { color:#e05555; font-size:0.82rem; letter-spacing:1px; min-height:20px; margin-bottom:8px; }

/* ── LAYOUT ── */
.app { display:flex; min-height:100vh; }
.sidebar {
width:240px; background:var(--black-mid); border-right:1px solid var(--border);
display:flex; flex-direction:column; position:fixed; height:100vh; z-index:100;
}
.sidebar-logo { padding:24px 20px 16px; border-bottom:1px solid var(--border); }
.sidebar-logo h1 { font-family:var(--font-display); font-size:1.2rem; color:var(--gold); }
.sidebar-logo p { font-size:0.68rem; color:var(--white-dim); letter-spacing:3px; text-transform:uppercase; }
.sidebar-user {
padding:12px 20px; background:rgba(201,168,76,0.06); border-bottom:1px solid var(--border);
display:flex; align-items:center; gap:10px;
}
.sidebar-avatar {
width:36px; height:36px; border-radius:50%; background:var(--gold);
display:flex; align-items:center; justify-content:center;
font-weight:700; color:var(--black); font-size:0.9rem;
}
.sidebar-user-info p { font-size:0.85rem; font-weight:600; }
.sidebar-user-info span { font-size:0.7rem; color:var(--gold); letter-spacing:1px; text-transform:uppercase; }
.sidebar-nav { flex:1; padding:16px 0; overflow-y:auto; }
.nav-section { padding:8px 20px 4px; font-size:0.65rem; color:var(--white-dim); letter-spacing:3px; text-transform:uppercase; }
.nav-item {
display:flex; align-items:center; gap:12px; padding:10px 20px;
color:var(--white-dim); cursor:pointer; transition:all .15s; font-size:0.9rem;
border-left:2px solid transparent; letter-spacing:.5px;
}
.nav-item:hover { color:var(--white); background:rgba(255,255,255,0.04); }
.nav-item.active { color:var(--gold); background:rgba(201,168,76,0.08); border-left-color:var(--gold); }
.nav-icon { font-size:1.1rem; width:20px; text-align:center; }
.sidebar-footer { padding:16px 20px; border-top:1px solid var(--border); }
.logout-btn {
width:100%; padding:10px; background:transparent; border:1px solid var(--border);
border-radius:6px; color:var(--white-dim); font-family:var(--font-body); font-size:0.8rem;
letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all .2s;
}
.logout-btn:hover { border-color:#e05555; color:#e05555; }

.main { margin-left:240px; flex:1; padding:32px; min-height:100vh; background:var(--black); }
.page-header { margin-bottom:28px; }
.page-header h2 { font-family:var(--font-display); font-size:1.8rem; color:var(--white); }
.page-header p { color:var(--white-dim); font-size:0.85rem; margin-top:4px; }
.gold-line { width:40px; height:2px; background:var(--gold); margin:8px 0; }

/* ── CARDS & GRID ── */
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.card {
background:var(--black-card); border:1px solid var(--border); border-radius:var(--radius);
padding:20px; box-shadow:var(--shadow);
}
.card-gold { border-color:var(--border-strong); }
.stat-card { position:relative; overflow:hidden; }
.stat-card::before {
content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--gold);
}
.stat-label { font-size:0.7rem; color:var(--white-dim); letter-spacing:3px; text-transform:uppercase; }
.stat-value { font-family:var(--font-display); font-size:2rem; color:var(--gold); margin:4px 0; }
.stat-sub { font-size:0.8rem; color:var(--white-dim); }

/* ── TABLES ── */
.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:0.88rem; }
th {
text-align:left; padding:12px 16px; font-size:0.68rem; letter-spacing:3px;
text-transform:uppercase; color:var(--gold); border-bottom:1px solid var(--border-strong);
font-weight:600;
}
td { padding:12px 16px; border-bottom:1px solid rgba(201,168,76,0.08); color:var(--white-dim); }
tr:hover td { background:rgba(255,255,255,0.02); color:var(--white); }

/* ── BADGES ── */
.badge {
display:inline-block; padding:3px 10px; border-radius:20px; font-size:0.7rem;
letter-spacing:1px; text-transform:uppercase; font-weight:600;
}
.badge-green { background:rgba(56,161,105,0.15); color:#68d391; border:1px solid rgba(56,161,105,0.3); }
.badge-yellow { background:rgba(201,168,76,0.15); color:var(--gold); border:1px solid var(--border); }
.badge-red { background:rgba(224,85,85,0.15); color:#fc8181; border:1px solid rgba(224,85,85,0.3); }
.badge-blue { background:rgba(66,153,225,0.15); color:#90cdf4; border:1px solid rgba(66,153,225,0.3); }

/* ── FORMS ── */
.form-row { display:flex; gap:16px; margin-bottom:16px; }
.form-group { flex:1; display:flex; flex-direction:column; gap:6px; }
.form-group label { font-size:0.72rem; letter-spacing:2px; text-transform:uppercase; color:var(--white-dim); }
.form-group input, .form-group select, .form-group textarea {
background:var(--black-soft); border:1px solid var(--border); border-radius:6px;
padding:10px 14px; color:var(--white); font-family:var(--font-body); font-size:0.9rem;
outline:none; transition:border .2s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
border-color:var(--gold);
}
.form-group select option { background:var(--black-soft); }

/* ── BUTTONS ── */
.btn {
padding:10px 20px; border-radius:6px; font-family:var(--font-body); font-size:0.82rem;
letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all .2s; border:none;
font-weight:600;
}
.btn-gold { background:var(--gold); color:var(--black); }
.btn-gold:hover { background:var(--gold-light); }
.btn-outline { background:transparent; border:1px solid var(--border-strong); color:var(--gold); }
.btn-outline:hover { background:rgba(201,168,76,0.1); }
.btn-danger { background:transparent; border:1px solid rgba(224,85,85,0.4); color:#fc8181; }
.btn-danger:hover { background:rgba(224,85,85,0.1); }
.btn-sm { padding:6px 14px; font-size:0.72rem; }

/* ── MODAL ── */
.modal-overlay {
position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200;
display:flex; align-items:center; justify-content:center; padding:20px;
}
.modal {
background:var(--black-mid); border:1px solid var(--border-strong); border-radius:12px;
padding:32px; width:100%; max-width:520px; box-shadow:0 0 60px rgba(201,168,76,0.15);
}
.modal h3 { font-family:var(--font-display); font-size:1.4rem; color:var(--gold); margin-bottom:20px; }
.modal-footer { display:flex; gap:12px; justify-content:flex-end; margin-top:24px; padding-top:20px; border-top:1px solid var(--border); }

/* ── MAP PLACEHOLDER ── */
.map-container {
background:var(--black-soft); border:1px solid var(--border); border-radius:var(--radius);
height:400px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;
}
.map-grid {
position:absolute; inset:0;
background:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(201,168,76,0.05) 40px,rgba(201,168,76,0.05) 41px),
repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(201,168,76,0.05) 40px,rgba(201,168,76,0.05) 41px);
}
.map-pin {
position:absolute; transform:translate(-50%,-100%);
display:flex; flex-direction:column; align-items:center; cursor:pointer;
}
.map-pin-head {
background:var(--gold); color:var(--black); padding:6px 10px; border-radius:6px;
font-size:0.75rem; font-weight:700; white-space:nowrap; box-shadow:0 2px 12px rgba(201,168,76,0.4);
}
.map-pin-tail { width:2px; height:12px; background:var(--gold); }
.map-pin-dot { width:8px; height:8px; background:var(--gold); border-radius:50%; }

/* ── PROGRESS ── */
.progress-bar { height:6px; background:var(--black-soft); border-radius:3px; overflow:hidden; margin-top:8px; }
.progress-fill { height:100%; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); border-radius:3px; transition:width .5s; }

/* ── SECTION TITLES ── */
.section-title {
display:flex; align-items:center; justify-content:space-between;
margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border);
}
.section-title h3 { font-family:var(--font-display); font-size:1.1rem; color:var(--white); }

/* ── TOAST ── */
.toast {
position:fixed; bottom:24px; right:24px; z-index:300;
background:var(--black-mid); border:1px solid var(--border-strong); border-radius:8px;
padding:14px 20px; color:var(--white); font-size:0.88rem;
box-shadow:0 4px 20px rgba(0,0,0,0.6); animation:slideIn .3s ease;
display:flex; align-items:center; gap:10px;
}
.toast.success { border-left:3px solid #68d391; }
.toast.error { border-left:3px solid #fc8181; }
@keyframes slideIn { from { transform:translateX(100px); opacity:0; } to { transform:translateX(0); opacity:1; } }

/* ── SALE FORM ── */
.sale-form { max-width:500px; margin:0 auto; }
.sale-amount {
font-family:var(--font-display); font-size:3rem; color:var(--gold); text-align:center;
padding:20px; background:var(--black-soft); border:1px solid var(--border); border-radius:8px;
margin-bottom:20px;
}

.empty-state { text-align:center; padding:40px; color:var(--white-dim); }
.empty-state .icon { font-size:2.5rem; margin-bottom:12px; }

/* ══════════════════════════════════════════
   RESPONSIVE — Mobile-first breakpoints
   ══════════════════════════════════════════ */

/* ── HAMBURGER BUTTON (mobile only) ── */
.hamburger {
  display: none;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--gold);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 6px 10px;
  line-height: 1;
  transition: all .2s;
}
.hamburger:hover { background: rgba(201,168,76,0.1); }

/* ── SIDEBAR OVERLAY (mobile) ── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 99;
}
.sidebar-overlay.open { display: block; }

/* ── TABLET (768px – 1024px) ── */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}

/* ── MOBILE (< 768px) ── */
@media (max-width: 767px) {
  /* Hamburger visible */
  .hamburger { display: inline-flex; align-items: center; justify-content: center; }

  /* Sidebar devient un drawer */
  .sidebar {
    transform: translateX(-100%);
    transition: transform .3s ease;
    z-index: 100;
    width: 260px;
  }
  .sidebar.open { transform: translateX(0); }

  /* Main prend toute la largeur */
  .main {
    margin-left: 0;
    padding: 16px;
  }

  /* Top bar mobile */
  .mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--black-mid);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 90;
    margin: -16px -16px 16px -16px;
  }
  .mobile-topbar-title {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--gold);
  }
  .mobile-user-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--white-dim);
  }

  /* Grilles */
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }

  /* Page header */
  .page-header h2 { font-size: 1.4rem; }
  .stat-value { font-size: 1.6rem; }

  /* Forms */
  .form-row { flex-direction: column; }

  /* Modal plein écran */
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal {
    border-radius: 16px 16px 0 0;
    padding: 24px 20px;
    max-height: 90vh;
    overflow-y: auto;
    max-width: 100%;
  }
  .modal-footer { flex-direction: column-reverse; }
  .modal-footer .btn { width: 100%; text-align: center; }

  /* PIN screen */
  .pin-box {
    width: 100%;
    max-width: 360px;
    padding: 32px 24px;
    margin: 16px;
  }

  /* Sale amount */
  .sale-amount { font-size: 2rem; }

  /* Toast */
  .toast {
    left: 16px;
    right: 16px;
    bottom: 16px;
    width: auto;
  }

  /* Section title */
  .section-title { flex-direction: column; align-items: flex-start; gap: 8px; }
  .section-title .btn { width: 100%; text-align: center; }

  /* Map */
  .map-container { height: 280px; }

  /* Tables — font légèrement réduit */
  th, td { padding: 8px 10px; font-size: 0.82rem; }

  /* Card padding réduit */
  .card { padding: 14px; }
}
`;

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_DATA = {
users: [
{ id: 1, name: "Admin Système", pin: "0000", role: "admin", stationId: null },
{ id: 2, name: "Kouamé Jean", pin: "1234", role: "gérant", stationId: 1 },
{ id: 3, name: "Traoré Fatou", pin: "2222", role: "vendeur", stationId: 1 },
{ id: 4, name: "Bamba Soro", pin: "3333", role: "gérant", stationId: 2 },
{ id: 5, name: "Diallo Ibrahim", pin: "4444", role: "vendeur", stationId: 2 },
],
stations: [
{ id: 1, name: "Station Plateau", city: "Abidjan", address: "Rue du Commerce, Plateau", lat: 5.3203, lng: -4.0185, pricePerLiter: 750, stock: 12000, capacity: 30000 },
{ id: 2, name: "Station Cocody", city: "Abidjan", address: "Av. Christiani, Cocody", lat: 5.3467, lng: -3.9870, pricePerLiter: 745, stock: 8000, capacity: 25000 },
{ id: 3, name: "Station Yopougon", city: "Abidjan", address: "Bd de Marseille, Yopougon", lat: 5.3274, lng: -4.0742, pricePerLiter: 740, stock: 5000, capacity: 20000 },
],
trucks: [
{ id: 1, plate: "AB-1234-CI", capacity: 15000, driver: "Koné Mamadou", status: "disponible", stationId: 1 },
{ id: 2, plate: "CD-5678-CI", capacity: 20000, driver: "Ouédraogo Issouf", status: "en livraison", stationId: 1 },
{ id: 3, plate: "EF-9012-CI", capacity: 10000, driver: "Touré Sékou", status: "disponible", stationId: 2 },
],
deliveries: [
{ id: 1, truckId: 2, stationId: 1, volume: 15000, date: "2026-05-08", status: "en cours", confirmedBy: null },
{ id: 2, truckId: 1, stationId: 2, volume: 10000, date: "2026-05-07", status: "terminée", confirmedBy: 5 },
{ id: 3, truckId: 3, stationId: 3, volume: 8000, date: "2026-05-06", status: "terminée", confirmedBy: 3 },
],
sales: [
{ id: 1, stationId: 1, vendorId: 3, volume: 30, amount: 22500, date: "2026-05-10", time: "08:15" },
{ id: 2, stationId: 1, vendorId: 3, volume: 50, amount: 37500, date: "2026-05-10", time: "09:30" },
{ id: 3, stationId: 2, vendorId: 5, volume: 40, amount: 29800, date: "2026-05-10", time: "07:45" },
{ id: 4, stationId: 1, vendorId: 3, volume: 25, amount: 18750, date: "2026-05-09", time: "14:20" },
],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const loadData = () => {
try { return JSON.parse(localStorage.getItem("fuelDB")) || INITIAL_DATA; } catch { return INITIAL_DATA; }
};
const saveData = (d) => localStorage.setItem("fuelDB", JSON.stringify(d));
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n);
const today = () => new Date().toISOString().split("T")[0];
const timeNow = () => new Date().toTimeString().slice(0, 5);
const nextId = (arr) => Math.max(0, ...arr.map((x) => x.id)) + 1;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
return (
<div className={`toast ${type}`}>
<span>{type === "success" ? "✓" : "✗"}</span>
{msg}
</div>
);
}

// ─── PIN SCREEN ───────────────────────────────────────────────────────────────
function PinScreen({ onLogin }) {
const [role, setRole] = useState("vendeur");
const [pin, setPin] = useState("");
const [error, setError] = useState("");
const data = loadData();

const press = (v) => {
if (pin.length < 4) setPin((p) => p + v);
};
const del = () => setPin((p) => p.slice(0, -1));
const submit = () => {
const user = data.users.find((u) => u.pin === pin && u.role === role);
if (user) { setError(""); onLogin(user); }
else { setError("Code PIN incorrect"); setPin(""); }
};
useEffect(() => { if (pin.length === 4) { setTimeout(submit, 150); } }, [pin]);

return (
<div className="pin-screen">
<div className="pin-box">
<div className="pin-logo">⛽ FuelPro</div>
<div className="pin-sub">Gestion de Stations</div>
<div className="pin-role-tabs">
{["vendeur", "gérant", "admin"].map((r) => (
<button key={r} className={`pin-role-tab ${role === r ? "active" : ""}`}
onClick={() => { setRole(r); setPin(""); setError(""); }}>
{r}
</button>
))}
</div>
<div className="pin-dots">
{[0,1,2,3].map((i) => <div key={i} className={`pin-dot ${pin.length > i ? "filled" : ""}`} />)}
</div>
<div className="pin-error">{error}</div>
<div className="pin-grid">
{["1","2","3","4","5","6","7","8","9","⌫","0","✓"].map((k) => (
<button key={k} className="pin-btn" onClick={() => k === "⌫" ? del() : k === "✓" ? submit() : press(k)}>
{k}
</button>
))}
</div>
<div style={{fontSize:"0.7rem",color:"var(--white-dim)",marginTop:12,letterSpacing:1}}>
Démo: vendeur=2222 | gérant=1234 | admin=0000
</div>
</div>
</div>
);
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, db }) {
const myStations = user.role === "admin" ? db.stations : db.stations.filter((s) => s.id === user.stationId);
const todaySales = db.sales.filter((s) => s.date === today() && (user.role === "admin" || s.stationId === user.stationId));
const totalRevenue = todaySales.reduce((a, s) => a + s.amount, 0);
const totalVolume = todaySales.reduce((a, s) => a + s.volume, 0);
const pendingDeliveries = db.deliveries.filter((d) => d.status === "en cours" && (user.role === "admin" || d.stationId === user.stationId));
const doneDeliveries = db.deliveries.filter((d) => d.status === "terminée" && (user.role === "admin" || d.stationId === user.stationId));

return (
<div>
<div className="page-header">
<h2>Dashboard</h2>
<div className="gold-line" />
<p>Vue d'ensemble -- {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
</div>

  <div className="grid-4" style={{marginBottom:24}}>
    <div className="card stat-card">
      <div className="stat-label">Stations</div>
      <div className="stat-value">{myStations.length}</div>
      <div className="stat-sub">actives</div>
    </div>
    <div className="card stat-card">
      <div className="stat-label">Ventes aujourd'hui</div>
      <div className="stat-value">{todaySales.length}</div>
      <div className="stat-sub">{fmt(totalVolume)} L vendus</div>
    </div>
    <div className="card stat-card">
      <div className="stat-label">Livraisons en cours</div>
      <div className="stat-value">{pendingDeliveries.length}</div>
      <div className="stat-sub">{doneDeliveries.length} terminées</div>
    </div>
    {(user.role === "gérant" || user.role === "admin") && (
      <div className="card stat-card">
        <div className="stat-label">Chiffre du jour</div>
        <div className="stat-value">{fmt(totalRevenue)}</div>
        <div className="stat-sub">FCFA</div>
      </div>
    )}
  </div>

  <div className="grid-2">
    {/* Stock par station */}
    <div className="card">
      <div className="section-title"><h3>📊 Niveaux de stock</h3></div>
      {myStations.map((s) => {
        const pct = Math.round((s.stock / s.capacity) * 100);
        const col = pct < 20 ? "#fc8181" : pct < 50 ? "var(--gold)" : "#68d391";
        return (
          <div key={s.id} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:"0.85rem"}}>{s.name}</span>
              <span style={{fontSize:"0.85rem",color:col,fontWeight:600}}>{fmt(s.stock)} L / {fmt(s.capacity)} L</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width:`${pct}%`,background:col}} />
            </div>
          </div>
        );
      })}
    </div>

    {/* Livraisons récentes */}
    <div className="card">
      <div className="section-title"><h3>🚛 Livraisons récentes</h3></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Station</th><th>Volume</th><th>Date</th><th>Statut</th></tr></thead>
          <tbody>
            {db.deliveries.filter(d => user.role === "admin" || d.stationId === user.stationId)
              .slice(0, 5).map((d) => {
              const st = db.stations.find((s) => s.id === d.stationId);
              return (
                <tr key={d.id}>
                  <td>{st?.name}</td>
                  <td>{fmt(d.volume)} L</td>
                  <td>{d.date}</td>
                  <td><span className={`badge ${d.status === "terminée" ? "badge-green" : "badge-yellow"}`}>{d.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Dernières ventes */}
  <div className="card" style={{marginTop:20}}>
    <div className="section-title"><h3>💰 Dernières ventes</h3></div>
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Station</th><th>Vendeur</th><th>Volume</th>
            {(user.role !== "vendeur") && <th>Montant</th>}
            <th>Heure</th>
          </tr>
        </thead>
        <tbody>
          {db.sales.filter(s => user.role === "admin" || s.stationId === user.stationId)
            .slice(-5).reverse().map((s) => {
            const st = db.stations.find((x) => x.id === s.stationId);
            const vendor = db.users.find((u) => u.id === s.vendorId);
            return (
              <tr key={s.id}>
                <td>{st?.name}</td>
                <td>{vendor?.name}</td>
                <td>{s.volume} L</td>
                {(user.role !== "vendeur") && <td style={{color:"var(--gold)"}}>{fmt(s.amount)} FCFA</td>}
                <td>{s.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}

// ─── SALE FORM ────────────────────────────────────────────────────────────────
function SaleForm({ user, db, onSave, toast }) {
const station = db.stations.find((s) => s.id === user.stationId);
const [volume, setVolume] = useState("");
const [method, setMethod] = useState("espèces");

const amount = volume ? Math.round(parseFloat(volume) * (station?.pricePerLiter || 0)) : 0;

const submit = () => {
const v = parseFloat(volume);
if (!v || v <= 0) { toast("Entrez un volume valide", "error"); return; }
if (v > station.stock) { toast("Stock insuffisant !", "error"); return; }
const newSale = { id: nextId(db.sales), stationId: user.stationId, vendorId: user.id, volume: v, amount, date: today(), time: timeNow(), method };
const updStations = db.stations.map((s) => s.id === user.stationId ? { ...s, stock: s.stock - v } : s);
onSave({ ...db, sales: [...db.sales, newSale], stations: updStations });
setVolume(""); toast("Vente enregistrée ✓", "success");
};

return (
<div>
<div className="page-header">
<h2>Formulaire de Vente</h2>
<div className="gold-line" />
<p>{station?.name} -- Prix : <strong style={{color:"var(--gold)"}}>{fmt(station?.pricePerLiter)} FCFA/L</strong></p>
</div>

  <div className="sale-form">
    <div className="card card-gold">
      <div style={{marginBottom:20}}>
        <div className="sale-amount">{fmt(amount)} <span style={{fontSize:"1rem"}}>FCFA</span></div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Volume (litres)</label>
          <input type="number" min="1" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Ex: 30" />
        </div>
        <div className="form-group">
          <label>Mode de paiement</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>espèces</option>
            <option>carte</option>
            <option>mobile money</option>
          </select>
        </div>
      </div>
      <div style={{padding:"12px",background:"var(--black-soft)",borderRadius:6,marginBottom:20,fontSize:"0.85rem",color:"var(--white-dim)"}}>
        Stock disponible : <strong style={{color: station?.stock < 1000 ? "#fc8181" : "var(--gold)"}}>{fmt(station?.stock)} L</strong>
      </div>
      <button className="btn btn-gold" style={{width:"100%",padding:"16px",fontSize:"1rem"}} onClick={submit}>
        ✓ Enregistrer la vente
      </button>
    </div>

    <div className="card" style={{marginTop:20}}>
      <div className="section-title"><h3>Mes ventes du jour</h3></div>
      <table>
        <thead><tr><th>Volume</th><th>Heure</th><th>Mode</th></tr></thead>
        <tbody>
          {db.sales.filter((s) => s.vendorId === user.id && s.date === today()).reverse().map((s) => (
            <tr key={s.id}>
              <td>{s.volume} L</td>
              <td>{s.time}</td>
              <td><span className="badge badge-yellow">{s.method}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}

// ─── STOCK ────────────────────────────────────────────────────────────────────
function Stock({ user, db }) {
const stations = user.role === "admin" ? db.stations : db.stations.filter((s) => s.id === user.stationId);
return (
<div>
<div className="page-header"><h2>Gestion du Stock</h2><div className="gold-line" /></div>
<div className="grid-2">
{stations.map((s) => {
const pct = Math.round((s.stock / s.capacity) * 100);
const lvl = pct < 20 ? "critique" : pct < 50 ? "faible" : "normal";
return (
<div key={s.id} className="card">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
<div>
<h3 style={{fontFamily:"var(--font-display)",fontSize:"1.1rem"}}>{s.name}</h3>
<p style={{fontSize:"0.8rem",color:"var(--white-dim)"}}>{s.city}</p>
</div>
<span className={`badge ${lvl === "critique" ? "badge-red" : lvl === "faible" ? "badge-yellow" : "badge-green"}`}>{lvl}</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
<span style={{fontSize:"0.8rem",color:"var(--white-dim)"}}>Stock actuel</span>
<span style={{fontFamily:"var(--font-display)",color:"var(--gold)",fontSize:"1.2rem"}}>{fmt(s.stock)} L</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
<span style={{fontSize:"0.8rem",color:"var(--white-dim)"}}>Capacité totale</span>
<span style={{fontSize:"0.9rem"}}>{fmt(s.capacity)} L</span>
</div>
<div className="progress-bar" style={{height:10}}>
<div className="progress-fill" style={{width:`${pct}%`,background: lvl==="critique" ? "#fc8181" : lvl==="faible" ? "var(--gold)" : "#68d391"}} />
</div>
<div style={{textAlign:"right",marginTop:6,fontSize:"0.75rem",color:"var(--white-dim)"}}>{pct}% de capacité</div>
<div style={{marginTop:16,padding:"10px 14px",background:"var(--black-soft)",borderRadius:6,display:"flex",justifyContent:"space-between"}}>
<span style={{fontSize:"0.8rem",color:"var(--white-dim)"}}>Prix/litre</span>
<span style={{color:"var(--gold)",fontWeight:700}}>{fmt(s.pricePerLiter)} FCFA</span>
</div>
</div>
);
})}
</div>
</div>
);
}

// ─── DELIVERIES ───────────────────────────────────────────────────────────────
function Deliveries({ user, db, onSave, toast }) {
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ truckId: "", stationId: user.stationId || "", volume: "", date: today() });

const myDeliveries = user.role === "admin"
? db.deliveries
: db.deliveries.filter((d) => d.stationId === user.stationId);

const confirm = (id) => {
const updated = db.deliveries.map((d) => {
if (d.id !== id) return d;
const st = db.stations.find((s) => s.id === d.stationId);
const newStock = Math.min(st.capacity, st.stock + d.volume);
onSave({
...db,
deliveries: db.deliveries.map((x) => x.id === id ? { ...x, status: "terminée", confirmedBy: user.id } : x),
stations: db.stations.map((s) => s.id === d.stationId ? { ...s, stock: newStock } : s),
});
return d;
});
toast("Livraison confirmée -- stock mis à jour ✓", "success");
};

const cancelDelivery = (id) => {
const d = db.deliveries.find((x) => x.id === id);
if (!d) return;
onSave({
...db,
deliveries: db.deliveries.map((x) => x.id === id ? { ...x, status: "annulée" } : x),
trucks: db.trucks.map((t) => t.id === d.truckId ? { ...t, status: "disponible" } : t),
});
toast("Livraison annulée", "success");
};

const addDelivery = () => {
if (!form.truckId || !form.stationId || !form.volume) { toast("Remplissez tous les champs", "error"); return; }
const nd = { id: nextId(db.deliveries), truckId: +form.truckId, stationId: +form.stationId, volume: +form.volume, date: form.date, status: "en cours", confirmedBy: null };
onSave({ ...db, deliveries: [...db.deliveries, nd] });
toast("Livraison planifiée ✓", "success");
setShowModal(false);
};

const availableTrucks = db.trucks.filter(t => (user.role === "admin" || t.stationId === user.stationId) && t.status === "disponible");

return (
<div>
<div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><h2>Livraisons</h2><div className="gold-line" /></div>
{(user.role === "gérant" || user.role === "admin") && (
<button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Planifier</button>
)}
</div>

  <div className="card">
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Station</th><th>Camion</th><th>Volume</th><th>Date</th><th>Statut</th><th>Action</th></tr>
        </thead>
        <tbody>
          {myDeliveries.map((d) => {
            const st = db.stations.find((s) => s.id === d.stationId);
            const tr = db.trucks.find((t) => t.id === d.truckId);
            return (
              <tr key={d.id}>
                <td>{st?.name}</td>
                <td>{tr?.plate}</td>
                <td>{fmt(d.volume)} L</td>
                <td>{d.date}</td>
                <td><span className={`badge ${d.status === "terminée" ? "badge-green" : d.status === "annulée" ? "badge-red" : "badge-yellow"}`}>{d.status}</span></td>
                <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {d.status === "en cours" && (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => confirm(d.id)}>Confirmer</button>
                      {(user.role === "gérant" || user.role === "admin") && (
                        <button className="btn btn-danger btn-sm" onClick={() => cancelDelivery(d.id)}>Annuler</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>

  {showModal && (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Planifier une livraison</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Station</label>
            <select value={form.stationId} onChange={(e) => setForm({...form, stationId: e.target.value})}>
              {(user.role === "admin" ? db.stations : db.stations.filter(s => s.id === user.stationId)).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Camion</label>
            <select value={form.truckId} onChange={(e) => setForm({...form, truckId: e.target.value})}>
              <option value="">Sélectionner</option>
              {availableTrucks.map(t => <option key={t.id} value={t.id}>{t.plate}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Volume (L)</label>
            <input type="number" value={form.volume} onChange={(e) => setForm({...form, volume: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
          <button className="btn btn-gold" onClick={addDelivery}>Confirmer</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}

// ─── TRUCKS ───────────────────────────────────────────────────────────────────
function Trucks({ user, db, onSave, toast }) {
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ plate: "", capacity: "", driver: "", stationId: user.stationId || "" });

const myTrucks = user.role === "admin" ? db.trucks : db.trucks.filter(t => t.stationId === user.stationId);

const addTruck = () => {
if (!form.plate || !form.capacity || !form.driver) { toast("Remplissez tous les champs", "error"); return; }
const nt = { id: nextId(db.trucks), plate: form.plate, capacity: +form.capacity, driver: form.driver, status: "disponible", stationId: +form.stationId };
onSave({ ...db, trucks: [...db.trucks, nt] });
toast("Camion ajouté ✓", "success");
setShowModal(false);
setForm({ plate: "", capacity: "", driver: "", stationId: user.stationId || "" });
};

const deleteTruck = (id) => {
onSave({ ...db, trucks: db.trucks.filter(t => t.id !== id) });
toast("Camion supprimé", "success");
};

const updateStatus = (id, status) => {
onSave({ ...db, trucks: db.trucks.map(t => t.id === id ? { ...t, status } : t) });
};

return (
<div>
<div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><h2>Flotte de Camions</h2><div className="gold-line" /></div>
{(user.role === "gérant" || user.role === "admin") && (
<button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Ajouter</button>
)}
</div>

  <div className="grid-3">
    {myTrucks.map((t) => {
      const st = db.stations.find(s => s.id === t.stationId);
      return (
        <div key={t.id} className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontFamily:"var(--font-display)",fontSize:"1.1rem",color:"var(--gold)"}}>{t.plate}</div>
              <div style={{fontSize:"0.8rem",color:"var(--white-dim)",marginTop:2}}>{st?.name}</div>
            </div>
            <span className={`badge ${t.status === "disponible" ? "badge-green" : t.status === "en livraison" ? "badge-yellow" : "badge-red"}`}>{t.status}</span>
          </div>
          <div style={{fontSize:"0.85rem",marginBottom:8}}>🧑 {t.driver}</div>
          <div style={{fontSize:"0.85rem",color:"var(--white-dim)",marginBottom:16}}>Capacité : {fmt(t.capacity)} L</div>
          {(user.role === "gérant" || user.role === "admin") && (
            <div style={{display:"flex",gap:8}}>
              <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}
                style={{flex:1,background:"var(--black-soft)",border:"1px solid var(--border)",borderRadius:6,padding:"6px 10px",color:"var(--white)",fontSize:"0.8rem",fontFamily:"var(--font-body)"}}>
                <option>disponible</option>
                <option>en livraison</option>
                <option>maintenance</option>
              </select>
              <button className="btn btn-danger btn-sm" onClick={() => deleteTruck(t.id)}>✕</button>
            </div>
          )}
        </div>
      );
    })}
  </div>

  {showModal && (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Ajouter un camion</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Plaque d'immatriculation</label>
            <input placeholder="AB-1234-CI" value={form.plate} onChange={(e) => setForm({...form, plate: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Capacité (L)</label>
            <input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Chauffeur</label>
            <input value={form.driver} onChange={(e) => setForm({...form, driver: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Station</label>
            <select value={form.stationId} onChange={(e) => setForm({...form, stationId: e.target.value})}>
              {(user.role === "admin" ? db.stations : db.stations.filter(s => s.id === user.stationId)).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
          <button className="btn btn-gold" onClick={addTruck}>Ajouter</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}

// ─── PERSONNEL ────────────────────────────────────────────────────────────────
function Personnel({ user, db, onSave, toast }) {
const isAdmin = user.role === "admin";
const [showModal, setShowModal] = useState(false);
const [editTarget, setEditTarget] = useState(null);
const emptyForm = { name: "", pin: "", newPin: "", role: "vendeur", stationId: db.stations[0]?.id || "" };
const [form, setForm] = useState(emptyForm);

const myUsers = isAdmin ? db.users : db.users.filter(u => u.stationId === user.stationId);

const openAdd = () => { setEditTarget(null); setForm(emptyForm); setShowModal(true); };
const openEdit = (u) => { setEditTarget(u); setForm({ name: u.name, pin: "", newPin: "", role: u.role, stationId: u.stationId || "" }); setShowModal(true); };

const saveUser = () => {
  if (editTarget) {
    if (!form.name) { toast("Nom requis", "error"); return; }
    if (form.newPin && form.newPin.length !== 4) { toast("Nouveau PIN doit faire 4 chiffres", "error"); return; }
    if (form.newPin && db.users.find(u => u.pin === form.newPin && u.id !== editTarget.id)) { toast("Ce PIN est déjà utilisé", "error"); return; }
    const updated = db.users.map(u => u.id === editTarget.id ? {
      ...u, name: form.name, role: form.role,
      stationId: form.stationId ? +form.stationId : null,
      ...(form.newPin ? { pin: form.newPin } : {})
    } : u);
    onSave({ ...db, users: updated });
    toast("Employé mis à jour ✓", "success");
  } else {
    if (!form.name || form.pin.length !== 4) { toast("Nom et PIN 4 chiffres requis", "error"); return; }
    if (db.users.find(u => u.pin === form.pin)) { toast("Ce PIN est déjà utilisé", "error"); return; }
    const nu = { id: nextId(db.users), name: form.name, pin: form.pin, role: form.role, stationId: +form.stationId };
    onSave({ ...db, users: [...db.users, nu] });
    toast("Utilisateur ajouté ✓", "success");
  }
  setShowModal(false);
};

const deleteUser = (id) => {
  if (id === user.id) { toast("Impossible de vous supprimer vous-même", "error"); return; }
  onSave({ ...db, users: db.users.filter(u => u.id !== id) });
  toast("Utilisateur supprimé", "success");
};

const roleColors = { admin: "badge-red", gérant: "badge-yellow", vendeur: "badge-blue" };

return (
<div>
<div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><h2>Personnel</h2><div className="gold-line" /></div>
{isAdmin && <button className="btn btn-gold" onClick={openAdd}>+ Ajouter</button>}
</div>

  <div className="card">
    <div className="table-wrap">
    <table>
      <thead><tr><th>Nom</th><th>Rôle</th><th>Station</th><th>PIN</th><th>Actions</th></tr></thead>
      <tbody>
        {myUsers.map((u) => {
          const st = db.stations.find(s => s.id === u.stationId);
          return (
            <tr key={u.id}>
              <td style={{fontWeight:600}}>{u.name}</td>
              <td><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
              <td>{st?.name || "--"}</td>
              <td style={{letterSpacing:4,color:"var(--white-dim)"}}>{"●●●●"}</td>
              <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {isAdmin ? (
                  <>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Éditer</button>
                    {u.id !== user.id && <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Supprimer</button>}
                  </>
                ) : (
                  <span style={{color:"var(--white-dim)",fontSize:"0.75rem"}}>--</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  </div>

  {showModal && (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editTarget ? "Éditer l\'employé" : "Ajouter un employé"}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nom complet</label>
            <input value={form.name} placeholder="Prénom Nom" onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            {editTarget ? (
              <>
                <label>Nouveau PIN (vide = inchangé)</label>
                <input type="password" maxLength={4} value={form.newPin} placeholder="····" onChange={(e) => setForm({...form, newPin: e.target.value.replace(/\D/g,"")})} />
              </>
            ) : (
              <>
                <label>Code PIN (4 chiffres)</label>
                <input type="password" maxLength={4} value={form.pin} onChange={(e) => setForm({...form, pin: e.target.value.replace(/\D/g,"")})} />
              </>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Rôle</label>
            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
              <option>vendeur</option>
              <option>gérant</option>
              <option>admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Station</label>
            <select value={form.stationId} onChange={(e) => setForm({...form, stationId: e.target.value})}>
              <option value="">-- Aucune --</option>
              {db.stations.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
          <button className="btn btn-gold" onClick={saveUser}>{editTarget ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}

// ─── STATIONS ─────────────────────────────────────────────────────────────────
function Stations({ user, db, onSave, toast }) {
const [showModal, setShowModal] = useState(false);
const [editStation, setEditStation] = useState(null);
const [form, setForm] = useState({ name: "", city: "", address: "", lat: "", lng: "", pricePerLiter: "", capacity: "" });

const openAdd = () => { setEditStation(null); setForm({ name: "", city: "", address: "", lat: "", lng: "", pricePerLiter: "", capacity: "" }); setShowModal(true); };
const openEdit = (s) => { setEditStation(s); setForm({ ...s }); setShowModal(true); };

const save = () => {
if (!form.name || !form.city) { toast("Nom et ville requis", "error"); return; }
if (editStation) {
onSave({ ...db, stations: db.stations.map(s => s.id === editStation.id ? { ...s, ...form, pricePerLiter: +form.pricePerLiter, capacity: +form.capacity, lat: +form.lat, lng: +form.lng } : s) });
toast("Station mise à jour ✓", "success");
} else {
const ns = { id: nextId(db.stations), ...form, pricePerLiter: +form.pricePerLiter, capacity: +form.capacity, lat: +form.lat, lng: +form.lng, stock: 0 };
onSave({ ...db, stations: [...db.stations, ns] });
toast("Station créée ✓", "success");
}
setShowModal(false);
};

const deleteStation = (id) => {
onSave({ ...db, stations: db.stations.filter(s => s.id !== id) });
toast("Station supprimée", "success");
};

return (
<div>
<div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><h2>Stations</h2><div className="gold-line" /></div>
{user.role === "admin" && <button className="btn btn-gold" onClick={openAdd}>+ Ajouter</button>}
</div>

  <div className="grid-2">
    {db.stations.map((s) => (
      <div key={s.id} className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:"1.1rem"}}>{s.name}</h3>
            <p style={{fontSize:"0.8rem",color:"var(--white-dim)"}}>{s.city}</p>
          </div>
          <span className="badge badge-green">Active</span>
        </div>
        <div style={{fontSize:"0.85rem",color:"var(--white-dim)",marginBottom:6}}>📍 {s.address}</div>
        <div style={{fontSize:"0.85rem",color:"var(--white-dim)",marginBottom:6}}>🌐 {s.lat}, {s.lng}</div>
        <div style={{fontSize:"0.85rem",color:"var(--gold)",fontWeight:600,marginBottom:12}}>Prix : {fmt(s.pricePerLiter)} FCFA/L</div>
        <div style={{display:"flex",gap:8}}>
          {user.role === "admin" && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteStation(s.id)}>Supprimer</button>
            </>
          )}
        </div>
      </div>
    ))}
  </div>

  {showModal && (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editStation ? "Modifier" : "Ajouter"} une station</h3>
        <div className="form-row">
          <div className="form-group"><label>Nom</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>Ville</label><input value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Adresse</label><input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Latitude</label><input type="number" step="any" value={form.lat} onChange={(e) => setForm({...form, lat: e.target.value})} /></div>
          <div className="form-group"><label>Longitude</label><input type="number" step="any" value={form.lng} onChange={(e) => setForm({...form, lng: e.target.value})} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Prix/L (FCFA)</label><input type="number" value={form.pricePerLiter} onChange={(e) => setForm({...form, pricePerLiter: e.target.value})} /></div>
          <div className="form-group"><label>Capacité (L)</label><input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
          <button className="btn btn-gold" onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
function MapView({ db }) {
const [selected, setSelected] = useState(null);
// Compute relative positions for visual map
const lats = db.stations.map(s => s.lat);
const lngs = db.stations.map(s => s.lng);
const minLat = Math.min(...lats), maxLat = Math.max(...lats);
const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
const pad = 0.01;

const toPercent = (s) => ({
left: `${((s.lng - minLng + pad) / (maxLng - minLng + 2 * pad)) * 85 + 7.5}%`,
top: `${((maxLat - s.lat + pad) / (maxLat - minLat + 2 * pad)) * 80 + 5}%`,
});

return (
<div>
<div className="page-header"><h2>Carte des Stations</h2><div className="gold-line" /><p>Visualisation géographique et prix</p></div>
<div className="map-container">
<div className="map-grid" />
<div style={{position:"absolute",top:12,left:12,fontSize:"0.7rem",color:"var(--white-dim)",letterSpacing:2}}>⚠ Carte schématique -- intégrez Google Maps API pour la carte réelle</div>
{db.stations.map((s) => {
const pos = toPercent(s);
return (
<div key={s.id} className="map-pin" style={{ left: pos.left, top: pos.top }} onClick={() => setSelected(s)}>
<div className="map-pin-head">{s.name} · {fmt(s.pricePerLiter)} FCFA/L</div>
<div className="map-pin-tail" />
<div className="map-pin-dot" />
</div>
);
})}
</div>

  {selected && (
    <div className="card card-gold" style={{marginTop:20,maxWidth:400}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:"1.1rem",color:"var(--gold)"}}>{selected.name}</h3>
        <button onClick={() => setSelected(null)} style={{background:"none",border:"none",color:"var(--white-dim)",cursor:"pointer",fontSize:"1.2rem"}}>✕</button>
      </div>
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:6,fontSize:"0.85rem",color:"var(--white-dim)"}}>
        <div>📍 {selected.address}, {selected.city}</div>
        <div>🌐 {selected.lat}, {selected.lng}</div>
        <div style={{color:"var(--gold)",fontWeight:700,fontSize:"1rem"}}>⛽ {fmt(selected.pricePerLiter)} FCFA/L</div>
        <div>📦 Stock : {fmt(selected.stock)} L / {fmt(selected.capacity)} L</div>
      </div>
    </div>
  )}

  <div style={{marginTop:20}}>
    <div className="section-title"><h3>📋 Résumé des prix</h3></div>
    <div className="grid-3">
      {db.stations.map(s => (
        <div key={s.id} className="card" style={{textAlign:"center"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"0.95rem",marginBottom:4}}>{s.name}</div>
          <div style={{fontSize:"1.5rem",color:"var(--gold)",fontWeight:700,fontFamily:"var(--font-display)"}}>{fmt(s.pricePerLiter)}</div>
          <div style={{fontSize:"0.7rem",color:"var(--white-dim)",letterSpacing:2}}>FCFA / LITRE</div>
        </div>
      ))}
    </div>
  </div>
</div>

);
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ user, db }) {
const myStations = user.role === "admin" ? db.stations : db.stations.filter(s => s.id === user.stationId);
const mySales = user.role === "admin" ? db.sales : db.sales.filter(s => s.stationId === user.stationId);

const byStation = myStations.map(st => {
const sales = mySales.filter(s => s.stationId === st.id);
return { ...st, totalSales: sales.length, totalVolume: sales.reduce((a,s)=>a+s.volume,0), totalRevenue: sales.reduce((a,s)=>a+s.amount,0) };
});

return (
<div>
<div className="page-header"><h2>Rapports & Analyses</h2><div className="gold-line" /></div>

  <div className="grid-3" style={{marginBottom:24}}>
    <div className="card stat-card">
      <div className="stat-label">Total ventes</div>
      <div className="stat-value">{mySales.length}</div>
      <div className="stat-sub">transactions</div>
    </div>
    <div className="card stat-card">
      <div className="stat-label">Volume total</div>
      <div className="stat-value">{fmt(mySales.reduce((a,s)=>a+s.volume,0))}</div>
      <div className="stat-sub">litres</div>
    </div>
    <div className="card stat-card">
      <div className="stat-label">Chiffre d'affaires</div>
      <div className="stat-value">{fmt(mySales.reduce((a,s)=>a+s.amount,0))}</div>
      <div className="stat-sub">FCFA total</div>
    </div>
  </div>

  <div className="card">
    <div className="section-title"><h3>Performance par station</h3></div>
    <table>
      <thead><tr><th>Station</th><th>Ventes</th><th>Volume (L)</th><th>Chiffre (FCFA)</th><th>Stock restant</th></tr></thead>
      <tbody>
        {byStation.map(s => (
          <tr key={s.id}>
            <td style={{fontWeight:600}}>{s.name}</td>
            <td>{s.totalSales}</td>
            <td>{fmt(s.totalVolume)}</td>
            <td style={{color:"var(--gold)",fontWeight:600}}>{fmt(s.totalRevenue)}</td>
            <td>{fmt(s.stock)} L</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
const [user, setUser] = useState(null);
const [page, setPage] = useState("dashboard");
const [db, setDb] = useState(loadData);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [toastMsg, setToastMsg] = useState(null);

const saveDb = useCallback((newDb) => { setDb(newDb); saveData(newDb); }, []);
const toast = useCallback((msg, type = "success") => setToastMsg({ msg, type }), []);

if (!user) return (
<>
<style>{STYLES}</style>
<PinScreen onLogin={(u) => { setUser(u); setPage(u.role === "vendeur" ? "sale" : "dashboard"); }} />
</>
);

const isVendor = user.role === "vendeur";
const isGerant = user.role === "gérant";
const isAdmin = user.role === "admin";

const nav = [
{ id: "dashboard", label: "Dashboard", icon: "📊", section: "Navigation", show: true },
{ id: "sale", label: "Vente Essence", icon: "⛽", section: "Navigation", show: !isAdmin },
{ id: "stock", label: "Stock", icon: "📦", section: "Navigation", show: true },
{ id: "deliveries", label: "Livraisons", icon: "🚛", section: "Navigation", show: true },
{ id: "trucks", label: "Camions", icon: "🔧", section: "Gestion", show: true },
{ id: "personnel", label: "Personnel", icon: "👥", section: "Gestion", show: isGerant || isAdmin },
{ id: "stations", label: "Stations", icon: "🏪", section: "Gestion", show: isAdmin },
{ id: "map", label: "Carte", icon: "🗺", section: "Gestion", show: true },
{ id: "reports", label: "Rapports", icon: "📈", section: "Analytics", show: isGerant || isAdmin },
].filter(n => n.show);

const sections = [...new Set(nav.map(n => n.section))];

return (
<>
<style>{STYLES}</style>
<div className="app">
{/* SIDEBAR */}
<div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
<aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
<div className="sidebar-logo">
<h1>⛽ FuelPro</h1>
<p>Gestion de Stations</p>
<button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
</div>
<div className="sidebar-user">
<div className="sidebar-avatar">{user.name[0]}</div>
<div className="sidebar-user-info">
<p>{user.name}</p>
<span>{user.role}</span>
</div>
</div>
<nav className="sidebar-nav">
{sections.map(sec => (
<div key={sec}>
<div className="nav-section">{sec}</div>
{nav.filter(n => n.section === sec).map(n => (
<div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); setSidebarOpen(false); }}>
<span className="nav-icon">{n.icon}</span>
{n.label}
</div>
))}
</div>
))}
</nav>
<div className="sidebar-footer">
<button className="logout-btn" onClick={() => setUser(null)}>Déconnexion</button>
</div>
</aside>

    {/* MAIN */}
    <main className="main">
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
        <span className="mobile-topbar-title">⛽ FuelPro</span>
        <div className="mobile-user-badge">
          <span>{user.name.split(' ')[0]}</span>
          <span style={{color:'var(--gold)', fontSize:'0.7rem'}}>{user.role}</span>
        </div>
      </div>
      {page === "dashboard" && <Dashboard user={user} db={db} />}
      {page === "sale" && !isAdmin && <SaleForm user={user} db={db} onSave={saveDb} toast={toast} />}
      {page === "stock" && <Stock user={user} db={db} />}
      {page === "deliveries" && <Deliveries user={user} db={db} onSave={saveDb} toast={toast} />}
      {page === "trucks" && <Trucks user={user} db={db} onSave={saveDb} toast={toast} />}
      {page === "personnel" && (isGerant || isAdmin) && <Personnel user={user} db={db} onSave={saveDb} toast={toast} />}
      {page === "stations" && isAdmin && <Stations user={user} db={db} onSave={saveDb} toast={toast} />}
      {page === "map" && <MapView db={db} />}
      {page === "reports" && (isGerant || isAdmin) && <Reports user={user} db={db} />}
    </main>
  </div>

  {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
</>

);
}
