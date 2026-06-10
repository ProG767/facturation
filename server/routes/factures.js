const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {
  const factures = db.prepare(`
    SELECT factures.*, clients.nom, clients.email
    FROM factures
    LEFT JOIN orders ON factures.order_id = orders.id
    LEFT JOIN clients ON orders.client_id = clients.id
  `).all()

  // Ajoute les items à chaque facture
  const result = factures.map(f => {
    const items = db.prepare(`
      SELECT order_items.*, products.ref, products.name, products.price
      FROM order_items
      LEFT JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
    `).all(f.order_id)
    return { ...f, items }
  })

  res.json(result)
})

router.get("/:id", (req, res) => {
  const facture = db.prepare(`
    SELECT factures.*, clients.nom, clients.email
    FROM factures
    LEFT JOIN orders ON factures.order_id = orders.id
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE factures.id = ?
  `).get(req.params.id)
  if (!facture) return res.status(404).json({ error: "Facture introuvable" })
  const items = db.prepare(`
    SELECT order_items.*, products.ref, products.name, products.price
    FROM order_items
    LEFT JOIN products ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
  `).all(facture.order_id)
  res.json({ ...facture, items })
})

router.post("/", (req, res) => {
  const { order_id, numero, date, total, status = "émise" } = req.body
  const result = db.prepare("INSERT INTO factures (order_id, numero, date, total) VALUES (?, ?, ?, ?)").run(order_id, numero, date, total)
  
  // Retourne la facture complète avec jointures
  const facture = db.prepare(`
    SELECT factures.*, clients.nom, clients.email
    FROM factures
    LEFT JOIN orders ON factures.order_id = orders.id
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE factures.id = ?
  `).get(result.lastInsertRowid)

  const items = db.prepare(`
    SELECT order_items.*, products.ref, products.name, products.price
    FROM order_items
    LEFT JOIN products ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
  `).all(facture.order_id)

  res.json({ ...facture, items })
})

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM factures WHERE id = ?").run(req.params.id)
  res.json({ deleted: req.params.id })
})

router.put("/:id/status", (req, res) => {
  const { status } = req.body
  db.prepare("UPDATE factures SET status = ? WHERE id = ?").run(status, req.params.id)
  res.json({ id: req.params.id, status })
})

module.exports = router
