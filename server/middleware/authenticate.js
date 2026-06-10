const jwt = require("jsonwebtoken")
const SECRET = process.env.JWT_SECRET || "dev_secret"

module.exports = function authenticate(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: "Token manquant" })
  const token = auth.split(" ")[1]
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: "Token invalide" })
  }
}