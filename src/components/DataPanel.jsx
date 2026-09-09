import DataReadout from './DataReadout'
import StatusLine from './StatusLine'
import './DataPanel.css'

// Bottom-right stage panel: up to three readouts and one status line.
// readouts: [{ label, value, unit }] · status: { tone, label }
export default function DataPanel({ readouts = [], status, children, className = '' }) {
  return (
    <aside className={`ds-panel ${className}`.trim()}>
      {readouts.length > 0 && (
        <div className="ds-panel__readouts">
          {readouts.map((readout) => (
            <DataReadout key={readout.label} {...readout} />
          ))}
        </div>
      )}
      {status ? <StatusLine status={status.tone}>{status.label}</StatusLine> : null}
      {children}
    </aside>
  )
}
