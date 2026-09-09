import './DataReadout.css'

// Stacked readout: label / value / unit. valueRef exposes the value node for
// scroll-driven counters (rainfall count-up, hours-to-peak countdown).
// size="md" sets the value in data-md (console sidebar grid).
export default function DataReadout({ label, value, unit, valueRef, size }) {
  return (
    <div className={`ds-readout${size === 'md' ? ' ds-readout--md' : ''}`}>
      <span className="ds-readout__label">{label}</span>
      <span className="ds-readout__value" ref={valueRef}>
        {value}
      </span>
      {unit ? <span className="ds-readout__unit">{unit}</span> : null}
    </div>
  )
}
