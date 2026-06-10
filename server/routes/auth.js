const express = require("express")
const router = express.Router()
const db = require("../db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "dev_secret"

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hash)
  res.json({ id: result.lastInsertRowid, email })
})

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (!user) return res.status(401).json({ error: "Utilisateur introuvable" })
  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "7d" })
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
})

module.exports = router