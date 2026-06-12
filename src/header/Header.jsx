import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <header className="nav">
      <nav>
        {user && (
            <button onClick={handleLogout} title="Déconnexion" style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
              color: "#444"
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
        <Link to="/factures" style={{ fontWeight: 600, fontSize: 16 }}>Facturation</Link>
        {user && (
          <>
            <Link to="/clients">Clients</Link>
            <Link to="/products">Produits</Link>
            <Link to="/orders">Commandes</Link>
          </>
        )}
      </nav>
    </header>
  )
}