const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*, clients.nom, clients.email
    FROM orders
    LEFT JOIN clients ON orders.client_id = clients.id
  `).all()
  res.json(orders)
})

router.get("/:id", (req, res) => {
  const order = db.prepare(`
    SELECT orders.*, clients.nom, clients.email
    FROM orders
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE orders.id = ?
  `).get(req.params.id)
  if (!order) return res.status(404).json({ error: "Commande introuvable" })
  const items = db.prepare(`
    SELECT order_items.*, products.ref, products.name, products.price
    FROM order_items
    LEFT JOIN products ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
  `).all(order.id)
  res.json({ ...order, items })
})

router.post("/", (req, res) => {
  const { client_id, items, total, date, numero } = req.body
  const result = db.prepare("INSERT INTO orders (client_id, numero, total, date) VALUES (?, ?, ?, ?)").run(client_id, numero, total, date)
  const order_id = result.lastInsertRowid
  const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)")
  items.forEach(item => {
    insertItem.run(order_id, item.product_id, item.quantity, item.subtotal)
  })
  const order = db.prepare(`
    SELECT orders.*, clients.nom, clients.email
    FROM orders
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE orders.id = ?
  `).get(order_id)
  res.json({ ...order, items })
})

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM order_items WHERE order_id = ?").run(req.params.id)
  db.prepare("DELETE FROM orders WHERE id = ?").run(req.params.id)
  res.json({ deleted: req.params.id })
})

module.exports = router
