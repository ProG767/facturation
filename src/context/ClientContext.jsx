import { useContext, createContext, useState, useEffect } from "react"
import { api } from "../api"
import { useAuth } from "./AuthContext"



const ClientContext = createContext()

export default function ClientProvider({ children }) {
  const [clients, setClients] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return  // ← attend le token
    api.fetchClients()
      .then(data => setClients(data))
  }, [token])

  function addClient(client) {
    api.createClient(client)
      .then(data => setClients(prev => [...prev, data]))
  }

  function deleteClient(id) {
    api.removeClient(id)
      .then(() => setClients(prev => prev.filter(c => c.id !== id)))
  }

  return (
    <ClientContext.Provider value={{ clients, addClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClients() {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error("useClients doit être dans ClientProvider")
  return ctx
}