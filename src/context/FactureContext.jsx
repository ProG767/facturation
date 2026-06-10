import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../api"
import { useAuth } from "./AuthContext"



const FactureContext = createContext()

export default function FactureProvider({ children }) {
  const { token } = useAuth()
  const [factures, setFactures] = useState([])

  useEffect(() => {
    if (!token) return  // ← attend le token
    console.log("fetch factures avec token:", token)
    api.fetchFactures()
        .then(data => {
        console.log("factures reçues:", data)  // ← remet ce log
        setFactures(data)
      })
      .catch(err => console.log("erreur factures:", err))
  }
  , [token])

  function addFacture(order) {
    const year = new Date().getFullYear()  // ← ajoute cette ligne
    const payload = {
      order_id: order.id,
      numero: `FAC-${year}-${String(factures.length + 1).padStart(4, "0")}`,
      date: new Date().toLocaleDateString("fr-FR"),
      total: order.total,
      status: "émise"
    }

    api.createFacture(payload)
      .then(data => setFactures(prev => [...prev, { ...data, order }]))
  }

  function updateStatus(id, status) {
  api.updateFactureStatus(id, status)
    .then(() => setFactures(prev =>
      prev.map(f => f.id === id ? { ...f, status } : f)
    ))
}

  function deleteFacture(id) {
    api.removeFacture(id)
      .then(() => setFactures(prev => prev.filter(f => f.id !== id)))
  }

  return (
    <FactureContext.Provider value={{ factures, addFacture, updateStatus, deleteFacture }}>
      {children}
    </FactureContext.Provider>
  )
}

export function useFacture() {
  const ctx = useContext(FactureContext)
  if (!ctx) throw new Error("useFacture doit être dans FactureProvider")
  return ctx
}