export default function Button({ label, onClick, disabled, className }) {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {label}
    </button>
  )
}