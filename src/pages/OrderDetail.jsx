import { useOrders } from "../context/OrderContext";
import { useNavigate, useParams } from "react-router-dom";
import InvoicePDF from "../pages/InvoicePDF.jsx"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"

export default function OrderDetail() {
  const { orders } = useOrders()
  const navigate = useNavigate()
  const { id } = useParams()

  const order = orders.find(o => o.id === Number(id))
  if (!order) return <p>Commande introuvable</p>

  return (
    <div className="page">
      <h1>Commande #{order.id}</h1>
      <p>Date : {order.date}</p>

      <h2>Client</h2>
      <p>{order.nom}</p>
      <p>{order.email}</p>
      <p>{order.address}</p>

      <h2>Produits</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.ref} – {item.name} — {item.quantity} x {item.price}€ = {item.subtotal}€
          </li>
        ))}
      </ul>

      <p>Total : {order.total}€</p>

      <button onClick={() => navigate("/orders")}>Retour</button>

      <PDFDownloadLink
        document={<InvoicePDF order={order} />}
        fileName={`commande-${order.id}.pdf`}
        style={{ textDecoration: "none", color: "blue" }}
      >
        {({ loading }) => loading ? "Génération..." : "Télécharger PDF"}
      </PDFDownloadLink>

      <PDFViewer width="100%" height={600}>
        <InvoicePDF order={order} />
      </PDFViewer>
    </div>
  )
}