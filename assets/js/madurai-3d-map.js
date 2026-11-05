/**
 * BIXI RIDE - AUTHENTIC 3D MADURAI ROUTE & CULTURAL SIMULATION
 * High-Performance Procedural Three.js Simulation
 * 
 * Culturally Accurate Madurai Heritage:
 * 1. Madurai Meenakshi Amman Kovil (7-tier Dravidian Gopuram with 5 Gold Kalasams & Temple Diya)
 * 2. Alanganallur Vadivasal & Jallikattu Arena:
 *    - Traditional wooden/stone Vadivasal entry gate & spectator barricades
 *    - Animated 3D Jallikattu Bull (Kangayam breed with muscular body, hump/timil, sharp horns, charging leg cycle & head-tossing animation!)
 * 3. Lucky Mess in Alanganallur (Authentic village non-veg feast, nattu kozhi, banana leaves)
 * 4. Power Kadai & Madurai Bun Parotta (Iconic Simmakkal/Goripalayam Kari Dosa & hot parotta counter with chimney smoke)
 * 5. Gandhi Memorial Museum (Tamukkam Nayak Palace with classical portico, dome & flag)
 * 6. Alagar Kovil / Kallazhagar Temple (Historic temple nestled at the green foothills of Alagar Malai)
 * 7. Sacred Vaigai River flowing along its own natural corridor (Isolated from the road - Car NEVER enters water!)
 * 
 * Controls & Interactivity:
 * - Car stays firmly on asphalt road at y=0.25 - ZERO underground clipping, ZERO water clipping!
 * - Real legible canvas signboards & 3D floating title badges on every model
 * - [ ✕ Zoom Out / Overview ] reset button
 * - 100% Theme Harmony in BIXI Sunset Orange (#E88124) and Pitch Carbon (#0B0D13)
 */

(function () {
  'use strict';

  const CHECKPOINTS = [
    {
      id: 'meenakshi',
      name: 'Meenakshi Amman Kovil',
      category: 'Temple Wonder',
      pos: { x: -4.5, y: 0.25, z: 1.8 },
      camPos: { x: -4.5, y: 3.4, z: 6.8 },
      target: { x: -4.5, y: 1.4, z: 1.8 },
      distance: '1.2 km from Junction',
      time: '5 mins',
      vehicle: 'Activa 6G / Maruti Swift',
      desc: 'The eternal heart of Madurai with 14 towering Dravidian gopurams, Thousand Pillar Hall, and sacred Golden Lotus Tank.',
      badge: 'Heritage Wonder',
      icon: '🛕'
    },
    {
      id: 'alanganallur-vadivasal',
      name: 'Alanganallur Vadivasal (Jallikattu)',
      category: 'World Jallikattu Arena',
      pos: { x: -1.5, y: 0.25, z: 3.2 },
      camPos: { x: -1.5, y: 2.8, z: 7.2 },
      target: { x: -1.5, y: 1.0, z: 3.2 },
      distance: '16 km',
      time: '26 mins',
      vehicle: 'Hunter 350 / Maruti Swift',
      desc: 'World-famous Vadivasal entry gate where fierce Kangayam bulls charge into the Pongal Jallikattu arena before thousands of roaring spectators.',
      badge: 'Jallikattu Arena',
      icon: '🐂'
    },
    {
      id: 'lucky-mess',
      name: 'Lucky Mess (Alanganallur)',
      category: 'Authentic Village Feast',
      pos: { x: 1.5, y: 0.25, z: 3.2 },
      camPos: { x: 1.5, y: 2.8, z: 7.2 },
      target: { x: 1.5, y: 1.0, z: 3.2 },
      distance: '16.5 km',
      time: '28 mins',
      vehicle: 'Maruti Swift / Hunter 350',
      desc: 'Legendary village mess in Alanganallur famous for piping hot nattu-kozhi chukka, spicy mutton gravy, and authentic banana-leaf feasts.',
      badge: 'Village Feast',
      icon: '🍗'
    },
    {
      id: 'power-kadai',
      name: 'Power Kadai & Bun Parotta',
      category: 'Madurai Street Food',
      pos: { x: 4.8, y: 0.25, z: 1.5 },
      camPos: { x: 4.8, y: 3.0, z: 5.8 },
      target: { x: 4.8, y: 1.1, z: 1.5 },
      distance: '3.5 km',
      time: '12 mins',
      vehicle: 'Activa 6G / Swift',
      desc: 'Simmakkal & Goripalayam food legends! World-renowned crispy layered Madurai Bun Parotta and sizzling Mutton Kari Dosa.',
      badge: 'Iconic Street Food',
      icon: '🥩'
    },
    {
      id: 'gandhi-museum',
      name: 'Gandhi Memorial Museum',
      category: 'Historic Tamukkam Palace',
      pos: { x: 3.8, y: 0.25, z: -3.2 },
      camPos: { x: 3.8, y: 3.5, z: 1.8 },
      target: { x: 3.8, y: 1.3, z: -3.2 },
      distance: '4.5 km',
      time: '14 mins',
      vehicle: 'Maruti Swift / Thar 4x4',
      desc: 'Historic 17th-century Nayak palace where Mahatma Gandhi decided to adopt the dhoti in 1921. Surrounded by serene Tamukkam gardens.',
      badge: 'Palace Museum',
      icon: '🏛️'
    },
    {
      id: 'alagar-kovil',
      name: 'Alagar Kovil (Kallazhagar Temple)',
      category: 'Sacred Hill Temple',
      pos: { x: -2.8, y: 0.25, z: -4.2 },
      camPos: { x: -2.8, y: 3.8, z: 0.2 },
      target: { x: -2.8, y: 1.4, z: -4.2 },
      distance: '21 km',
      time: '35 mins',
      vehicle: 'Maruti Swift / RE Himalayan',
      desc: 'Nestled at the scenic foothills of Alagar Malai. Ancient temple of Lord Kallazhagar, famous for the Chithirai festival and natural springs.',
      badge: 'Alagar Temple',
      icon: '🛕'
    }
  ];

  // Helper: Create crisp dynamic canvas texture for signboards
  function createSignboardTexture(title, subtitle, bgColor, textColor, accentColor) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d');

    ctx.fillStyle = bgColor || '#12141c';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = accentColor || '#e88124';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.fillStyle = accentColor || '#e88124';
    ctx.fillRect(8, 8, 496, 10);

    ctx.fillStyle = textColor || '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 55);

    if (subtitle) {
      ctx.fillStyle = accentColor || '#e88124';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(subtitle, 256, 95);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  // Helper: Create 3D floating billboard title badge hovering above landmark
  function createFloatingBadge(name, icon) {
    const c = document.createElement('canvas');
    c.width = 384;
    c.height = 96;
    const ctx = c.getContext('2d');

    ctx.fillStyle = 'rgba(11, 13, 19, 0.94)';
    ctx.beginPath();
    ctx.roundRect(6, 6, 372, 84, 42);
    ctx.fill();

    ctx.strokeStyle = '#e88124';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${icon} ${name}`, 192, 48);

    const tex = new THREE.CanvasTexture(c);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  function initMadurai3DWorld() {
    const canvas = document.getElementById('madurai-3d-map-canvas');
    const container = document.getElementById('madurai-3d-map-wrapper');
    if (!canvas || !container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js library is required for the 3D world');
      return;
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d13);
    scene.fog = new THREE.FogExp2(0x0b0d13, 0.026);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    const defaultCamPos = new THREE.Vector3(0, 13, 17);
    const defaultLookAt = new THREE.Vector3(0, 0.5, 0);
    const currentLookAt = defaultLookAt.clone();
    camera.position.copy(defaultCamPos);
    camera.lookAt(currentLookAt);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Warm Sunset / BIXI Orange Atmosphere
    const ambLight = new THREE.AmbientLight(0xffeedd, 0.9);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(0xffa756, 1.7);
    sunLight.position.set(12, 22, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const orangeAccentLight = new THREE.PointLight(0xe88124, 2.2, 30);
    orangeAccentLight.position.set(0, 8, 0);
    scene.add(orangeAccentLight);

    // =========================================================================
    // 1. TERRAIN (Pitch Slate Ground - Completely Flat at y=0 so Road at y=0.25 Never Clips!)
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(36, 36);
    terrainGeo.rotateX(-Math.PI / 2);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x121520,
      roughness: 0.85,
      metalness: 0.15
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Alagar Malai (Scenic Sacred Mountain Foothills behind Alagar Kovil in North)
    const alagarMountainGeo = new THREE.ConeGeometry(5.5, 6.5, 7);
    const alagarMountainMat = new THREE.MeshStandardMaterial({
      color: 0x1a221b, // Forest mountain green-slate
      roughness: 0.9,
      flatShading: true
    });
    const am1 = new THREE.Mesh(alagarMountainGeo, alagarMountainMat);
    am1.position.set(-2.8, 3.0, -12);
    scene.add(am1);

    const am2 = new THREE.Mesh(alagarMountainGeo, alagarMountainMat);
    am2.scale.set(1.3, 1.1, 1.3);
    am2.position.set(3.5, 3.2, -13);
    scene.add(am2);

    // =========================================================================
    // 2. SACRED VAIGAI RIVER (Flows on south periphery - NEVER CROSSES THE ROAD!)
    // =========================================================================
    // River runs cleanly across z = 6.2, completely outside the road loop (z: -4.5 to +3.5)
    // The car stays 100% on the road and NEVER touches the river!
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-16, 0.04, 6.5),
      new THREE.Vector3(-8, 0.04, 6.2),
      new THREE.Vector3(0, 0.04, 6.0),
      new THREE.Vector3(8, 0.04, 6.3),
      new THREE.Vector3(16, 0.04, 6.6)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.1, 8, false);
    riverGeo.scale(1, 0.05, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // Riverbank Coconut Palms
    function createRiverPalm(x, z) {
      const palm = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1e });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.4, 6), trunkMat);
      trunk.position.y = 0.7;
      palm.add(trunk);
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
      for (let p = 0; p < 5; p++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.1, 4), frondMat);
        frond.position.set(0, 1.4, 0);
        frond.rotation.z = 0.65;
        frond.rotation.y = (p * Math.PI * 2) / 5;
        palm.add(frond);
      }
      palm.position.set(x, 0, z);
      return palm;
    }
    [-12, -7, -2, 3, 8, 13].forEach(rx => {
      scene.add(createRiverPalm(rx, 5.2));
    });

    // =========================================================================
    // 3. REALISTIC 3D LANDMARK MODELS & ANIMATED JALLIKATTU BULL
    // =========================================================================

    // A. MADURAI MEENAKSHI AMMAN KOVIL
    function createMeenakshiTemple() {
      const gopuram = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb55220, roughness: 0.7 });
      const tierColors = [0x8f3510, 0x1e3a8a, 0x065f46, 0xb45309, 0x991b1b, 0x4c1d95, 0xd97706];
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Base Temple Gateway with pilasters
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 1.8), stoneMat);
      base.position.y = 0.5;
      base.castShadow = true;
      gopuram.add(base);

      // Deep Archway Portal
      const portalMat = new THREE.MeshBasicMaterial({ color: 0x090a0d });
      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.85), portalMat);
      portal.position.y = 0.4;
      gopuram.add(portal);

      // Signboard over Base Entrance
      const signTex = createSignboardTexture('SRI MEENAKSHI AMMAN TEMPLE', 'MADURAI • ESTD. ANCIENT PANDYA ERA', '#1a0e08', '#ffffff', '#e88124');
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.45), signMat);
      signMesh.position.set(0, 0.85, 0.92);
      gopuram.add(signMesh);

      // 6 Stepped Tiers with cornices
      let tierY = 1.0;
      let tierW = 2.3;
      let tierD = 1.5;
      for (let t = 0; t < 6; t++) {
        tierY += 0.35;
        tierW -= 0.24;
        tierD -= 0.15;
        const mat = new THREE.MeshStandardMaterial({ color: tierColors[t % tierColors.length], roughness: 0.6 });
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.35, tierD), mat);
        tier.position.y = tierY;
        tier.castShadow = true;
        gopuram.add(tier);

        const ledge = new THREE.Mesh(new THREE.BoxGeometry(tierW + 0.15, 0.06, tierD + 0.15), stoneMat);
        ledge.position.y = tierY + 0.18;
        gopuram.add(ledge);
      }

      // Crown Vaulted Roof & 5 Golden Kalasams
      const topRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.48, 0.35, 8), stoneMat);
      topRoof.rotation.z = Math.PI / 2;
      topRoof.position.y = tierY + 0.34;
      gopuram.add(topRoof);

      for (let k = -2; k <= 2; k++) {
        const kalasam = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.34, 6), goldMat);
        kalasam.position.set(k * 0.18, tierY + 0.62, 0);
        gopuram.add(kalasam);
      }

      const templeLight = new THREE.PointLight(0xffa500, 2.5, 6);
      templeLight.position.set(0, tierY + 0.2, 1.2);
      gopuram.add(templeLight);

      const badge = createFloatingBadge('Meenakshi Amman Kovil', '🛕');
      badge.position.set(0, tierY + 1.4, 0);
      gopuram.add(badge);

      return gopuram;
    }

    const meenakshiModel = createMeenakshiTemple();
    meenakshiModel.position.set(-4.5, 0, 1.8);
    scene.add(meenakshiModel);

    // B. ALANGANALLUR VADIVASAL & ANIMATED JALLIKATTU BULL!
    let bullMesh = null;
    let bullLegs = [];
    let bullHead = null;
    let bullTail = null;

    function createAlanganallurVadivasal() {
      const arenaGroup = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11, roughness: 0.8 });
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x993d14, roughness: 0.7 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

      // 1. The Iconic Vadivasal Gate Pillars
      const leftGate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.6, 0.5), brickMat);
      leftGate.position.set(-1.2, 1.3, 0);
      arenaGroup.add(leftGate);

      const rightGate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.6, 0.5), brickMat);
      rightGate.position.set(1.2, 1.3, 0);
      arenaGroup.add(rightGate);

      // Vadivasal Entrance Crossbeam Arch
      const archBeam = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.5, 0.55), brickMat);
      archBeam.position.set(0, 2.5, 0);
      arenaGroup.add(archBeam);

      // Traditional Terracotta Tiled Roof Canopy over Vadivasal
      const tileRoof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.6, 4), roofMat);
      tileRoof.rotation.y = Math.PI / 4;
      tileRoof.position.set(0, 3.0, 0);
      arenaGroup.add(tileRoof);

      // Official Vadivasal Signboard
      const gateTex = createSignboardTexture('ALANGANALLUR VADIVASAL', 'அலங்காநல்லூர் வாடிவாசல் • JALLIKATTU', '#1a0b06', '#ffffff', '#e88124');
      const gateSignMat = new THREE.MeshBasicMaterial({ map: gateTex });
      const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), gateSignMat);
      gateSign.position.set(0, 2.5, 0.3);
      arenaGroup.add(gateSign);

      // Arena Wooden Barricade Railings
      for (let r = 0; r < 3; r++) {
        const barLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.6), woodMat);
        barLeft.position.set(-1.2, 0.4 + r * 0.45, 1.3);
        arenaGroup.add(barLeft);

        const barRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.6), woodMat);
        barRight.position.set(1.2, 0.4 + r * 0.45, 1.3);
        arenaGroup.add(barRight);
      }

      // 2. THE ANIMATED TAMIL JALLIKATTU BULL (Kangayam Breed)
      const bullGroup = new THREE.Group();
      const bullBodyMat = new THREE.MeshStandardMaterial({
        color: 0x1c1917, // Sleek black/charcoal bull
        roughness: 0.6,
        metalness: 0.2
      });
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xe5e7eb,
        roughness: 0.3,
        metalness: 0.4
      });

      // Muscular Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 1.2), bullBodyMat);
      torso.position.y = 0.65;
      torso.castShadow = true;
      bullGroup.add(torso);

      // Iconic Muscular Hump (திமில் - Timil)
      const hump = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), bullBodyMat);
      hump.scale.set(0.9, 1.2, 1.0);
      hump.position.set(0, 1.05, 0.25);
      bullGroup.add(hump);

      // Powerful Neck & Head (animated)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.85, 0.65);

      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.5), bullBodyMat);
      neck.position.set(0, 0, 0.15);
      headGroup.add(neck);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 6), bullBodyMat);
      head.rotation.x = -Math.PI / 2;
      head.position.set(0, -0.05, 0.45);
      headGroup.add(head);

      // Sharp Curved Horns with festive ribbon bands
      const leftHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.45, 6), hornMat);
      leftHorn.rotation.set(-0.3, 0, 0.55);
      leftHorn.position.set(-0.25, 0.2, 0.35);
      headGroup.add(leftHorn);

      const rightHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.45, 6), hornMat);
      rightHorn.rotation.set(-0.3, 0, -0.55);
      rightHorn.position.set(0.25, 0.2, 0.35);
      headGroup.add(rightHorn);

      bullGroup.add(headGroup);
      bullHead = headGroup;

      // 4 Running Legs
      const legOffsets = [
        { x: -0.22, y: 0.32, z: 0.38 },
        { x: 0.22, y: 0.32, z: 0.38 },
        { x: -0.22, y: 0.32, z: -0.38 },
        { x: 0.22, y: 0.32, z: -0.38 }
      ];

      bullLegs = [];
      legOffsets.forEach(lo => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.65, 6), bullBodyMat);
        leg.position.set(lo.x, lo.y, lo.z);
        leg.castShadow = true;
        bullGroup.add(leg);
        bullLegs.push(leg);
      });

      // Tail with hair tuft
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.6), bullBodyMat);
      tail.position.set(0, 0.6, -0.65);
      tail.rotation.x = -0.4;
      bullGroup.add(tail);
      bullTail = tail;

      // Position the bull bursting forward from the Vadivasal gate
      bullGroup.position.set(0, 0, 1.2);
      arenaGroup.add(bullGroup);
      bullMesh = bullGroup;

      // Floating Title Badge
      const badge = createFloatingBadge('Alanganallur Vadivasal', '🐂');
      badge.position.set(0, 4.0, 0);
      arenaGroup.add(badge);

      return arenaGroup;
    }

    const vadivasalModel = createAlanganallurVadivasal();
    vadivasalModel.position.set(-1.5, 0, 3.2);
    scene.add(vadivasalModel);

    // C. LUCKY MESS IN ALANGANALLUR (Village Non-Veg Feast)
    function createLuckyMess() {
      const mess = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });

      // Mess Building
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 1.8), wallMat);
      bldg.position.y = 0.75;
      bldg.castShadow = true;
      mess.add(bldg);

      // Lucky Mess Signboard
      const messTex = createSignboardTexture('LUCKY MESS • ALANGANALLUR', 'FAMOUS NATTU KOZHI & MUTTON CHUKKA', '#1f0d05', '#ffffff', '#e88124');
      const messSignMat = new THREE.MeshBasicMaterial({ map: messTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.48), messSignMat);
      sign.position.set(0, 1.7, 0.95);
      mess.add(sign);

      // Banana Leaf Outdoor Tables
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      for (let t = -0.7; t <= 0.7; t += 1.4) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.4, 0.5), tableMat);
        table.position.set(t, 0.2, 1.5);
        mess.add(table);

        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.25), new THREE.MeshBasicMaterial({ color: 0x15803d }));
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(t, 0.41, 1.5);
        mess.add(leaf);
      }

      const light = new THREE.PointLight(0xffa756, 2.2, 5);
      light.position.set(0, 1.3, 1.4);
      mess.add(light);

      const badge = createFloatingBadge('Lucky Mess Alanganallur', '🍗');
      badge.position.set(0, 2.5, 0);
      mess.add(badge);

      return mess;
    }

    const luckyMessModel = createLuckyMess();
    luckyMessModel.position.set(1.5, 0, 3.2);
    scene.add(luckyMessModel);

    // D. POWER KADAI & MADURAI BUN PAROTTA (Simmakkal / Goripalayam)
    const chimneySmokeParticles = [];

    function createPowerKadai() {
      const hotel = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x3d281d, roughness: 0.8 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x16161a });

      const block = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 2.0), brickMat);
      block.position.y = 0.8;
      block.castShadow = true;
      hotel.add(block);

      // Illuminated Signboard
      const messTex = createSignboardTexture('POWER KADAI & BUN PAROTTA', 'MADURAI KARI DOSA • SIMMAKKAL', '#1a0b06', '#ffffff', '#e88124');
      const messSignMat = new THREE.MeshBasicMaterial({ map: messTex });
      const messSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.55), messSignMat);
      messSign.position.set(0, 1.9, 1.05);
      hotel.add(messSign);

      // Kitchen Chimney with Animated Smoke
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.0), darkMat);
      chimney.position.set(0.8, 2.1, -0.6);
      hotel.add(chimney);

      const smokeMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db, transparent: true, opacity: 0.6 });
      for (let s = 0; s < 10; s++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.12 + Math.random() * 0.08, 6, 6), smokeMat.clone());
        puff.position.set(0.8 + (Math.random() - 0.5) * 0.1, 2.6 + s * 0.2, -0.6 + (Math.random() - 0.5) * 0.1);
        puff.userData = { baseY: 2.6, speed: 0.015 + Math.random() * 0.01, drift: (Math.random() - 0.5) * 0.005 };
        hotel.add(puff);
        chimneySmokeParticles.push(puff);
      }

      // Porch Dining Setup
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      for (let t = -0.8; t <= 0.8; t += 1.6) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.5), tableMat);
        table.position.set(t, 0.2, 1.6);
        hotel.add(table);

        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshBasicMaterial({ color: 0x15803d }));
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(t, 0.41, 1.6);
        hotel.add(leaf);
      }

      const foodLight = new THREE.PointLight(0xffa756, 2.5, 6);
      foodLight.position.set(0, 1.4, 1.6);
      hotel.add(foodLight);

      const badge = createFloatingBadge('Power Kadai & Bun Parotta', '🥩');
      badge.position.set(0, 2.7, 0);
      hotel.add(badge);

      return hotel;
    }

    const powerKadaiModel = createPowerKadai();
    powerKadaiModel.position.set(4.8, 0, 1.5);
    scene.add(powerKadaiModel);

    // E. GANDHI MEMORIAL MUSEUM (TAMUKKAM NAYAK PALACE)
    function createGandhiMuseum() {
      const museum = new THREE.Group();
      const stonePlinthMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.8 });
      const palaceWallMat = new THREE.MeshStandardMaterial({ color: 0x3a4056, roughness: 0.5 });
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe88124, metalness: 0.85, roughness: 0.25 });

      const baseStep1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.8), stonePlinthMat);
      baseStep1.position.y = 0.1;
      museum.add(baseStep1);

      const baseStep2 = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.2, 2.5), stonePlinthMat);
      baseStep2.position.y = 0.3;
      museum.add(baseStep2);

      const hall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.2), palaceWallMat);
      hall.position.y = 1.0;
      hall.castShadow = true;
      museum.add(hall);

      const museumTex = createSignboardTexture('GANDHI MEMORIAL PALACE MUSEUM', 'TAMUKKAM NAYAK PALACE • FREEDOM ARCHIVES', '#151928', '#ffffff', '#e88124');
      const museumSignMat = new THREE.MeshBasicMaterial({ map: museumTex });
      const museumSign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.5), museumSignMat);
      museumSign.position.set(0, 1.85, 1.15);
      museum.add(museumSign);

      for (let p = -1.4; p <= 1.4; p += 0.56) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 1.3, 12), pillarMat);
        pillar.position.set(p, 1.05, 1.18);
        pillar.castShadow = true;
        museum.add(pillar);
      }

      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.35, 8), stonePlinthMat);
      drum.position.set(0, 1.85, 0);
      museum.add(drum);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.set(0, 2.0, 0);
      museum.add(dome);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6), pillarMat);
      pole.position.set(0, 3.4, 0);
      museum.add(pole);

      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), new THREE.MeshBasicMaterial({ color: 0xe88124 }));
      flag.position.set(0.22, 4.0, 0);
      museum.add(flag);

      const badge = createFloatingBadge('Gandhi Memorial Palace', '🏛️');
      badge.position.set(0, 4.8, 0);
      museum.add(badge);

      return museum;
    }

    const museumModel = createGandhiMuseum();
    museumModel.position.set(3.8, 0, -3.2);
    scene.add(museumModel);

    // F. ALAGAR KOVIL (KALLAZHAGAR TEMPLE - NOT WATERFALLS!)
    function createAlagarTemple() {
      const templeGroup = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xa8481d, roughness: 0.7 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Temple Outer Fort Wall & Gateway
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.1, 2.2), stoneMat);
      base.position.y = 0.55;
      base.castShadow = true;
      templeGroup.add(base);

      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 2.25), new THREE.MeshBasicMaterial({ color: 0x090a0d }));
      portal.position.y = 0.45;
      templeGroup.add(portal);

      // Alagar Kovil Signboard
      const alagarTex = createSignboardTexture('ALAGAR KOVIL (KALLAZHAGAR)', 'அழகர் கோவில் • CHITHIRAI FESTIVAL', '#160a04', '#ffffff', '#e88124');
      const alagarSignMat = new THREE.MeshBasicMaterial({ map: alagarTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), alagarSignMat);
      sign.position.set(0, 0.95, 1.12);
      templeGroup.add(sign);

      // Dravidian Raja Gopuram (4 stepped tiers)
      let tierY = 1.1;
      let tierW = 2.4;
      let tierD = 1.6;
      for (let t = 0; t < 4; t++) {
        tierY += 0.42;
        tierW -= 0.32;
        tierD -= 0.2;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.42, tierD), stoneMat);
        tier.position.y = tierY;
        tier.castShadow = true;
        templeGroup.add(tier);
      }

      // Gold Vimanam Spire
      const vimanam = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 6), goldMat);
      vimanam.position.set(0, tierY + 0.6, 0);
      templeGroup.add(vimanam);

      // Sacred Golden Dhwaja Stambham (Flagmast)
      const flagmast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.5), goldMat);
      flagmast.position.set(1.4, 1.25, 1.4);
      templeGroup.add(flagmast);

      const templeLight = new THREE.PointLight(0xffb703, 2.5, 6);
      templeLight.position.set(0, 2.0, 1.4);
      templeGroup.add(templeLight);

      const badge = createFloatingBadge('Alagar Kovil (Kallazhagar)', '🛕');
      badge.position.set(0, tierY + 1.4, 0);
      templeGroup.add(badge);

      return templeGroup;
    }

    const alagarModel = createAlagarTemple();
    alagarModel.position.set(-2.8, 0, -4.2);
    scene.add(alagarModel);

    // =========================================================================
    // 4. NATURAL PALM GROVES
    // =========================================================================
    function createPalmTree(scale) {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1e, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.3, 6), trunkMat);
      trunk.position.y = 0.65;
      trunk.castShadow = true;
      tree.add(trunk);

      const frondMat = new THREE.MeshStandardMaterial({ color: 0x1a4329, roughness: 0.7 });
      for (let p = 0; p < 5; p++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), frondMat);
        frond.position.set(0, 1.3, 0);
        frond.rotation.z = 0.65;
        frond.rotation.y = (p * Math.PI * 2) / 5;
        tree.add(frond);
      }
      tree.scale.set(scale, scale, scale);
      return tree;
    }

    const treeSpots = [
      { x: -3.2, z: 2.2 }, { x: -5.8, z: 1.8 },
      { x: 0.0, z: 2.8 },  { x: 3.2, z: 4.5 },
      { x: 5.5, z: 2.8 },  { x: 5.8, z: -1.2 },
      { x: 1.8, z: -2.8 }, { x: -1.2, z: -3.8 },
      { x: -4.8, z: -3.8 }
    ];
    treeSpots.forEach(s => {
      const t = createPalmTree(0.75 + Math.random() * 0.3);
      t.position.set(s.x, 0, s.y);
      scene.add(t);
    });

    // =========================================================================
    // 5. HIGHWAY ROAD LOOP (ELEVATED AT y=0.25 - CAR NEVER ENTERS WATER OR GROUND!)
    // =========================================================================
    const ROAD_Y = 0.25;

    // Road curve connecting all Madurai checkpoints cleanly (bounds: x: -5 to +5, z: -4.5 to +3.5)
    // River is at z = 6.0+, completely separated!
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, ROAD_Y, 1.8),  // Meenakshi Temple
      new THREE.Vector3(-1.5, ROAD_Y, 3.2),  // Alanganallur Vadivasal (Jallikattu)
      new THREE.Vector3(1.5, ROAD_Y, 3.2),   // Lucky Mess (Alanganallur)
      new THREE.Vector3(4.8, ROAD_Y, 1.5),   // Power Kadai & Bun Parotta
      new THREE.Vector3(3.8, ROAD_Y, -3.2),  // Gandhi Memorial Museum
      new THREE.Vector3(-2.8, ROAD_Y, -4.2), // Alagar Kovil Temple
      new THREE.Vector3(-5.5, ROAD_Y, -1.2)  // Circuit Closer
    ], true, 'catmullrom', 0.25);

    // Road Ribbon
    const roadGeo = new THREE.TubeGeometry(roadCurve, 140, 0.42, 6, true);
    roadGeo.scale(1, 0.04, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e212b,
      roughness: 0.7,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Glowing Neon BIXI Orange Center Lane
    const roadLineGeo = new THREE.TubeGeometry(roadCurve, 140, 0.04, 4, true);
    roadLineGeo.scale(1, 0.05, 1);
    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xe88124 });
    const roadLineMesh = new THREE.Mesh(roadLineGeo, roadLineMat);
    roadLineMesh.position.y = 0.02;
    scene.add(roadLineMesh);

    // Road Streetlights
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const lampSpacing = 7;
    for (let l = 0; l < lampSpacing; l++) {
      const u = l / lampSpacing;
      const pt = roadCurve.getPointAt(u);
      const tangent = roadCurve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const polePos = pt.clone().add(normal.clone().multiplyScalar(0.7));
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4), lampMat);
      pole.position.set(polePos.x, ROAD_Y + 0.7, polePos.z);
      scene.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), bulbMat);
      bulb.position.set(polePos.x, ROAD_Y + 1.4, polePos.z);
      scene.add(bulb);

      const lampLight = new THREE.PointLight(0xffeedd, 1.2, 3.5);
      lampLight.position.set(polePos.x, ROAD_Y + 1.35, polePos.z);
      scene.add(lampLight);
    }

    // =========================================================================
    // 6. 3D MARUTI SWIFT HATCHBACK MODEL (BIXI RACING ORANGE)
    // =========================================================================
    const carGroup = new THREE.Group();

    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe88124,
      metalness: 0.8,
      roughness: 0.2
    });
    const carRoofMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.6,
      roughness: 0.3
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 1.25), carBodyMat);
    lowerBody.position.y = 0.18;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.35), carBodyMat);
    nose.position.set(0, 0.18, 0.58);
    carGroup.add(nose);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.65), carRoofMat);
    cabin.position.set(0, 0.36, -0.05);
    carGroup.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.18, 0.68), glassMat);
    windshield.position.set(0, 0.35, -0.05);
    carGroup.add(windshield);

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const carWheels = [];

    const wheelOffsets = [
      { x: -0.32, y: 0.12, z: 0.4 },
      { x: 0.32, y: 0.12, z: 0.4 },
      { x: -0.32, y: 0.12, z: -0.4 },
      { x: 0.32, y: 0.12, z: -0.4 }
    ];

    wheelOffsets.forEach(wo => {
      const wGroup = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), wheelMat);
      tire.rotation.z = Math.PI / 2;
      wGroup.add(tire);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 6), rimMat);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);
      wGroup.position.set(wo.x, wo.y, wo.z);
      carGroup.add(wGroup);
      carWheels.push(wGroup);
    });

    // Twin LED Headlights (Cast forward light onto the road)
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headMat);
    hl1.position.set(-0.22, 0.22, 0.74);
    carGroup.add(hl1);
    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), headMat);
    hl2.position.set(0.22, 0.22, 0.74);
    carGroup.add(hl2);

    const carHeadlightSpot = new THREE.SpotLight(0xfffaed, 3.5, 6, Math.PI / 6, 0.4);
    carHeadlightSpot.position.set(0, 0.3, 0.7);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 3.5);
    carGroup.add(spotTarget);
    carHeadlightSpot.target = spotTarget;
    carGroup.add(carHeadlightSpot);

    // Red LED Taillights
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl1.position.set(-0.22, 0.24, -0.62);
    carGroup.add(tl1);
    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl2.position.set(0.22, 0.24, -0.62);
    carGroup.add(tl2);

    scene.add(carGroup);

    // =========================================================================
    // 7. CHECKPOINT BEACONS & INTERACTION
    // =========================================================================
    const pinMeshes = [];
    CHECKPOINTS.forEach(cp => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(cp.pos.x, ROAD_Y, cp.pos.z);

      const ringGeo = new THREE.RingGeometry(0.25, 0.45, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe88124,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.05;
      pinGroup.add(ring);

      const pinHeadGeo = new THREE.OctahedronGeometry(0.26, 0);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: 0xe88124,
        emissive: 0xd97706,
        roughness: 0.2,
        metalness: 0.8
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.y = 1.6;
      pinHead.userData = { id: cp.id, info: cp, ring: ring, originalY: 1.6 };
      pinGroup.add(pinHead);
      pinMeshes.push(pinHead);

      scene.add(pinGroup);
    });

    // =========================================================================
    // 8. INTERACTIVE CLICK & CAMERA CONTROLS
    // =========================================================================
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

    let isMouseDown = false;
    let prevMouseX = 0;
    let autoRotate = true;
    let cameraAngle = 0.6;
    let camDistance = 16;
    let camHeight = 12;
    let camTargetPos = null;
    let camTargetLook = null;

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
      camTargetPos = null;
    });

    window.addEventListener('pointerup', () => {
      isMouseDown = false;
    });

    function selectCheckpoint(cp) {
      if (!cp) return;

      camTargetPos = new THREE.Vector3(cp.camPos.x, cp.camPos.y, cp.camPos.z);
      camTargetLook = new THREE.Vector3(cp.target.x, cp.target.y, cp.target.z);
      autoRotate = false;

      // Show the [ ✕ Zoom Out / Overview ] button
      const resetBtn = document.getElementById('btnMapResetView');
      if (resetBtn) resetBtn.style.display = 'inline-flex';

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

      document.querySelectorAll('.map-pill-btn').forEach(btn => {
        if (btn.dataset.id === cp.id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function resetMaduraiOverview() {
      camTargetPos = defaultCamPos.clone();
      camTargetLook = defaultLookAt.clone();
      autoRotate = true;

      const resetBtn = document.getElementById('btnMapResetView');
      if (resetBtn) resetBtn.style.display = 'none';

      document.querySelectorAll('.map-pill-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      const cardTitle = document.getElementById('mapActiveTitle');
      if (cardTitle) cardTitle.textContent = 'Madurai Landmark Tour';
      const cardCategory = document.getElementById('mapActiveCategory');
      if (cardCategory) cardCategory.textContent = 'Scenic Route Loop';
      const cardDesc = document.getElementById('mapActiveDesc');
      if (cardDesc) cardDesc.textContent = 'Explore Madurai’s most iconic landmarks and authentic food stops. Click any landmark pill to fly into the 3D model, or enjoy the live Swift cruiser tour.';
    }

    window.focusMaduraiCheckpoint = function (id) {
      const found = CHECKPOINTS.find(c => c.id === id);
      if (found) {
        selectCheckpoint(found);
      }
    };

    window.resetMaduraiMapOverview = function () {
      resetMaduraiOverview();
    };

    // =========================================================================
    // 9. ANIMATION LOOP & SIMULATIONS
    // =========================================================================
    let carT = 0;
    const carSpeed = 0.00065;
    let animationFrameId = null;
    let isVisible = false;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      // A. Drive Car along road loop (strictly at ROAD_Y + 0.12)
      carT = (carT + carSpeed) % 1;
      const pt = roadCurve.getPointAt(carT);
      const nextPt = roadCurve.getPointAt((carT + 0.01) % 1);

      carGroup.position.set(pt.x, ROAD_Y + 0.12, pt.z);
      carGroup.lookAt(new THREE.Vector3(nextPt.x, ROAD_Y + 0.12, nextPt.z));

      carWheels.forEach(w => {
        w.rotation.x += 0.25;
      });

      // B. Update Live Telemetry HUD dynamically
      let nearestCp = null;
      let minDistance = 999;
      CHECKPOINTS.forEach(cp => {
        const d = pt.distanceTo(new THREE.Vector3(cp.pos.x, ROAD_Y, cp.pos.z));
        if (d < minDistance) {
          minDistance = d;
          nearestCp = cp;
        }
      });

      const liveHudLocation = document.getElementById('mapLiveCheckpointText');
      if (liveHudLocation && nearestCp && minDistance < 2.5) {
        liveHudLocation.textContent = nearestCp.name;
      }

      // C. ANIMATE JALLIKATTU BULL (Charging Gallop & Head-Toss Simulation!)
      const timeSec = Date.now() * 0.008;
      if (bullMesh && bullLegs.length === 4) {
        // Galloping leg motion
        bullLegs[0].rotation.x = Math.sin(timeSec) * 0.45;
        bullLegs[1].rotation.x = -Math.sin(timeSec) * 0.45;
        bullLegs[2].rotation.x = -Math.sin(timeSec + 0.5) * 0.45;
        bullLegs[3].rotation.x = Math.sin(timeSec + 0.5) * 0.45;

        // Head thrusting / horn tossing
        if (bullHead) {
          bullHead.rotation.x = Math.sin(timeSec * 0.6) * 0.15;
          bullHead.rotation.y = Math.cos(timeSec * 0.4) * 0.1;
        }

        // Tail swishing
        if (bullTail) {
          bullTail.rotation.z = Math.sin(timeSec * 1.2) * 0.3;
        }

        // Bull charging stride forward and back slightly
        bullMesh.position.z = 1.2 + Math.sin(timeSec * 0.5) * 0.25;
      }

      // D. Animate Chimney Smoke above Power Kadai
      chimneySmokeParticles.forEach((puff) => {
        puff.position.y += puff.userData.speed;
        puff.position.x += puff.userData.drift;
        const progress = (puff.position.y - puff.userData.baseY) / 1.5;
        puff.scale.set(1 + progress * 1.5, 1 + progress * 1.5, 1 + progress * 1.5);
        puff.material.opacity = Math.max(0, 0.6 * (1 - progress));
        if (puff.position.y > puff.userData.baseY + 1.5) {
          puff.position.y = puff.userData.baseY;
          puff.position.x = 0.8 + (Math.random() - 0.5) * 0.1;
          puff.scale.set(1, 1, 1);
        }
      });

      // E. Spin Diamond Beacons
      const time = Date.now() * 0.003;
      pinMeshes.forEach(mesh => {
        mesh.rotation.y += 0.02;
        mesh.position.y = mesh.userData.originalY + Math.sin(time + mesh.position.x) * 0.08;
      });

      // F. Camera Smooth Follow / Tween or Orbit
      if (camTargetPos && camTargetLook) {
        camera.position.lerp(camTargetPos, 0.045);
        currentLookAt.lerp(camTargetLook, 0.045);
        camera.lookAt(currentLookAt);
      } else {
        if (autoRotate) {
          cameraAngle += 0.0012;
        }
        camera.position.x = Math.sin(cameraAngle) * camDistance;
        camera.position.z = Math.cos(cameraAngle) * camDistance;
        camera.position.y = camHeight;
        camera.lookAt(currentLookAt);
      }

      // G. Raycasting for Hover Highlights
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
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
    }, { threshold: 0.1 });

    observer.observe(container);

    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadurai3DWorld);
  } else {
    initMadurai3DWorld();
  }
})();
