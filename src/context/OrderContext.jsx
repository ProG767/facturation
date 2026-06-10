import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../api"
import { useClients } from "./ClientContext"
import { useProducts } from "./ProductContext"
import { useFacture } from "./FactureContext"
import { useAuth } from "./AuthContext"



const OrderContext = createContext(null)

export default function OrderProvider({ children }) {
  const { clients } = useClients()
  const { products } = useProducts()
  const { addFacture } = useFacture()
  const [orders, setOrders] = useState([])
  const year = new Date().getFullYear()
  const numero = `CMD-${year}-${String(orders.length + 1).padStart(4, "0")}`
  const { token } = useAuth()


  useEffect(() => {
    if (!token) return  // ← attend le token
    api.fetchOrders()
      .then(data => setOrders(data))
  }, [token])

  function addOrder(clientId, items) {
    const client = clients.find(c => c.id === clientId)

    const resolvedItems = items.map(({ productId, quantity }) => {
      const product = products.find(p => p.id === productId)
      return {
        product_id: product.id,
        ref: product.ref,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity
      }
    })

    const total = resolvedItems.reduce((sum, i) => sum + i.subtotal, 0)
    const date = new Date().toLocaleDateString("fr-FR")

    const payload = {
      client_id: clientId,
      numero,
      items: resolvedItems.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        subtotal: i.subtotal
      })),
      total,
      date
    }

    api.createOrder(payload)
      .then(data => setOrders(prev => [...prev, { ...data, nom: client.nom, email: client.email, items: resolvedItems }]))
  }

  function deleteOrder(id) {
    api.removeOrder(id)
      .then(() => setOrders(prev => prev.filter(o => o.id !== id)))
  }

  function generateInvoice(orderId) {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    return addFacture(order)
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, deleteOrder, generateInvoice }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders doit être dans OrderProvider")
  return ctx
}