// Camera waypoints for the Hydra stage. SCENES.md is authoritative; change
// it first, then this file to match. lon/lat degrees, height metres, pitch
// degrees. Heading starts at 0; Scene 07 rotates it +30 across the flood.
export const WAYPOINTS = [
  { id: 'WP0', name: 'Earth', lon: 78, lat: 10, height: 30000000, pitch: -90 },
  { id: 'WP1', name: 'India', lon: 78, lat: 22, height: 6000000, pitch: -85 },
  { id: 'WP2', name: 'Himalayan arc', lon: 79.0, lat: 30.0, height: 1200000, pitch: -60 },
  // nadir Scene 04 pose, derived: the full catchment outline inside the
  // central 65 percent of frame, the footprint fully on-screen and clear
  // of the data panel through the whole sweep, upper-left quadrant clear
  // for the satellite. Supersedes WP3.
  { id: 'WP3b', name: 'Basin nadir', lon: 79.3, lat: 30.6, height: 110000, pitch: -88 },
  // WP4 and WP5 sit south of the basin so it is framed ahead, not beneath
  { id: 'WP4', name: 'Valley', lon: 79.4, lat: 30.27, height: 60000, pitch: -55 },
  // derived from projection constraints (corridor midpoint central, Chamoli
  // lower-central, mouth upper half): 28 km down the valley axis, looking
  // back up the valley
  { id: 'WP5', name: 'Downstream', lon: 79.151, lat: 30.138, height: 60000, pitch: -55, heading: 31.5 },
]
