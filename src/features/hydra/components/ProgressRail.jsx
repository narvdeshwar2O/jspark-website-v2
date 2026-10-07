import './ProgressRail.css'

const DEFAULT_SCENES = ['01', '02', '03', '04', '05', '06']

// The tick is positioned imperatively at scroll rate through tickRef;
// activeIndex highlights the current scene number. rootRef exposes the rail
// itself so the stage can gate its visibility to the pinned range.
export default function ProgressRail({ scenes = DEFAULT_SCENES, activeIndex = -1, tickRef, rootRef }) {
  return (
    <div className="ds-rail" ref={rootRef} aria-hidden="true">
      <div className="ds-rail__line" />
      <div className="ds-rail__tick" ref={tickRef} />
      <ol className="ds-rail__scenes">
        {scenes.map((scene, i) => (
          <li key={scene} className={`ds-rail__scene${i === activeIndex ? ' is-active' : ''}`}>
            {scene}
          </li>
        ))}
      </ol>
    </div>
  )
}
