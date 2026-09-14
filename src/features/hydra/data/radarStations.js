// Radar station positions for Scene 05, on the catchment rim so the
// coverage rings overlap across the basin interior. SCENES.md is
// authoritative: approximate, adjust together with the catchment polygon.
export const RADAR_STATIONS = [
  { id: 'R1', name: 'West rim', lat: 30.49163, lon: 79.37799 },
  { id: 'R2', name: 'North rim', lat: 30.55723, lon: 79.45589 },
  { id: 'R3', name: 'East rim', lat: 30.49573, lon: 79.50919 },
]

export const RADAR_RADIUS_METRES = 30000
export const RADAR_SWEEP_SECONDS = 4
