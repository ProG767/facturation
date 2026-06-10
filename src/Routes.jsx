import Facture from "./pages/Facture";
import Factures from "./pages/Factures";
import NewFacture from "./pages/NewFacture";
import NotFound from "./pages/NotFound";
import App from "./App";
import { Navigate } from "react-router-dom";
import RootError from "./errors/RootError";
import PageError from "./errors/PageError";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";




const ROUTES = [{
    path : "/", element: <App />, 
    errorElement:<RootError/>,
    children: [
    {index: true,           element: <Navigate to ="/login" />},
    { path: "login",  element: <Login />, errorElement: <PageError /> },
    { path: "facture/:id",  element: <PrivateRoute><Facture /></PrivateRoute>, errorElement: <PageError /> },
    { path: "factures",     element: <PrivateRoute><Factures /></PrivateRoute>, errorElement: <PageError /> },
    { path: "new",          element: <NewFacture />, errorElement: <PageError /> },
    { path: "*",            element: <NotFound />, errorElement: <PageError /> },
    { path: "clients",       element: <PrivateRoute><Clients /></PrivateRoute>, errorElement: <PageError />},
    { path: "products",       element: <PrivateRoute><Products /></PrivateRoute>, errorElement: <PageError />},
    { path: "orders",       element: <PrivateRoute><Orders /></PrivateRoute>, errorElement: <PageError />},
    { path: "order/:id",       element: <PrivateRoute><OrderDetail /></PrivateRoute>, errorElement: <PageError />},
    ],},
]
export default ROUTES;