import { useState } from "react"
import { useOrders } from "../context/OrderContext"
import { useClients } from "../context/ClientContext"
import { useProducts } from "../context/ProductContext"
import { useNavigate } from "react-router-dom"

const INITIAL_FORM = { clientId: "", items: [{ productId: "", quantity: 1 }] }

export default function Orders() {
  const { orders, addOrder, deleteOrder, generateInvoice } = useOrders()
  const { clients } = useClients()
  const { products } = useProducts()
  const [form, setForm] = useState(INITIAL_FORM)
  const navigate = useNavigate()

  function handleClientChange(e) {
    setForm(prev => ({ ...prev, clientId: e.target.value }))
  }

  function handleItemChange(index, field, value) {
    const newItems = [...form.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setForm(prev => ({ ...prev, items: newItems }))
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...prev.items, { productId: "", quantity: 1 }] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.clientId || form.items.some(i => !i.productId)) return
    addOrder(Number(form.clientId), form.items.map(i => ({
      productId: Number(i.productId),
      quantity: Number(i.quantity)
    })))
    setForm(INITIAL_FORM)
  }

  return (
    <div className="page">
      <h1>Commandes</h1>

      <form onSubmit={handleSubmit}>
        <select value={form.clientId} onChange={handleClientChange} required>
          <option value="">-- Client --</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>

        {form.items.map((item, i) => (
          <div key={i}>
            <select value={item.productId} onChange={e => handleItemChange(i, "productId", e.target.value)} required>
              <option value="">-- Produit --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price}€</option>)}
            </select>
            <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(i, "quantity", e.target.value)} />
          </div>
        ))}

        <button type="button" onClick={addItem} className="btn-small" >+ Produit</button>
        <button type="submit" className="btn-small" >Créer commande</button>
      </form>

      <ul style={{ listStyle: "none" }}>
        {orders.map(o => (
          <li key={o.id}>
             {o.numero} — {o.date} — {o.nom} — {o.total}€
             <button onClick={() => {
              generateInvoice(o.id)
            }} className="btn-small" >Générer facture</button>
            <button onClick={() => deleteOrder(o.id)} className="btn-small btn-danger">Supprimer</button>
          </li>
        ))}
        <button onClick = {()=>navigate("/factures")} className="btn-small" >Voir factures</button>
      </ul>
    </div>
  )
}