import { CHAMOLI, RIVER_PATH } from './riverPath'

// Fourteen ground stations for Scenes 05 to 07. SCENES.md is authoritative.
// Six river gauges are defined by index into the real channel path so they
// sit on the Alaknanda exactly; five basin sensors sit on the stylised
// coverage zone; three upstream stations sit above the head, inside the
// true (larger) basin. Index 49 IS the Chamoli vertex: gauge G-06 and the
// town marker are one fused mark ("CHAMOLI · G-06"), so the town reads as
// a reporting station. States: neutral through Scene 05, caution across
// the Scene 06 rain ramp, and in Scene 07 the gauges flip to alert as the
// flood front passes their chainage.
const GAUGE_INDICES = [4, 13, 22, 31, 40, 49]

export const GROUND_STATIONS = [
  ...GAUGE_INDICES.map((riverIndex, i) => ({
    id: `G-0${i + 1}`,
    kind: 'gauge',
    riverIndex,
    town: riverIndex === 49 ? CHAMOLI.name : null,
    lon: RIVER_PATH[riverIndex][0],
    lat: RIVER_PATH[riverIndex][1],
  })),
  { id: 'S-01', kind: 'sensor', lon: 79.39029, lat: 30.46703 },
  { id: 'S-02', kind: 'sensor', lon: 79.38619, lat: 30.51623 },
  { id: 'S-03', kind: 'sensor', lon: 79.427, lat: 30.522 },
  { id: 'S-04', kind: 'sensor', lon: 79.50509, lat: 30.52443 },
  { id: 'S-05', kind: 'sensor', lon: 79.48869, lat: 30.47113 },
  { id: 'U-01', kind: 'upstream', lon: 79.47, lat: 30.601 },
  { id: 'U-02', kind: 'upstream', lon: 79.523, lat: 30.632 },
  { id: 'U-03', kind: 'upstream', lon: 79.408, lat: 30.588 },
]
