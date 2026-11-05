/**
 * BIXI RIDE - 3D THREE.JS EXPERIENCE
 * Color Scheme: #202020 (Charcoal) • #FFD43B (Cyber Yellow) • #EAEAEA (Light Gray) • #FFFFFF (White)
 * Features:
 * 1. Procedural 3D Superbike Model with PBR Materials & Dynamic Lighting
 * 2. 360 Orbit & Damping Controls (Mouse & Touch)
 * 3. Live Livery Color Customizer (Cyber Yellow, Stealth Charcoal, White, Amber)
 * 4. Camera Angle Presets (360 Spin, Cockpit POV, Side Profile, Engine Macro)
 * 5. Drop-in GLTF/GLB Loader with Draco Support for custom 3D models
 */

(function () {
  'use strict';

  function initHero3DShowcase() {
    const container = document.getElementById('threejs-hero-canvas');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js library not loaded yet.');
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1c2e, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4.2, 1.8, 4.6);

    const renderer = new THREE.WebGLRenderer({
      canvas: container,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00c2a8, 2.2);
    keyLight.position.set(5, 7, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf4f7fa, 1.4);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.0, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // --- Ground Grid & Circular Contact Shadow ---
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x07101b,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    // --- Materials Palette ---
    const liveryMaterial = new THREE.MeshStandardMaterial({
      color: 0x00c2a8, // Default Aqua Teal
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.5
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x142b45,
      metalness: 0.6,
      roughness: 0.35
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f7fa,
      metalness: 0.95,
      roughness: 0.08
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1c2e,
      metalness: 0.1,
      roughness: 0.85
    });

    const neonGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00c2a8
    });

    const headlampGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });

    // --- Procedural 3D Motorcycle Builder ---
    const bikeGroup = new THREE.Group();
    const wheels = [];

    function buildProceduralBike() {
      const wheelGeo = new THREE.TorusGeometry(0.72, 0.22, 16, 40);
      const rimGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.16, 24);
      rimGeo.rotateX(Math.PI / 2);

      // Rear Wheel
      const rearWheel = new THREE.Group();
      const rearTire = new THREE.Mesh(wheelGeo, tireMaterial);
      rearTire.castShadow = true;
      const rearRim = new THREE.Mesh(rimGeo, chromeMaterial);
      rearWheel.add(rearTire);
      rearWheel.add(rearRim);
      rearWheel.position.set(-1.6, 0.72, 0);
      bikeGroup.add(rearWheel);
      wheels.push(rearWheel);

      // Front Wheel
      const frontWheel = new THREE.Group();
      const frontTire = new THREE.Mesh(wheelGeo, tireMaterial);
      frontTire.castShadow = true;
      const frontRim = new THREE.Mesh(rimGeo, chromeMaterial);
      const brakeRotorGeo = new THREE.RingGeometry(0.32, 0.48, 24);
      const brakeRotor = new THREE.Mesh(brakeRotorGeo, chromeMaterial);
      brakeRotor.position.z = 0.1;
      frontWheel.add(frontTire);
      frontWheel.add(frontRim);
      frontWheel.add(brakeRotor);
      frontWheel.position.set(1.6, 0.72, 0);
      bikeGroup.add(frontWheel);
      wheels.push(frontWheel);

      // Trellis Frame
      const frameGeo = new THREE.CylinderGeometry(0.065, 0.065, 2.2, 12);
      const frame1 = new THREE.Mesh(frameGeo, carbonMaterial);
      frame1.position.set(0.1, 1.25, 0.16);
      frame1.rotation.z = -0.55;
      bikeGroup.add(frame1);

      const frame2 = frame1.clone();
      frame2.position.z = -0.16;
      bikeGroup.add(frame2);

      // Engine Block
      const engineGeo = new THREE.BoxGeometry(0.95, 0.75, 0.55);
      const engineMesh = new THREE.Mesh(engineGeo, carbonMaterial);
      engineMesh.position.set(-0.1, 0.78, 0);
      engineMesh.castShadow = true;
      bikeGroup.add(engineMesh);

      // Engine Cooling Fins
      for (let i = 0; i < 4; i++) {
        const finGeo = new THREE.BoxGeometry(0.85, 0.03, 0.6);
        const fin = new THREE.Mesh(finGeo, chromeMaterial);
        fin.position.set(-0.1, 0.65 + i * 0.1, 0);
        bikeGroup.add(fin);
      }

      // Exhaust Pipe
      const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.14, 1.6, 16);
      const exhaustMesh = new THREE.Mesh(exhaustGeo, chromeMaterial);
      exhaustMesh.position.set(-1.0, 0.65, 0.35);
      exhaustMesh.rotation.z = 1.35;
      bikeGroup.add(exhaustMesh);

      // Sculpted Fuel Tank (Livery Material)
      const tankGeo = new THREE.CylinderGeometry(0.38, 0.52, 1.45, 16);
      tankGeo.scale(1, 0.65, 0.85);
      const tankMesh = new THREE.Mesh(tankGeo, liveryMaterial);
      tankMesh.position.set(0.4, 1.42, 0);
      tankMesh.rotation.z = 1.32;
      tankMesh.castShadow = true;
      bikeGroup.add(tankMesh);

      // Seat Unit
      const seatGeo = new THREE.BoxGeometry(1.2, 0.18, 0.44);
      const seatMesh = new THREE.Mesh(seatGeo, carbonMaterial);
      seatMesh.position.set(-0.7, 1.32, 0);
      seatMesh.rotation.z = 0.15;
      bikeGroup.add(seatMesh);

      // Front Forks
      const forkGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.85, 12);
      const leftFork = new THREE.Mesh(forkGeo, chromeMaterial);
      leftFork.position.set(1.35, 1.25, 0.22);
      leftFork.rotation.z = 0.44;
      bikeGroup.add(leftFork);

      const rightFork = leftFork.clone();
      rightFork.position.z = -0.22;
      bikeGroup.add(rightFork);

      // Handlebars
      const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.95, 12);
      const barMesh = new THREE.Mesh(barGeo, carbonMaterial);
      barMesh.position.set(1.15, 1.82, 0);
      barMesh.rotation.x = Math.PI / 2;
      bikeGroup.add(barMesh);

      // Digital Cockpit Console
      const consoleGeo = new THREE.BoxGeometry(0.18, 0.04, 0.26);
      const consoleMesh = new THREE.Mesh(consoleGeo, neonGlowMaterial);
      consoleMesh.position.set(1.22, 1.86, 0);
      consoleMesh.rotation.z = 0.3;
      bikeGroup.add(consoleMesh);

      // Headlight Cowl
      const headlampCowlGeo = new THREE.ConeGeometry(0.24, 0.42, 16);
      const headlampCowl = new THREE.Mesh(headlampCowlGeo, liveryMaterial);
      headlampCowl.position.set(1.7, 1.52, 0);
      headlampCowl.rotation.z = -Math.PI / 2;
      bikeGroup.add(headlampCowl);

      const lensGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const lens = new THREE.Mesh(lensGeo, headlampGlass);
      lens.position.set(1.88, 1.52, 0);
      bikeGroup.add(lens);

      // Spot Light Beam Casting from Headlamp
      const headlightBeam = new THREE.SpotLight(0xffd43b, 4, 12, Math.PI / 7, 0.4);
      headlightBeam.position.set(1.9, 1.52, 0);
      headlightBeam.target.position.set(8, 0, 0);
      scene.add(headlightBeam);
      scene.add(headlightBeam.target);

      // Rear Tail Light
      const tailLightGeo = new THREE.BoxGeometry(0.06, 0.08, 0.22);
      const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
      const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
      tailLight.position.set(-1.32, 1.48, 0);
      bikeGroup.add(tailLight);

      scene.add(bikeGroup);
    }

    buildProceduralBike();

    // --- Interactive Drag & Orbit Handling ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0;
    let autoSpin = true;

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      autoSpin = false;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-0.25, Math.min(0.5, targetRotationX));
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    // Camera Preset Controls
    const targetCameraPos = new THREE.Vector3(4.2, 1.8, 4.6);
    const camButtons = document.querySelectorAll('.cam-btn');
    camButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        camButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const preset = btn.dataset.preset;
        if (preset === 'spin') {
          autoSpin = true;
          targetCameraPos.set(4.2, 1.8, 4.6);
        } else if (preset === 'cockpit') {
          autoSpin = false;
          targetRotationY = 0;
          targetCameraPos.set(0.8, 2.2, 0);
        } else if (preset === 'side') {
          autoSpin = false;
          targetRotationY = 0;
          targetCameraPos.set(0, 1.4, 5.0);
        } else if (preset === 'engine') {
          autoSpin = false;
          targetRotationY = -0.5;
          targetCameraPos.set(0.6, 1.1, 2.4);
        }
      });
    });

    // Color Swatches
    const swatches = document.querySelectorAll('.swatch-btn');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        swatches.forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');

        const colorHex = swatch.dataset.color;
        if (colorHex) {
          liveryMaterial.color.set(colorHex);
          if (colorHex === '#142B45' || colorHex === '#202020') {
            liveryMaterial.metalness = 0.95;
            liveryMaterial.roughness = 0.2;
          } else {
            liveryMaterial.metalness = 0.85;
            liveryMaterial.roughness = 0.22;
          }
        }
      });
    });

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoSpin) {
        targetRotationY += 0.007;
      }

      bikeGroup.rotation.y += (targetRotationY - bikeGroup.rotation.y) * 0.08;
      bikeGroup.rotation.x += (targetRotationX - bikeGroup.rotation.x) * 0.08;

      wheels.forEach((w) => {
        w.rotation.z -= 0.02;
      });

      camera.position.lerp(targetCameraPos, 0.06);
      camera.lookAt(0, 1.0, 0);

      renderer.render(scene, camera);
    }

    animate();

    // Window Resizing
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Optional: Load custom GLTF/GLB if present
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();
      if (typeof THREE.DRACOLoader !== 'undefined') {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);
      }
      loader.load(
        'assets/models/bike.glb',
        (gltf) => {
          scene.remove(bikeGroup);
          const customModel = gltf.scene;
          customModel.position.set(0, 0, 0);
          customModel.scale.set(1.2, 1.2, 1.2);
          scene.add(customModel);
        },
        undefined,
        () => {
          console.info('Using procedural 3D superbike model.');
        }
      );
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHero3DShowcase();
  });
})();
