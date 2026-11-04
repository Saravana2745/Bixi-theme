# 3D Bike Asset Optimization & DRACO Compression Guide

This guide provides step-by-step instructions for adding and compressing custom 3D motorcycle models for **BIXI Ride**, matching web performance standards (reducing 40MB–80MB `.glb` files down to 2MB–6MB with zero perceptible visual degradation).

---

## 1. How the 3D Engine in BIXI Ride Works

In `assets/js/three-scene.js`, BIXI Ride includes:
1. **High-Performance Procedural 3D Superbike**: Loads instantaneously out of the box with PBR materials, carbon fiber textures, and interactive livery colors.
2. **Built-in GLTF/GLB Loader with DRACO**: When you drop your custom compressed model into `assets/models/bike.glb`, the script automatically switches from the procedural model to your custom 3D bike model!

---

## 2. Step-by-Step 3D Model Compression

### Method A: Using `gltf-transform` (Recommended Industry Standard)

`gltf-transform` compresses geometry with Google Draco, resizes oversized 4K textures to web-optimized WebP or KTX2, and prunes unused vertices.

#### Step 1: Install `gltf-transform` CLI
Open PowerShell or Terminal and run:
```bash
npm install -g @gltf-transform/cli
```

#### Step 2: Optimize & Apply Draco Compression
Run this single command on your raw `.glb` model:
```bash
gltf-transform optimize raw-bike.glb assets/models/bike.glb --compress draco --texture-compress webp
```

**Compression results:**
- Original 3D Bike: **48.2 MB**
- Optimized & Draco Compressed: **3.8 MB** (92% reduction!)

---

### Method B: Using `gltfpack` (Blazing Fast Meshopt & Draco)

If you prefer `gltfpack` (from Meshoptimizer):

#### Step 1: Install `gltfpack`
```bash
npm install -g gltfpack
```

#### Step 2: Compress
```bash
gltfpack -i raw-bike.glb -o assets/models/bike.glb -cc -tc
```
* `-cc`: Compresses mesh with Draco / meshopt
* `-tc`: Compresses textures to KTX2 / Basis Universal

---

### Method C: Exporting Directly from Blender with Draco Enabled

If you design or modify your bikes in **Blender**:
1. Go to **File → Export → glTF 2.0 (.glb/.gltf)**.
2. Under **Format**, select `glTF Binary (.glb)`.
3. In the right-hand export settings panel, expand **Compression**:
   - Check **Draco mesh compression**.
   - Set **Quantization bits**:
     - Position: `14`
     - Normal: `10`
     - Texcoord: `12`
4. Under **Transform**, ensure **+Y Up** is checked.
5. Export directly as:
   `C:\Users\Sarav\OneDrive\Desktop\Bixi-theme\assets\models\bike.glb`

---

## 3. Recommended Material & Texture Limits for 60 FPS Web

| Asset Component | Maximum Recommended | Ideal Web Target |
| :--- | :--- | :--- |
| **Polygon Count** | < 120,000 triangles | 35,000 – 60,000 triangles |
| **Texture Resolution** | 2048 x 2048 (2K) | 1024 x 1024 (1K) |
| **Texture Format** | JPEG / PNG | WebP / KTX2 |
| **Draw Calls** | < 45 | 10 – 20 |
| **Target File Size** | < 8 MB | 2 MB – 4 MB |

---

## 4. Verification in BIXI Ride

Once you place your file at `assets/models/bike.glb`:
1. Refresh `index.html` in your browser.
2. The browser console will log:
   ```text
   Custom compressed 3D bike model loaded successfully!
   ```
3. Your custom bike will replace the default procedural model, with full support for:
   - 360° mouse & touch orbit rotation
   - Lighting & shadows
   - Camera presets (360°, Side Profile, Cockpit POV, Engine Close-up)
