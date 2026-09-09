"""Builds the Hydra radar station from primitives and exports it as glTF Binary.

Run headless from the project root:
  blender --background --python tools/blender/build_radar.py

Conventions: Blender +Z up, +Y forward (the dish faces +Y at frame 1).
The glTF exporter converts to +Y up. Origin at the base centre so the model
clamps to terrain. Materials are Principled BSDF, matte, one tiny emissive
indicator on the head. The head rotates 360 degrees over 144 frames (6 s).
"""

import math
import os
import sys

import bmesh
import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT_GLB = os.path.join(ROOT, "public", "models", "radar.glb")
OUT_PNG = os.path.join(ROOT, "tools", "blender", "radar_preview.png")

FPS = 24
FRAMES = 144
TOWER_HEIGHT = 3.0
BASE_SIZE = 1.0


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
    bsdf.inputs["Metallic"].default_value = metallic
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


def add_cylinder(name, radius, depth, location, rotation, material, parent=None, vertices=16):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj


def add_lattice_tower(height, half_width_bottom, half_width_top, material, parent):
    """Four legs tapering with height, with horizontal and diagonal bracing."""
    legs = []
    r = 0.03
    corners = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    for i, (sx, sy) in enumerate(corners):
        x0, y0 = sx * half_width_bottom, sy * half_width_bottom
        x1, y1 = sx * half_width_top, sy * half_width_top
        mid = ((x0 + x1) / 2, (y0 + y1) / 2, height / 2)
        dx, dy, dz = x1 - x0, y1 - y0, height
        length = math.sqrt(dx * dx + dy * dy + dz * dz)
        # orient a z-aligned cylinder along the leg direction
        pitch = math.acos(dz / length)
        yaw = math.atan2(dy, dx)
        leg = add_cylinder(f"Leg{i}", r, length, mid, (0, pitch, yaw), material, parent, vertices=8)
        legs.append(leg)
    levels = 5
    for level in range(1, levels + 1):
        z = height * level / levels
        hw = half_width_bottom + (half_width_top - half_width_bottom) * (level / levels)
        for j in range(4):
            (ax, ay), (bx, by) = corners[j], corners[(j + 1) % 4]
            mid = ((ax + bx) / 2 * hw, (ay + by) / 2 * hw, z)
            length = 2 * hw
            yaw = math.atan2((by - ay) * hw, (bx - ax) * hw)
            add_cylinder(f"Brace{level}_{j}", 0.018, length, mid, (0, math.pi / 2, yaw), material, parent, vertices=6)
            # diagonal to the next level down
            if level > 1:
                z0 = height * (level - 1) / levels
                hw0 = half_width_bottom + (half_width_top - half_width_bottom) * ((level - 1) / levels)
                p0 = (ax * hw0, ay * hw0, z0)
                p1 = (bx * hw, by * hw, z)
                dmid = ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2)
                dx, dy, dz = p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]
                dl = math.sqrt(dx * dx + dy * dy + dz * dz)
                add_cylinder(f"Diag{level}_{j}", 0.012, dl, dmid, (0, math.acos(dz / dl), math.atan2(dy, dx)), material, parent, vertices=6)
    return legs


def add_dish(name, radius, depth, material, parent):
    """Shallow parabolic dish, concave side facing local +Y."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj.parent = parent
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=40, radius=radius)
    for _ in range(3):
        bmesh.ops.inset_region(bm, faces=bm.faces[:], thickness=radius * 0.2, depth=0.0)
    for v in bm.verts:
        r2 = v.co.x * v.co.x + v.co.y * v.co.y
        v.co.z = depth * (r2 / (radius * radius))
    bm.to_mesh(mesh)
    bm.free()
    solid = obj.modifiers.new("Solidify", "SOLIDIFY")
    solid.thickness = 0.03
    obj.rotation_euler = (-math.pi / 2, 0, 0)  # local +z (dish axis) to +Y
    return obj


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.fps = FPS
    scene.frame_start = 1
    scene.frame_end = FRAMES
    bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"

    tower_mat = make_material("Tower", "#6B7480", 0.6, 0.6)
    dish_mat = make_material("Dish", "#9AA3AD", 0.9, 0.5)
    base_mat = make_material("Base", "#2A2F36", 0.1, 0.8)
    accent_mat = make_material("Indicator", "#62C6FF", 0.0, 0.4, emission="#62C6FF", strength=2.0)

    root = bpy.data.objects.new("Radar", None)
    bpy.context.collection.objects.link(root)

    # concrete base, top face at z = 0.2, origin at its centre on the ground
    add_box("Base", (BASE_SIZE, BASE_SIZE, 0.2), (0, 0, 0.1), base_mat, root)
    # equipment cabin beside the tower foot
    add_box("Cabin", (0.5, 0.35, 0.35), (0.55, -0.45, 0.375), base_mat, root)

    tower = bpy.data.objects.new("Tower", None)
    tower.location = (0, 0, 0.2)
    tower.parent = root
    bpy.context.collection.objects.link(tower)
    add_lattice_tower(TOWER_HEIGHT, 0.38, 0.22, tower_mat, tower)

    # rotating head on top: bearing, mount, horizontal axis and the dish
    head = bpy.data.objects.new("Head", None)
    head.location = (0, 0, 0.2 + TOWER_HEIGHT)
    head.parent = root
    bpy.context.collection.objects.link(head)
    add_cylinder("Bearing", 0.22, 0.12, (0, 0, 0.06), (0, 0, 0), tower_mat, head, vertices=24)
    add_box("Mount", (0.3, 0.3, 0.35), (0, 0, 0.3), tower_mat, head)
    add_cylinder("Axis", 0.05, 0.9, (0, 0, 0.55), (0, math.pi / 2, 0), dish_mat, head, vertices=12)
    dish = add_dish("Dish", 0.75, 0.16, dish_mat, head)
    dish.location = (0, 0.12, 0.55)
    dish.rotation_euler = (-math.pi / 2 + math.radians(12), 0, 0)  # tilted up 12 degrees
    add_cylinder("Feed", 0.02, 0.5, (0, 0.4, 0.6), (math.pi / 2, 0, 0), dish_mat, head, vertices=8)
    add_box("Indicator", (0.06, 0.06, 0.06), (0, -0.18, 0.5), accent_mat, head)

    # 360 degrees about the vertical over the loop, linear
    head.rotation_mode = "XYZ"
    head.rotation_euler = (0, 0, 0)
    head.keyframe_insert("rotation_euler", frame=1)
    head.rotation_euler = (0, 0, 2 * math.pi)
    head.keyframe_insert("rotation_euler", frame=FRAMES + 1)
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
        for key in ("export_frame_range", "export_image_format", "export_draco_mesh_compression_enable", "export_cameras", "export_lights"):
            options.pop(key, None)
        bpy.ops.export_scene.gltf(**options)


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
    scene.frame_set(30)

    world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*srgb_to_linear(hex_rgb("#05070A")), 1.0)
    bg.inputs[1].default_value = 1.0

    def light(name, location, energy, size):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.size = size
        obj = bpy.data.objects.new(name, data)
        obj.location = location
        bpy.context.collection.objects.link(obj)
        target = (0, 0, 1.8)
        direction = obj.location.__class__(target) - obj.location
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        return obj

    light("Key", (5, -6, 7), 900, 3)
    light("Fill", (-6, -4, 3), 300, 5)
    light("Rim", (1, 6, 5), 700, 2)

    cam_data = bpy.data.cameras.new("PreviewCam")
    cam_data.lens = 50
    cam = bpy.data.objects.new("PreviewCam", cam_data)
    cam.location = (6, -7, 4.5)
    target = cam.location.__class__((0, 0, 1.8))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(cam)
    scene.camera = cam
    bpy.ops.render.render(write_still=True)


def main():
    build()
    tris = triangle_count()
    export_glb()
    size = os.path.getsize(OUT_GLB)
    print(f"RADAR_EXPORT triangles={tris} bytes={size} path={OUT_GLB}")
    render_preview()
    print(f"RADAR_PREVIEW path={OUT_PNG}")


if __name__ == "__main__":
    try:
        main()
    except Exception as err:  # noqa: BLE001
        print(f"RADAR_BUILD_FAILED {err!r}")
        sys.exit(1)
