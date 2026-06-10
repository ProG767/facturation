const db = require("./db")

// Vide les tables
db.exec(`
  DELETE FROM factures;
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM products;
  DELETE FROM clients;
`)

// Clients
const c1 = db.prepare("INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)").run("Alice Martin", "alice@mail.fr", "0601020304")
const c2 = db.prepare("INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)").run("Bob Dupont", "bob@mail.fr", "0605060708")

// Products
const p1 = db.prepare("INSERT INTO products (ref, name, price) VALUES (?, ?, ?)").run("REF001", "Prestation conseil", 150)
const p2 = db.prepare("INSERT INTO products (ref, name, price) VALUES (?, ?, ?)").run("REF002", "Développement web", 500)
const p3 = db.prepare("INSERT INTO products (ref, name, price) VALUES (?, ?, ?)").run("REF003", "Formation React", 300)

// Order 1
const o1 = db.prepare("INSERT INTO orders (client_id, numero, total, date) VALUES (?, ?, ?, ?)").run(c1.lastInsertRowid, "CMD-2026-0001", 650, "01/06/2026")
db.prepare("INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)").run(o1.lastInsertRowid, p1.lastInsertRowid, 1, 150)
db.prepare("INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)").run(o1.lastInsertRowid, p2.lastInsertRowid, 1, 500)

// Order 2
const o2 = db.prepare("INSERT INTO orders (client_id, numero, total, date) VALUES (?, ?, ?, ?)").run(c2.lastInsertRowid, "CMD-2026-0002", 300, "01/06/2026")
db.prepare("INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)").run(o2.lastInsertRowid, p3.lastInsertRowid, 1, 300)

// Facture 1
db.prepare("INSERT INTO factures (order_id, numero, date, total, status) VALUES (?, ?, ?, ?, ?)").run(o1.lastInsertRowid, "FAC-2026-0001", "01/06/2026", 650, "émise")

// Facture 2
db.prepare("INSERT INTO factures (order_id, numero, date, total, status) VALUES (?, ?, ?, ?, ?)").run(o2.lastInsertRowid, "FAC-2026-0002", "01/06/2026", 300, "payée")

console.log("✅ Seed terminé")