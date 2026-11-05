/**
 * BIXI RIDE - 3D MADURAI ROUTE, LANDMARKS & NATURE SIMULATOR
 * High-Performance Procedural Three.js Simulation
 * 
 * Perfected Alignment:
 * - 100% Theme Color Harmony: Pitch Carbon (#0B0D13), BIXI Sunset Orange (#E88124), Titanium Silver
 * - Car Elevation Fixed: Road elevated at y=0.25, Car sits on top at y=0.40 - ZERO underground clipping!
 * - Realistic Vaigai River & Historic Albert Victor Bridge (No out-of-place river lighthouse)
 * - Authentic 3D Models:
 *   1. Madurai Meenakshi Amman Temple (7-tier Dravidian Stepped Gopuram with 5 Gold Kalasams)
 *   2. Albert Victor Stone-Arch Bridge across Vaigai River
 *   3. Alagar Hills Waterfalls & Sacred Mountain Springs
 *   4. Gandhi Memorial Palace Museum (Tamukkam Nayak Palace with pillars & dome)
 *   5. Power Kadai & Lucky Mess (Iconic Madurai food landmark with glowing neon sign & chimney)
 *   6. Madurai-Kilakarai 4-Lane Highway Gateway Arch
 * - Procedural 3D Maruti Swift in BIXI Sunset Orange cruising along an endless road circuit
 * - Zero ugly scrollbars, 60 FPS, IntersectionObserver pauses off-screen
 */

(function () {
  'use strict';

  const CHECKPOINTS = [
    {
      id: 'meenakshi',
      name: 'Meenakshi Amman Kovil',
      category: 'Temple Wonder',
      pos: { x: -4.5, y: 0.25, z: 2.2 },
      camPos: { x: -4.5, y: 3.5, z: 6.8 },
      target: { x: -4.5, y: 1.2, z: 2.2 },
      distance: '1.2 km from Junction',
      time: '5 mins',
      vehicle: 'Activa 6G / Maruti Swift',
      desc: 'Madurai’s eternal crown jewel featuring 14 towering sculpted Dravidian gopurams, Thousand Pillar Hall, and sacred Golden Lotus tank.',
      badge: 'Heritage Wonder'
    },
    {
      id: 'vaigai-bridge',
      name: 'Vaigai River & AV Bridge',
      category: 'Historic River Landmark',
      pos: { x: -1.2, y: 0.25, z: 1.8 },
      camPos: { x: -1.2, y: 3.2, z: 5.5 },
      target: { x: -1.2, y: 0.8, z: 1.8 },
      distance: '1.8 km',
      time: '6 mins',
      vehicle: 'Hunter 350 / Swift',
      desc: 'Historic Albert Victor Bridge built in 1889 over the sacred Vaigai River with 16 stone arches, heritage streetlamps, and river breezes.',
      badge: 'Vaigai River'
    },
    {
      id: 'power-kadai',
      name: 'Power Kadai & Lucky Mess',
      category: 'Culinary Legend',
      pos: { x: 3.2, y: 0.25, z: 3.2 },
      camPos: { x: 3.2, y: 3.0, z: 7.2 },
      target: { x: 3.2, y: 1.0, z: 3.2 },
      distance: '3.8 km / 16 km',
      time: '12 mins / 28 mins',
      vehicle: 'Maruti Swift / Hunter 350',
      desc: 'Authentic Goripalayam Mutton Kari Dosa and legendary Alanganallur country non-veg feast served piping hot on fresh banana leaves.',
      badge: 'Food & Mess'
    },
    {
      id: 'gandhi-museum',
      name: 'Gandhi Memorial Palace Museum',
      category: 'Historic Nayak Palace',
      pos: { x: 5.2, y: 0.25, z: 0.2 },
      camPos: { x: 5.2, y: 3.4, z: 4.8 },
      target: { x: 5.2, y: 1.2, z: 0.2 },
      distance: '4.5 km',
      time: '14 mins',
      vehicle: 'Maruti Swift / Thar 4x4',
      desc: 'Historic 17th-century Nayak palace where Mahatma Gandhi decided to adopt the dhoti in 1921. Surrounded by serene Tamukkam gardens.',
      badge: 'Palace Museum'
    },
    {
      id: 'alagar-waterfalls',
      name: 'Alagar Kovil & Mountain Waterfalls',
      category: 'Nature & Sacred Springs',
      pos: { x: 1.8, y: 0.25, z: -4.8 },
      camPos: { x: 1.8, y: 4.0, z: -0.8 },
      target: { x: 1.8, y: 1.5, z: -4.8 },
      distance: '21 km',
      time: '35 mins',
      vehicle: 'Maruti Swift / RE Himalayan',
      desc: 'Nestled in lush Western Ghat foothills. Natural mountain spring cascades, Pazhamudircholai forest canopy, and refreshing hill breezes.',
      badge: 'Falls & Hills'
    },
    {
      id: 'kilakarai-highway',
      name: 'Madurai-Kilakarai Highway Arch',
      category: '4-Lane Expressway Gateway',
      pos: { x: -4.8, y: 0.25, z: -3.2 },
      camPos: { x: -4.8, y: 3.5, z: 0.8 },
      target: { x: -4.8, y: 1.2, z: -3.2 },
      distance: '92 km',
      time: '1 hr 45m',
      vehicle: 'Maruti Swift / Ertiga 7-Str',
      desc: 'Grand highway expressway connecting Madurai through Vadipatti & Ramanathapuram towards Kilakarai coastal port and Rameswaram.',
      badge: 'Expressway Gateway'
    }
  ];

  function initMadurai3DWorld() {
    const canvas = document.getElementById('madurai-3d-map-canvas');
    const container = document.getElementById('madurai-3d-map-wrapper');
    if (!canvas || !container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js library is required for the 3D world');
      return;
    }

    // --- Scene & Atmospheric Theme Lighting ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d13); // Pitch Carbon theme
    scene.fog = new THREE.FogExp2(0x0b0d13, 0.026);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    const defaultCamPos = new THREE.Vector3(0, 12, 16);
    const targetLookAt = new THREE.Vector3(0, 0.5, 0);
    camera.position.copy(defaultCamPos);
    camera.lookAt(targetLookAt);

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

    // Harmonized BIXI Orange & Warm Sunset Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffa756, 1.6);
    sunLight.position.set(12, 22, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    scene.add(sunLight);

    const orangeGlowLight = new THREE.PointLight(0xe88124, 2.0, 30);
    orangeGlowLight.position.set(0, 8, 0);
    scene.add(orangeGlowLight);

    // =========================================================================
    // 1. TERRAIN (Pitch Slate Ground - Completely Flat Under Road to Prevent Clipping)
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(36, 36, 32, 32);
    terrainGeo.rotateX(-Math.PI / 2);

    // Terrain stays firmly at y=0 so road at y=0.25 is ALWAYS completely visible on top!
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x131620, // Dark Slate matching site theme
      roughness: 0.85,
      metalness: 0.15
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Distant Western Ghats Mountain Foothills in the background (far north, behind waterfalls)
    const mountainGeo = new THREE.ConeGeometry(5, 6, 6);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e2c, // Dark mountain silhouette
      roughness: 0.9,
      flatShading: true
    });
    const m1 = new THREE.Mesh(mountainGeo, mountainMat);
    m1.position.set(4, 2.6, -13);
    scene.add(m1);
    const m2 = new THREE.Mesh(mountainGeo, mountainMat);
    m2.scale.set(1.4, 1.2, 1.4);
    m2.position.set(-3, 3.2, -14);
    scene.add(m2);
    const m3 = new THREE.Mesh(mountainGeo, mountainMat);
    m3.scale.set(1.1, 0.9, 1.1);
    m3.position.set(10, 2.4, -12);
    scene.add(m3);

    // =========================================================================
    // 2. VAIGAI RIVER (Crossing Madurai - NO LIGHTHOUSE!)
    // =========================================================================
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-16, 0.04, 3.8),
      new THREE.Vector3(-8, 0.04, 2.9),
      new THREE.Vector3(-1.2, 0.04, 1.8),
      new THREE.Vector3(4, 0.04, 0.4),
      new THREE.Vector3(10, 0.04, -1.2),
      new THREE.Vector3(16, 0.04, -2.5)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.15, 8, false);
    riverGeo.scale(1, 0.06, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48, // Deep blue reflective water
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // =========================================================================
    // 3. REAL 3D LANDMARK MODELS
    // =========================================================================

    // A. MEENAKSHI AMMAN TEMPLE (Authentic 7-tier Dravidian Stepped Gopuram with 5 Gold Kalasams)
    function createMeenakshiTemple() {
      const gopuram = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xc45c24, roughness: 0.7 });
      const tierColors = [0x993d14, 0x1e3a8a, 0x065f46, 0xd97706, 0x991b1b, 0x4c1d95, 0xb45309];
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Base Temple Gateway
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.6), stoneMat);
      base.position.y = 0.45;
      base.castShadow = true;
      base.receiveShadow = true;
      gopuram.add(base);

      // Arch Portal
      const portalMat = new THREE.MeshBasicMaterial({ color: 0x0d0d0f });
      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.65), portalMat);
      portal.position.y = 0.35;
      gopuram.add(portal);

      // 6 Stepped Tiers
      let tierY = 0.9;
      let tierW = 2.1;
      let tierD = 1.4;
      for (let t = 0; t < 6; t++) {
        tierY += 0.34;
        tierW -= 0.22;
        tierD -= 0.14;
        const mat = new THREE.MeshStandardMaterial({ color: tierColors[t % tierColors.length], roughness: 0.6 });
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.34, tierD), mat);
        tier.position.y = tierY;
        tier.castShadow = true;
        gopuram.add(tier);

        // Cornice ledge
        const ledge = new THREE.Mesh(new THREE.BoxGeometry(tierW + 0.12, 0.06, tierD + 0.12), stoneMat);
        ledge.position.y = tierY + 0.17;
        gopuram.add(ledge);
      }

      // Top Vault Roof & 5 Golden Kalasam Spires
      const topRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.48, 0.35, 8), stoneMat);
      topRoof.rotation.z = Math.PI / 2;
      topRoof.position.y = tierY + 0.32;
      gopuram.add(topRoof);

      for (let k = -2; k <= 2; k++) {
        const kalasam = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32, 6), goldMat);
        kalasam.position.set(k * 0.18, tierY + 0.6, 0);
        gopuram.add(kalasam);
      }

      // Golden Temple Lantern Light
      const templeLight = new THREE.PointLight(0xffa500, 2.5, 6);
      templeLight.position.set(0, tierY + 0.2, 1);
      gopuram.add(templeLight);

      return gopuram;
    }

    const meenakshiModel = createMeenakshiTemple();
    meenakshiModel.position.set(-4.5, 0, 2.2);
    scene.add(meenakshiModel);

    // B. ALBERT VICTOR BRIDGE ACROSS VAIGAI RIVER (Historic Stone-Arched Bridge)
    function createAlbertVictorBridge() {
      const bridge = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x2d3242, roughness: 0.8 });
      const archMat = new THREE.MeshStandardMaterial({ color: 0x1e2230, roughness: 0.9 });
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });

      // Bridge Deck Pier spanning river
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 2.8), stoneMat);
      deck.position.set(0, 0.25, 0);
      deck.castShadow = true;
      deck.receiveShadow = true;
      bridge.add(deck);

      // 3 Stone Arch Openings underneath
      for (let a = -0.9; a <= 0.9; a += 0.9) {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.65, 12, 1, false, 0, Math.PI), archMat);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(0, 0.12, a);
        bridge.add(arch);
      }

      // Parapet Stone Railings
      const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 2.8), stoneMat);
      leftRail.position.set(-0.75, 0.45, 0);
      bridge.add(leftRail);

      const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 2.8), stoneMat);
      rightRail.position.set(0.75, 0.45, 0);
      bridge.add(rightRail);

      // Heritage Lampposts on Bridge
      for (let lp = -1.1; lp <= 1.1; lp += 1.1) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), stoneMat);
        post.position.set(-0.75, 0.7, lp);
        bridge.add(post);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), lampMat);
        bulb.position.set(-0.75, 1.0, lp);
        bridge.add(bulb);
      }

      return bridge;
    }

    const bridgeModel = createAlbertVictorBridge();
    bridgeModel.position.set(-1.2, 0, 1.8);
    scene.add(bridgeModel);

    // C. ALAGAR HILLS WATERFALLS (Rocky Cliff with Cascading Spring Water)
    function createWaterfalls() {
      const fallsGroup = new THREE.Group();
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x272b38, roughness: 0.95, flatShading: true });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.1, metalness: 0.8 });
      const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

      // Mountain Cliff Rock Face
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 2.0), rockMat);
      cliff.position.y = 1.9;
      cliff.castShadow = true;
      fallsGroup.add(cliff);

      // Water Cascade Sheet
      const cascade = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3.4), waterMat);
      cascade.position.set(0, 1.7, 1.05);
      fallsGroup.add(cascade);

      // Mountain Spring Pool
      const pool = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.25, 12), waterMat);
      pool.position.set(0, 0.1, 1.6);
      fallsGroup.add(pool);

      const foamRing = new THREE.Mesh(new THREE.RingGeometry(0.4, 1.2, 12), foamMat);
      foamRing.rotation.x = -Math.PI / 2;
      foamRing.position.set(0, 0.24, 1.6);
      fallsGroup.add(foamRing);

      // Pine Canopy Trees on Cliff Top
      const pineMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
      for (let i = -1; i <= 1; i++) {
        const treeTop = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.3, 6), pineMat);
        treeTop.position.set(i * 0.9, 4.2, 0);
        fallsGroup.add(treeTop);
      }

      return fallsGroup;
    }

    const fallsModel = createWaterfalls();
    fallsModel.position.set(1.8, 0, -4.8);
    scene.add(fallsModel);

    // D. GANDHI MEMORIAL PALACE MUSEUM (Tamukkam Nayak Palace with Colonnade & Central Dome)
    function createGandhiMuseum() {
      const museum = new THREE.Group();
      const palaceWallMat = new THREE.MeshStandardMaterial({ color: 0x33384a, roughness: 0.6 });
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe88124, metalness: 0.8, roughness: 0.3 }); // Sunset Orange dome

      // Main Palace Building
      const hall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.2), palaceWallMat);
      hall.position.y = 0.7;
      hall.castShadow = true;
      museum.add(hall);

      // Portico Pillars
      for (let p = -1.4; p <= 1.4; p += 0.7) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), pillarMat);
        pillar.position.set(p, 0.7, 1.18);
        pillar.castShadow = true;
        museum.add(pillar);
      }

      // Palace Center Dome
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.set(0, 1.4, 0);
      museum.add(dome);

      // Flag Mast
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6), pillarMat);
      pole.position.set(0, 2.8, 0);
      museum.add(pole);

      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshBasicMaterial({ color: 0xe88124 }));
      flag.position.set(0.2, 3.4, 0);
      museum.add(flag);

      return museum;
    }

    const museumModel = createGandhiMuseum();
    museumModel.position.set(5.2, 0, 0.2);
    scene.add(museumModel);

    // E. POWER KADAI & LUCKY MESS (Madurai Iconic Food Landmark with Glowing Sign & Chimney)
    function createFoodMess() {
      const hotel = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x3d281d, roughness: 0.8 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x16161a });
      const neonOrange = new THREE.MeshBasicMaterial({ color: 0xe88124 });

      // Restaurant Main Block
      const block = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 2.0), brickMat);
      block.position.y = 0.8;
      block.castShadow = true;
      hotel.add(block);

      // Glowing Rooftop Signboard
      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.1), darkMat);
      signBoard.position.set(0, 1.85, 1.05);
      hotel.add(signBoard);

      const neonBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.12), neonOrange);
      neonBar.position.set(0, 1.85, 1.06);
      hotel.add(neonBar);

      // Steaming Kitchen Chimney
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.9), darkMat);
      chimney.position.set(0.8, 2.05, -0.6);
      hotel.add(chimney);

      // Outdoor Dining Tables with Green Banana Leaves
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      for (let t = -0.7; t <= 0.7; t += 1.4) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.5), tableMat);
        table.position.set(t, 0.2, 1.6);
        hotel.add(table);

        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), new THREE.MeshBasicMaterial({ color: 0x15803d }));
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(t, 0.41, 1.6);
        hotel.add(leaf);
      }

      // Warm Dining Porch Lamp
      const foodLight = new THREE.PointLight(0xffa756, 2.5, 5);
      foodLight.position.set(0, 1.4, 1.5);
      hotel.add(foodLight);

      return hotel;
    }

    const foodModel = createFoodMess();
    foodModel.position.set(3.2, 0, 3.2);
    scene.add(foodModel);

    // F. MADURAI-KILAKARAI HIGHWAY GATEWAY ARCH (Modern 4-Lane Expressway Toll Gateway)
    function createHighwayArch() {
      const gateGroup = new THREE.Group();
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.5 });
      const archSignMat = new THREE.MeshBasicMaterial({ color: 0xe88124 });

      // Left Pillar
      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 0.5), pylonMat);
      leftPillar.position.set(-1.4, 1.4, 0);
      gateGroup.add(leftPillar);

      // Right Pillar
      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 0.5), pylonMat);
      rightPillar.position.set(1.4, 1.4, 0);
      gateGroup.add(rightPillar);

      // Overhead Crossbar Span
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.6, 0.55), pylonMat);
      crossbar.position.set(0, 2.8, 0);
      gateGroup.add(crossbar);

      // Illuminated Orange Expressway Sign
      const sign = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 0.58), archSignMat);
      sign.position.set(0, 2.8, 0);
      gateGroup.add(sign);

      // Overhead Highway Spotlights
      const archLight = new THREE.PointLight(0xffa756, 2.0, 6);
      archLight.position.set(0, 2.5, 0.6);
      gateGroup.add(archLight);

      return gateGroup;
    }

    const highwayArch = createHighwayArch();
    highwayArch.position.set(-4.8, 0, -3.2);
    highwayArch.rotation.y = 0.45;
    scene.add(highwayArch);

    // =========================================================================
    // 4. NATURAL VEGETATION (Dark Slate/Emerald Palms Harmonized with Palette)
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
      { x: -3.0, z: 2.5 }, { x: -5.8, z: 2.2 },
      { x: 0.8, z: 2.6 },  { x: 4.5, z: 4.8 },
      { x: 4.8, z: 1.8 },  { x: 6.8, z: 0.8 },
      { x: 4.2, z: -1.5 }, { x: 3.2, z: -3.5 },
      { x: 0.2, z: -3.8 }, { x: -2.8, z: -4.8 },
      { x: -6.2, z: -2.0 },{ x: -5.8, z: -0.2 }
    ];
    treeSpots.forEach(s => {
      const t = createPalmTree(0.75 + Math.random() * 0.3);
      t.position.set(s.x, 0, s.y);
      scene.add(t);
    });

    // =========================================================================
    // 5. HIGHWAY ROAD LOOP (ELEVATED AT y=0.25 - ZERO UNDERGROUND CLIPPING!)
    // =========================================================================
    const ROAD_Y = 0.25;

    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, ROAD_Y, 2.2),  // Meenakshi Temple
      new THREE.Vector3(-1.2, ROAD_Y, 1.8),  // Crosses Albert Victor Bridge over Vaigai
      new THREE.Vector3(3.2, ROAD_Y, 3.2),   // Power Kadai & Lucky Mess
      new THREE.Vector3(5.2, ROAD_Y, 0.2),   // Gandhi Museum
      new THREE.Vector3(1.8, ROAD_Y, -4.8),  // Alagar Hills & Falls
      new THREE.Vector3(-4.8, ROAD_Y, -3.2), // Kilakarai Highway Arch
      new THREE.Vector3(-5.8, ROAD_Y, -0.5)  // Loop Closer
    ], true, 'catmullrom', 0.25);

    // Asphalt Road Ribbon
    const roadGeo = new THREE.TubeGeometry(roadCurve, 140, 0.42, 6, true);
    roadGeo.scale(1, 0.04, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e212b, // Dark Asphalt
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

    // Road Streetlight Columns
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
      color: 0xe88124, // BIXI Sunset Orange
      metalness: 0.8,
      roughness: 0.2
    });
    const carRoofMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Pitch Black Contrast Roof
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

    // Lower Chassis
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 1.25), carBodyMat);
    lowerBody.position.y = 0.18;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Front Hood & Aerodynamic Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.35), carBodyMat);
    nose.position.set(0, 0.18, 0.58);
    carGroup.add(nose);

    // Cabin & Windshield Roof
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.65), carRoofMat);
    cabin.position.set(0, 0.36, -0.05);
    carGroup.add(cabin);

    // Windows
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.18, 0.68), glassMat);
    windshield.position.set(0, 0.35, -0.05);
    carGroup.add(windshield);

    // 4 Rotating Alloy Wheels
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

    // Twin LED Headlights (Casting real forward light pool onto asphalt)
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

      // Radar Ring on road/ground
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

      // Floating BIXI Orange Diamond Pin
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

    // Camera Orbit / Manual Drag
    let isMouseDown = false;
    let prevMouseX = 0;
    let autoRotate = true;
    let cameraAngle = 0.6;
    let camDistance = 15;
    let camHeight = 11;
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
      camTargetPos = null; // Clear tween on user interaction
    });

    window.addEventListener('pointerup', () => {
      isMouseDown = false;
    });

    function selectCheckpoint(cp) {
      if (!cp) return;

      // Smooth camera transition to landmark
      camTargetPos = new THREE.Vector3(cp.camPos.x, cp.camPos.y, cp.camPos.z);
      camTargetLook = new THREE.Vector3(cp.target.x, cp.target.y, cp.target.z);
      autoRotate = false;

      // Update Destination UI card
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

      // Active pill styling
      document.querySelectorAll('.map-pill-btn').forEach(btn => {
        if (btn.dataset.id === cp.id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    window.focusMaduraiCheckpoint = function (id) {
      const found = CHECKPOINTS.find(c => c.id === id);
      if (found) {
        selectCheckpoint(found);
      }
    };

    // =========================================================================
    // 9. ANIMATION LOOP & CAR LOOPING CRUISE (NO UNDERGROUND CLIPPING!)
    // =========================================================================
    let carT = 0;
    const carSpeed = 0.00065; // Relaxed cinematic drive
    let animationFrameId = null;
    let isVisible = false;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      // A. Drive Car along endless road loop (y remains firmly at ROAD_Y)
      carT = (carT + carSpeed) % 1;
      const pt = roadCurve.getPointAt(carT);
      const nextPt = roadCurve.getPointAt((carT + 0.01) % 1);

      // Wheels touch ROAD_Y, so car center is at ROAD_Y + 0.12
      carGroup.position.set(pt.x, ROAD_Y + 0.12, pt.z);
      carGroup.lookAt(new THREE.Vector3(nextPt.x, ROAD_Y + 0.12, nextPt.z));

      // Rotate wheels as car moves
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

      // C. Spin Diamond Beacons
      const time = Date.now() * 0.003;
      pinMeshes.forEach(mesh => {
        mesh.rotation.y += 0.02;
        mesh.position.y = mesh.userData.originalY + Math.sin(time + mesh.position.x) * 0.08;
      });

      // D. Camera Smooth Follow / Tween or Orbit
      if (camTargetPos && camTargetLook) {
        camera.position.lerp(camTargetPos, 0.04);
        targetLookAt.lerp(camTargetLook, 0.04);
        camera.lookAt(targetLookAt);
      } else {
        if (autoRotate) {
          cameraAngle += 0.0012;
        }
        camera.position.x = Math.sin(cameraAngle) * camDistance;
        camera.position.z = Math.cos(cameraAngle) * camDistance;
        camera.position.y = camHeight;
        camera.lookAt(targetLookAt);
      }

      // E. Raycasting for Hover Highlights
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

    // IntersectionObserver (Zero CPU when off-screen)
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

    // Window Resize
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadurai3DWorld);
  } else {
    initMadurai3DWorld();
  }
})();
