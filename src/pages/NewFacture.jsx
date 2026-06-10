import { useState, useReducer } from "react";
import Input from "../components/Input";

/*const [id, setId] = useState("")
const [numero, setNumero] = useState("")
const [client, setClient] = useState("")
const [montant, setMontant] = useState("")
const [date, setDate] = useState("")*/

const initialState = {
id : "", 
numero : "",
client : "",
montant : "",
date : ""
}

function reducer(state, action) {
  return { ...state, [action.type]: action.payload }
}


export default function NewFacture() { 
    const [state, dispatch] = useReducer(reducer, initialState); 
    
    const handleId = (val) => dispatch({ type: "setId", payload: val });
    const handleNumero = (val) => dispatch({ type: "setNumero", payload: val });
    const handleClient = (val) => dispatch({ type: "setClient", payload: val });
    const handleMontant = (val) => dispatch({ type: "setMontant", payload: val });
    const handleDate = (val) => dispatch({ type: "setDate", payload: val });

    return (
      <div className="page">
            <h2>Nouvelle facture</h2>
            <Input label="Id" value={state.id} onChange={handleId} />
            <Input label="numero"  value={state.numero}  onChange={handleNumero} />
            <Input label="client"  value={state.client}  onChange={handleClient} />
            <Input label="montant" value={state.montant} onChange={handleMontant} />
            <Input label="date"    value={state.date}    onChange={handleDate} />
      </div>
    ); 
}
