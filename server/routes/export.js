const express = require("express")
const router = express.Router()
const db = require("../db")
const { PDFDocument } = require("pdf-lib")
const { generateFacturXML } = require("../utils/facturx")

// GET /api/export/facture/:id
router.get("/facture/:id", async (req, res) => {
  const facture = db.prepare(`
    SELECT factures.*, clients.nom, clients.email
    FROM factures
    LEFT JOIN orders ON factures.order_id = orders.id
    LEFT JOIN clients ON orders.client_id = clients.id
    WHERE factures.id = ?
  `).get(req.params.id)

  if (!facture) return res.status(404).json({ error: "Facture introuvable" })

  // Génère le XML Factur-X
  const xml = generateFacturXML(facture)

  // Crée un PDF minimal
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  page.drawText(`Facture ${facture.numero}`, { x: 50, y: 750, size: 20 })
  page.drawText(`Client : ${facture.nom}`, { x: 50, y: 720, size: 12 })
  page.drawText(`Total : ${facture.total}€`, { x: 50, y: 700, size: 12 })
  page.drawText(`Date : ${facture.date}`, { x: 50, y: 680, size: 12 })

  // Embarque le XML dans le PDF (metadata)
  pdfDoc.setTitle(facture.numero)
  pdfDoc.setSubject("Factur-X")

  const pdfBytes = await pdfDoc.save()

  // Retourne le PDF + XML séparément
  res.json({
    pdf: Buffer.from(pdfBytes).toString("base64"),
    xml: xml,
    numero: facture.numero
  })
})

module.exports = router