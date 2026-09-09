import './StatusLine.css'

// 6px square (not circle) in the status colour + mono 12 label.
// status: 'ok' | 'caution' | 'alert' | 'signal'
export default function StatusLine({ status = 'ok', children }) {
  return (
    <div className={`ds-status ds-status--${status}`}>
      <span className="ds-status__square" />
      <span className="ds-status__label">{children}</span>
    </div>
  )
}
