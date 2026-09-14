import './Label.css'

// Eyebrow label, format "01 / OBSERVE".
export default function Label({ children, className = '', ...rest }) {
  return (
    <span className={`ds-label ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
