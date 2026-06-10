const express = require("express")
const router = express.Router()
const db = require("../db")

// GET — liste tous les clients
router.get("/", (req, res) => {
  const clients = db.prepare("SELECT * FROM clients").all()
  res.json(clients)
})

// GET — un client par id
router.get("/:id", (req, res) => {
  const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(req.params.id)
  if (!client) return res.status(404).json({ error: "Client introuvable" })
  res.json(client)
})

// POST — créer un client
router.post("/", (req, res) => {
  const { nom, email, telephone } = req.body
  const result = db.prepare("INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)").run(nom, email, telephone)
  res.json({ id: result.lastInsertRowid, nom, email, telephone })
})

// DELETE — supprimer un client
router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id)
  res.json({ deleted: req.params.id })
})

module.exports = router