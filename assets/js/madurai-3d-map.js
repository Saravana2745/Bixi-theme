/**
 * BIXI RIDE - 3D MADURAI ROUTE, LANDMARKS & NATURE SIMULATION
 * High-Performance Procedural Three.js Simulation
 * Features:
 * - Natural 3D Landscape: Rolling Green Hills, Western Ghats Mountains, Flowing River
 * - Real 3D Landmark Models:
 *   1. Meenakshi Amman Temple (Multi-tier Dravidian Stepped Gopuram with Gold Kalasams)
 *   2. Alagar Hills Waterfalls (Cliff cascade into foaming mountain pool with mist)
 *   3. Gandhi Memorial Nayak Palace Museum (Historic pillared colonnade & dome)
 *   4. Famous Madurai Food Landmark & Mess (Power Kadai / Lucky Mess with chimney & neon)
 *   5. Kilakarai Coastal Highway (Coastline & Lighthouse with rotating light beam)
 * - 3D Maruti Swift Hatchback with rotating wheels, headlights casting road illumination,
 *   cruising in an endless scenic circuit through nature and city landmarks
 * - Lush 3D Trees, Streetlights, and Road Barriers
 * - Smooth Camera Focus Tweening & Interactive Checkpoints
 * - 100% Procedural (Zero heavy downloads, instant 60 FPS, IntersectionObserver 0% off-screen)
 */

(function () {
  'use strict';

  const CHECKPOINTS = [
    {
      id: 'meenakshi',
      name: 'Meenakshi Amman Kovil',
      category: 'Heritage Wonder',
      pos: { x: -4, y: 0, z: 2 },
      camPos: { x: -4, y: 3.5, z: 6.5 },
      target: { x: -4, y: 1.2, z: 2 },
      distance: '1.2 km from Junction',
      time: '5 mins',
      vehicle: 'Activa 6G / Maruti Swift',
      desc: 'Madurai’s eternal jewel with 14 towering sculpted Dravidian gopurams, Thousand Pillar Hall, and sacred Golden Lotus tank.',
      badge: 'Temple Wonder'
    },
    {
      id: 'bun-parotta',
      name: 'Madurai Bun Parotta & Food Hub',
      category: 'Street Food Legend',
      pos: { x: -1.5, y: 0, z: 4 },
      camPos: { x: -1.5, y: 2.8, z: 7.2 },
      target: { x: -1.5, y: 0.8, z: 4 },
      distance: '2.5 km',
      time: '8 mins',
      vehicle: 'Hunter 350 / Activa',
      desc: 'Simmakkal & Town Hall Rd. World-famous crispy, flaky layered bun parotta served midnight hot with spicy salna.',
      badge: 'Iconic Street Food'
    },
    {
      id: 'power-kadai',
      name: 'Power Kadai & Lucky Mess',
      category: 'Culinary Heritage',
      pos: { x: 3, y: 0, z: 3.5 },
      camPos: { x: 3, y: 3, z: 7.5 },
      target: { x: 3, y: 1, z: 3.5 },
      distance: '3.8 km / 16 km',
      time: '12 mins / 28 mins',
      vehicle: 'Maruti Swift / Hunter 350',
      desc: 'Authentic Goripalayam Mutton Kari Dosa and legendary Alanganallur country non-veg feast served on fresh banana leaves.',
      badge: 'Food & Mess'
    },
    {
      id: 'gandhi-museum',
      name: 'Gandhi Memorial Palace Museum',
      category: 'Historic Palace',
      pos: { x: 5, y: 0, z: 0 },
      camPos: { x: 5, y: 3.2, z: 4.5 },
      target: { x: 5, y: 1.2, z: 0 },
      distance: '4.5 km',
      time: '14 mins',
      vehicle: 'Maruti Swift / Thar 4x4',
      desc: 'Historic 17th-century Nayak palace where Gandhiji adopted the simple dhoti in 1921. Surrounded by serene garden parks.',
      badge: 'History & Gardens'
    },
    {
      id: 'alagar-waterfalls',
      name: 'Alagar Kovil & Mountain Waterfalls',
      category: 'Nature & Springs',
      pos: { x: 2, y: 0, z: -5 },
      camPos: { x: 2, y: 4, z: -1 },
      target: { x: 2, y: 1.5, z: -5 },
      distance: '21 km',
      time: '35 mins',
      vehicle: 'Maruti Swift / RE Himalayan',
      desc: 'Nestled in lush Western Ghat foothills. Natural mountain spring cascades, Pazhamudircholai forest canopy, and cool breezes.',
      badge: 'Falls & Hills'
    },
    {
      id: 'kilakarai',
      name: 'Kilakarai Coastal Highway',
      category: 'Coast & Highway',
      pos: { x: -4.5, y: 0, z: -3.5 },
      camPos: { x: -4.5, y: 3.5, z: 0.5 },
      target: { x: -4.5, y: 1.2, z: -3.5 },
      distance: '92 km',
      time: '1 hr 45m',
      vehicle: 'Maruti Swift / Ertiga 7-Str',
      desc: 'Smooth 4-lane expressway to pristine Gulf of Mannar waters, palm groves, historic trading minarets, and Pamban Bridge.',
      badge: 'Coastal Gateway'
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

    // --- Scene & Atmospheric Lighting ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e171b);
    scene.fog = new THREE.FogExp2(0x0e171b, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      150
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

    // Atmospheric Warm Sunset Sunlight
    const ambientLight = new THREE.AmbientLight(0xfff1e0, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd199, 1.8);
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

    const skyHemiLight = new THREE.HemisphereLight(0x7ec8e3, 0x22351c, 0.6);
    scene.add(skyHemiLight);

    // =========================================================================
    // 1. NATURAL TERRAIN: LUSH GREEN ROLLING HILLS & MOUNTAINS
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(36, 36, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      // Foothills in north (negative Z), flatter center/south
      let h = 0;
      if (vz < -2) {
        h += Math.sin(vx * 0.4) * 0.8 + Math.cos(vz * 0.3) * 1.4 + (-vz - 2) * 0.45;
      } else {
        h += Math.sin(vx * 0.3) * 0.15 + Math.cos(vz * 0.3) * 0.15;
      }
      // Keep highway road elevation smooth
      posAttr.setY(i, Math.max(-0.2, h));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1f3d26,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -0.15;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Background Western Ghats Mountain Silhouettes
    const mountainGeo = new THREE.ConeGeometry(5, 7, 5);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x182c20,
      roughness: 0.9,
      flatShading: true
    });
    const m1 = new THREE.Mesh(mountainGeo, mountainMat);
    m1.position.set(4, 3, -13);
    scene.add(m1);
    const m2 = new THREE.Mesh(mountainGeo, mountainMat);
    m2.scale.set(1.4, 1.2, 1.4);
    m2.position.set(-3, 3.8, -14);
    scene.add(m2);
    const m3 = new THREE.Mesh(mountainGeo, mountainMat);
    m3.scale.set(1.1, 0.9, 1.1);
    m3.position.set(10, 2.8, -12);
    scene.add(m3);

    // =========================================================================
    // 2. VAIGAI RIVER (SHIMMERING WATER RIBBON)
    // =========================================================================
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 0.05, 3.5),
      new THREE.Vector3(-8, 0.05, 2.8),
      new THREE.Vector3(-2, 0.05, 1.2),
      new THREE.Vector3(4, 0.05, 0.2),
      new THREE.Vector3(10, 0.05, -1.8),
      new THREE.Vector3(16, 0.05, -3)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.1, 8, false);
    riverGeo.scale(1, 0.08, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x1a73e8,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // =========================================================================
    // 3. REAL 3D LANDMARK MODELS
    // =========================================================================

    // A. MEENAKSHI AMMAN TEMPLE (Stepped Dravidian Gopuram with Gold Kalasams)
    function createMeenakshiTemple() {
      const gopuram = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd97736, roughness: 0.7 });
      const tierColors = [0xc25e24, 0x3b82f6, 0x10b981, 0xf59e0b, 0xef4444];
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Base Gateway
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.6), stoneMat);
      base.castShadow = true;
      base.receiveShadow = true;
      gopuram.add(base);

      // Arch Portal
      const portalMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.65), portalMat);
      portal.position.y = -0.1;
      gopuram.add(portal);

      // 5 Stepped Tiers
      let tierY = 0.6;
      let tierW = 2.1;
      let tierD = 1.4;
      for (let t = 0; t < 5; t++) {
        tierY += 0.38;
        tierW -= 0.25;
        tierD -= 0.16;
        const mat = new THREE.MeshStandardMaterial({ color: tierColors[t % tierColors.length], roughness: 0.6 });
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.38, tierD), mat);
        tier.position.y = tierY;
        tier.castShadow = true;
        gopuram.add(tier);

        // Cornice ledge
        const ledge = new THREE.Mesh(new THREE.BoxGeometry(tierW + 0.1, 0.08, tierD + 0.1), stoneMat);
        ledge.position.y = tierY + 0.19;
        gopuram.add(ledge);
      }

      // Top Vault Roof & 5 Golden Kalasam Spires
      const topRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.35, 8), stoneMat);
      topRoof.rotation.z = Math.PI / 2;
      topRoof.position.y = tierY + 0.35;
      gopuram.add(topRoof);

      for (let k = -2; k <= 2; k++) {
        const kalasam = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 6), goldMat);
        kalasam.position.set(k * 0.2, tierY + 0.65, 0);
        gopuram.add(kalasam);
      }

      // Golden Temple Lantern Light
      const templeLight = new THREE.PointLight(0xffa500, 2, 6);
      templeLight.position.set(0, tierY + 0.2, 1);
      gopuram.add(templeLight);

      return gopuram;
    }

    const meenakshiModel = createMeenakshiTemple();
    meenakshiModel.position.set(-4, 0.45, 2);
    scene.add(meenakshiModel);

    // B. ALAGAR HILLS WATERFALLS (Rocky Cliff with Cascading Water & Foaming Pool)
    function createWaterfalls() {
      const fallsGroup = new THREE.Group();
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x383838, roughness: 0.95, flatShading: true });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x8be9fd, roughness: 0.1, metalness: 0.8 });
      const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

      // Mountain Cliff Rock
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 2.2), rockMat);
      cliff.position.y = 1.8;
      cliff.castShadow = true;
      fallsGroup.add(cliff);

      // Water Cascade Sheets
      const cascade = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3.4), waterMat);
      cascade.position.set(0, 1.7, 1.15);
      fallsGroup.add(cascade);

      // Foaming Splash Pool
      const pool = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.25, 12), waterMat);
      pool.position.set(0, 0.1, 1.8);
      fallsGroup.add(pool);

      const foamRing = new THREE.Mesh(new THREE.RingGeometry(0.5, 1.3, 12), foamMat);
      foamRing.rotation.x = -Math.PI / 2;
      foamRing.position.set(0, 0.24, 1.8);
      fallsGroup.add(foamRing);

      // Forest Canopy Trees on cliff top
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      for (let i = -1; i <= 1; i++) {
        const treeTop = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 6), foliageMat);
        treeTop.position.set(i * 0.9, 4.2, 0);
        fallsGroup.add(treeTop);
      }

      return fallsGroup;
    }

    const fallsModel = createWaterfalls();
    fallsModel.position.set(2, 0, -5.5);
    scene.add(fallsModel);

    // C. GANDHI MEMORIAL MUSEUM (Historic Nayak Palace Colonnade & Central Dome)
    function createGandhiMuseum() {
      const museum = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1e4cf, roughness: 0.6 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

      // Main Hall Building
      const hall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.2), wallMat);
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

      // Classic Palace Center Dome
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), wallMat);
      dome.position.set(0, 1.4, 0);
      museum.add(dome);

      // Flag Mast
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6), pillarMat);
      pole.position.set(0, 2.8, 0);
      museum.add(pole);

      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), new THREE.MeshBasicMaterial({ color: 0xff9933 }));
      flag.position.set(0.2, 3.4, 0);
      museum.add(flag);

      return museum;
    }

    const museumModel = createGandhiMuseum();
    museumModel.position.set(5.5, 0, 0);
    scene.add(museumModel);

    // D. FAMOUS FOOD LANDMARK / MESS (Power Kadai & Lucky Mess with Glowing Neon & Chimney)
    function createFoodMess() {
      const hotel = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
      const neonOrange = new THREE.MeshBasicMaterial({ color: 0xe88124 });

      // Building Body
      const block = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 2), brickMat);
      block.position.y = 0.8;
      block.castShadow = true;
      hotel.add(block);

      // Rooftop Neon Hotel Signboard
      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.1), darkMat);
      signBoard.position.set(0, 1.85, 1.05);
      hotel.add(signBoard);

      const neonBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.12), neonOrange);
      neonBar.position.set(0, 1.85, 1.06);
      hotel.add(neonBar);

      // Steaming Kitchen Chimney
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.9), darkMat);
      chimney.position.set(0.8, 2.05, -0.6);
      hotel.add(chimney);

      // Outdoor Dining Tables & Banana Leaf Setup
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      for (let t = -0.7; t <= 0.7; t += 1.4) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.5), tableMat);
        table.position.set(t, 0.2, 1.6);
        hotel.add(table);

        // Banana leaf green plate
        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(t, 0.41, 1.6);
        hotel.add(leaf);
      }

      // Warm Welcome Food Porch Light
      const foodLight = new THREE.PointLight(0xffb703, 2, 5);
      foodLight.position.set(0, 1.4, 1.5);
      hotel.add(foodLight);

      return hotel;
    }

    const foodModel = createFoodMess();
    foodModel.position.set(3, 0, 3.5);
    scene.add(foodModel);

    // E. KILAKARAI COASTAL HIGHWAY & LIGHTHOUSE
    function createCoastalLighthouse() {
      const coastGroup = new THREE.Group();
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const seaMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.5 });

      // Sea Water Pool
      const seaWater = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), seaMat);
      seaWater.rotation.x = -Math.PI / 2;
      seaWater.position.set(-1.5, 0.02, 0);
      coastGroup.add(seaWater);

      // Striped Lighthouse Tower
      let y = 0.5;
      for (let s = 0; s < 4; s++) {
        const mat = s % 2 === 0 ? redMat : whiteMat;
        const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.28 - s * 0.03, 0.35 - s * 0.03, 0.7, 10), mat);
        segment.position.y = y;
        segment.castShadow = true;
        coastGroup.add(segment);
        y += 0.7;
      }

      // Glass Beacon Lantern Top
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.35, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lantern.position.y = y + 0.15;
      coastGroup.add(lantern);

      // Rotating Coastal Light Beam
      const beamLight = new THREE.SpotLight(0xffffff, 4, 12, Math.PI / 7, 0.4);
      beamLight.position.set(0, y + 0.2, 0);
      beamLight.target.position.set(5, 0, 0);
      coastGroup.add(beamLight);
      coastGroup.add(beamLight.target);
      coastGroup.userData.beam = beamLight;

      return coastGroup;
    }

    const coastModel = createCoastalLighthouse();
    coastModel.position.set(-5.5, 0, -3.5);
    scene.add(coastModel);

    // =========================================================================
    // 4. LUSH NATURE: TROPICAL TREES & PALMS ALONG ROADS
    // =========================================================================
    function createTree(scale, isPalm) {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 6), trunkMat);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      tree.add(trunk);

      if (isPalm) {
        const frondMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
        for (let p = 0; p < 5; p++) {
          const frond = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 4), frondMat);
          frond.position.set(0, 1.2, 0);
          frond.rotation.z = 0.6;
          frond.rotation.y = (p * Math.PI * 2) / 5;
          tree.add(frond);
        }
      } else {
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.8 });
        const ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 7, 6), foliageMat);
        ball1.position.y = 1.35;
        ball1.castShadow = true;
        tree.add(ball1);
        const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 6, 5), foliageMat);
        ball2.position.set(0.2, 1.7, 0);
        ball2.castShadow = true;
        tree.add(ball2);
      }
      tree.scale.set(scale, scale, scale);
      return tree;
    }

    // Scatter 20 trees across natural zones
    const treePositions = [
      { x: -2.5, z: 1.5, p: false }, { x: -3.2, z: 3.5, p: false },
      { x: -5.8, z: 2.2, p: false }, { x: 0.8, z: 2.5, p: true },
      { x: 1.8, z: 4.8, p: true },  { x: 4.2, z: 4.8, p: false },
      { x: 4.5, z: 1.8, p: false }, { x: 6.8, z: 1.2, p: false },
      { x: 4.2, z: -1.5, p: true }, { x: 3.2, z: -3.5, p: false },
      { x: 0.5, z: -4.2, p: false },{ x: -1.8, z: -4.8, p: false },
      { x: -4.2, z: -1.8, p: true },{ x: -6.5, z: -2.2, p: true },
      { x: -6.2, z: 0.5, p: true }, { x: -1.2, z: -2.2, p: false }
    ];
    treePositions.forEach(tp => {
      const t = createTree(0.7 + Math.random() * 0.35, tp.p);
      t.position.set(tp.x, 0, tp.z);
      scene.add(t);
    });

    // =========================================================================
    // 5. HIGHWAY ROAD LOOP & STREETLIGHTS
    // =========================================================================
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, 0.05, 1.8),   // Meenakshi Temple
      new THREE.Vector3(-1.5, 0.05, 3.8), // Bun Parotta
      new THREE.Vector3(2.8, 0.05, 3.2),  // Power Kadai / Lucky Mess
      new THREE.Vector3(5, 0.05, 0),      // Gandhi Museum
      new THREE.Vector3(2, 0.05, -4.5),   // Alagar Kovil Foothills & Falls
      new THREE.Vector3(-4.2, 0.05, -3.2),// Kilakarai Coast
      new THREE.Vector3(-5.2, 0.05, -0.5) // Highway Loop Closer
    ], true, 'catmullrom', 0.25);

    // Asphalt Road Ribbon
    const roadGeo = new THREE.TubeGeometry(roadCurve, 120, 0.42, 6, true);
    roadGeo.scale(1, 0.04, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.7,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Glowing Neon Lane Divider in center
    const roadLineGeo = new THREE.TubeGeometry(roadCurve, 120, 0.04, 4, true);
    roadLineGeo.scale(1, 0.05, 1);
    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xe88124 });
    const roadLineMesh = new THREE.Mesh(roadLineGeo, roadLineMat);
    roadLineMesh.position.y = 0.02;
    scene.add(roadLineMesh);

    // Streetlights along road
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lampSpacing = 6;
    for (let l = 0; l < lampSpacing; l++) {
      const u = l / lampSpacing;
      const pt = roadCurve.getPointAt(u);
      const tangent = roadCurve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const polePos = pt.clone().add(normal.clone().multiplyScalar(0.7));
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4), lampMat);
      pole.position.set(polePos.x, 0.7, polePos.z);
      scene.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), bulbMat);
      bulb.position.set(polePos.x, 1.4, polePos.z);
      scene.add(bulb);

      const lampLight = new THREE.PointLight(0xffeedd, 1.2, 3.5);
      lampLight.position.set(polePos.x, 1.35, polePos.z);
      scene.add(lampLight);
    }

    // =========================================================================
    // 6. REALISTIC 3D MARUTI SWIFT HATCHBACK MODEL
    // =========================================================================
    const carGroup = new THREE.Group();

    // Swift Body Shell (Glossy Sunset Orange / Red Livery)
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

    // Lower Chassis
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 1.25), carBodyMat);
    lowerBody.position.y = 0.18;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Curved Hood & Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.35), carBodyMat);
    nose.position.set(0, 0.18, 0.58);
    carGroup.add(nose);

    // Cabin & Windshield Roof
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.65), carRoofMat);
    cabin.position.set(0, 0.36, -0.05);
    carGroup.add(cabin);

    // Front & Side Windows
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.18, 0.68), glassMat);
    windshield.position.set(0, 0.35, -0.05);
    carGroup.add(windshield);

    // Wheels (4 Rotating Alloy Rims with Rubber Tires)
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

    // Twin LED Headlights (Casting dynamic light beams onto the road!)
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
      pinGroup.position.set(cp.pos.x, 0, cp.pos.z);

      // Radar Ring on ground
      const ringGeo = new THREE.RingGeometry(0.25, 0.45, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe88124,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.08;
      pinGroup.add(ring);

      // Floating Diamond Pin Marker
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
    // 9. ANIMATION LOOP & CAR LOOPING CRUISE
    // =========================================================================
    let carT = 0;
    const carSpeed = 0.00065; // Relaxed cinematic drive
    let animationFrameId = null;
    let isVisible = false;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      // A. Drive Car along endless road loop
      carT = (carT + carSpeed) % 1;
      const pt = roadCurve.getPointAt(carT);
      const nextPt = roadCurve.getPointAt((carT + 0.01) % 1);

      carGroup.position.copy(pt);
      carGroup.lookAt(nextPt);

      // Rotate wheels as car moves
      carWheels.forEach(w => {
        w.rotation.x += 0.25;
      });

      // B. Update Live Telemetry HUD dynamically
      let nearestCp = null;
      let minDistance = 999;
      CHECKPOINTS.forEach(cp => {
        const d = pt.distanceTo(new THREE.Vector3(cp.pos.x, 0, cp.pos.z));
        if (d < minDistance) {
          minDistance = d;
          nearestCp = cp;
        }
      });

      const liveHudLocation = document.getElementById('mapLiveCheckpointText');
      if (liveHudLocation && nearestCp && minDistance < 2.5) {
        liveHudLocation.textContent = nearestCp.name;
      }

      // C. Rotate Lighthouse beam
      if (coastModel.userData.beam) {
        const beamAngle = Date.now() * 0.0018;
        coastModel.userData.beam.target.position.set(
          Math.sin(beamAngle) * 5,
          0,
          Math.cos(beamAngle) * 5
        );
      }

      // D. Spin Diamond Beacons
      const time = Date.now() * 0.003;
      pinMeshes.forEach(mesh => {
        mesh.rotation.y += 0.02;
        mesh.position.y = mesh.userData.originalY + Math.sin(time + mesh.position.x) * 0.08;
      });

      // E. Camera Smooth Follow / Tween or Orbit
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

      // F. Raycasting for Hover Highlights
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
