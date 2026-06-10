const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")
const db = require("../db")

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

router.post("/facture/:id", async (req, res) => {
  const { to, subject, message, pdfBase64 } = req.body

  const facture = db.prepare(`
    SELECT factures.*, clients.nom, clients.email
    FROM factures
    LEFT JOIN orders ON factures.order_id = orders.id
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE factures.id = ?
  `).get(req.params.id)

  if (!facture) return res.status(404).json({ error: "Facture introuvable" })

  const attachments = pdfBase64 ? [{
    filename: `${facture.numero}.pdf`,
    content: Buffer.from(pdfBase64, "base64"),
    contentType: "application/pdf"
  }] : []

  transporter.sendMail({
    from: "Facturation <contact@go-mi.com>",
    to: to || facture.email,
    subject: subject || `Facture ${facture.numero}`,
    html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
    attachments
  })
  .then(() => res.json({ success: true, to }))
  .catch(err => res.status(500).json({ error: err.message }))
})

module.exports = router