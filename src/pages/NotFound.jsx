import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function NotFound() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <p>404 - Page introuvable</p>
}