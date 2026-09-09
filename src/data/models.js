// Model URLs and calibration constants for the Hydra stage objects.
//
// Swapping in the real assets: point SATELLITE_MODEL at
// '/models/satellite.glb' and RADAR_MODEL at '/models/radar.glb', then adjust
// the heading and height-offset constants if the new meshes are authored on
// a different axis or with their origin away from the base. Scale is
// calibrated at runtime from each mesh's own bounds, so no scale constant
// needs to change.

// Both built by tools/blender/build_*.py (Blender +Y forward, dish along
// +Y, origin at the bus centre / the base centre).
export const SATELLITE_MODEL = '/models/satellite.glb'
export const RADAR_MODEL = '/models/radar.glb'

// on-screen width targets that drive the runtime scale calibration
export const SATELLITE_PIXEL_WIDTH = 170 // at the WP3b camera pose; corner placement, not a centred hero
export const RADAR_PIXEL_WIDTH = 80 // at the WP4 camera pose; supporting objects read at 70 to 100 px
export const RADAR_MIN_PIXELS = 40 // floor while the camera is still far away at Scene 05 start

// orientation of the mesh's forward axis, degrees clockwise from north.
// Blender +Y exports as glTF -Z, which Cesium maps to west at heading 0;
// 270 turns the dish to face south, the direction the satellite travels
// as it enters from the top of the frame.
export const SATELLITE_HEADING = 270
export const RADAR_HEADING = 0

// metres above the sampled terrain, for meshes whose origin is not at the base
export const RADAR_HEIGHT_OFFSET = 0

// idle loops used only when a mesh ships without its own animations
export const SATELLITE_IDLE_YAW_SECONDS = 10
export const RADAR_IDLE_YAW_SECONDS = 6
