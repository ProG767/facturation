import { useFacture } from "../context/FactureContext"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"

export default function Factures() {
  const { factures, deleteFacture } = useFacture()
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1>Factures</h1>
      {factures.map((f) => (
        <div key={f.id}>
          <p>{f.numero} — {f.nom} — {f.total}€ — {f.date}</p>
          <Button label="Voir" onClick={() => navigate("/facture/" + f.id)} className="btn-small" />
          <Button label="Supprimer" onClick={() => deleteFacture(f.id)} className="btn-small btn-danger" />
        </div>
      ))}
    </div>
  )
}
