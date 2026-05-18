# ⛽ FuelPro — Gestion de Stations Service

Application web de gestion de stations service multi-sites.

## Fonctionnalités

- 🔐 **Authentification par PIN** (4 chiffres) — rôles : vendeur, gérant, admin
- 📊 **Dashboard** — état du stock, livraisons, ventes du jour
- ⛽ **Formulaire de vente** (essence uniquement)
- 📦 **Gestion du stock** par station
- 🚛 **Livraisons** — planification et confirmation
- 🔧 **Flotte de camions** — statuts, chauffeurs
- 👥 **Personnel** — ajout/suppression d'employés
- 🏪 **Stations** — gestion multi-sites avec localisation
- 🗺 **Carte** — visualisation géographique des prix
- 📈 **Rapports** — chiffre d'affaires, volumes par station

## Accès démo

| Rôle    | PIN  |
|---------|------|
| Vendeur | 2222 |
| Gérant  | 1234 |
| Admin   | 0000 |

## Stack

- **Frontend :** React 18 + Vite
- **Styles :** CSS-in-JS inline (noir / blanc / or)
- **Stockage :** localStorage (démo) — schéma SQL PostgreSQL disponible dans `fuelprodb.sql`

## Lancer en local

```bash
npm install
npm run dev
```

## Base de données

Le fichier `fuelprodb.sql` contient le schéma complet compatible PostgreSQL/SQLite avec :
- Tables : stations, users, trucks, deliveries, sales, price_history
- Vues : v_daily_sales, v_low_stock, v_active_deliveries
- Triggers : mise à jour automatique du stock
- Index de performance

## Couleurs

| Variable | Valeur |
|----------|--------|
| Or       | #C9A84C |
| Noir     | #0A0A0A |
| Blanc    | #F5F5F0 |
