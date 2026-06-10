import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../api"
import { useAuth } from "./AuthContext"

const ProductContext = createContext(null)

export default function ProductProvider({children}){
    const [products, setProducts] = useState([])
    const { token } = useAuth()

   
  useEffect(() => {
    if (!token) return
      api.fetchProducts()
        .then(data => setProducts(data))
    }, [token])
  

  function addProduct(product) {
    api.createProduct(product)
    .then(data=> setProducts(prev =>[...prev,data]))
  }

  function deleteProduct(id) {
    api.removeProduct(id)
    .then(()=>(setProducts(prev =>prev.filter(p => p.id!==id))))
  }


    return (
        <ProductContext.Provider value = {{products, addProduct, deleteProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts(){
     const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts doit être dans ProductProvider");
  return ctx;

}