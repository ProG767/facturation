import { useState } from "react"
import { useProducts } from "../context/ProductContext"


const INITIAL_STATE = { name: "", price: "", ref: "" }

export default function ProductPage() {
  const { products, addProduct, deleteProduct } = useProducts()
  const [form, setForm] = useState(INITIAL_STATE)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }


 function handleSubmit(e) {
    e.preventDefault()
    addProduct({ ...form, price: Number(form.price) })
    setForm(INITIAL_STATE)
  }


  return (
    <div className="page">
      <h1>Produits</h1>

        <form onSubmit={handleSubmit}>
            <input name="ref"   value={form.ref}   onChange={handleChange} placeholder="Référence" required />
            <input name="name"  value={form.name}  onChange={handleChange} placeholder="Nom" required />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Prix" type="number" required />
            <button type="submit" className="btn-small" >Ajouter</button>
        </form>

      <ul style={{ listStyle: "none" }}>
        {products.map(p => (
          <li key={p.id}>
            {p.ref} — {p.name} — {p.price}€
            <button onClick={() => deleteProduct(p.id)} className="btn-small btn-danger">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}