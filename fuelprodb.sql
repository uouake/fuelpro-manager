-- ═══════════════════════════════════════════════════════════════
--  FUELPR0 — Schéma de Base de Données
--  Compatible: PostgreSQL / MySQL / SQLite
-- ═══════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────
-- 1. STATIONS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE stations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            VARCHAR(100)   NOT NULL,
    city            VARCHAR(100)   NOT NULL,
    address         TEXT,
    latitude        DECIMAL(10,7)  NOT NULL,
    longitude       DECIMAL(10,7)  NOT NULL,
    price_per_liter DECIMAL(10,2)  NOT NULL DEFAULT 0,
    stock_liters    DECIMAL(12,2)  NOT NULL DEFAULT 0,
    capacity_liters DECIMAL(12,2)  NOT NULL DEFAULT 30000,
    is_active       BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at      DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME       DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales
INSERT INTO stations (name, city, address, latitude, longitude, price_per_liter, stock_liters, capacity_liters) VALUES
  ('Station Plateau',   'Abidjan', 'Rue du Commerce, Plateau',      5.3203, -4.0185, 750, 12000, 30000),
  ('Station Cocody',    'Abidjan', 'Av. Christiani, Cocody',        5.3467, -3.9870, 745, 8000,  25000),
  ('Station Yopougon',  'Abidjan', 'Bd de Marseille, Yopougon',     5.3274, -4.0742, 740, 5000,  20000);


-- ───────────────────────────────────────────────────────────────
-- 2. UTILISATEURS / PERSONNEL
-- ───────────────────────────────────────────────────────────────
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(150)  NOT NULL,
    pin_hash    VARCHAR(255)  NOT NULL,            -- Stockez un hash (bcrypt), jamais en clair
    role        VARCHAR(20)   NOT NULL CHECK (role IN ('admin','gérant','vendeur')),
    station_id  INTEGER       REFERENCES stations(id) ON DELETE SET NULL,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login  DATETIME,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales (PIN stockés en clair ici pour la démo — hashezles en prod)
INSERT INTO users (name, pin_hash, role, station_id) VALUES
  ('Admin Système',   '0000', 'admin',   NULL),
  ('Kouamé Jean',     '1234', 'gérant',  1),
  ('Traoré Fatou',    '2222', 'vendeur', 1),
  ('Bamba Soro',      '3333', 'gérant',  2),
  ('Diallo Ibrahim',  '4444', 'vendeur', 2);


-- ───────────────────────────────────────────────────────────────
-- 3. CAMIONS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE trucks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    plate           VARCHAR(20)   NOT NULL UNIQUE,
    capacity_liters DECIMAL(12,2) NOT NULL,
    driver_name     VARCHAR(150),
    status          VARCHAR(20)   NOT NULL DEFAULT 'disponible'
                    CHECK (status IN ('disponible','en livraison','maintenance')),
    station_id      INTEGER       REFERENCES stations(id) ON DELETE SET NULL,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO trucks (plate, capacity_liters, driver_name, status, station_id) VALUES
  ('AB-1234-CI', 15000, 'Koné Mamadou',      'disponible',   1),
  ('CD-5678-CI', 20000, 'Ouédraogo Issouf',  'en livraison', 1),
  ('EF-9012-CI', 10000, 'Touré Sékou',       'disponible',   2);


-- ───────────────────────────────────────────────────────────────
-- 4. LIVRAISONS
-- ───────────────────────────────────────────────────────────────
CREATE TABLE deliveries (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    truck_id        INTEGER       NOT NULL REFERENCES trucks(id),
    station_id      INTEGER       NOT NULL REFERENCES stations(id),
    volume_liters   DECIMAL(12,2) NOT NULL,
    planned_date    DATE          NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'en cours'
                    CHECK (status IN ('en cours','terminée','annulée')),
    confirmed_by    INTEGER       REFERENCES users(id),
    confirmed_at    DATETIME,
    notes           TEXT,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO deliveries (truck_id, station_id, volume_liters, planned_date, status, confirmed_by) VALUES
  (2, 1, 15000, '2026-05-08', 'en cours',  NULL),
  (1, 2, 10000, '2026-05-07', 'terminée',  5),
  (3, 3, 8000,  '2026-05-06', 'terminée',  3);


-- ───────────────────────────────────────────────────────────────
-- 5. VENTES
-- ───────────────────────────────────────────────────────────────
CREATE TABLE sales (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id          INTEGER       NOT NULL REFERENCES stations(id),
    vendor_id           INTEGER       NOT NULL REFERENCES users(id),
    volume_liters       DECIMAL(10,2) NOT NULL,
    price_per_liter     DECIMAL(10,2) NOT NULL,   -- Prix snapshot au moment de la vente
    total_amount        DECIMAL(12,2) NOT NULL,
    payment_method      VARCHAR(30)   NOT NULL DEFAULT 'espèces'
                        CHECK (payment_method IN ('espèces','carte','mobile money')),
    sale_date           DATE          NOT NULL,
    sale_time           TIME          NOT NULL,
    created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sales (station_id, vendor_id, volume_liters, price_per_liter, total_amount, payment_method, sale_date, sale_time) VALUES
  (1, 3, 30, 750, 22500, 'espèces',      '2026-05-10', '08:15'),
  (1, 3, 50, 750, 37500, 'carte',        '2026-05-10', '09:30'),
  (2, 5, 40, 745, 29800, 'mobile money', '2026-05-10', '07:45'),
  (1, 3, 25, 750, 18750, 'espèces',      '2026-05-09', '14:20');


-- ───────────────────────────────────────────────────────────────
-- 6. HISTORIQUE DES PRIX
-- ───────────────────────────────────────────────────────────────
CREATE TABLE price_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id      INTEGER       NOT NULL REFERENCES stations(id),
    price_per_liter DECIMAL(10,2) NOT NULL,
    changed_by      INTEGER       REFERENCES users(id),
    changed_at      DATETIME      DEFAULT CURRENT_TIMESTAMP
);


-- ───────────────────────────────────────────────────────────────
-- 7. VUES UTILES
-- ───────────────────────────────────────────────────────────────

-- Vue: Résumé des ventes par station et par jour
CREATE VIEW v_daily_sales AS
SELECT
    s.sale_date,
    st.name          AS station_name,
    st.city,
    COUNT(s.id)      AS nb_sales,
    SUM(s.volume_liters)  AS total_volume,
    SUM(s.total_amount)   AS total_revenue
FROM sales s
JOIN stations st ON st.id = s.station_id
GROUP BY s.sale_date, st.id, st.name, st.city
ORDER BY s.sale_date DESC, total_revenue DESC;

-- Vue: Stock critique (< 20% capacité)
CREATE VIEW v_low_stock AS
SELECT
    id,
    name,
    city,
    stock_liters,
    capacity_liters,
    ROUND((stock_liters * 100.0 / capacity_liters), 1) AS stock_pct,
    price_per_liter
FROM stations
WHERE (stock_liters * 1.0 / capacity_liters) < 0.20
  AND is_active = TRUE;

-- Vue: Livraisons en cours avec détails
CREATE VIEW v_active_deliveries AS
SELECT
    d.id,
    d.planned_date,
    d.volume_liters,
    d.status,
    t.plate          AS truck_plate,
    t.driver_name,
    st.name          AS station_name,
    st.city
FROM deliveries d
JOIN trucks   t  ON t.id  = d.truck_id
JOIN stations st ON st.id = d.station_id
WHERE d.status = 'en cours'
ORDER BY d.planned_date;


-- ───────────────────────────────────────────────────────────────
-- 8. TRIGGERS — Mise à jour automatique du stock
-- ───────────────────────────────────────────────────────────────

-- Trigger: Confirmation d'une livraison → ajout au stock
CREATE TRIGGER trg_delivery_confirmed
AFTER UPDATE ON deliveries
FOR EACH ROW
WHEN NEW.status = 'terminée' AND OLD.status != 'terminée'
BEGIN
    UPDATE stations
    SET stock_liters = MIN(capacity_liters, stock_liters + NEW.volume_liters),
        updated_at   = CURRENT_TIMESTAMP
    WHERE id = NEW.station_id;
END;

-- Trigger: Vente → déduction du stock
CREATE TRIGGER trg_sale_stock_deduction
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
    UPDATE stations
    SET stock_liters = MAX(0, stock_liters - NEW.volume_liters),
        updated_at   = CURRENT_TIMESTAMP
    WHERE id = NEW.station_id;
END;

-- Trigger: Historique automatique des prix
CREATE TRIGGER trg_price_history
AFTER UPDATE OF price_per_liter ON stations
FOR EACH ROW
WHEN NEW.price_per_liter != OLD.price_per_liter
BEGIN
    INSERT INTO price_history (station_id, price_per_liter)
    VALUES (NEW.id, NEW.price_per_liter);
END;


-- ───────────────────────────────────────────────────────────────
-- 9. INDEX
-- ───────────────────────────────────────────────────────────────
CREATE INDEX idx_sales_station_date   ON sales(station_id, sale_date);
CREATE INDEX idx_sales_vendor         ON sales(vendor_id);
CREATE INDEX idx_deliveries_station   ON deliveries(station_id, status);
CREATE INDEX idx_deliveries_truck     ON deliveries(truck_id);
CREATE INDEX idx_users_role           ON users(role);

-- ═══════════════════════════════════════════════════════════════
-- FIN DU SCRIPT
-- ═══════════════════════════════════════════════════════════════
