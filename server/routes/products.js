const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all()
  res.json(products)
})

router.get("/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id)
  if (!product) return res.status(404).json({ error: "Produit introuvable" })
  res.json(product)
})

router.post("/", (req, res) => {
  const { ref, name, price } = req.body
  const result = db.prepare("INSERT INTO products (ref, name, price) VALUES (?, ?, ?)").run(ref, name, price)
  res.json({ id: result.lastInsertRowid, ref, name, price })
})

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id)
  res.json({ deleted: req.params.id })
})

module.exports = router