/**
 * BIXI RIDE - AUTHENTIC 3D MADURAI ROUTE & CULTURAL SIMULATION
 * High-Performance Procedural Three.js Simulation
 * 
 * Authentic Cultural Landmarks & Highlights:
 * 1. Madurai Meenakshi Amman Kovil (7-tier Dravidian Gopuram with 5 Gold Kalasams & Temple Diyas)
 * 2. Alanganallur Vadivasal & Jallikattu Arena:
 *    - Traditional brick/timber Vadivasal gateway & spectator barricades
 *    - Majestic Kangayam Jallikattu Bull with muscular hump (திமில்) and sharp curved horns
 *    - Brave Jallikattu Tamer (மாடு பிடி வீரர்) embracing and holding onto the bull's hump!
 *    - Zero trees blocking line of sight - 100% crystal-clear visibility!
 * 3. Lucky Mess in Alanganallur:
 *    - Authentic Tamil village mess with snug Mangalore terracotta tiled roof, teak veranda pillars,
 *      glass snack showcase, banana-leaf dining, and warm illuminated signboard
 * 4. Power Kadai & Madurai Bun Parotta:
 *    - Iconic Madurai street food front with live circular parotta tava, sizzling bun parottas,
 *      parotta chef master figure with spatulas, stainless exhaust hood & rooftop chimney with animated billowing smoke
 * 5. Gandhi Memorial Museum:
 *    - Historic 17th-century Tamukkam Nayak Palace with grand plinth, colonnade pillars, copper dome & flag
 * 6. Alagar Kovil (Kallazhagar Temple):
 *    - Sacred hill temple at the foothills of Alagar Malai with golden vimanam and dhwaja stambham
 * 7. Sacred Vaigai River:
 *    - Isolated along the southern boundary at z = 8.5 with lush coconut palms; car NEVER touches water!
 * 
 * Sky Atmosphere, Nature & Aesthetics:
 * - Twilight sapphire-slate sky with warm sunset horizon glow.
 * - Procedural drifting cumulus 3D clouds (Megathangal / மேகங்கள்).
 * - Animated flock of temple doves/swallows flying in V-formation above gopurams.
 * - Zoom In (+), Zoom Out (-), and Full Overview reset controls.
 * - Dynamic pill bar auto-highlighting visited landmark stop during car cruise tour.
 */

(function () {
  'use strict';

  // Checkpoints with road stop coordinates, offset roadside model positions, and camera presets
  const CHECKPOINTS = [
    {
      id: 'meenakshi',
      name: 'Meenakshi Amman Kovil',
      category: 'Temple Wonder',
      roadPos: { x: -4.8, y: 0.25, z: 1.2 },
      modelPos: { x: -7.5, y: 0, z: 1.2 },
      facing: Math.PI / 2, // Facing East toward road
      camPos: { x: -4.8, y: 3.5, z: 6.2 },
      target: { x: -7.5, y: 1.8, z: 1.2 },
      distance: '1.2 km from Junction',
      time: '5 mins',
      vehicle: 'Activa 6G / Maruti Swift',
      desc: 'The eternal soul of Madurai with 14 towering Dravidian gopurams, Thousand Pillar Hall, and sacred Golden Lotus Tank.',
      badge: 'Heritage Wonder',
      icon: 'temple'
    },
    {
      id: 'alanganallur-vadivasal',
      name: 'Alanganallur Vadivasal (Jallikattu)',
      category: 'World Jallikattu Arena',
      roadPos: { x: -2.4, y: 0.25, z: 3.4 },
      modelPos: { x: -2.4, y: 0, z: 6.0 },
      facing: 0, // Facing South toward road
      camPos: { x: -2.4, y: 3.0, z: 1.6 },
      target: { x: -2.4, y: 1.4, z: 6.0 },
      distance: '16 km',
      time: '26 mins',
      vehicle: 'Hunter 350 / Maruti Swift',
      desc: 'World-famous Vadivasal entry gate where fierce Kangayam bulls charge into the Pongal Jallikattu arena and courageous tamers embrace the hump (திமில் தழுவுதல்).',
      badge: 'Jallikattu Arena',
      icon: 'bull'
    },
    {
      id: 'lucky-mess',
      name: 'Lucky Mess (Alanganallur)',
      category: 'Authentic Village Feast',
      roadPos: { x: 2.4, y: 0.25, z: 3.4 },
      modelPos: { x: 2.4, y: 0, z: 6.0 },
      facing: 0, // Facing South toward road
      camPos: { x: 2.4, y: 3.2, z: 1.6 },
      target: { x: 2.4, y: 1.2, z: 6.0 },
      distance: '16.5 km',
      time: '28 mins',
      vehicle: 'Maruti Swift / Hunter 350',
      desc: 'Legendary village mess in Alanganallur famous for piping hot nattu-kozhi chukka, spicy mutton gravy, and authentic banana-leaf feasts.',
      badge: 'Village Feast',
      icon: 'feast'
    },
    {
      id: 'power-kadai',
      name: 'Power Kadai & Bun Parotta',
      category: 'Madurai Street Food',
      roadPos: { x: 4.8, y: 0.25, z: 1.0 },
      modelPos: { x: 7.6, y: 0, z: 1.0 },
      facing: -Math.PI / 2, // Facing West toward road
      camPos: { x: 4.8, y: 3.4, z: 5.6 },
      target: { x: 7.6, y: 1.4, z: 1.0 },
      distance: '3.5 km',
      time: '12 mins',
      vehicle: 'Activa 6G / Swift',
      desc: 'Simmakkal & Goripalayam street-food legend! Sizzling Bun Parotta on live tava, crispy mutton kari dosa, and roaring kitchen chimney.',
      badge: 'Iconic Street Food',
      icon: 'food'
    },
    {
      id: 'gandhi-museum',
      name: 'Gandhi Memorial Palace Museum',
      category: 'Historic Tamukkam Palace',
      roadPos: { x: 3.6, y: 0.25, z: -3.2 },
      modelPos: { x: 6.2, y: 0, z: -5.4 },
      facing: -Math.PI * 0.75, // Facing North-West toward road
      camPos: { x: 2.2, y: 3.8, z: -1.2 },
      target: { x: 6.2, y: 1.6, z: -5.4 },
      distance: '4.5 km',
      time: '14 mins',
      vehicle: 'Maruti Swift / Thar 4x4',
      desc: 'Historic 17th-century Nayak palace where Mahatma Gandhi decided to adopt the dhoti in 1921. Surrounded by serene Tamukkam gardens.',
      badge: 'Palace Museum',
      icon: 'museum'
    },
    {
      id: 'alagar-kovil',
      name: 'Alagar Kovil (Kallazhagar Temple)',
      category: 'Sacred Hill Temple',
      roadPos: { x: -3.0, y: 0.25, z: -3.6 },
      modelPos: { x: -4.8, y: 0, z: -6.0 },
      facing: Math.PI, // Facing South toward road
      camPos: { x: -3.0, y: 3.8, z: 0.8 },
      target: { x: -4.8, y: 1.6, z: -6.0 },
      distance: '21 km',
      time: '35 mins',
      vehicle: 'Maruti Swift / RE Himalayan',
      desc: 'Nestled at the scenic foothills of Alagar Malai. Ancient temple of Lord Kallazhagar, famous for the Chithirai festival and natural springs.',
      badge: 'Alagar Temple',
      icon: 'temple'
    }
  ];

  // Preload BIXI logo favicon emblem (pure shield emblem without text)
  const bixiEmblemImg = new Image();
  bixiEmblemImg.src = 'assets/images/logo-icon.svg';

  /**
   * Helper: Create crisp dynamic canvas texture for signboards
   * Dynamically calculates font size so NO text is ever clipped!
   */
  function createSignboardTexture(title, subtitle, bgColor, textColor, accentColor) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 256);
    grad.addColorStop(0, bgColor || '#0d0f14');
    grad.addColorStop(1, '#161922');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);

    ctx.strokeStyle = accentColor || '#e88124';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 1008, 240);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 216);

    ctx.fillStyle = accentColor || '#e88124';
    const rivets = [[30, 30], [994, 30], [30, 226], [994, 226]];
    rivets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    const maxTextWidth = 920;

    let titleFontSize = 52;
    ctx.font = `bold ${titleFontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    while (ctx.measureText(title).width > maxTextWidth && titleFontSize > 18) {
      titleFontSize -= 2;
      ctx.font = `bold ${titleFontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    }

    ctx.fillStyle = textColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(title, 512, subtitle ? 96 : 128);

    if (subtitle) {
      ctx.fillStyle = accentColor || '#e88124';
      ctx.fillRect(256, 142, 512, 4);

      let subFontSize = 32;
      ctx.font = `bold ${subFontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      while (ctx.measureText(subtitle).width > maxTextWidth && subFontSize > 14) {
        subFontSize -= 2;
        ctx.font = `bold ${subFontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      }

      ctx.fillStyle = accentColor || '#e88124';
      ctx.fillText(subtitle, 512, 185);
    }

    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Helper: Create floating 3D popup badge hovering above each landmark
   */
  function createBixiPopupBadge(title, category) {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 384;
    const ctx = c.getContext('2d');

    function renderBadge() {
      ctx.clearRect(0, 0, 768, 384);

      ctx.fillStyle = 'rgba(11, 13, 19, 0.95)';
      ctx.beginPath();
      ctx.roundRect(16, 16, 736, 352, 48);
      ctx.fill();

      ctx.strokeStyle = '#e88124';
      ctx.lineWidth = 8;
      ctx.shadowColor = 'rgba(232, 129, 36, 0.8)';
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (bixiEmblemImg.complete && bixiEmblemImg.naturalWidth > 0) {
        ctx.drawImage(bixiEmblemImg, (768 - 90) / 2, 34, 90, 105);
      } else {
        ctx.fillStyle = '#e88124';
        ctx.beginPath();
        ctx.arc(384, 85, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BIXI', 384, 85);
      }

      let fontSize = 38;
      const maxW = 680;
      ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      while (ctx.measureText(title).width > maxW && fontSize > 18) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      }
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 384, 210);

      ctx.fillStyle = '#e88124';
      ctx.font = 'bold 24px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(`BIXI TOUR STOP • ${category.toUpperCase()}`, 384, 280);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('PASSENGER PICKUP & DROPOFF', 384, 320);
    }

    renderBadge();

    if (!bixiEmblemImg.complete) {
      bixiEmblemImg.onload = () => {
        renderBadge();
        tex.needsUpdate = true;
      };
    }

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0, 0, 1);
    sprite.userData = {
      targetScale: 0,
      baseY: 0,
      maxScaleX: 3.4,
      maxScaleY: 1.7
    };
    return sprite;
  }

  /**
   * Helper: Create animated low-poly passenger figure
   */
  function createPassengerFigure(shirtColor, pantsColor) {
    const human = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor || 0xffffff, roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor || 0x1e293b, roughness: 0.8 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    head.position.y = 0.58;
    human.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.082, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x09090b }));
    hair.position.y = 0.58;
    human.add(hair);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.12), shirtMat);
    torso.position.y = 0.40;
    human.add(torso);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), shirtMat);
    leftArm.position.set(-0.13, 0.36, 0);
    human.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), shirtMat);
    rightArm.position.set(0.13, 0.36, 0);
    human.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.035, 0.28, 6), pantsMat);
    leftLeg.position.set(-0.06, 0.14, 0);
    human.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.035, 0.28, 6), pantsMat);
    rightLeg.position.set(0.06, 0.14, 0);
    human.add(rightLeg);

    human.userData = {
      leftArm: leftArm,
      rightArm: rightArm,
      leftLeg: leftLeg,
      rightLeg: rightLeg
    };

    human.visible = false;
    return human;
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
    scene.background = new THREE.Color(0x182232);
    scene.fog = new THREE.Fog(0x182232, 34, 95);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      160
    );
    const defaultCamPos = new THREE.Vector3(0, 13, 17.5);
    const defaultLookAt = new THREE.Vector3(0, 1.0, 0);
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

    // --- Official OrbitControls (Full 360° Free Orbit, Pitch Tilt, Wheel Zoom & Pan) ---
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.85;
      controls.zoomSpeed = 1.0;
      controls.panSpeed = 0.8;
      controls.maxPolarAngle = Math.PI / 2 - 0.04;
      controls.minPolarAngle = 0.08;
      controls.minDistance = 3.5;
      controls.maxDistance = 50.0;
      controls.target.copy(defaultLookAt);
    }

    // Atmospheric Sunset & Sky Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1f1614, 0.85);
    scene.add(hemiLight);

    const ambLight = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(0xffa048, 1.85);
    sunLight.position.set(16, 26, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const orangeAccentLight = new THREE.PointLight(0xe88124, 2.5, 32);
    orangeAccentLight.position.set(0, 9, 0);
    scene.add(orangeAccentLight);

    // =========================================================================
    // 1. TERRAIN & SACRED ALAGAR MALAI FOOTHILLS
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(42, 42);
    terrainGeo.rotateX(-Math.PI / 2);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.88,
      metalness: 0.12
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Sacred Alagar Malai Mountain Ranges (Scenic background behind Alagar Kovil)
    const mountainMat1 = new THREE.MeshStandardMaterial({
      color: 0x163022,
      roughness: 0.94,
      flatShading: true
    });
    const mountainMat2 = new THREE.MeshStandardMaterial({
      color: 0x1e3f2d,
      roughness: 0.90,
      flatShading: true
    });
    const mountainMat3 = new THREE.MeshStandardMaterial({
      color: 0x244a36,
      roughness: 0.88,
      flatShading: true
    });

    const mPeaks = [
      { geo: new THREE.ConeGeometry(8.5, 9.8, 9), mat: mountainMat1, pos: [-5.0, 4.8, -16.5] },
      { geo: new THREE.ConeGeometry(10.0, 11.2, 9), mat: mountainMat2, pos: [2.5, 5.5, -17.5] },
      { geo: new THREE.ConeGeometry(7.5, 8.2, 8), mat: mountainMat3, pos: [9.5, 4.0, -15.5] },
      { geo: new THREE.ConeGeometry(7.8, 8.5, 8), mat: mountainMat1, pos: [-12.0, 4.2, -16.0] },
      { geo: new THREE.ConeGeometry(6.5, 7.0, 7), mat: mountainMat2, pos: [16.0, 3.4, -15.0] }
    ];
    mPeaks.forEach(mp => {
      const m = new THREE.Mesh(mp.geo, mp.mat);
      m.position.set(mp.pos[0], mp.pos[1], mp.pos[2]);
      scene.add(m);
    });

    // =========================================================================
    // 2. SKY ENHANCEMENT: VOLUMETRIC PROCEDURAL 3D CLOUDS & BIRDS IN FLIGHT!
    // =========================================================================

    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.90,
      metalness: 0.02,
      emissive: 0xffeedd,
      emissiveIntensity: 0.20,
      transparent: true,
      opacity: 0.94
    });

    function createSingleCloud(scale) {
      const cloud = new THREE.Group();
      const puffs = [
        { x: 0, y: 0.2, z: 0, r: 1.1 },
        { x: -0.9, y: 0.05, z: 0.2, r: 0.85 },
        { x: 0.9, y: 0.05, z: -0.2, r: 0.9 },
        { x: -0.4, y: 0.45, z: -0.1, r: 0.78 },
        { x: 0.45, y: 0.4, z: 0.15, r: 0.8 },
        { x: 0.1, y: -0.15, z: 0.6, r: 0.72 },
        { x: -0.3, y: -0.15, z: -0.55, r: 0.7 },
        { x: 1.35, y: -0.1, z: 0.0, r: 0.65 }
      ];
      puffs.forEach(p => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 8, 8), cloudMat);
        puff.position.set(p.x, p.y, p.z);
        cloud.add(puff);
      });
      cloud.scale.set(scale, scale * 0.7, scale * 0.85);
      return cloud;
    }

    const cloudEntities = [];
    const cloudPositions = [
      { x: -16, y: 9.8, z: -11, speed: 0.0042 },
      { x: -8, y: 11.2, z: -14, speed: 0.0036 },
      { x: 0, y: 10.0, z: -9, speed: 0.0040 },
      { x: 9, y: 11.5, z: -13, speed: 0.0038 },
      { x: 17, y: 9.2, z: -10, speed: 0.0044 },
      { x: -22, y: 8.8, z: -6, speed: 0.0045 },
      { x: -4, y: 8.5, z: -5, speed: 0.0035 },
      { x: 12, y: 8.9, z: -6, speed: 0.0041 },
      { x: 21, y: 10.5, z: -12, speed: 0.0037 }
    ];

    cloudPositions.forEach(cp => {
      const c = createSingleCloud(1.3 + Math.random() * 0.5);
      c.position.set(cp.x, cp.y, cp.z);
      c.userData = { speed: cp.speed };
      cloudsGroup.add(c);
      cloudEntities.push(c);
    });
    scene.add(cloudsGroup);

    // B. FLOCK OF MADURAI TEMPLE BIRDS (SOARING IN V-FORMATION!)
    const birdsFlockGroup = new THREE.Group();
    const birdMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
      metalness: 0.2
    });

    const birdEntities = [];
    const vOffsets = [
      { x: 0, z: 0 },
      { x: -0.55, z: -0.65 },
      { x: 0.55, z: -0.65 },
      { x: -1.1, z: -1.3 },
      { x: 1.1, z: -1.3 },
      { x: -1.65, z: -1.95 },
      { x: 1.65, z: -1.95 }
    ];

    vOffsets.forEach((vo, idx) => {
      const bird = new THREE.Group();

      // Fuselage / Bird Body
      const bBody = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 5), birdMat);
      bBody.rotation.x = Math.PI / 2;
      bird.add(bBody);

      // Left & Right Wings (articulated for flapping)
      const lWing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.12), birdMat);
      lWing.position.set(-0.16, 0.02, 0);
      bird.add(lWing);

      const rWing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.12), birdMat);
      rWing.position.set(0.16, 0.02, 0);
      bird.add(rWing);

      bird.position.set(vo.x, 0, vo.z);
      bird.userData = {
        leftWing: lWing,
        rightWing: rWing,
        flapOffset: idx * 0.4
      };
      birdsFlockGroup.add(bird);
      birdEntities.push(bird);
    });

    birdsFlockGroup.position.set(0, 10.5, 0);
    scene.add(birdsFlockGroup);

    // =========================================================================
    // 3. SACRED VAIGAI RIVER (FAR SOUTH AT z = 8.5 - NEVER TOUCHES ROAD!)
    // =========================================================================
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 0.04, 8.8),
      new THREE.Vector3(-8, 0.04, 8.4),
      new THREE.Vector3(0, 0.04, 8.2),
      new THREE.Vector3(8, 0.04, 8.5),
      new THREE.Vector3(18, 0.04, 8.9)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.25, 8, false);
    riverGeo.scale(1, 0.05, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x103b62,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.94
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // Authentic Madurai Coconut Palms & Shady Banyan Trees
    function createPalm(x, z, scale) {
      const palm = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.92 });
      
      const leanAngle = (Math.random() - 0.5) * 0.18;
      const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.8, 7), trunkMat);
      t1.position.y = 0.4;
      palm.add(t1);

      const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.85, 7), trunkMat);
      t2.position.set(Math.sin(leanAngle) * 0.15, 1.15, 0);
      t2.rotation.z = leanAngle;
      palm.add(t2);

      const coconutMat = new THREE.MeshStandardMaterial({ color: 0xa8621e, roughness: 0.8 });
      for (let c = 0; c < 4; c++) {
        const nut = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), coconutMat);
        nut.position.set(
          Math.sin(leanAngle) * 0.15 + Math.cos(c * Math.PI / 2) * 0.1,
          1.52,
          Math.sin(c * Math.PI / 2) * 0.1
        );
        palm.add(nut);
      }

      const frondMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.75 });
      for (let p = 0; p < 8; p++) {
        const frondGroup = new THREE.Group();
        frondGroup.position.set(Math.sin(leanAngle) * 0.15, 1.58, 0);
        frondGroup.rotation.y = (p * Math.PI * 2) / 8;

        const fLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 1.2), frondMat);
        fLeaf.position.set(0, -0.22, 0.58);
        fLeaf.rotation.x = 0.42;
        frondGroup.add(fLeaf);
        palm.add(frondGroup);
      }

      palm.scale.set(scale, scale, scale);
      palm.position.set(x, 0, z);
      return palm;
    }

    function createShadeTree(x, z, scale) {
      const tree = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.95 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 7), woodMat);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      tree.add(trunk);

      const leafMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85, flatShading: true });
      const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 7, 7), leafMat);
      c1.position.set(0, 1.5, 0);
      c1.castShadow = true;
      tree.add(c1);

      const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 6, 6), leafMat);
      c2.position.set(-0.45, 1.35, 0.3);
      tree.add(c2);

      const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 6, 6), leafMat);
      c3.position.set(0.45, 1.35, -0.3);
      tree.add(c3);

      tree.scale.set(scale, scale, scale);
      tree.position.set(x, 0, z);
      return tree;
    }

    [-15, -11, -7, -3, 1, 5, 9, 13, 17].forEach(rx => {
      scene.add(createPalm(rx, 7.5, 0.9 + Math.random() * 0.3));
    });

    [
      { x: -10, z: -3.5, s: 1.1 },
      { x: 10, z: -3.5, s: 1.0 },
      { x: -1.5, z: -9.5, s: 1.2 },
      { x: 3.5, z: -9.5, s: 1.15 }
    ].forEach(st => {
      scene.add(createShadeTree(st.x, st.z, st.s));
    });

    // =========================================================================
    // 4. LANDMARK 3D MODELS (ROADSIDE CURBS, ZERO ROAD OVERLAP!)
    // =========================================================================

    const popupBadges = {}; // id -> sprite

    // A. MADURAI MEENAKSHI AMMAN KOVIL
    function createMeenakshiTemple() {
      const temple = new THREE.Group();
      
      const baseGranite = new THREE.MeshStandardMaterial({ color: 0x24211e, roughness: 0.95 });
      const mainStoneMat = new THREE.MeshStandardMaterial({ color: 0x6e5c4c, roughness: 0.85 });
      const detailStoneMat = new THREE.MeshStandardMaterial({ color: 0x7f6c5a, roughness: 0.82 });
      const terracottaAccent = new THREE.MeshStandardMaterial({ color: 0x8a452a, roughness: 0.80 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.96, roughness: 0.12 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.82, roughness: 0.28 });
      const redWallMat = new THREE.MeshStandardMaterial({ color: 0xa82020, roughness: 0.78 });
      const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.78 });

      // Plinth & Terraces
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.7, 0.25, 16), baseGranite);
      plinth.position.y = 0.12;
      plinth.receiveShadow = true;
      temple.add(plinth);

      // Torus molding (Kumuda)
      const kumuda = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.08, 8, 24), baseGranite);
      kumuda.rotation.x = Math.PI / 2;
      kumuda.position.y = 0.25;
      temple.add(kumuda);

      // Sacred Mathil Suvar (Perimeter Wall with vertical Red & White Namam Stripes)
      const wallGroup = new THREE.Group();
      const numStripes = 16;
      const stripeW = 4.4 / numStripes;
      for (let s = 0; s < numStripes; s++) {
        const isRed = (s % 2 === 0);
        const mat = isRed ? redWallMat : whiteWallMat;
        const xPos = -2.2 + (s + 0.5) * stripeW;
        if (Math.abs(xPos) > 0.85) {
          const frontSeg = new THREE.Mesh(new THREE.BoxGeometry(stripeW, 0.75, 0.16), mat);
          frontSeg.position.set(xPos, 0.48, 1.8);
          frontSeg.castShadow = true;
          wallGroup.add(frontSeg);
        }
        const backSeg = new THREE.Mesh(new THREE.BoxGeometry(stripeW, 0.75, 0.16), mat);
        backSeg.position.set(xPos, 0.48, -1.8);
        wallGroup.add(backSeg);
      }
      const crestF = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 8), mainStoneMat);
      crestF.rotation.z = Math.PI / 2;
      crestF.position.set(0, 0.86, 1.8);
      wallGroup.add(crestF);
      const crestB = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 8), mainStoneMat);
      crestB.rotation.z = Math.PI / 2;
      crestB.position.set(0, 0.86, -1.8);
      wallGroup.add(crestB);
      temple.add(wallGroup);

      // Grand Dravidian Arched Portal Gateway (Torana)
      const gatewayGroup = new THREE.Group();
      const jambL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.4, 8), detailStoneMat);
      jambL.position.set(-0.65, 0.7, 1.05);
      gatewayGroup.add(jambL);
      const jambR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.4, 8), detailStoneMat);
      jambR.position.set(0.65, 0.7, 1.05);
      gatewayGroup.add(jambR);

      const toranaArch = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 8, 16, Math.PI), detailStoneMat);
      toranaArch.position.set(0, 1.4, 1.05);
      gatewayGroup.add(toranaArch);

      const sanctumVoid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 8), new THREE.MeshBasicMaterial({ color: 0x070709 }));
      sanctumVoid.position.set(0, 0.7, 0.6);
      gatewayGroup.add(sanctumVoid);

      const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.0, 0.06), brassMat);
      doorL.position.set(-0.24, 0.65, 0.95);
      doorL.rotation.y = 0.35;
      gatewayGroup.add(doorL);
      const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.0, 0.06), brassMat);
      doorR.position.set(0.24, 0.65, 0.95);
      doorR.rotation.y = -0.35;
      gatewayGroup.add(doorR);
      temple.add(gatewayGroup);

      const signTex = createSignboardTexture(
        'SRI MEENAKSHI AMMAN TEMPLE',
        'MADURAI HERITAGE • 2,500 YRS • 14 SACRED GOPURAMS',
        '#160e0a',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.55), signMat);
      sign.position.set(0, 1.75, 1.12);
      temple.add(sign);

      // 7-Tier Sculpted Dravidian Raja Gopuram (Sloping 4-sided trapezoidal frustums with entasis!)
      let currentY = 1.95;
      let baseRadius = 1.85;
      for (let t = 0; t < 7; t++) {
        const tierHeight = 0.38;
        const topRadius = baseRadius - 0.18;
        
        const tierGeo = new THREE.CylinderGeometry(topRadius, baseRadius, tierHeight, 4, 1, false, Math.PI / 4);
        const tierMat = (t % 2 === 0) ? mainStoneMat : detailStoneMat;
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = currentY + tierHeight / 2;
        tier.castShadow = true;
        temple.add(tier);

        const eaveGeo = new THREE.CylinderGeometry(baseRadius + 0.14, baseRadius + 0.18, 0.07, 4, 1, false, Math.PI / 4);
        const eave = new THREE.Mesh(eaveGeo, terracottaAccent);
        eave.position.y = currentY + tierHeight;
        temple.add(eave);

        const kuduL = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 12, Math.PI), detailStoneMat);
        kuduL.position.set(-topRadius * 0.45, currentY + tierHeight * 0.55, topRadius * 0.72);
        temple.add(kuduL);
        const kuduR = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 12, Math.PI), detailStoneMat);
        kuduR.position.set(topRadius * 0.45, currentY + tierHeight * 0.55, topRadius * 0.72);
        temple.add(kuduR);

        currentY += tierHeight;
        baseRadius = topRadius;
      }

      // Vaulted Barrel Roof (Sala-Shikhara)
      const salaLength = baseRadius * 1.8;
      const salaGeo = new THREE.CylinderGeometry(0.32, 0.48, salaLength, 12, 1, false, 0, Math.PI);
      const sala = new THREE.Mesh(salaGeo, mainStoneMat);
      sala.rotation.z = Math.PI / 2;
      sala.rotation.y = Math.PI / 2;
      sala.position.y = currentY + 0.30;
      sala.castShadow = true;
      temple.add(sala);

      const gableL = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 16, Math.PI), detailStoneMat);
      gableL.position.set(-salaLength / 2, currentY + 0.30, 0);
      gableL.rotation.y = Math.PI / 2;
      temple.add(gableL);
      const gableR = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 16, Math.PI), detailStoneMat);
      gableR.position.set(salaLength / 2, currentY + 0.30, 0);
      gableR.rotation.y = -Math.PI / 2;
      temple.add(gableR);

      // 5 Lathed Golden Kalasams
      for (let k = -2; k <= 2; k++) {
        const kalasamGroup = new THREE.Group();
        const padma = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.02, 6, 16), goldMat);
        padma.rotation.x = Math.PI / 2;
        padma.position.y = 0.03;
        kalasamGroup.add(padma);
        const pot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), goldMat);
        pot.position.y = 0.12;
        kalasamGroup.add(pot);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.32, 8), goldMat);
        spire.position.y = 0.32;
        kalasamGroup.add(spire);

        kalasamGroup.position.set(k * 0.22, currentY + 0.58, 0);
        temple.add(kalasamGroup);
      }

      // Warm Ghee Diya Illumination at entrance
      const diyaLight = new THREE.PointLight(0xffa033, 2.8, 8);
      diyaLight.position.set(0, 1.2, 1.4);
      temple.add(diyaLight);

      const diyaL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.1, 8), brassMat);
      diyaL.position.set(-0.75, 0.25, 1.25);
      temple.add(diyaL);
      const diyaR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.1, 8), brassMat);
      diyaR.position.set(0.75, 0.25, 1.25);
      temple.add(diyaR);

      // Sacred Golden Lotus Pond (Potramarai Kulam)
      const tankGroup = new THREE.Group();
      const tankPlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.15, 16), baseGranite);
      tankPlinth.position.set(2.4, 0.08, 0);
      tankGroup.add(tankPlinth);
      const tankWater = new THREE.Mesh(new THREE.CircleGeometry(0.8, 16), new THREE.MeshStandardMaterial({
        color: 0x0a4838,
        roughness: 0.1,
        metalness: 0.85
      }));
      tankWater.rotation.x = -Math.PI / 2;
      tankWater.position.set(2.4, 0.16, 0);
      tankGroup.add(tankWater);
      const lotus = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 8), goldMat);
      lotus.position.set(2.4, 0.25, 0);
      tankGroup.add(lotus);
      temple.add(tankGroup);

      const badge = createBixiPopupBadge('Meenakshi Amman Kovil', 'Temple Wonder');
      badge.position.set(0, currentY + 1.8, 0);
      badge.userData.baseY = currentY + 1.8;
      temple.add(badge);
      popupBadges['meenakshi'] = badge;

      return temple;
    }

    const meenakshiModel = createMeenakshiTemple();
    meenakshiModel.position.set(-7.5, 0, 1.2);
    meenakshiModel.rotation.y = Math.PI / 2; // Faces East towards Road
    scene.add(meenakshiModel);

    // B. ALANGANALLUR VADIVASAL & KANGAYAM BULL + BRAVE TAMER!
    let bullMesh = null;
    let bullLegs = [];
    let bullHead = null;
    let bullTail = null;
    let bullTamer = null;

    function createAlanganallurVadivasal() {
      const arena = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x8a3818, roughness: 0.72 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x422a18, roughness: 0.88 });
      const sandMat = new THREE.MeshStandardMaterial({ color: 0x856445, roughness: 0.95 });
      const bullSkinMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: 0.65 });
      const hornMat = new THREE.MeshStandardMaterial({ color: 0x242426, roughness: 0.35 });
      const hornTipMat = new THREE.MeshStandardMaterial({ color: 0xdcd8d0, roughness: 0.3 });
      const tamerSkin = new THREE.MeshStandardMaterial({ color: 0x8a532d, roughness: 0.75 });
      const vestiMat = new THREE.MeshStandardMaterial({ color: 0xe88124, roughness: 0.7 });

      const sandFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.12, 20), sandMat);
      sandFloor.position.set(0, 0.06, 0.6);
      sandFloor.receiveShadow = true;
      arena.add(sandFloor);

      const gateGroup = new THREE.Group();
      const pierL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 12), brickMat);
      pierL.position.set(-1.4, 1.4, 1.8);
      gateGroup.add(pierL);
      const pierR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 12), brickMat);
      pierR.position.set(1.4, 1.4, 1.8);
      gateGroup.add(pierR);

      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.24, 8, 20, Math.PI), brickMat);
      arch.position.set(0, 2.8, 1.8);
      gateGroup.add(arch);

      const eaveRoof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.45, 4), new THREE.MeshStandardMaterial({ color: 0xa84218, roughness: 0.65 }));
      eaveRoof.rotation.y = Math.PI / 4;
      eaveRoof.position.set(0, 3.25, 1.8);
      gateGroup.add(eaveRoof);
      arena.add(gateGroup);

      for (let side = -1; side <= 1; side += 2) {
        for (let post = 0; post < 4; post++) {
          const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 1.8, 6), woodMat);
          const zPos = 1.6 - post * 0.65;
          const lean = side * 0.08;
          log.position.set(side * 1.65, 0.9, zPos);
          log.rotation.z = lean;
          arena.add(log);
        }
        const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), woodMat);
        rail1.rotation.x = Math.PI / 2;
        rail1.position.set(side * 1.65, 0.6, 0.6);
        arena.add(rail1);
        const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), woodMat);
        rail2.rotation.x = Math.PI / 2;
        rail2.position.set(side * 1.65, 1.2, 0.6);
        arena.add(rail2);
      }

      const signTex = createSignboardTexture(
        'ALANGANALLUR VADIVASAL',
        'JALLIKATTU ARENA • 2,000 YR TRADITION',
        '#180c06',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.52), signMat);
      sign.position.set(0, 2.45, 1.95);
      arena.add(sign);

      const bullGroup = new THREE.Group();
      const bodyChest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.85, 12), bullSkinMat);
      bodyChest.rotation.x = Math.PI / 2;
      bodyChest.position.set(0, 0.82, 0.35);
      bodyChest.castShadow = true;
      bullGroup.add(bodyChest);

      const bodyHind = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.34, 0.75, 12), bullSkinMat);
      bodyHind.rotation.x = Math.PI / 2;
      bodyHind.position.set(0, 0.84, -0.4);
      bodyHind.castShadow = true;
      bullGroup.add(bodyHind);

      const hump = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), bullSkinMat);
      hump.scale.set(0.78, 1.15, 0.95);
      hump.position.set(0, 1.25, 0.55);
      hump.castShadow = true;
      bullGroup.add(hump);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.55, 10), bullSkinMat);
      neck.rotation.x = -Math.PI / 3.8;
      neck.position.set(0, 1.05, 0.85);
      bullGroup.add(neck);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 8), bullSkinMat);
      head.rotation.x = Math.PI / 2.8;
      head.position.set(0, 1.05, 1.25);
      bullGroup.add(head);

      for (let side = -1; side <= 1; side += 2) {
        const hornGroup = new THREE.Group();
        const hBase = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.45, 8), hornMat);
        hBase.position.set(side * 0.16, 0.22, 0);
        hBase.rotation.z = -side * 0.55;
        hBase.rotation.x = -0.3;
        hornGroup.add(hBase);

        const hTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.42, 8), hornTipMat);
        hTip.position.set(side * 0.34, 0.55, -0.08);
        hTip.rotation.z = -side * 0.25;
        hTip.rotation.x = -0.15;
        hornGroup.add(hTip);

        hornGroup.position.set(side * 0.14, 1.22, 1.15);
        bullGroup.add(hornGroup);
      }

      const legPositions = [
        { x: -0.28, z: 0.6 },
        { x: 0.28, z: 0.6 },
        { x: -0.26, z: -0.55 },
        { x: 0.26, z: -0.55 }
      ];
      legPositions.forEach(lp => {
        const leg = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.45, 8), bullSkinMat);
        thigh.position.y = 0.55;
        leg.add(thigh);
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.42, 8), bullSkinMat);
        shin.position.y = 0.22;
        leg.add(shin);
        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.1, 8), hornMat);
        hoof.position.y = 0.05;
        leg.add(hoof);

        leg.position.set(lp.x, 0, lp.z);
        bullGroup.add(leg);
      });

      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.65, 6), bullSkinMat);
      tail.position.set(0, 0.65, -0.9);
      tail.rotation.x = 0.45;
      bullGroup.add(tail);

      const tamerGroup = new THREE.Group();
      const tamerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.45, 8), tamerSkin);
      tamerTorso.position.set(0.38, 1.25, 0.52);
      tamerTorso.rotation.z = -0.35;
      tamerTorso.rotation.y = -0.4;
      tamerGroup.add(tamerTorso);

      const tamerHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), tamerSkin);
      tamerHead.position.set(0.48, 1.55, 0.55);
      tamerGroup.add(tamerHead);

      const vesti = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.32, 8), vestiMat);
      vesti.position.set(0.32, 0.98, 0.45);
      vesti.rotation.z = -0.3;
      tamerGroup.add(vesti);

      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.42, 6), tamerSkin);
      armL.position.set(0.18, 1.35, 0.55);
      armL.rotation.z = Math.PI / 3;
      armL.rotation.y = 0.2;
      tamerGroup.add(armL);

      bullGroup.add(tamerGroup);
      arena.add(bullGroup);

      const badge = createBixiPopupBadge('Alanganallur Vadivasal', 'Jallikattu Arena');
      badge.position.set(0, 4.0, 1.8);
      badge.userData.baseY = 4.0;
      arena.add(badge);
      popupBadges['alanganallur-vadivasal'] = badge;

      return arena;
    }

    const vadivasalModel = createAlanganallurVadivasal();
    vadivasalModel.position.set(-2.4, 0, 6.0);
    vadivasalModel.rotation.y = 0; // Facing South toward Road
    scene.add(vadivasalModel);

    // C. LUCKY MESS (AUTHENTIC VILLAGE HOTEL WITH COMPACT MANGALORE TILED ROOF & THINNAI)
    function createLuckyMess() {
      const mess = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x2e241c, roughness: 0.85 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x4f311c, roughness: 0.82 });
      const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0xaa4218, roughness: 0.62 });
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.92 });
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d8a3a, roughness: 0.65 });

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.24, 2.6), plinthMat);
      plinth.position.y = 0.12;
      plinth.receiveShadow = true;
      mess.add(plinth);

      const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.45, 1.8), wallMat);
      mainBuilding.position.set(0, 0.86, 0.3);
      mainBuilding.castShadow = true;
      mess.add(mainBuilding);

      const hipRoof = new THREE.Mesh(new THREE.ConeGeometry(2.35, 1.15, 4), tileRoofMat);
      hipRoof.rotation.y = Math.PI / 4;
      hipRoof.position.set(0, 2.15, 0.3);
      hipRoof.castShadow = true;
      mess.add(hipRoof);

      for (let p = -1.35; p <= 1.35; p += 0.9) {
        const pillarGroup = new THREE.Group();
        const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.15, 8), plinthMat);
        pBase.position.y = 0.08;
        pillarGroup.add(pBase);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 1.25, 8), woodMat);
        shaft.position.y = 0.72;
        pillarGroup.add(shaft);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.14), woodMat);
        cap.position.y = 1.38;
        pillarGroup.add(cap);

        pillarGroup.position.set(p, 0.24, -0.85);
        pillarGroup.castShadow = true;
        mess.add(pillarGroup);
      }

      const eaves = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.75), tileRoofMat);
      eaves.position.set(0, 1.62, -0.65);
      mess.add(eaves);

      const diningTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.45), woodMat);
      diningTable.position.set(0, 0.48, -0.45);
      mess.add(diningTable);

      for (let bl = -0.5; bl <= 0.5; bl += 0.5) {
        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), leafMat);
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(bl, 0.72, -0.45);
        mess.add(leaf);
      }

      const signTex = createSignboardTexture(
        'LUCKY MESS (ALANGANALLUR)',
        'ORIGINAL VILLAGE FEAST • SEERAGA SAMBA BIRYANI',
        '#160a04',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), signMat);
      sign.position.set(0, 1.48, 1.22);
      mess.add(sign);

      const interiorLight = new THREE.PointLight(0xffa500, 2.5, 6);
      interiorLight.position.set(0, 1.1, -0.2);
      mess.add(interiorLight);

      const badge = createBixiPopupBadge('Lucky Mess', 'Village Feast');
      badge.position.set(0, 3.4, 0.3);
      badge.userData.baseY = 3.4;
      mess.add(badge);
      popupBadges['lucky-mess'] = badge;

      return mess;
    }

    const luckyMessModel = createLuckyMess();
    luckyMessModel.position.set(2.4, 0, 6.0);
    luckyMessModel.rotation.y = 0; // Facing South toward Road
    scene.add(luckyMessModel);

    // D. POWER KADAI & MADURAI BUN PAROTTA (LIVE TAVA COUNTER + CHIMNEY SMOKE)
    const chimneySmokeParticles = [];

    function createPowerKadai() {
      const hotel = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x332219, roughness: 0.82 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 0.9 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dde4, metalness: 0.9, roughness: 0.2 });
      const tavaMat = new THREE.MeshStandardMaterial({ color: 0x121418, metalness: 0.85, roughness: 0.35 });
      const parottaMat = new THREE.MeshStandardMaterial({ color: 0xdfab54, roughness: 0.65 });
      const chefSkin = new THREE.MeshStandardMaterial({ color: 0x8a532d, roughness: 0.75 });
      const apronMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 2.6), darkMat);
      plinth.position.y = 0.1;
      hotel.add(plinth);

      const mainShop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 1.8), brickMat);
      mainShop.position.set(0, 0.9, -0.3);
      hotel.add(mainShop);

      const awning = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 1.2), new THREE.MeshStandardMaterial({ color: 0x3d4f5c, metalness: 0.7, roughness: 0.4 }));
      awning.position.set(0, 1.75, 0.6);
      awning.rotation.x = 0.22;
      hotel.add(awning);

      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.75, 0.85), darkMat);
      counter.position.set(0, 0.5, 0.7);
      hotel.add(counter);

      const tavaDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.06, 20), tavaMat);
      tavaDisc.position.set(-0.35, 0.9, 0.7);
      hotel.add(tavaDisc);

      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.04, 12), parottaMat);
      p1.position.set(-0.45, 0.94, 0.65);
      hotel.add(p1);
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.04, 12), parottaMat);
      p2.position.set(-0.25, 0.94, 0.75);
      hotel.add(p2);

      const chefGroup = new THREE.Group();
      const chefBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.65, 8), apronMat);
      chefBody.position.set(0.45, 0.9, 0.25);
      chefGroup.add(chefBody);
      const chefHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), chefSkin);
      chefHead.position.set(0.45, 1.32, 0.25);
      chefGroup.add(chefHead);
      const chefCap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.18, 10), apronMat);
      chefCap.position.set(0.45, 1.48, 0.25);
      chefGroup.add(chefCap);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.45, 6), chefSkin);
      arm.position.set(0.25, 1.05, 0.5);
      arm.rotation.z = Math.PI / 3;
      chefGroup.add(arm);
      hotel.add(chefGroup);

      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 12), chromeMat);
      chimney.position.set(1.2, 2.2, -0.6);
      hotel.add(chimney);

      const smokeGroup = new THREE.Group();
      const smokeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5, roughness: 1.0 });
      for (let sm = 0; sm < 4; sm++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.14 + sm * 0.04, 6, 6), smokeMat);
        puff.position.set(1.2, 3.1 + sm * 0.25, -0.6 + sm * 0.05);
        puff.userData = { baseY: 3.1 + sm * 0.25, offset: sm * 0.8 };
        smokeGroup.add(puff);
      }
      hotel.add(smokeGroup);

      const signTex = createSignboardTexture(
        'POWER KADAI & BUN PAROTTA',
        'MADURAI STREET FOOD • CITY THAT NEVER SLEEPS',
        '#160a04',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), signMat);
      sign.position.set(0, 1.78, 1.02);
      hotel.add(sign);

      const nightLight = new THREE.PointLight(0xffaa22, 2.8, 7);
      nightLight.position.set(-0.35, 1.2, 0.8);
      hotel.add(nightLight);

      const badge = createBixiPopupBadge('Power Kadai', 'Iconic Street Food');
      badge.position.set(0, 3.4, 0);
      badge.userData.baseY = 3.4;
      hotel.add(badge);
      popupBadges['power-kadai'] = badge;

      return hotel;
    }

    const powerKadaiModel = createPowerKadai();
    powerKadaiModel.position.set(7.6, 0, 1.0);
    powerKadaiModel.rotation.y = -Math.PI / 2; // Facing West toward Road
    scene.add(powerKadaiModel);

    // E. GANDHI MEMORIAL PALACE MUSEUM (TAMUKKAM NAYAK PALACE)
    function createGandhiMuseum() {
      const museum = new THREE.Group();
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x222632, roughness: 0.85 });
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd2c6b4, roughness: 0.72 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xb56338, metalness: 0.82, roughness: 0.28 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 3.2), plinthMat);
      plinth.position.y = 0.14;
      plinth.receiveShadow = true;
      museum.add(plinth);

      const mainHall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.45, 2.2), stoneMat);
      mainHall.position.set(0, 0.95, -0.2);
      mainHall.castShadow = true;
      museum.add(mainHall);

      for (let col = -1.5; col <= 1.5; col += 0.5) {
        const pillarGroup = new THREE.Group();
        const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 8), stoneMat);
        pBase.position.y = 0.05;
        pillarGroup.add(pBase);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.3, 10), stoneMat);
        shaft.position.y = 0.72;
        pillarGroup.add(shaft);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.18), stoneMat);
        cap.position.y = 1.42;
        pillarGroup.add(cap);

        pillarGroup.position.set(col, 0.28, 1.05);
        pillarGroup.castShadow = true;
        museum.add(pillarGroup);
      }

      const entablature = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.6), stoneMat);
      entablature.position.set(0, 1.82, 1.0);
      museum.add(entablature);

      const domeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.35, 16), stoneMat);
      domeDrum.position.set(0, 1.85, -0.2);
      museum.add(domeDrum);

      const domeHemisphere = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      domeHemisphere.position.set(0, 2.02, -0.2);
      domeHemisphere.castShadow = true;
      museum.add(domeHemisphere);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 8), goldMat);
      finial.position.set(0, 2.95, -0.2);
      museum.add(finial);

      const signTex = createSignboardTexture(
        'GANDHI MEMORIAL PALACE MUSEUM',
        'TAMUKKAM PALACE (1670 CE) • RANI MANGAMMAL',
        '#121620',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), signMat);
      sign.position.set(0, 1.48, 1.25);
      museum.add(sign);

      const badge = createBixiPopupBadge('Gandhi Palace Museum', 'Palace Museum');
      badge.position.set(0, 3.8, -0.2);
      badge.userData.baseY = 3.8;
      museum.add(badge);
      popupBadges['gandhi-museum'] = badge;

      return museum;
    }

    const museumModel = createGandhiMuseum();
    museumModel.position.set(6.2, 0, -5.4);
    museumModel.rotation.y = -Math.PI * 0.75; // Facing North-West toward Road
    scene.add(museumModel);

    // F. ALAGAR KOVIL (KALLAZHAGAR SACRED TEMPLE - FOOTHILLS OF ALAGAR MALAI)
    function createAlagarTemple() {
      const temple = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e5a4a, roughness: 0.85 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.96, roughness: 0.12 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.85, roughness: 0.25 });
      const redWallMat = new THREE.MeshStandardMaterial({ color: 0xa82020, roughness: 0.78 });
      const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.78 });
      const boulderMat = new THREE.MeshStandardMaterial({ color: 0x363832, roughness: 0.95, flatShading: true });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x147892, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.92 });

      const rockCoords = [
        { x: -2.4, y: 0.4, z: -1.8, s: 0.9 },
        { x: -2.8, y: 0.6, z: -0.8, s: 1.1 },
        { x: 2.6, y: 0.4, z: -1.6, s: 0.95 },
        { x: 2.2, y: 0.3, z: -0.6, s: 0.8 }
      ];
      rockCoords.forEach(rc => {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rc.s, 1), boulderMat);
        rock.position.set(rc.x, rc.y, rc.z);
        rock.castShadow = true;
        temple.add(rock);
      });

      const terrace = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.28, 16), stoneMat);
      terrace.position.y = 0.14;
      terrace.receiveShadow = true;
      temple.add(terrace);

      for (let s = 0; s < 12; s++) {
        const mat = (s % 2 === 0) ? redWallMat : whiteWallMat;
        const xPos = -1.65 + (s + 0.5) * 0.28;
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.65, 0.08), mat);
        st.position.set(xPos, 0.46, -1.2);
        temple.add(st);
      }

      const mandapam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.25, 12), stoneMat);
      mandapam.position.set(0, 0.76, 0);
      mandapam.castShadow = true;
      temple.add(mandapam);

      const vimanaBase = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.35, 0.85, 8), stoneMat);
      vimanaBase.position.set(0, 1.8, 0);
      vimanaBase.castShadow = true;
      temple.add(vimanaBase);

      const goldenVimana = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.15, 8), goldMat);
      goldenVimana.position.set(0, 2.75, 0);
      goldenVimana.castShadow = true;
      temple.add(goldenVimana);

      const kalasam = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.38, 8), goldMat);
      kalasam.position.set(0, 3.4, 0);
      temple.add(kalasam);

      const flagGroup = new THREE.Group();
      const mastBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.35, 8), brassMat);
      mastBase.position.y = 0.18;
      flagGroup.add(mastBase);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.8, 10), goldMat);
      mast.position.y = 1.55;
      flagGroup.add(mast);
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.04), goldMat);
      crossbar.position.y = 2.65;
      flagGroup.add(crossbar);
      flagGroup.position.set(1.5, 0.28, -1.5);
      temple.add(flagGroup);

      const streamGeo = new THREE.PlaneGeometry(0.75, 2.8);
      streamGeo.rotateX(-Math.PI / 2);
      const stream = new THREE.Mesh(streamGeo, waterMat);
      stream.position.set(-2.1, 0.12, -1.1);
      temple.add(stream);

      const cistern = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.28, 12), stoneMat);
      cistern.position.set(-2.1, 0.14, 0.3);
      temple.add(cistern);

      const signTex = createSignboardTexture(
        'ALAGAR KOVIL (KALLAZHAGAR)',
        'SACRED HILL TEMPLE • CHITHIRAI FESTIVAL',
        '#160a04',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), signMat);
      sign.position.set(0, 1.25, -1.25);
      temple.add(sign);

      const bellLight = new THREE.PointLight(0xffb703, 2.8, 8);
      bellLight.position.set(0, 1.6, -1.4);
      temple.add(bellLight);

      const badge = createBixiPopupBadge('Alagar Kovil', 'Alagar Temple');
      badge.position.set(0, 3.8, 0);
      badge.userData.baseY = 3.8;
      temple.add(badge);
      popupBadges['alagar-kovil'] = badge;

      return temple;
    }

    const alagarModel = createAlagarTemple();
    alagarModel.position.set(-4.8, 0, -6.0);
    alagarModel.rotation.y = Math.PI; // Facing South toward Road
    scene.add(alagarModel);

    // =========================================================================
    // 5. NATURAL SCENIC PALMS (CLEARED FROM ALL ENTRANCES)
    // =========================================================================
    const scenicPalmSpots = [
      { x: -8.8, z: -1.2 }, { x: -8.5, z: 3.5 },
      { x: 8.8, z: 3.2 },   { x: 8.5, z: -2.2 },
      { x: 4.5, z: -8.5 },  { x: -1.5, z: -8.8 },
      { x: -8.0, z: -7.5 }
    ];
    scenicPalmSpots.forEach(s => {
      scene.add(createPalm(s.x, s.z, 0.8 + Math.random() * 0.3));
    });

    // =========================================================================
    // 6. HIGHWAY ROAD LOOP & PARKING BAYS (ELEVATED FIRMLY AT y = 0.25)
    // =========================================================================
    const ROAD_Y = 0.25;

    const roadControlPoints = [
      new THREE.Vector3(-4.8, ROAD_Y, 1.2),  // 0: Meenakshi Stop
      new THREE.Vector3(-2.4, ROAD_Y, 3.4),  // 1: Vadivasal Stop
      new THREE.Vector3(0.0, ROAD_Y, 3.6),   // 2: Mid-curve
      new THREE.Vector3(2.4, ROAD_Y, 3.4),   // 3: Lucky Mess Stop
      new THREE.Vector3(4.8, ROAD_Y, 1.0),   // 4: Power Kadai Stop
      new THREE.Vector3(4.5, ROAD_Y, -1.2),  // 5: East Curve
      new THREE.Vector3(3.6, ROAD_Y, -3.2),  // 6: Gandhi Museum Stop
      new THREE.Vector3(0.5, ROAD_Y, -4.2),  // 7: North-East transition
      new THREE.Vector3(-3.0, ROAD_Y, -3.6), // 8: Alagar Kovil Stop
      new THREE.Vector3(-5.2, ROAD_Y, -1.2)  // 9: West Curve transition back
    ];

    const roadCurve = new THREE.CatmullRomCurve3(roadControlPoints, true, 'catmullrom', 0.25);

    // Smooth Asphalt Roadway Ribbon
    const roadGeo = new THREE.TubeGeometry(roadCurve, 160, 0.44, 8, true);
    roadGeo.scale(1, 0.04, 1);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e212b,
      roughness: 0.72,
      metalness: 0.15
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Glowing BIXI Sunset Orange Center Lane
    const roadLineGeo = new THREE.TubeGeometry(roadCurve, 160, 0.045, 4, true);
    roadLineGeo.scale(1, 0.05, 1);
    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xe88124 });
    const roadLineMesh = new THREE.Mesh(roadLineGeo, roadLineMat);
    roadLineMesh.position.y = 0.022;
    scene.add(roadLineMesh);

    // Painted Roadside Parking Bays in front of every landmark
    CHECKPOINTS.forEach(cp => {
      const bay = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.65, 16), new THREE.MeshBasicMaterial({ color: 0xe88124, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      bay.rotation.x = -Math.PI / 2;
      bay.position.set(cp.roadPos.x, ROAD_Y + 0.015, cp.roadPos.z);
      scene.add(bay);
    });

    // Roadside Streetlights
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    for (let l = 0; l < 8; l++) {
      const u = l / 8;
      const pt = roadCurve.getPointAt(u);
      const tangent = roadCurve.getTangentAt(u);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const polePos = pt.clone().add(normal.clone().multiplyScalar(0.75));
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4), lampMat);
      pole.position.set(polePos.x, ROAD_Y + 0.7, polePos.z);
      scene.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), bulbMat);
      bulb.position.set(polePos.x, ROAD_Y + 1.4, polePos.z);
      scene.add(bulb);
    }

    // =========================================================================
    // 7. 3D MARUTI SWIFT HATCHBACK MODEL (BIXI SUNSET ORANGE)
    // =========================================================================
    const carGroup = new THREE.Group();

    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe88124,
      metalness: 0.85,
      roughness: 0.2
    });
    const carRoofMat = new THREE.MeshStandardMaterial({
      color: 0x0b0d13,
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

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.22, 1.25), carBodyMat);
    lowerBody.position.y = 0.18;
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.35), carBodyMat);
    nose.position.set(0, 0.18, 0.58);
    carGroup.add(nose);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.22, 0.65), carRoofMat);
    cabin.position.set(0, 0.36, -0.05);
    carGroup.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.68), glassMat);
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

    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl1.position.set(-0.22, 0.24, -0.62);
    carGroup.add(tl1);
    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl2.position.set(0.22, 0.24, -0.62);
    carGroup.add(tl2);

    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const hazards = [
      new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), hazardMat),
      new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), hazardMat),
      new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), hazardMat),
      new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), hazardMat)
    ];
    hazards[0].position.set(-0.31, 0.22, 0.72);
    hazards[1].position.set(0.31, 0.22, 0.72);
    hazards[2].position.set(-0.31, 0.24, -0.60);
    hazards[3].position.set(0.31, 0.24, -0.60);
    hazards.forEach(h => {
      h.visible = false;
      carGroup.add(h);
    });

    scene.add(carGroup);

    // Passenger Figures
    const touristOut = createPassengerFigure(0xffffff, 0x1e3a8a);
    scene.add(touristOut);

    const touristIn = createPassengerFigure(0xe88124, 0x0f172a);
    scene.add(touristIn);

    // Calculate parameter t along road curve for each stop point
    const stopTValues = [];
    CHECKPOINTS.forEach(cp => {
      let bestT = 0;
      let minDist = 999;
      for (let s = 0; s <= 500; s++) {
        const testT = s / 500;
        const pt = roadCurve.getPointAt(testT);
        const d = pt.distanceTo(new THREE.Vector3(cp.roadPos.x, ROAD_Y, cp.roadPos.z));
        if (d < minDist) {
          minDist = d;
          bestT = testT;
        }
      }
      stopTValues.push(bestT);
    });

    // Checkpoint Diamond Beacons
    const pinMeshes = [];
    CHECKPOINTS.forEach(cp => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(cp.roadPos.x, ROAD_Y, cp.roadPos.z);

      const pinHeadGeo = new THREE.OctahedronGeometry(0.25, 0);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: 0xe88124,
        emissive: 0xd97706,
        roughness: 0.2,
        metalness: 0.8
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.y = 1.6;
      pinHead.userData = { id: cp.id, info: cp, originalY: 1.6 };
      pinGroup.add(pinHead);
      pinMeshes.push(pinHead);

      scene.add(pinGroup);
    });

    // =========================================================================
    // 8. INTERACTIVE CLICK & CAMERA CONTROLS (+, -, OVERVIEW)
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

    let isTweeningCamera = false;
    let isFocusingCheckpoint = false;
    let camTweenStart = 0;
    const CAM_TWEEN_DURATION = 850;
    const camStartPos = new THREE.Vector3();
    const camEndPos = new THREE.Vector3();
    const targetStartPos = new THREE.Vector3();
    const targetEndPos = new THREE.Vector3();

    function flyCameraTo(destCam, destTarget) {
      isTweeningCamera = true;
      camTweenStart = performance.now();
      camStartPos.copy(camera.position);
      camEndPos.copy(destCam);
      if (controls) {
        targetStartPos.copy(controls.target);
      } else {
        targetStartPos.copy(currentLookAt);
      }
      targetEndPos.copy(destTarget);
    }

    let pointerDownX = 0;
    let pointerDownY = 0;
    let pointerDownTime = 0;
    let isPointerDragging = false;

    canvas.addEventListener('pointerdown', (e) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      pointerDownTime = performance.now();
      isPointerDragging = false;
      isTweeningCamera = false;
    });

    canvas.addEventListener('pointermove', (e) => {
      const dx = Math.abs(e.clientX - pointerDownX);
      const dy = Math.abs(e.clientY - pointerDownY);
      if (dx > 7 || dy > 7) {
        isPointerDragging = true;
      }
    });

    canvas.addEventListener('pointerup', (e) => {
      const dt = performance.now() - pointerDownTime;
      if (!isPointerDragging && dt < 450) {
        if (hoveredPin && hoveredPin.userData && hoveredPin.userData.info) {
          selectCheckpoint(hoveredPin.userData.info);
        }
      }
    });

    window.zoomMaduraiMap = function (dir) {
      if (!controls) return;
      isTweeningCamera = false;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      const factor = dir > 0 ? 0.78 : 1.28;
      offset.multiplyScalar(factor);
      if (offset.length() >= controls.minDistance && offset.length() <= controls.maxDistance) {
        camera.position.copy(controls.target).add(offset);
      }
    };

    function selectCheckpoint(cp) {
      if (!cp) return;
      isFocusingCheckpoint = true;

      flyCameraTo(
        new THREE.Vector3(cp.camPos.x, cp.camPos.y, cp.camPos.z),
        new THREE.Vector3(cp.target.x, cp.target.y, cp.target.z)
      );

      const resetBtn = document.getElementById('btnMapResetView');
      if (resetBtn) resetBtn.style.display = 'inline-flex';

      Object.keys(popupBadges).forEach(k => {
        if (popupBadges[k]) {
          popupBadges[k].userData.targetScale = (k === cp.id) ? 1.0 : 0.0;
        }
      });

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
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.classList.remove('active');
        }
      });

      document.querySelectorAll('.dock-checkpoint-btn').forEach(btn => {
        if (btn.dataset.checkpoint === cp.id) {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.classList.remove('active');
        }
      });

      if (typeof window.openDestinationDrawer === 'function') {
        window.openDestinationDrawer(cp.id);
      }
    }

    function resetMaduraiOverview() {
      isFocusingCheckpoint = false;
      flyCameraTo(defaultCamPos, defaultLookAt);

      const resetBtn = document.getElementById('btnMapResetView');
      if (resetBtn) resetBtn.style.display = 'none';

      document.querySelectorAll('.map-pill-btn').forEach(btn => {
        if (btn.dataset.id === 'overview') {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.classList.remove('active');
        }
      });

      Object.keys(popupBadges).forEach(k => {
        if (popupBadges[k]) popupBadges[k].userData.targetScale = 0.0;
      });

      const cardTitle = document.getElementById('mapActiveTitle');
      if (cardTitle) cardTitle.textContent = 'Madurai Landmark Tour';
      const cardCategory = document.getElementById('mapActiveCategory');
      if (cardCategory) cardCategory.textContent = 'Scenic Route Loop';
      const cardDistance = document.getElementById('mapActiveDistance');
      if (cardDistance) cardDistance.textContent = 'Full City Circuit';
      const cardTime = document.getElementById('mapActiveTime');
      if (cardTime) cardTime.textContent = 'Scenic Cruise';
      const cardVehicle = document.getElementById('mapActiveVehicle');
      if (cardVehicle) cardVehicle.textContent = 'Maruti Swift / RE Hunter';
      const cardDesc = document.getElementById('mapActiveDesc');
      if (cardDesc) cardDesc.textContent = 'Explore Madurai’s most iconic landmarks and authentic food stops. Click any landmark pill to fly into the 3D model, or enjoy the live Swift cruiser tour.';

      if (typeof window.closeDestinationDrawer === 'function') {
        window.closeDestinationDrawer();
      }
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
    // 9. TOUR SIMULATION ENGINE (CAR STOPS, HAZARD BLINKERS & PEOPLE MOVING)
    // =========================================================================
    let carT = 0;
    const cruiseSpeed = 0.00065;
    let currentSpeed = cruiseSpeed;
    let carState = 'CRUISING';
    let currentStopIdx = -1;
    let stopTimer = 0;
    const STOP_DURATION_FRAMES = 240;

    let animationFrameId = null;
    let isVisible = false;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      const timeSec = now * 0.009;

      // -----------------------------------------------------------------------
      // A. TOUR STATE MACHINE
      // -----------------------------------------------------------------------
      if (carState === 'CRUISING') {
        carT = (carT + currentSpeed) % 1;

        for (let i = 0; i < stopTValues.length; i++) {
          const targetT = stopTValues[i];
          let diff = Math.abs(carT - targetT);
          if (diff > 0.5) diff = 1.0 - diff;

          if (diff < 0.008 && currentStopIdx !== i) {
            carState = 'STOPPED';
            currentStopIdx = i;
            stopTimer = 0;
            currentSpeed = 0;

            const cp = CHECKPOINTS[i];
            if (popupBadges[cp.id]) {
              popupBadges[cp.id].userData.targetScale = 1.0;
            }

            const liveHudLocation = document.getElementById('mapLiveCheckpointText');
            if (liveHudLocation) {
              liveHudLocation.textContent = `${cp.name} (Stop #${i + 1} of 6)`;
            }

            // Sync active pill in bottom dock if in cruise tour mode
            if (!isFocusingCheckpoint) {
              document.querySelectorAll('.map-pill-btn').forEach(btn => {
                if (btn.dataset.id === cp.id) {
                  btn.classList.add('active');
                  btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                  btn.classList.remove('active');
                }
              });

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
            }
            break;
          }
        }

        hazards.forEach(h => { h.visible = false; });
        touristOut.visible = false;
        touristIn.visible = false;

        if (currentSpeed < cruiseSpeed) {
          currentSpeed += 0.00003;
        }

      } else if (carState === 'STOPPED') {
        stopTimer++;

        const hazardBlink = Math.floor(now / 350) % 2 === 0;
        hazards.forEach(h => { h.visible = hazardBlink; });

        const cp = CHECKPOINTS[currentStopIdx];
        const carWorldPos = new THREE.Vector3(cp.roadPos.x, ROAD_Y, cp.roadPos.z);
        const entranceWorldPos = new THREE.Vector3(cp.modelPos.x * 0.72 + cp.roadPos.x * 0.28, ROAD_Y, cp.modelPos.z * 0.72 + cp.roadPos.z * 0.28);

        // Phase 1 (0 to 110 frames): Passenger walks out to entrance
        if (stopTimer <= 110) {
          touristOut.visible = true;
          const prog = stopTimer / 110;
          touristOut.position.lerpVectors(carWorldPos, entranceWorldPos, prog);
          touristOut.lookAt(entranceWorldPos);

          const w = stopTimer * 0.25;
          touristOut.userData.leftLeg.rotation.x = Math.sin(w) * 0.6;
          touristOut.userData.rightLeg.rotation.x = -Math.sin(w) * 0.6;
          touristOut.userData.leftArm.rotation.x = -Math.sin(w) * 0.5;
          touristOut.userData.rightArm.rotation.x = Math.sin(w) * 0.5;
          touristOut.position.y = ROAD_Y + Math.abs(Math.sin(w)) * 0.04;
        } else {
          touristOut.visible = false;
        }

        // Phase 2 (110 to 220 frames): Returning passenger walks to car
        if (stopTimer > 110 && stopTimer <= 220) {
          touristIn.visible = true;
          const prog = (stopTimer - 110) / 110;
          touristIn.position.lerpVectors(entranceWorldPos, carWorldPos, prog);
          touristIn.lookAt(carWorldPos);

          const w = (stopTimer - 110) * 0.25;
          touristIn.userData.leftLeg.rotation.x = Math.sin(w) * 0.6;
          touristIn.userData.rightLeg.rotation.x = -Math.sin(w) * 0.6;
          touristIn.userData.leftArm.rotation.x = -Math.sin(w) * 0.5;
          touristIn.userData.rightArm.rotation.x = Math.sin(w) * 0.5;
          touristIn.position.y = ROAD_Y + Math.abs(Math.sin(w)) * 0.04;
        } else if (stopTimer > 220) {
          touristIn.visible = false;
        }

        if (stopTimer >= STOP_DURATION_FRAMES) {
          if (popupBadges[cp.id]) {
            popupBadges[cp.id].userData.targetScale = 0.0;
          }

          carState = 'CRUISING';
          currentSpeed = 0.0001;
        }
      }

      // -----------------------------------------------------------------------
      // B. UPDATE CAR ORIENTATION & WHEELS
      // -----------------------------------------------------------------------
      const pt = roadCurve.getPointAt(carT);
      const nextPt = roadCurve.getPointAt((carT + 0.01) % 1);

      carGroup.position.set(pt.x, ROAD_Y + 0.12, pt.z);
      carGroup.lookAt(new THREE.Vector3(nextPt.x, ROAD_Y + 0.12, nextPt.z));

      if (carState === 'CRUISING') {
        carWheels.forEach(w => {
          w.rotation.x += 0.28;
        });
      }

      // -----------------------------------------------------------------------
      // C. ANIMATE DRIFTING CLOUDS & BIRDS IN SKY!
      // -----------------------------------------------------------------------
      cloudEntities.forEach(c => {
        c.position.x += c.userData.speed;
        if (c.position.x > 26) {
          c.position.x = -26;
        }
      });

      // Soaring Flock of Birds Animation
      const birdCircTime = now * 0.00045;
      birdsFlockGroup.position.x = Math.sin(birdCircTime) * 9.5;
      birdsFlockGroup.position.z = Math.cos(birdCircTime) * 7.5 - 2.0;
      birdsFlockGroup.position.y = 10.0 + Math.sin(birdCircTime * 2) * 0.8;
      birdsFlockGroup.rotation.y = birdCircTime + Math.PI / 2;

      birdEntities.forEach(b => {
        const flap = Math.sin(timeSec * 1.5 + b.userData.flapOffset) * 0.55;
        b.userData.leftWing.rotation.z = flap;
        b.userData.rightWing.rotation.z = -flap;
      });

      // -----------------------------------------------------------------------
      // D. ANIMATE FLOATING BIXI POPUP BADGES
      // -----------------------------------------------------------------------
      const badgeTime = now * 0.003;
      Object.keys(popupBadges).forEach(k => {
        const b = popupBadges[k];
        if (b) {
          const target = b.userData.targetScale;
          b.scale.x = THREE.MathUtils.lerp(b.scale.x, target * b.userData.maxScaleX, 0.08);
          b.scale.y = THREE.MathUtils.lerp(b.scale.y, target * b.userData.maxScaleY, 0.08);
          if (target > 0) {
            b.position.y = b.userData.baseY + Math.sin(badgeTime + b.position.x) * 0.08;
          }
        }
      });

      // -----------------------------------------------------------------------
      // E. ANIMATE JALLIKATTU BULL & BRAVE TAMER (HUMP-EMBRACING GALLOP CYCLE!)
      // -----------------------------------------------------------------------
      if (bullMesh && bullLegs.length === 4) {
        bullLegs[0].rotation.x = Math.sin(timeSec) * 0.55;
        bullLegs[1].rotation.x = -Math.sin(timeSec) * 0.55;
        bullLegs[2].rotation.x = -Math.sin(timeSec + 0.6) * 0.55;
        bullLegs[3].rotation.x = Math.sin(timeSec + 0.6) * 0.55;

        if (bullHead) {
          bullHead.rotation.x = Math.sin(timeSec * 0.7) * 0.2;
          bullHead.rotation.y = Math.cos(timeSec * 0.5) * 0.12;
        }

        if (bullTail) {
          bullTail.rotation.z = Math.sin(timeSec * 1.4) * 0.35;
        }

        bullMesh.position.z = 0.2 + Math.sin(timeSec * 0.5) * 0.3;
        bullMesh.position.y = Math.abs(Math.sin(timeSec * 0.5)) * 0.08;

        if (bullTamer) {
          bullTamer.rotation.x = 0.35 + Math.sin(timeSec * 0.5) * 0.12;
          bullTamer.rotation.z = 0.22 + Math.cos(timeSec * 0.7) * 0.06;
        }
      }

      // -----------------------------------------------------------------------
      // F. ANIMATE POWER KADAI BILLOWING CHIMNEY SMOKE
      // -----------------------------------------------------------------------
      chimneySmokeParticles.forEach((puff) => {
        puff.position.y += puff.userData.speed;
        puff.position.x += puff.userData.drift;
        const progress = (puff.position.y - puff.userData.baseY) / 1.6;
        puff.scale.set(1 + progress * 1.6, 1 + progress * 1.6, 1 + progress * 1.6);
        puff.material.opacity = Math.max(0, 0.6 * (1 - progress));
        if (puff.position.y > puff.userData.baseY + 1.6) {
          puff.position.y = puff.userData.baseY;
          puff.position.x = 0.8 + (Math.random() - 0.5) * 0.1;
          puff.scale.set(1, 1, 1);
        }
      });

      // -----------------------------------------------------------------------
      // G. SPIN PIN BEACONS
      // -----------------------------------------------------------------------
      const beaconTime = now * 0.003;
      pinMeshes.forEach(mesh => {
        mesh.rotation.y += 0.025;
        mesh.position.y = mesh.userData.originalY + Math.sin(beaconTime + mesh.position.x) * 0.08;
      });

      // -----------------------------------------------------------------------
      // H. CAMERA SMOOTH FLIGHT & OFFICIAL ORBIT CONTROLS
      // -----------------------------------------------------------------------
      if (isTweeningCamera) {
        const elapsed = performance.now() - camTweenStart;
        const progress = Math.min(elapsed / CAM_TWEEN_DURATION, 1.0);
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(camStartPos, camEndPos, ease);
        if (controls) {
          controls.target.lerpVectors(targetStartPos, targetEndPos, ease);
        } else {
          currentLookAt.lerpVectors(targetStartPos, targetEndPos, ease);
          camera.lookAt(currentLookAt);
        }
        if (progress >= 1.0) {
          isTweeningCamera = false;
        }
      }

      if (controls) {
        controls.update();
      }

      // -----------------------------------------------------------------------
      // I. RAYCASTING HOVER
      // -----------------------------------------------------------------------
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);
      if (intersects.length > 0) {
        hoveredPin = intersects[0].object;
        canvas.style.cursor = 'pointer';
        hoveredPin.scale.set(1.3, 1.3, 1.3);
      } else {
        if (hoveredPin) hoveredPin.scale.set(1, 1, 1);
        hoveredPin = null;
        canvas.style.cursor = isPointerDragging ? 'grabbing' : 'grab';
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
