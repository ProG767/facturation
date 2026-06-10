import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFacture } from "../context/FactureContext"
import Button from "../components/Button"
import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import InvoicePDF from "./InvoicePDF"
import { api } from "../api"

export default function Facture() {
  const { id } = useParams()
  const { factures, updateStatus } = useFacture()
  const navigate = useNavigate()

  const facture = factures.find(f => f.id === Number(id))

  const [mailForm, setMailForm] = useState({ to: "", subject: "", message: "" })
  const [mailSent, setMailSent] = useState(false)

  useEffect(() => {
    if (!facture) return
    setMailForm({
      to: facture.email || "",
      subject: `Facture ${facture.numero}`,
      message: `Bonjour ${facture.nom},\n\nVeuillez trouver ci-joint votre facture ${facture.numero} d'un montant de ${facture.total}€.\n\nCordialement`
    })
  }, [facture?.id])

  if (!facture) return <p>Facture introuvable</p>

  async function handleSendMail() {
  // Génère le PDF depuis InvoicePDF
  const blob = await pdf(<InvoicePDF facture={facture} />).toBlob()
  
  // Convertit en base64
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = () => {
    const base64 = reader.result.split(",")[1]
    
    api.sendFactureMail(facture.id, { ...mailForm, pdfBase64: base64 })
      .then(() => setMailSent(true))
      .catch(() => alert("Erreur envoi mail"))
  }
}

function handleDownloadXML() {
  api.exportFactureX(facture.id)
    .then(data => {
      const blob = new Blob([data.xml], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${data.numero}-facturx.xml`
      a.click()
    })
}



  return (
    <div className="page">
      <h1 className="facture-numero">{facture.numero}</h1>
      <p>Date : {facture.date}</p>
      <p>Status : <span className={`badge badge-${facture.status === "payée" ? "payee" : facture.status === "annulée" ? "annulee" : "emise"}`}>{facture.status}</span></p>

      <h2>Client</h2>
      <p>{facture.nom}</p>
      <p className="text-muted">{facture.email}</p>

      <h2>Produits</h2>
      <ul>
        {facture.items?.map((item, index) => (
          <li key={index}>
            {item.ref} – {item.name} — {item.quantity} x {item.price}€ = <strong>{item.subtotal}€</strong>
          </li>
        ))}
      </ul>

      <p className="total">Total : {facture.total}€</p>

      <div className="facture-actions">
        <select value={facture.status} onChange={e => updateStatus(facture.id, e.target.value)}>
          <option value="émise">Émise</option>
          <option value="payée">Payée</option>
          <option value="annulée">Annulée</option>
        </select>
        <Button label="Retour" onClick={() => navigate("/factures")} />
        <PDFDownloadLink
          document={<InvoicePDF facture={facture} />}
          fileName={`${facture.numero}.pdf`}
          className="pdf-link"
        >
          {({ loading }) => loading ? "Génération..." : "Télécharger PDF"}
        </PDFDownloadLink>
      </div>

      <PDFViewer width="100%" height={500} style={{ marginTop: 30, border: "none" }}>
        <InvoicePDF facture={facture} />
      </PDFViewer>

      <div style={{ marginTop: 30, borderTop: "1px solid #eee", paddingTop: 20 }}>
        <h2>Envoyer par mail</h2>
        {mailSent && <p style={{ color: "green" }}>✅ Mail envoyé à {mailForm.to}</p>}
        <input
          value={mailForm.to}
          onChange={e => setMailForm(prev => ({ ...prev, to: e.target.value }))}
          placeholder="Destinataire"
        />
        <input
          value={mailForm.subject}
          onChange={e => setMailForm(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="Sujet"
        />
        <textarea
          value={mailForm.message}
          onChange={e => setMailForm(prev => ({ ...prev, message: e.target.value }))}
          rows={6}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, marginBottom: 10 }}
        />
        <button onClick={handleSendMail}>Envoyer</button>
        <button onClick={handleDownloadXML}>Télécharger Factur-X XML</button>
      </div>
    </div>
  )
}