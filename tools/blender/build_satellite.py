"""Builds the Hydra satellite from primitives and exports it as glTF Binary.

Run headless from the project root:
  blender --background --python tools/blender/build_satellite.py

Conventions: Blender +Z up, +Y forward (the dish faces +Y), wings along X.
The glTF exporter converts to +Y up. Origin at the bus centre, total span
10 units. Monochrome scheme: matte Principled materials, metallic never
above 0.4, one cyan emissive strip on the sensor block. The solar cell grid
is geometry (inset cell frames), because node-based procedural textures do
not survive glTF export without baking.
"""

import math
import os
import sys

import bmesh
import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT_GLB = os.path.join(ROOT, "public", "models", "satellite.glb")
OUT_PNG = os.path.join(ROOT, "tools", "blender", "satellite_preview.png")

FPS = 24
FRAMES = 240


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))


def srgb_to_linear(c):
    return tuple(((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c)


def make_material(name, color, metallic, roughness, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    rgb = srgb_to_linear(hex_rgb(color))
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Metallic"].default_value = min(metallic, 0.4)
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        e = srgb_to_linear(hex_rgb(emission))
        bsdf.inputs["Emission Color"].default_value = (*e, 1.0)
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def add_box(name, size, location, material, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0], size[1], size[2])
    obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj


def add_cylinder(name, radius, depth, location, rotation, material, parent=None, vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj


def add_solar_panel(name, x_start, x_end, width, cells_x, cells_y, cell_mat, grid_mat, frame_mat, parent):
    """A thin panel from x_start to x_end: a grid of cells, each inset so the
    grid lines read between them, then solidified with the frame material on
    the rim and back."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(grid_mat)  # 0: grid lines between cells
    obj.data.materials.append(cell_mat)  # 1: cell surface
    obj.data.materials.append(frame_mat)  # 2: rim and back

    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=cells_x, y_segments=cells_y, size=1.0)
    xs = [v.co.x for v in bm.verts]
    ys = [v.co.y for v in bm.verts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    length = x_end - x_start
    for v in bm.verts:
        v.co.x = x_start + (v.co.x - x0) / (x1 - x0) * length
        v.co.y = ((v.co.y - y0) / (y1 - y0) - 0.5) * width
        v.co.z = 0.0
    cells = bm.faces[:]
    bmesh.ops.inset_individual(bm, faces=cells, thickness=0.04, depth=0.0)
    for f in bm.faces:
        f.material_index = 0
    for f in cells:
        f.material_index = 1
    bm.to_mesh(mesh)
    bm.free()
    solid = obj.modifiers.new("Solidify", "SOLIDIFY")
    solid.thickness = 0.04
    solid.offset = -1.0
    solid.material_offset = 2
    solid.material_offset_rim = 2
    return obj


def add_dish(name, radius, depth, location, material, parent=None):
    """A parabolic dish, concave side facing +Y."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=48, radius=radius)
    for _ in range(3):
        bmesh.ops.inset_region(bm, faces=bm.faces[:], thickness=radius * 0.2, depth=0.0)
    for v in bm.verts:
        r2 = v.co.x * v.co.x + v.co.y * v.co.y
        v.co.z = depth * (r2 / (radius * radius))
    bm.to_mesh(mesh)
    bm.free()
    solid = obj.modifiers.new("Solidify", "SOLIDIFY")
    solid.thickness = 0.02
    obj.location = location
    obj.rotation_euler = (-math.pi / 2, 0, 0)  # local +z (dish axis) to world +Y
    return obj


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.fps = FPS
    scene.frame_start = 1
    scene.frame_end = FRAMES
    # Blender 5 layered actions no longer expose Action.fcurves; make new
    # keyframes linear at the source so the wing loop runs at constant speed
    bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"

    bus_mat = make_material("Bus", "#3A4048", 0.3, 0.55)
    cell_mat = make_material("SolarCells", "#0B1220", 0.2, 0.3)
    grid_mat = make_material("CellGrid", "#3B5A8A", 0.2, 0.5)
    frame_mat = make_material("WingFrame", "#4A5260", 0.3, 0.55)
    dish_mat = make_material("Dish", "#B8C0CA", 0.2, 0.5)
    sensor_mat = make_material("Sensor", "#1C232C", 0.1, 0.7)
    accent_mat = make_material("Accent", "#62C6FF", 0.0, 0.4, emission="#62C6FF", strength=4.0)

    # root empty at the bus centre; everything hangs off it
    root = bpy.data.objects.new("Satellite", None)
    bpy.context.collection.objects.link(root)

    add_box("Bus", (2.0, 1.5, 1.5), (0, 0, 0), bus_mat, root)

    # sensor block underneath, facing down, with the one emissive strip on
    # its south face and a dark lens
    add_box("SensorBlock", (0.5, 0.5, 0.3), (0, 0, -0.9), sensor_mat, root)
    add_cylinder("SensorLens", 0.12, 0.08, (0, 0, -1.08), (0, 0, 0), sensor_mat, root)
    add_box("AccentStrip", (0.42, 0.03, 0.04), (0, 0.26, -0.86), accent_mat, root)

    # dish on a short mast, facing forward (+Y)
    add_cylinder("Mast", 0.04, 0.45, (0, 0.975, 0.2), (math.pi / 2, 0, 0), dish_mat, root)
    add_dish("Dish", 0.6, 0.18, (0, 1.2, 0.2), dish_mat, root)
    add_cylinder("Feed", 0.02, 0.4, (0, 1.42, 0.2), (math.pi / 2, 0, 0), dish_mat, root, vertices=8)

    # two thin antenna rods from the top of the bus
    add_cylinder("AntennaA", 0.012, 1.2, (0.35, -0.2, 1.3), (0.15, 0.1, 0), dish_mat, root, vertices=8)
    add_cylinder("AntennaB", 0.012, 0.9, (-0.4, 0.1, 1.15), (-0.12, -0.2, 0), dish_mat, root, vertices=8)

    # wings: a yoke plus a 3 x 1.4 panel on each side, each pivoting on an
    # empty at the bus face so the whole wing rotates about the yoke axis
    for side, sign in (("L", -1), ("R", 1)):
        pivot = bpy.data.objects.new(f"WingPivot{side}", None)
        pivot.location = (sign * 1.0, 0, 0)
        pivot.parent = root
        bpy.context.collection.objects.link(pivot)
        add_cylinder(f"Yoke{side}", 0.05, 1.0, (sign * 0.5, 0, 0), (0, math.pi / 2, 0), frame_mat, pivot, vertices=12)
        if sign > 0:
            add_solar_panel(f"Panel{side}", 1.0, 4.0, 1.4, 6, 3, cell_mat, grid_mat, frame_mat, pivot)
        else:
            add_solar_panel(f"Panel{side}", -4.0, -1.0, 1.4, 6, 3, cell_mat, grid_mat, frame_mat, pivot)
        # 360 degrees about the yoke (local X) over the loop, linear
        pivot.rotation_mode = "XYZ"
        pivot.rotation_euler = (0, 0, 0)
        pivot.keyframe_insert("rotation_euler", frame=1)
        pivot.rotation_euler = (2 * math.pi, 0, 0)
        pivot.keyframe_insert("rotation_euler", frame=FRAMES + 1)

    return root


def triangle_count():
    depsgraph = bpy.context.evaluated_depsgraph_get()
    total = 0
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        mesh = obj.evaluated_get(depsgraph).to_mesh()
        total += sum(len(p.vertices) - 2 for p in mesh.polygons)
        obj.evaluated_get(depsgraph).to_mesh_clear()
    return total


def export_glb():
    os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    options = dict(
        filepath=OUT_GLB,
        export_format="GLB",
        export_apply=True,
        export_animations=True,
        export_yup=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_draco_mesh_compression_enable=False,
        export_image_format="AUTO",
        export_frame_range=True,
    )
    try:
        bpy.ops.export_scene.gltf(**options)
    except TypeError:
        # exporter keyword set changes between Blender releases; fall back to
        # the essentials (the dropped ones are the exporter's defaults anyway)
        for key in ("export_frame_range", "export_image_format", "export_draco_mesh_compression_enable", "export_cameras", "export_lights"):
            options.pop(key, None)
        bpy.ops.export_scene.gltf(**options)
    return os.path.getsize(OUT_GLB)


def render_preview():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUT_PNG
    scene.frame_set(40)

    world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*srgb_to_linear(hex_rgb("#05070A")), 1.0)
    bg.inputs[1].default_value = 1.0

    def light(name, kind, location, energy, size=None):
        data = bpy.data.lights.new(name, kind)
        data.energy = energy
        if size is not None:
            data.size = size
        obj = bpy.data.objects.new(name, data)
        obj.location = location
        bpy.context.collection.objects.link(obj)
        direction = -obj.location
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        return obj

    light("Key", "AREA", (8, -10, 9), 2500, size=4)
    light("Fill", "AREA", (-10, -6, 4), 700, size=6)
    light("Rim", "AREA", (2, 10, 6), 1800, size=3)

    cam_data = bpy.data.cameras.new("PreviewCam")
    cam_data.lens = 50
    cam = bpy.data.objects.new("PreviewCam", cam_data)
    cam.location = (10, -11, 7)
    cam.rotation_euler = (-cam.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(cam)
    scene.camera = cam

    bpy.ops.render.render(write_still=True)


def main():
    build()
    tris = triangle_count()
    size = export_glb()
    print(f"SATELLITE_EXPORT triangles={tris} bytes={size} path={OUT_GLB}")
    render_preview()
    print(f"SATELLITE_PREVIEW path={OUT_PNG}")


if __name__ == "__main__":
    try:
        main()
    except Exception as err:  # noqa: BLE001
        print(f"SATELLITE_BUILD_FAILED {err!r}")
        sys.exit(1)
