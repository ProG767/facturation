import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()  // ← ajoute user
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <header className="nav">
      <nav>
        <Link to="/factures" style={{ fontWeight: 600, fontSize: 16 }}>Facturation</Link>
        {user && (
          <>
            <Link to="/clients" style={{ fontWeight: 600, fontSize: 16 }} >Clients</Link>
            <Link to="/products" style={{ fontWeight: 600, fontSize: 16 }}>Produits</Link>
            <Link to="/orders" style={{ fontWeight: 600, fontSize: 16 }}>Commandes</Link>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  )
}