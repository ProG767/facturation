const dotenv = require("dotenv")         // lit les variables du fichier .env
dotenv.config()                          // charge PORT=3001 dans process.env

const express = require("express")       // framework HTTP — gère les routes
const cors = require("cors")             // autorise le frontend (port 5173) à appeler le backend (port 3001)
const clientsRouter = require("./routes/clients") // Ajouts des toues dans un 2em temps + Ligne 14 
const productsRouter = require("./routes/products")
const ordersRouter = require("./routes/orders")
const facturesRouter = require("./routes/factures")
const authRouter = require("./routes/auth")
const mailRouter = require("./routes/mail")
const exportRouter = require("./routes/export")




const app = express()                    // crée l'application serveur
app.use(cors())                          // active CORS pour toutes les routes
app.use(express.json())                  // parse automatiquement le JSON des requêtes


const authenticate = require("./middleware/authenticate")

app.use("/api/clients", authenticate, clientsRouter)  // toutes les routes clients // ajouté dans un secon temps apres créationd es routes, puis les autres ci-dessous
app.use("/api/products", authenticate, productsRouter)
app.use("/api/orders", authenticate, ordersRouter)
app.use("/api/factures", authenticate, facturesRouter)
app.use("/api/mail", authenticate, mailRouter)
app.use("/api/export", authenticate, exportRouter)

app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 3001    // utilise .env ou 3001 par défaut

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// démarre le serveur — écoute les requêtes sur le port défini