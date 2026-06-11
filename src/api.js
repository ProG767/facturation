const BASE = "https://facturation.go-mi.com/api"

const getHeaders = () => {
  const token = localStorage.getItem("token")

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
}

export const api = {
  // Clients
  fetchClients:   () => fetch(`${BASE}/clients`, { headers: getHeaders() }).then(r => r.json()),
  createClient:   (data) => fetch(`${BASE}/clients`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  removeClient:   (id) => fetch(`${BASE}/clients/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),

  // Products
  fetchProducts:  () => fetch(`${BASE}/products`, { headers: getHeaders() }).then(r => r.json()),
  createProduct:  (data) => fetch(`${BASE}/products`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  removeProduct:  (id) => fetch(`${BASE}/products/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),

  // Orders
  fetchOrders:    () => fetch(`${BASE}/orders`, { headers: getHeaders() }).then(r => r.json()),
  createOrder:    (data) => fetch(`${BASE}/orders`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  removeOrder:    (id) => fetch(`${BASE}/orders/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),

  // Factures
  fetchFactures:  () => fetch(`${BASE}/factures`, { headers: getHeaders() }).then(r => r.json()),
  createFacture:  (data) => fetch(`${BASE}/factures`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  removeFacture:  (id) => fetch(`${BASE}/factures/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),
  updateFactureStatus: (id, status) => fetch(`${BASE}/factures/${id}/status`, { method: "PUT", headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Auth — pas de token nécessaire
  login:    (email, password) => fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(r => r.json()),
  register: (email, password) => fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(r => r.json()),

sendFactureMail: (id, mailData) => fetch(`${BASE}/mail/facture/${id}`, {
  method: "POST",
  headers: getHeaders(),
  body: JSON.stringify(mailData)
}).then(r => r.json()),

exportFactureX: (id) => fetch(`${BASE}/export/facture/${id}`, {
  headers: getHeaders()
}).then(r => r.json()),

}

