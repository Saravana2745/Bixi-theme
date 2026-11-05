/**
 * BIXI RIDE - 3D MADURAI ROUTE & DESTINATION SIMULATOR
 * High-Performance Procedural Three.js Simulation
 * Features:
 * - 3D Holographic Isometric Map Grid of Madurai & Surrounds
 * - 3D Procedural Car (Swift Hatchback) driving along an endless circuit in a LOOP
 * - Real-world Madurai Checkpoints (Meenakshi Temple, Alanganallur, Alagar Kovil, Kilakarai, Gandhi Museum, Bun Parotta, Power Kadai, Lucky Mess)
 * - Dynamic Lighting, Headlight Beams, Tail Sparks, and Pulse Radar Rings
 * - Camera focus & Interactive Checkpoint Selection
 * - IntersectionObserver lifecycle (Zero CPU/GPU usage when out of viewport)
 */

(function () {
  'use strict';

  // Checkpoints data
  const CHECKPOINTS = [
    {
      id: 'meenakshi',
      name: 'Meenakshi Amman Kovil',
      category: 'heritage',
      pos: { x: -2, y: 0, z: 1 },
      distance: '1.2 km from Junction',
      time: '5 mins',
      vehicle: 'Scooter / Maruti Swift',
      desc: 'World-renowned architectural wonder with 14 gopurams. Park at Periyar Multi-level and explore.',
      badge: 'Heritage Wonder'
    },
    {
      id: 'bun-parotta',
      name: 'Madurai Bun Parotta',
      category: 'food',
      pos: { x: -0.8, y: 0, z: 2.5 },
      distance: '2.5 km',
      time: '8 mins',
      vehicle: 'Activa 6G / Hunter 350',
      desc: 'Simmakkal & Town Hall Rd. World-famous flaky, deep-fried piping hot bun parotta with spicy salna.',
      badge: 'Iconic Food'
    },
    {
      id: 'power-kadai',
      name: 'Power Kadai (Kari Dosa)',
      category: 'food',
      pos: { x: 1.5, y: 0, z: 1.8 },
      distance: '3.8 km',
      time: '12 mins',
      vehicle: 'Bike / Self-Drive Swift',
      desc: 'Goripalayam. The birthplace of authentic Madurai Mutton Kari Dosa and spicy Chukka roast.',
      badge: 'Culinary Legend'
    },
    {
      id: 'gandhi-museum',
      name: 'Gandhi Memorial Museum',
      category: 'heritage',
      pos: { x: 2.8, y: 0, z: 0.2 },
      distance: '4.5 km',
      time: '14 mins',
      vehicle: 'Maruti Swift / Thar',
      desc: 'Tamukkam grounds. Historic 17th-century Nayak palace housing original freedom movement archives.',
      badge: 'History & Peace'
    },
    {
      id: 'alagar-koil',
      name: 'Alagar Kovil (Kallazhagar)',
      category: 'heritage',
      pos: { x: 3.5, y: 0, z: -3.5 },
      distance: '21 km',
      time: '35 mins',
      vehicle: 'Self-Drive Swift / RE Himalayan',
      desc: 'Foothills of Western Ghats. Spectacular scenic forest boulevard drive with natural springs at Pazhamudircholai.',
      badge: 'Scenic Foothills'
    },
    {
      id: 'alanganallur',
      name: 'Alanganallur & Lucky Mess',
      category: 'food',
      pos: { x: -1.5, y: 0, z: -3.8 },
      distance: '16 km',
      time: '28 mins',
      vehicle: 'Maruti Swift / Hunter 350',
      desc: 'World capital of Jallikattu warriors & home of the legendary country non-veg feast at Lucky Mess.',
      badge: 'Jallikattu & Feast'
    },
    {
      id: 'kilakarai',
      name: 'Kilakarai Coastal Highway',
      category: 'heritage',
      pos: { x: -4.2, y: 0, z: -0.5 },
      distance: '92 km',
      time: '1 hr 45m',
      vehicle: 'Self-Drive Swift / Ertiga 7-Str',
      desc: 'Smooth 4-lane expressway connecting Madurai to the Gulf of Mannar, pristine beaches & Pamban Bridge.',
      badge: 'Coast & Highway'
    }
  ];

  function initMadurai3DMap() {
    const canvas = document.getElementById('madurai-3d-map-canvas');
    const container = document.getElementById('madurai-3d-map-wrapper');
    if (!canvas || !container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not found for Madurai 3D Map');
      return;
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0d0f, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Isometric aerial perspective
    const defaultCameraPos = new THREE.Vector3(0, 11, 10);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    camera.position.copy(defaultCameraPos);
    camera.lookAt(targetLookAt);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Ambient & Directional Lights ---
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    sunLight.position.set(8, 15, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const orangeAccentLight = new THREE.PointLight(0xe88124, 2.5, 25);
    orangeAccentLight.position.set(0, 6, 0);
    scene.add(orangeAccentLight);

    // --- Futuristic Holographic Ground Grid ---
    const gridHelper = new THREE.GridHelper(26, 32, 0xe88124, 0x1f242e);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Stylized Vaigai River ribbon
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, -0.03, -2),
      new THREE.Vector3(-4, -0.03, -0.5),
      new THREE.Vector3(0, -0.03, 0.8),
      new THREE.Vector3(4, -0.03, 1.5),
      new THREE.Vector3(9, -0.03, 2.8)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 32, 0.28, 6, false);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      emissive: 0x0d2238,
      roughness: 0.2,
      metalness: 0.7
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // --- Highway Loop Path Connecting Madurai Checkpoints ---
    const routePoints = [
      new THREE.Vector3(-2, 0, 1),      // Meenakshi
      new THREE.Vector3(-0.8, 0, 2.5),  // Bun Parotta (Simmakkal)
      new THREE.Vector3(1.5, 0, 1.8),   // Power Kadai
      new THREE.Vector3(2.8, 0, 0.2),   // Gandhi Museum
      new THREE.Vector3(3.5, 0, -3.5),  // Alagar Koil
      new THREE.Vector3(-1.5, 0, -3.8), // Alanganallur & Lucky Mess
      new THREE.Vector3(-4.2, 0, -0.5), // Kilakarai South Exit
      new THREE.Vector3(-2, 0, 1)       // Loop back to Meenakshi
    ];

    const circuitCurve = new THREE.CatmullRomCurve3(routePoints, true, 'centripetal', 0.25);

    // Illuminated Glowing Road Tube
    const roadGeo = new THREE.TubeGeometry(circuitCurve, 120, 0.1, 8, true);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0xe88124,
      emissive: 0x8a3e00,
      roughness: 0.3,
      metalness: 0.6
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Outer neon glow tube
    const glowGeo = new THREE.TubeGeometry(circuitCurve, 80, 0.16, 6, true);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xe88124,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // --- Procedural 3D Checkpoint Pins & Radar Rings ---
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);

    const pinMeshes = [];
    const pulseRings = [];

    CHECKPOINTS.forEach((cp, idx) => {
      // Beacon Base Cylinder
      const baseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16);
      const baseMat = new THREE.MeshStandardMaterial({
        color: cp.category === 'food' ? 0xff7a00 : 0xe88124,
        metalness: 0.8,
        roughness: 0.2
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(cp.pos.x, 0.04, cp.pos.z);
      pinGroup.add(base);

      // Vertical Marker Pillar
      const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12);
      const pillarMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(cp.pos.x, 0.45, cp.pos.z);
      pinGroup.add(pillar);

      // Glowing Diamond / Sphere Pin Top
      const headGeo = new THREE.OctahedronGeometry(0.22);
      const headMat = new THREE.MeshStandardMaterial({
        color: cp.category === 'food' ? 0xffa048 : 0xe88124,
        emissive: cp.category === 'food' ? 0xff5500 : 0xd66810,
        roughness: 0.15,
        metalness: 0.9
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(cp.pos.x, 0.95, cp.pos.z);
      head.userData = { id: cp.id, info: cp, originalY: 0.95 };
      pinGroup.add(head);
      pinMeshes.push(head);

      // Radar Pulse Ring on Ground
      const ringGeo = new THREE.RingGeometry(0.25, 0.45, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe88124,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(cp.pos.x, 0.02, cp.pos.z);
      pinGroup.add(ring);
      pulseRings.push(ring);
    });

    // --- Procedural 3D Car Model (Swift Hatchback) ---
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Car Body (Aerodynamic Hatchback)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe88124, // BIXI Racing Orange
      metalness: 0.85,
      roughness: 0.22
    });

    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d0f,
      roughness: 0.1,
      metalness: 0.9
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95
    });

    // Lower Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(0.5, 0.18, 0.9);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.position.y = 0.16;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Upper Cabin & Windshield
    const cabinGeo = new THREE.BoxGeometry(0.42, 0.16, 0.52);
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 0.31, -0.05);
    carGroup.add(cabin);

    // Roof Spoiler
    const spoilerGeo = new THREE.BoxGeometry(0.44, 0.03, 0.12);
    const spoiler = new THREE.Mesh(spoilerGeo, bodyMat);
    spoiler.position.set(0, 0.39, -0.32);
    carGroup.add(spoiler);

    // Front Headlights (LED Beams)
    const headlampGeo = new THREE.BoxGeometry(0.1, 0.06, 0.04);
    const headlampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftLight = new THREE.Mesh(headlampGeo, headlampMat);
    leftLight.position.set(-0.18, 0.17, 0.46);
    carGroup.add(leftLight);

    const rightLight = new THREE.Mesh(headlampGeo, headlampMat);
    rightLight.position.set(0.18, 0.17, 0.46);
    carGroup.add(rightLight);

    // Real Spotlight Beams projected on road
    const beam = new THREE.SpotLight(0xfff5e6, 2.5, 4.5, Math.PI / 6, 0.4);
    beam.position.set(0, 0.2, 0.4);
    beam.target.position.set(0, 0, 3.5);
    carGroup.add(beam);
    carGroup.add(beam.target);

    // Rear Taillights (Red LED)
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
    const leftTail = new THREE.Mesh(headlampGeo, tailMat);
    leftTail.position.set(-0.18, 0.18, -0.46);
    carGroup.add(leftTail);

    const rightTail = new THREE.Mesh(headlampGeo, tailMat);
    rightTail.position.set(0.18, 0.18, -0.46);
    carGroup.add(rightTail);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.8 });
    const carWheels = [];

    const wheelPositions = [
      [-0.26, 0.09, 0.28],
      [0.26, 0.09, 0.28],
      [-0.26, 0.09, -0.28],
      [0.26, 0.09, -0.28]
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, wy, wz);
      carGroup.add(w);
      carWheels.push(w);
    });

    // --- Interactive Hover / Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredPin = null;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    canvas.addEventListener('click', () => {
      if (hoveredPin) {
        selectCheckpoint(hoveredPin.userData.info);
      }
    });

    // Camera Orbit drag
    let isMouseDown = false;
    let prevMouseX = 0;
    let autoRotate = true;
    let targetCameraY = 11;
    let targetCamDist = 14;
    let cameraAngle = 0.8;

    canvas.addEventListener('pointerdown', (e) => {
      isMouseDown = true;
      autoRotate = false;
      prevMouseX = e.clientX;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      cameraAngle -= deltaX * 0.005;
    });

    window.addEventListener('pointerup', () => {
      isMouseDown = false;
    });

    // --- Animation State & Loop ---
    let carProgress = 0;
    let carSpeed = 0.00075; // Smooth cinematic cruise speed
    let pulseScale = 1;
    let activeCheckpointId = null;

    function selectCheckpoint(cp) {
      if (!cp) return;
      activeCheckpointId = cp.id;

      // Update UI preview card
      const cardTitle = document.getElementById('mapActiveTitle');
      const cardCategory = document.getElementById('mapActiveCategory');
      const cardDistance = document.getElementById('mapActiveDistance');
      const cardTime = document.getElementById('mapActiveTime');
      const cardVehicle = document.getElementById('mapActiveVehicle');
      const cardDesc = document.getElementById('mapActiveDesc');

      if (cardTitle) cardTitle.textContent = cp.name;
      if (cardCategory) cardCategory.textContent = cp.badge;
      if (cardDistance) cardDistance.textContent = cp.distance;
      if (cardTime) cardTime.textContent = cp.time;
      if (cardVehicle) cardVehicle.textContent = cp.vehicle;
      if (cardDesc) cardDesc.textContent = cp.desc;

      // Active button styling
      document.querySelectorAll('.map-pill-btn').forEach((btn) => {
        if (btn.dataset.id === cp.id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Expose checkpoint selection to DOM buttons
    window.focusMaduraiCheckpoint = function (id) {
      const found = CHECKPOINTS.find((c) => c.id === id);
      if (found) {
        selectCheckpoint(found);
        // Highlight telemetry
        autoRotate = false;
      }
    };

    // Category Filter Buttons
    window.filterMaduraiCheckpoints = function (category) {
      document.querySelectorAll('.map-filter-tab').forEach((t) => t.classList.remove('active'));
      const activeTab = document.querySelector(`.map-filter-tab[data-cat="${category}"]`);
      if (activeTab) activeTab.classList.add('active');

      pinMeshes.forEach((mesh) => {
        const info = mesh.userData.info;
        if (category === 'all' || info.category === category) {
          mesh.parent.visible = true;
        } else {
          mesh.parent.visible = false;
        }
      });
    };

    // Initialize first checkpoint
    selectCheckpoint(CHECKPOINTS[0]);

    // --- Animation Engine ---
    let isVisible = true;
    let animationFrameId = null;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      // 1. Advance Car along the Circuit Curve in a LOOP
      carProgress = (carProgress + carSpeed) % 1;
      const pointOnCurve = circuitCurve.getPointAt(carProgress);
      const lookAheadPoint = circuitCurve.getPointAt((carProgress + 0.012) % 1);

      carGroup.position.copy(pointOnCurve);
      carGroup.lookAt(lookAheadPoint);

      // Spin car wheels
      carWheels.forEach((w) => {
        w.rotation.x -= 0.15;
      });

      // 2. Pulse Radar Rings
      pulseScale += 0.015;
      if (pulseScale > 2.2) pulseScale = 1;
      pulseRings.forEach((ring) => {
        ring.scale.set(pulseScale, pulseScale, 1);
        ring.material.opacity = Math.max(0, 0.65 - (pulseScale - 1) * 0.5);
      });

      // 3. Spin Diamond Pin Heads
      pinMeshes.forEach((mesh) => {
        mesh.rotation.y += 0.02;
        mesh.position.y = mesh.userData.originalY + Math.sin(Date.now() * 0.003 + mesh.position.x) * 0.06;
      });

      // 4. Update Current Location HUD dynamically as Car cruises
      let nearestCp = null;
      let minDistance = 999;
      CHECKPOINTS.forEach((cp) => {
        const d = pointOnCurve.distanceTo(new THREE.Vector3(cp.pos.x, 0, cp.pos.z));
        if (d < minDistance) {
          minDistance = d;
          nearestCp = cp;
        }
      });

      const liveHudLocation = document.getElementById('mapLiveCheckpointText');
      if (liveHudLocation && nearestCp && minDistance < 1.8) {
        liveHudLocation.textContent = nearestCp.name;
      }

      // 5. Camera Gentle Orbit
      if (autoRotate) {
        cameraAngle += 0.0018;
      }
      camera.position.x = Math.sin(cameraAngle) * targetCamDist;
      camera.position.z = Math.cos(cameraAngle) * targetCamDist;
      camera.position.y = targetCameraY;
      camera.lookAt(targetLookAt);

      // 6. Raycast Hover detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        hoveredPin = intersects[0].object;
        canvas.style.cursor = 'pointer';
        hoveredPin.scale.set(1.3, 1.3, 1.3);
      } else {
        if (hoveredPin) hoveredPin.scale.set(1, 1, 1);
        hoveredPin = null;
        canvas.style.cursor = isMouseDown ? 'grabbing' : 'grab';
      }

      renderer.render(scene, camera);
    }

    // --- IntersectionObserver (Zero CPU when off-screen) ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animate();
            }
          } else {
            isVisible = false;
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Responsive Resize
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadurai3DMap);
  } else {
    initMadurai3DMap();
  }
})();
