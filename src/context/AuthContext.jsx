import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../api"

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)  // ← ajout

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)  // ← termine le chargement
  }, [])

  function login(email, password) {
    return api.login(email, password)
      .then(data => {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      })
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être dans AuthProvider")
  return ctx
}
