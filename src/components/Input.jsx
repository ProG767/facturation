export default function Input({ label, value, onChange, type = "text", placeholder = "" }) { 
    return (
    <div>
        <label>{label}</label>
        <input 
            type={type} 
            value={value} 
            placeholder={placeholder} 
            onChange={(e) => onChange(e.target.value)} 
            />
        </div>); 
    }
