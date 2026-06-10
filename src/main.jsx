import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ROUTES from './Routes.jsx'
import './index.css'
import FactureProvider from './context/FactureContext.jsx'
import ProductProvider from './context/ProductContext.jsx'
import ClientProvider from './context/ClientContext.jsx'
import OrderProvider from './context/OrderContext.jsx'
import AuthProvider from './context/AuthContext.jsx'


const router = createBrowserRouter(ROUTES);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <ClientProvider>
          <FactureProvider >
            <OrderProvider>
              <RouterProvider router={router} />
            </OrderProvider>
          </FactureProvider>
        </ClientProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
