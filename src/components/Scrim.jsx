import './Scrim.css'

// bg at 40%, 24px padding, required behind any text over the 3D canvas.
export default function Scrim({ children, className = '' }) {
  return <div className={`ds-scrim ${className}`.trim()}>{children}</div>
}
