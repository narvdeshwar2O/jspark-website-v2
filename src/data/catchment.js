// The one catchment polygon behind the whole Hydra through-line: a
// stylised coverage zone over the upper Alaknanda basin, scaled to the
// scan beam (about 12.5 km across, 1.8x the footprint radius), with the
// MOUTH vertex anchored on the real channel so the Scene 07 flood emerges
// from the true river exit; the true basin is larger. Vertices are
// [lon, lat], clockwise from the downstream mouth at the south end to the
// head at the north end and back, scaled toward the mouth from the
// ridgeline tracing. SCENES.md is authoritative for how each scene uses
// it.
export const CATCHMENT = {
  id: 'upper-alaknanda',
  name: 'Upper Alaknanda',
  mouth: { lon: 79.42523, lat: 30.45107 }, // on the real channel (RIVER_PATH[0])
  head: { lon: 79.45589, lat: 30.55723 },
  vertices: [
    [79.42523, 30.45107], // mouth, downstream, on the real channel
    [79.39029, 30.46703],
    [79.37799, 30.49163], // west rim
    [79.38619, 30.51623],
    [79.40669, 30.53673],
    [79.43129, 30.55313],
    [79.45589, 30.55723], // head, upper slopes
    [79.48459, 30.54493],
    [79.50509, 30.52443],
    [79.50919, 30.49573], // east rim
    [79.48869, 30.47113],
    [79.45179, 30.45473],
  ],
}

// the boundary as two arcs from the mouth to the head, west side and east
// side, so an outline can draw in behind a south-to-north sweep
export function catchmentArcs() {
  const v = CATCHMENT.vertices
  const headIndex = v.findIndex(([lon, lat]) => lon === CATCHMENT.head.lon && lat === CATCHMENT.head.lat)
  const west = v.slice(0, headIndex + 1)
  const east = [v[0], ...v.slice(headIndex).reverse()]
  return { west, east }
}
