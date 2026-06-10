import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    login(form.email, form.password)
      .then(() => navigate("/factures"))
      .catch(() => setError("Email ou mot de passe incorrect"))
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 30 }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" type="password" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}
