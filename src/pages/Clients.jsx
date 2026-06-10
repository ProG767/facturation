import { useState } from "react"
import { useClients } from "../context/ClientContext"

export default function Clients() {
  const { clients, addClient, deleteClient } = useClients()
  const [form, setForm] = useState({ nom: "", email: "", telephone: "" })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    if (!form.nom) return
    addClient(form)
    setForm({ nom: "", email: "", telephone: "" })
  }

  return (
    <div className="page">
      <h1>Clients</h1>

      <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
      <button onClick={handleSubmit} className="btn-small" >Ajouter</button>

      <ul style={{ listStyle: "none" }}>
        {clients.map((c) => (
          <li key={c.id}>
            {c.nom} — {c.email} — {c.telephone}
            <button onClick={() => deleteClient(c.id)} className="btn-small btn-danger">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}