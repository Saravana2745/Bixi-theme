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
      camPos: { x: -2.0, y: 10.5, z: 9.0 },
      target: { x: -6.8, y: 2.5, z: 1.2 },
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
      camPos: { x: 0.6, y: 9.5, z: 0.2 },
      target: { x: -2.8, y: 1.8, z: 5.4 },
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
      camPos: { x: -0.5, y: 9.5, z: 0.5 },
      target: { x: 2.4, y: 1.6, z: 5.8 },
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
      camPos: { x: 2.5, y: 9.5, z: 7.2 },
      target: { x: 7.0, y: 1.8, z: 1.0 },
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
      camPos: { x: 1.0, y: 10.5, z: 0.2 },
      target: { x: 5.8, y: 2.0, z: -5.0 },
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
      camPos: { x: -0.8, y: 10.5, z: 0.8 },
      target: { x: -4.5, y: 2.4, z: -5.0 },
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
    c.width = 1024;
    c.height = 460;
    const ctx = c.getContext('2d');

    function renderBadge() {
      ctx.clearRect(0, 0, 1024, 460);

      // Card Background (Dark Glass Obsidian)
      ctx.fillStyle = 'rgba(10, 13, 20, 0.96)';
      ctx.beginPath();
      ctx.roundRect(16, 16, 992, 428, 56);
      ctx.fill();

      // Glowing Neon Orange Border
      ctx.strokeStyle = '#FF7A18';
      ctx.lineWidth = 10;
      ctx.shadowColor = 'rgba(255, 122, 24, 0.9)';
      ctx.shadowBlur = 32;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Top Tag Pill
      ctx.fillStyle = 'rgba(255, 122, 24, 0.2)';
      ctx.beginPath();
      ctx.roundRect(312, 45, 400, 52, 26);
      ctx.fill();
      ctx.strokeStyle = '#FF7A18';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFA858';
      ctx.font = 'bold 26px "Cabinet Grotesk", "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`BIXI STOP • ${category.toUpperCase()}`, 512, 71);

      // Landmark Title (Big, Bold, Crisp White)
      let fontSize = 54;
      const maxW = 900;
      ctx.font = `900 ${fontSize}px "Cabinet Grotesk", "Segoe UI", Roboto, sans-serif`;
      while (ctx.measureText(title).width > maxW && fontSize > 28) {
        fontSize -= 2;
        ctx.font = `900 ${fontSize}px "Cabinet Grotesk", "Segoe UI", Roboto, sans-serif`;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(title, 512, 190);

      // Bottom Subtitle (Route & Dispatch Guidance)
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 28px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('CLICK TO VIEW 3D WAYPOINT & RENTAL STRATEGY', 512, 290);

      // Bottom Button Pill
      ctx.fillStyle = '#FF7A18';
      ctx.beginPath();
      ctx.roundRect(362, 345, 300, 56, 28);
      ctx.fill();
      ctx.fillStyle = '#0B0D13';
      ctx.font = '900 26px "Segoe UI", sans-serif';
      ctx.fillText('EXPLORE GUIDE →', 512, 373);
    }

    renderBadge();

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.renderOrder = 9999;
    sprite.scale.set(0, 0, 1);
    sprite.userData = {
      targetScale: 0,
      baseY: 0,
      maxScaleX: 4.5,
      maxScaleY: 2.05
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
    // 1. VAST ENCLOSED TERRAIN & 360° MOUNTAIN HORIZON (ZERO BLACK VOID!)
    // Expansive 320x320 master terrain covering entire viewable horizon
    const terrainGeo = new THREE.PlaneGeometry(320, 320, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x131822,
      roughness: 0.92,
      metalness: 0.08
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Inner Madurai City Greenery & Earth Patch (radius 18m)
    const cityPlazaGeo = new THREE.CircleGeometry(19, 32);
    cityPlazaGeo.rotateX(-Math.PI / 2);
    const cityPlazaMat = new THREE.MeshStandardMaterial({
      color: 0x181f2c,
      roughness: 0.85,
      metalness: 0.12
    });
    const cityPlaza = new THREE.Mesh(cityPlazaGeo, cityPlazaMat);
    cityPlaza.position.y = 0.01;
    cityPlaza.receiveShadow = true;
    scene.add(cityPlaza);

    // Realistic Atmospheric Sky Dome
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d');
    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0.0, '#0a101d'); // Zenith: Deep night sapphire
    skyGrad.addColorStop(0.55, '#151e2e'); // Mid: Twilight blue
    skyGrad.addColorStop(0.85, '#222d3f'); // Horizon mist
    skyGrad.addColorStop(1.0, '#2e3748');  // Horizon warm dusk glow
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyGeo = new THREE.SphereGeometry(155, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Continuous 360-Degree Mountain Enclosure (North, South, East, West - Fully Closed!)
    const mountainMatDark = new THREE.MeshStandardMaterial({ color: 0x12241b, roughness: 0.95, flatShading: true });
    const mountainMatMid  = new THREE.MeshStandardMaterial({ color: 0x183426, roughness: 0.92, flatShading: true });
    const mountainMatLush = new THREE.MeshStandardMaterial({ color: 0x1e4231, roughness: 0.88, flatShading: true });
    const mountainMaterials = [mountainMatDark, mountainMatMid, mountainMatLush];

    const perimeterPeaks = [
      // NORTH MOUNTAIN CHAIN (Alagar Malai Sacred Ranges)
      { r: 10.5, h: 18.0, x: -48, z: -42 },
      { r: 12.0, h: 22.5, x: -30, z: -45 },
      { r: 14.5, h: 26.0, x: -10, z: -48 },
      { r: 13.0, h: 24.0, x: 12,  z: -46 },
      { r: 11.5, h: 20.0, x: 32,  z: -44 },
      { r: 10.0, h: 16.5, x: 50,  z: -40 },

      // SOUTH MOUNTAIN CHAIN (Thirupparankundram Sacred Hill Ridge)
      { r: 10.0, h: 17.0, x: -48, z: 42 },
      { r: 12.5, h: 21.0, x: -28, z: 46 },
      { r: 14.0, h: 24.5, x: -6,  z: 48 },
      { r: 13.5, h: 23.0, x: 16,  z: 46 },
      { r: 11.0, h: 19.5, x: 36,  z: 43 },
      { r: 9.5,  h: 15.5, x: 52,  z: 39 },

      // EAST MOUNTAIN CHAIN (Vaigai River Basin Hills & Ridges)
      { r: 11.0, h: 18.5, x: 44, z: -28 },
      { r: 13.0, h: 22.0, x: 48, z: -10 },
      { r: 12.5, h: 21.5, x: 47, z: 12 },
      { r: 10.5, h: 17.5, x: 43, z: 28 },

      // WEST MOUNTAIN CHAIN (Nagamalai Western Ghats Foothills)
      { r: 11.0, h: 19.0, x: -44, z: -28 },
      { r: 13.5, h: 23.0, x: -48, z: -8 },
      { r: 12.0, h: 21.0, x: -47, z: 14 },
      { r: 10.0, h: 17.0, x: -43, z: 28 }
    ];

    perimeterPeaks.forEach((p, idx) => {
      const pGeo = new THREE.ConeGeometry(p.r, p.h, 9);
      const pMat = mountainMaterials[idx % 3];
      const peak = new THREE.Mesh(pGeo, pMat);
      peak.position.set(p.x, p.h / 2 - 0.5, p.z);
      scene.add(peak);
    });

    // Outer rolling foothills connecting all gaps seamlessly
    for (let f = 0; f < 28; f++) {
      const angle = (f / 28) * Math.PI * 2;
      const dist = 58 + (f % 3) * 6;
      const fX = Math.cos(angle) * dist;
      const fZ = Math.sin(angle) * dist;
      const fH = 8.0 + (f % 4) * 3.5;
      const fR = 7.5 + (f % 3) * 2.5;

      const footGeo = new THREE.ConeGeometry(fR, fH, 7);
      const footMat = mountainMaterials[(f + 1) % 3];
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fX, fH / 2 - 0.5, fZ);
      scene.add(foot);
    }

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

    [-15, -11, -7, 2, 6, 10, 14, 18].forEach(rx => {
      scene.add(createPalm(rx, 8.5, 0.9 + Math.random() * 0.3));
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
      
      const baseGranite = new THREE.MeshStandardMaterial({ color: 0x1f1d1a, roughness: 0.95 });
      const mainStoneMat = new THREE.MeshStandardMaterial({ color: 0x6e5c4c, roughness: 0.85 });
      const detailStoneMat = new THREE.MeshStandardMaterial({ color: 0x826f5d, roughness: 0.80 });
      const terracottaAccent = new THREE.MeshStandardMaterial({ color: 0x944222, roughness: 0.75 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.96, roughness: 0.12 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.85, roughness: 0.25 });
      const redWallMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.75 });
      const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.75 });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x0d5c48, roughness: 0.1, metalness: 0.85 });

      // Plinth: Multi-layered tiered circular & octagonal granite pedestal with Kumuda torus molding
      const plinthBase = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.85, 0.22, 16), baseGranite);
      plinthBase.position.y = 0.11;
      plinthBase.receiveShadow = true;
      temple.add(plinthBase);

      const kumudaTorus = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.08, 8, 24), baseGranite);
      kumudaTorus.rotation.x = Math.PI / 2;
      kumudaTorus.position.y = 0.24;
      temple.add(kumudaTorus);

      const plinthTop = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.55, 0.18, 16), baseGranite);
      plinthTop.position.y = 0.35;
      temple.add(plinthTop);

      // Sacred Mathil Suvar (Perimeter Wall with vertical Red & White Namam Stripes & Curved Coping)
      const wallGroup = new THREE.Group();
      const numStripes = 16;
      const stripeW = 4.4 / numStripes;
      for (let s = 0; s < numStripes; s++) {
        const isRed = (s % 2 === 0);
        const mat = isRed ? redWallMat : whiteWallMat;
        const xPos = -2.2 + (s + 0.5) * stripeW;
        if (Math.abs(xPos) > 0.85) {
          const frontSeg = new THREE.Mesh(new THREE.BoxGeometry(stripeW, 0.75, 0.16), mat);
          frontSeg.position.set(xPos, 0.72, 1.8);
          frontSeg.castShadow = true;
          wallGroup.add(frontSeg);
        }
        const backSeg = new THREE.Mesh(new THREE.BoxGeometry(stripeW, 0.75, 0.16), mat);
        backSeg.position.set(xPos, 0.72, -1.8);
        wallGroup.add(backSeg);
      }
      // Rounded Coping Rails along top of walls
      const crestF = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 12), mainStoneMat);
      crestF.rotation.z = Math.PI / 2;
      crestF.position.set(0, 1.12, 1.8);
      wallGroup.add(crestF);
      const crestB = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 12), mainStoneMat);
      crestB.rotation.z = Math.PI / 2;
      crestB.position.set(0, 1.12, -1.8);
      wallGroup.add(crestB);

      // 4 Round Defensive Bastions at Wall Corners with Dome Caps
      const cornerOffsets = [
        { x: -2.2, z: 1.8 }, { x: 2.2, z: 1.8 },
        { x: -2.2, z: -1.8 }, { x: 2.2, z: -1.8 }
      ];
      cornerOffsets.forEach(co => {
        const bastion = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.1, 16), baseGranite);
        bastion.position.set(co.x, 0.65, co.z);
        bastion.castShadow = true;
        wallGroup.add(bastion);

        const domeCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), detailStoneMat);
        domeCap.position.set(co.x, 1.20, co.z);
        wallGroup.add(domeCap);
      });
      temple.add(wallGroup);

      // Grand Dravidian Arched Portal Gateway (Torana)
      const gatewayGroup = new THREE.Group();
      const jambL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.5, 12), detailStoneMat);
      jambL.position.set(-0.65, 0.95, 1.05);
      gatewayGroup.add(jambL);
      const jambR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.5, 12), detailStoneMat);
      jambR.position.set(0.65, 0.95, 1.05);
      gatewayGroup.add(jambR);

      // Carved Torus Column Capitals
      const capL = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 16), detailStoneMat);
      capL.rotation.x = Math.PI / 2;
      capL.position.set(-0.65, 1.68, 1.05);
      gatewayGroup.add(capL);
      const capR = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 16), detailStoneMat);
      capR.rotation.x = Math.PI / 2;
      capR.position.set(0.65, 1.68, 1.05);
      gatewayGroup.add(capR);

      // Multi-Cusped Torana Arch
      const toranaArch = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.14, 10, 24, Math.PI), detailStoneMat);
      toranaArch.position.set(0, 1.7, 1.05);
      gatewayGroup.add(toranaArch);

      const sanctumVoid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 12), new THREE.MeshBasicMaterial({ color: 0x050608 }));
      sanctumVoid.position.set(0, 0.95, 0.6);
      gatewayGroup.add(sanctumVoid);

      // Brass Carved Temple Doors
      const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.06), brassMat);
      doorL.position.set(-0.24, 0.9, 0.95);
      doorL.rotation.y = 0.35;
      gatewayGroup.add(doorL);
      const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.06), brassMat);
      doorR.position.set(0.24, 0.9, 0.95);
      doorR.rotation.y = -0.35;
      gatewayGroup.add(doorR);
      temple.add(gatewayGroup);

      // Inner Sanctum (Golden Vimana Tower behind Gopuram)
      const vimanaGroup = new THREE.Group();
      const vimanaDrum = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.25, 0.9, 8), mainStoneMat);
      vimanaDrum.position.set(0, 0.9, -0.6);
      vimanaDrum.castShadow = true;
      vimanaGroup.add(vimanaDrum);

      const vimanaCornice = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.05, 0.12, 8), terracottaAccent);
      vimanaCornice.position.set(0, 1.38, -0.6);
      vimanaGroup.add(vimanaCornice);

      const stupiDome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), goldMat);
      stupiDome.position.set(0, 1.44, -0.6);
      stupiDome.castShadow = true;
      vimanaGroup.add(stupiDome);

      const stupiKalasam = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.45, 12), goldMat);
      stupiKalasam.position.set(0, 2.35, -0.6);
      vimanaGroup.add(stupiKalasam);
      temple.add(vimanaGroup);

      const signTex = createSignboardTexture(
        'SRI MEENAKSHI AMMAN TEMPLE',
        'MADURAI HERITAGE • 2,500 YRS • 14 SACRED GOPURAMS',
        '#160e0a',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.55), signMat);
      sign.position.set(0, 2.05, 1.12);
      temple.add(sign);

      // 7-Tier Sculpted Dravidian Raja Gopuram (Parabolic 4-sided Frustums with Kudu Arches & Corner Stupis)
      let currentY = 2.25;
      let baseRadius = 1.85;
      for (let t = 0; t < 7; t++) {
        const tierHeight = 0.38;
        const topRadius = baseRadius - 0.18;
        
        // 4-sided trapezoidal pyramidal frustum
        const tierGeo = new THREE.CylinderGeometry(topRadius, baseRadius, tierHeight, 4, 1, false, Math.PI / 4);
        const tierMat = (t % 2 === 0) ? mainStoneMat : detailStoneMat;
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = currentY + tierHeight / 2;
        tier.castShadow = true;
        temple.add(tier);

        // Flaring curved kapota cornice eave
        const eaveGeo = new THREE.CylinderGeometry(baseRadius + 0.15, baseRadius + 0.18, 0.08, 4, 1, false, Math.PI / 4);
        const eave = new THREE.Mesh(eaveGeo, terracottaAccent);
        eave.position.y = currentY + tierHeight;
        temple.add(eave);

        // Horseshoe Kudu dormer arches on faces
        const kuduL = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.028, 8, 16, Math.PI), detailStoneMat);
        kuduL.position.set(-topRadius * 0.45, currentY + tierHeight * 0.55, topRadius * 0.72);
        temple.add(kuduL);
        const kuduR = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.028, 8, 16, Math.PI), detailStoneMat);
        kuduR.position.set(topRadius * 0.45, currentY + tierHeight * 0.55, topRadius * 0.72);
        temple.add(kuduR);

        // Miniature corner Stupis on all 4 corners
        const cornerDist = baseRadius * 0.7;
        const cornerSigns = [
          [-cornerDist, cornerDist], [cornerDist, cornerDist],
          [-cornerDist, -cornerDist], [cornerDist, -cornerDist]
        ];
        cornerSigns.forEach(cs => {
          const mStupi = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), goldMat);
          mStupi.position.set(cs[0], currentY + tierHeight + 0.05, cs[1]);
          temple.add(mStupi);
        });

        currentY += tierHeight;
        baseRadius = topRadius;
      }

      // Vaulted Barrel Roof (Sala-Shikhara)
      const salaLength = baseRadius * 1.8;
      const salaGeo = new THREE.CylinderGeometry(0.35, 0.50, salaLength, 16, 1, false, 0, Math.PI);
      const sala = new THREE.Mesh(salaGeo, mainStoneMat);
      sala.rotation.z = Math.PI / 2;
      sala.rotation.y = Math.PI / 2;
      sala.position.y = currentY + 0.32;
      sala.castShadow = true;
      temple.add(sala);

      // Gavaksha Arched End Gables
      const gableL = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 8, 16, Math.PI), detailStoneMat);
      gableL.position.set(-salaLength / 2, currentY + 0.32, 0);
      gableL.rotation.y = Math.PI / 2;
      temple.add(gableL);
      const gableR = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 8, 16, Math.PI), detailStoneMat);
      gableR.position.set(salaLength / 2, currentY + 0.32, 0);
      gableR.rotation.y = -Math.PI / 2;
      temple.add(gableR);

      // 5 Lathed Golden Kalasams (Flared Lotus Base + Spherical Pot + Conical Spire)
      for (let k = -2; k <= 2; k++) {
        const kalasamGroup = new THREE.Group();
        const padma = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.10, 16), goldMat);
        padma.rotation.x = Math.PI;
        padma.position.y = 0.05;
        kalasamGroup.add(padma);
        const pot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), goldMat);
        pot.position.y = 0.16;
        kalasamGroup.add(pot);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 12), goldMat);
        spire.position.y = 0.38;
        kalasamGroup.add(spire);

        kalasamGroup.position.set(k * 0.22, currentY + 0.62, 0);
        temple.add(kalasamGroup);
      }

      // Warm Ghee Diya Illumination at Entrance
      const diyaLight = new THREE.PointLight(0xffa033, 2.8, 8);
      diyaLight.position.set(0, 1.4, 1.4);
      temple.add(diyaLight);

      const diyaL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.12, 12), brassMat);
      diyaL.position.set(-0.75, 0.45, 1.25);
      temple.add(diyaL);
      const diyaR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.12, 12), brassMat);
      diyaR.position.set(0.75, 0.45, 1.25);
      temple.add(diyaR);

      // Sacred Golden Lotus Pond (Potramarai Kulam)
      const tankGroup = new THREE.Group();
      const tankPlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 0.2, 16), baseGranite);
      tankPlinth.position.set(2.4, 0.10, 0);
      tankGroup.add(tankPlinth);

      const tankRim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 8, 20), baseGranite);
      tankRim.rotation.x = Math.PI / 2;
      tankRim.position.set(2.4, 0.21, 0);
      tankGroup.add(tankRim);

      const tankWater = new THREE.Mesh(new THREE.CircleGeometry(0.92, 16), waterMat);
      tankWater.rotation.x = -Math.PI / 2;
      tankWater.position.set(2.4, 0.19, 0);
      tankGroup.add(tankWater);

      const lotusPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.4, 10), brassMat);
      lotusPillar.position.set(2.4, 0.35, 0);
      tankGroup.add(lotusPillar);

      const lotus = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.26, 12), goldMat);
      lotus.position.set(2.4, 0.58, 0);
      tankGroup.add(lotus);
      temple.add(tankGroup);

      const badge = createBixiPopupBadge('Meenakshi Amman Kovil', 'Temple Wonder');
      badge.position.set(0, 6.8, 0);
      badge.userData.baseY = 6.8;
      temple.add(badge);
      popupBadges['meenakshi'] = badge;

      return temple;
    }

    const meenakshiModel = createMeenakshiTemple();
    meenakshiModel.position.set(-7.5, 0, 1.2);
    meenakshiModel.rotation.y = Math.PI / 2; // Faces East towards Road
    scene.add(meenakshiModel);

    // B. ALANGANALLUR VADIVASAL & REALISTIC KANGAYAM JALLIKATTU BULL (SOLO MAJESTIC BULL)
    let bullMesh = null;
    let bullLegs = [];
    let bullHead = null;
    let bullTail = null;

    function createAlanganallurVadivasal() {
      const arena = new THREE.Group();
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x8a3818, roughness: 0.72 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x422a18, roughness: 0.88 });
      const sandMat = new THREE.MeshStandardMaterial({ color: 0x967450, roughness: 0.95 });
      const bullMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.55, metalness: 0.18 });
      const muzzleMat = new THREE.MeshStandardMaterial({ color: 0x23252b, roughness: 0.65 });
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xdcd8d0, roughness: 0.30, metalness: 0.1 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.9, roughness: 0.2 });
      const hoofMat = new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.9 });

      // Circular Sandy Arena Floor
      const sandFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.0, 0.12, 32), sandMat);
      sandFloor.position.set(0, 0.06, 0.5);
      sandFloor.receiveShadow = true;
      arena.add(sandFloor);

      // Historic Vadivasal Brick Gateway (Positioned at rear of arena so camera never clips)
      const gateGroup = new THREE.Group();
      const pierL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 16), brickMat);
      pierL.position.set(-1.6, 1.4, 2.2);
      gateGroup.add(pierL);
      const pierR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 16), brickMat);
      pierR.position.set(1.6, 1.4, 2.2);
      gateGroup.add(pierR);

      const ballL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), brickMat);
      ballL.position.set(-1.6, 2.95, 2.2);
      gateGroup.add(ballL);
      const ballR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), brickMat);
      ballR.position.set(1.6, 2.95, 2.2);
      gateGroup.add(ballR);

      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.22, 10, 24, Math.PI), brickMat);
      arch.position.set(0, 2.8, 2.2);
      gateGroup.add(arch);

      const eaveRoof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.48, 4), new THREE.MeshStandardMaterial({ color: 0xa84218, roughness: 0.65 }));
      eaveRoof.rotation.y = Math.PI / 4;
      eaveRoof.position.set(0, 3.32, 2.2);
      gateGroup.add(eaveRoof);
      arena.add(gateGroup);

      // Spectator Log Rails
      for (let side = -1; side <= 1; side += 2) {
        for (let post = 0; post < 4; post++) {
          const log = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 1.85, 10), woodMat);
          const zPos = 2.0 - post * 0.7;
          log.position.set(side * 1.85, 0.92, zPos);
          log.rotation.z = side * 0.08;
          arena.add(log);
        }
        const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 8), woodMat);
        rail1.rotation.x = Math.PI / 2;
        rail1.position.set(side * 1.85, 0.65, 0.9);
        arena.add(rail1);
        const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 8), woodMat);
        rail2.rotation.x = Math.PI / 2;
        rail2.position.set(side * 1.85, 1.25, 0.9);
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
      sign.position.set(0, 2.45, 2.35);
      arena.add(sign);

      // =======================================================================
      // REALISTIC KANGAYAM JALLIKATTU BULL (ANATOMICALLY ACCURATE)
      // =======================================================================
      const bullGroup = new THREE.Group();

      // Muscular Torso & Deep Chest
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.40, 1.35, 16), bullMat);
      torso.rotation.x = Math.PI / 2;
      torso.position.set(0, 0.92, 0);
      torso.castShadow = true;
      bullGroup.add(torso);

      // Iconic Kangayam Muscular Shoulder Hump (திமில்)
      const hump = new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 16), bullMat);
      hump.scale.set(0.78, 1.32, 1.15);
      hump.position.set(0, 1.38, 0.38);
      hump.castShadow = true;
      bullGroup.add(hump);

      // Thick Arched Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.38, 0.60, 14), bullMat);
      neck.rotation.x = -Math.PI / 3.8;
      neck.position.set(0, 1.14, 0.72);
      bullGroup.add(neck);

      // Curved Dewlap Skin Folds
      const dewlap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.16, 0.55, 8), muzzleMat);
      dewlap.rotation.x = -Math.PI / 3.4;
      dewlap.position.set(0, 0.84, 0.68);
      bullGroup.add(dewlap);

      // Ceremonial Brass Bell Collar (Mani Malai)
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 20), brassMat);
      collar.rotation.x = Math.PI / 2.8;
      collar.position.set(0, 0.98, 0.64);
      bullGroup.add(collar);

      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.10, 10), brassMat);
      bell.position.set(0, 0.76, 0.68);
      bullGroup.add(bell);

      // Anatomical Bovine Head (Broad Skull + Flat Muzzle with Bovine Nostrils)
      const headGroup = new THREE.Group();

      const skull = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.28), bullMat);
      skull.position.set(0, 0.08, 0);
      headGroup.add(skull);

      // Flat Bovine Muzzle (NOT a pointed beak cone!)
      const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.28), muzzleMat);
      muzzle.position.set(0, 0, 0.24);
      headGroup.add(muzzle);

      // Wide Flat Nostrils
      const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x07080a });
      const nostrilL = new THREE.Mesh(new THREE.CircleGeometry(0.028, 8), nostrilMat);
      nostrilL.position.set(-0.065, -0.02, 0.382);
      headGroup.add(nostrilL);
      const nostrilR = new THREE.Mesh(new THREE.CircleGeometry(0.028, 8), nostrilMat);
      nostrilR.position.set(0.065, -0.02, 0.382);
      headGroup.add(nostrilR);

      // Dark Bovine Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), nostrilMat);
      eyeL.position.set(-0.17, 0.12, 0.10);
      headGroup.add(eyeL);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), nostrilMat);
      eyeR.position.set(0.17, 0.12, 0.10);
      headGroup.add(eyeR);

      // Drooping Bovine Ears
      for (let side = -1; side <= 1; side += 2) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.20, 8), bullMat);
        ear.rotation.z = side * 1.25;
        ear.rotation.y = 0.2;
        ear.position.set(side * 0.22, 0.08, -0.04);
        headGroup.add(ear);
      }

      // =======================================================================
      // AUTHENTIC LYRE-SHAPED CRESCENT HORNS (SMOOTH 3D TUBE SPLINES)
      // =======================================================================
      const hornCurveL = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.12, 0.18, 0.05),
        new THREE.Vector3(-0.35, 0.32, -0.05),
        new THREE.Vector3(-0.42, 0.62, 0.08),
        new THREE.Vector3(-0.25, 0.85, 0.18)
      ]);
      const hornGeoL = new THREE.TubeGeometry(hornCurveL, 24, 0.055, 10, false);
      const hornMeshL = new THREE.Mesh(hornGeoL, hornMat);
      headGroup.add(hornMeshL);

      const hornCurveR = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.12, 0.18, 0.05),
        new THREE.Vector3(0.35, 0.32, -0.05),
        new THREE.Vector3(0.42, 0.62, 0.08),
        new THREE.Vector3(0.25, 0.85, 0.18)
      ]);
      const hornGeoR = new THREE.TubeGeometry(hornCurveR, 24, 0.055, 10, false);
      const hornMeshR = new THREE.Mesh(hornGeoR, hornMat);
      headGroup.add(hornMeshR);

      headGroup.position.set(0, 1.25, 1.05);
      bullGroup.add(headGroup);

      // 4 Athletic Legs with Hock Joints and Hooves
      bullLegs = [];
      const legOffsets = [
        { x: -0.24, z: 0.44 }, { x: 0.24, z: 0.44 },
        { x: -0.22, z: -0.44 }, { x: 0.22, z: -0.44 }
      ];
      legOffsets.forEach(lo => {
        const legGroup = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.45, 12), bullMat);
        thigh.position.y = -0.22;
        legGroup.add(thigh);

        const hock = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bullMat);
        hock.position.y = -0.42;
        legGroup.add(hock);

        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.38, 10), bullMat);
        shin.position.y = -0.60;
        legGroup.add(shin);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.12, 12), hoofMat);
        hoof.position.y = -0.80;
        legGroup.add(hoof);

        legGroup.position.set(lo.x, 0.88, lo.z);
        bullGroup.add(legGroup);
        bullLegs.push(legGroup);
      });

      // Tail with Brush Tuft
      const tailGroup = new THREE.Group();
      const tailStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.75, 8), bullMat);
      tailStem.position.y = -0.36;
      tailGroup.add(tailStem);

      const tailTuft = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.26, 8), hoofMat);
      tailTuft.position.y = -0.76;
      tailGroup.add(tailTuft);

      tailGroup.position.set(0, 0.92, -0.68);
      tailGroup.rotation.x = -0.25;
      bullGroup.add(tailGroup);

      bullMesh = bullGroup;
      bullHead = headGroup;
      bullTail = tailGroup;
      bullGroup.position.set(0, 0, 0.3);
      arena.add(bullGroup);

      // Elevated Popup Badge (Floats at y = 6.0 in clear sky, depthTest: false)
      const badge = createBixiPopupBadge('Alanganallur Vadivasal', 'Jallikattu Arena');
      badge.position.set(0, 6.0, 1.8);
      badge.userData.baseY = 6.0;
      arena.add(badge);
      popupBadges['alanganallur-vadivasal'] = badge;

      return arena;
    }

    const vadivasalModel = createAlanganallurVadivasal();
    vadivasalModel.position.set(-3.2, 0, 5.8);
    vadivasalModel.rotation.y = Math.PI * 0.15;
    scene.add(vadivasalModel);

    // C. LUCKY MESS (TRADITIONAL VILLAGE MESS WITH MANGALORE BARREL RIDGE TILES & TURNED TEAK PILLARS)
    function createLuckyMess() {
      const mess = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x36281e, roughness: 0.85 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x4f311c, roughness: 0.82 });
      const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0xaa4218, roughness: 0.62 });
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.92 });
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d8a3a, roughness: 0.65 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.85, roughness: 0.25 });
      const clayMat = new THREE.MeshStandardMaterial({ color: 0x8a3818, roughness: 0.85 });

      // Raised Veranda Plinth with Bullnose Rounded Edges
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.35, 0.24, 16), plinthMat);
      plinth.position.set(0, 0.12, 0);
      plinth.receiveShadow = true;
      mess.add(plinth);

      const plinthEdge = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.06, 8, 20), plinthMat);
      plinthEdge.rotation.x = Math.PI / 2;
      plinthEdge.position.set(0, 0.24, 0);
      mess.add(plinthEdge);

      // Veranda Colonnade: Turned Chettinad Teakwood Pillars with Carved Torus Rings
      for (let p = -1.4; p <= 1.4; p += 0.7) {
        const pillarGroup = new THREE.Group();
        const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.18, 12), plinthMat);
        pBase.position.y = 0.09;
        pillarGroup.add(pBase);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.25, 12), woodMat);
        shaft.position.y = 0.72;
        pillarGroup.add(shaft);

        // 3 Carved Torus Molding Rings on Shaft
        for (let r = 0; r < 3; r++) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), woodMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.4 + r * 0.35;
          pillarGroup.add(ring);
        }

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.12, 12), woodMat);
        cap.position.y = 1.38;
        pillarGroup.add(cap);

        pillarGroup.position.set(p, 0.24, 0.85);
        pillarGroup.castShadow = true;
        mess.add(pillarGroup);
      }

      // Inner Village Mess Building (Rear Enclosure)
      const mainBuilding = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 1.45, 12), wallMat);
      mainBuilding.position.set(0, 0.86, -0.3);
      mainBuilding.castShadow = true;
      mess.add(mainBuilding);

      // Pitched Mangalore Terracotta Hip Roof
      const hipRoof = new THREE.Mesh(new THREE.ConeGeometry(2.35, 1.15, 4), tileRoofMat);
      hipRoof.rotation.y = Math.PI / 4;
      hipRoof.position.set(0, 2.15, 0.1);
      hipRoof.castShadow = true;
      mess.add(hipRoof);

      // Half-Pipe Clay Ridge Tiles along the 4 Hip Ridges
      for (let h = 0; h < 4; h++) {
        const ridgeAngle = (h * Math.PI) / 2 + Math.PI / 4;
        const ridgeTiles = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8, 1, false, 0, Math.PI), tileRoofMat);
        ridgeTiles.position.set(Math.cos(ridgeAngle) * 0.9, 2.1, 0.1 + Math.sin(ridgeAngle) * 0.9);
        ridgeTiles.rotation.y = -ridgeAngle;
        ridgeTiles.rotation.z = 0.45;
        mess.add(ridgeTiles);
      }

      // Round Earthenware Clay Water Pots (Kudam)
      for (let cp = -1; cp <= 1; cp += 2) {
        const potGroup = new THREE.Group();
        const potBelly = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 12), clayMat);
        potBelly.position.y = 0.20;
        potGroup.add(potBelly);

        const potNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.12, 10), clayMat);
        potNeck.position.y = 0.36;
        potGroup.add(potNeck);

        const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 12), clayMat);
        potRim.rotation.x = Math.PI / 2;
        potRim.position.y = 0.42;
        potGroup.add(potRim);

        potGroup.position.set(cp * 1.6, 0.24, 0.7);
        mess.add(potGroup);
      }

      // Traditional Tall Brass Kuthuvilakku Lamp
      const lampGroup = new THREE.Group();
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 12), brassMat);
      lampGroup.add(lampBase);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.75, 10), brassMat);
      lampStem.position.y = 0.42;
      lampGroup.add(lampStem);
      const oilTier = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.08, 12), brassMat);
      oilTier.rotation.x = Math.PI;
      oilTier.position.y = 0.80;
      lampGroup.add(oilTier);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffaa22 }));
      flame.position.y = 0.86;
      lampGroup.add(flame);
      lampGroup.position.set(0, 0.24, 0.95);
      mess.add(lampGroup);

      // Banana Leaf Dining Table
      const diningTable = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.45, 12), woodMat);
      diningTable.position.set(0, 0.48, -0.2);
      mess.add(diningTable);

      for (let bl = -0.4; bl <= 0.4; bl += 0.4) {
        const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.18, 12), leafMat);
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(bl, 0.72, -0.2);
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
      sign.position.set(0, 1.48, 1.15);
      mess.add(sign);

      const interiorLight = new THREE.PointLight(0xffa500, 2.5, 6);
      interiorLight.position.set(0, 1.1, 0.3);
      mess.add(interiorLight);

      const badge = createBixiPopupBadge('Lucky Mess', 'Village Feast');
      badge.position.set(0, 5.8, 0.1);
      badge.userData.baseY = 5.8;
      mess.add(badge);
      popupBadges['lucky-mess'] = badge;

      return mess;
    }

    const luckyMessModel = createLuckyMess();
    luckyMessModel.position.set(2.4, 0, 6.0);
    luckyMessModel.rotation.y = 0; // Facing South toward Road
    scene.add(luckyMessModel);

    // D. POWER KADAI & MADURAI BUN PAROTTA (CIRCULAR IRON TAVA + SPIRAL BUN PAROTTAS + CHIMNEY SMOKE)
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

      // Round Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.3, 0.2, 16), darkMat);
      plinth.position.y = 0.1;
      hotel.add(plinth);

      // Curved Shop Enclosure
      const mainShop = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 1.6, 16), brickMat);
      mainShop.position.set(0, 0.9, -0.3);
      hotel.add(mainShop);

      // Fluted Cylindrical Street Canopy
      const awning = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 0.12, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x3d4f5c, metalness: 0.7, roughness: 0.4 }));
      awning.position.set(0, 1.75, 0.4);
      awning.rotation.x = 0.2;
      hotel.add(awning);

      // Curved Dining Counter
      const counter = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.25, 0.75, 16, 1, false, 0, Math.PI), darkMat);
      counter.position.set(0, 0.5, 0.5);
      hotel.add(counter);

      // Circular Heavy Cast-Iron Parotta Tava with Raised Outer Lip
      const tavaDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.08, 24), tavaMat);
      tavaDisc.position.set(-0.35, 0.92, 0.7);
      hotel.add(tavaDisc);

      const tavaLip = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.04, 8, 24), tavaMat);
      tavaLip.rotation.x = Math.PI / 2;
      tavaLip.position.set(-0.35, 0.96, 0.7);
      hotel.add(tavaLip);

      // Sizzling Golden Bun Parottas (Multi-Layer Spiral Torus Rings)
      const p1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.05, 10, 16), parottaMat);
      p1.rotation.x = Math.PI / 2;
      p1.position.set(-0.45, 0.98, 0.65);
      hotel.add(p1);

      const p2 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.05, 10, 16), parottaMat);
      p2.rotation.x = Math.PI / 2;
      p2.position.set(-0.25, 0.98, 0.75);
      hotel.add(p2);

      // Master Parotta Chef with Tall Toque Hat
      const chefGroup = new THREE.Group();
      const chefBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.65, 10), apronMat);
      chefBody.position.set(0.45, 0.9, 0.25);
      chefGroup.add(chefBody);

      const chefHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), chefSkin);
      chefHead.position.set(0.45, 1.32, 0.25);
      chefGroup.add(chefHead);

      const chefCap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.22, 12), apronMat);
      chefCap.position.set(0.45, 1.50, 0.25);
      chefGroup.add(chefCap);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.45, 8), chefSkin);
      arm.position.set(0.25, 1.05, 0.5);
      arm.rotation.z = Math.PI / 3;
      chefGroup.add(arm);
      hotel.add(chefGroup);

      // Conical Exhaust Hood Canopy & Tall Cylindrical Smoke Chimney
      const hood = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.45, 16, 1, true), chromeMat);
      hood.position.set(1.2, 1.85, -0.6);
      hotel.add(hood);

      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 14), chromeMat);
      chimney.position.set(1.2, 2.5, -0.6);
      hotel.add(chimney);

      const chimneyCowl = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.12, 12), chromeMat);
      chimneyCowl.position.set(1.2, 3.46, -0.6);
      hotel.add(chimneyCowl);

      const smokeGroup = new THREE.Group();
      const smokeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5, roughness: 1.0 });
      for (let sm = 0; sm < 5; sm++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.14 + sm * 0.04, 8, 8), smokeMat);
        puff.position.set(1.2, 3.6 + sm * 0.28, -0.6 + sm * 0.05);
        puff.userData = { baseY: 3.6 + sm * 0.28, offset: sm * 0.8 };
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
      sign.position.set(0, 1.78, 1.05);
      hotel.add(sign);

      const nightLight = new THREE.PointLight(0xffaa22, 2.8, 7);
      nightLight.position.set(-0.35, 1.2, 0.8);
      hotel.add(nightLight);

      const badge = createBixiPopupBadge('Power Kadai', 'Iconic Street Food');
      badge.position.set(0, 5.8, 0);
      badge.userData.baseY = 5.8;
      hotel.add(badge);
      popupBadges['power-kadai'] = badge;

      return hotel;
    }

    const powerKadaiModel = createPowerKadai();
    powerKadaiModel.position.set(7.6, 0, 1.0);
    powerKadaiModel.rotation.y = -Math.PI / 2; // Facing West toward Road
    scene.add(powerKadaiModel);

    // E. GANDHI MEMORIAL PALACE MUSEUM (TAMUKKAM NAYAK PALACE - FLUTED COLONNADE & PALACE DOME)
    function createGandhiMuseum() {
      const museum = new THREE.Group();
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x222632, roughness: 0.85 });
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd2c6b4, roughness: 0.72 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xb56338, metalness: 0.82, roughness: 0.28 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });

      // Stepped Circular Granite Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.28, 20), plinthMat);
      plinth.position.y = 0.14;
      plinth.receiveShadow = true;
      museum.add(plinth);

      // Central Nayak Palace Hall
      const mainHall = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 1.45, 16), stoneMat);
      mainHall.position.set(0, 0.95, -0.2);
      mainHall.castShadow = true;
      museum.add(mainHall);

      // Fluted Cylindrical Colonnade with Carved Torus Capitals & Arches
      const numCols = 8;
      const colRadius = 1.9;
      for (let c = 0; c < numCols; c++) {
        const colAngle = (c / (numCols - 1)) * Math.PI * 0.8 - Math.PI * 0.4;
        const colX = Math.sin(colAngle) * colRadius;
        const colZ = Math.cos(colAngle) * colRadius;

        const pillarGroup = new THREE.Group();
        const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.12, 12), stoneMat);
        pBase.position.y = 0.06;
        pillarGroup.add(pBase);

        // Fluted column shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.35, 16), stoneMat);
        shaft.position.y = 0.75;
        pillarGroup.add(shaft);

        // Carved Torus Capital
        const cap = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.03, 6, 12), stoneMat);
        cap.rotation.x = Math.PI / 2;
        cap.position.y = 1.45;
        pillarGroup.add(cap);

        pillarGroup.position.set(colX, 0.28, colZ);
        pillarGroup.castShadow = true;
        museum.add(pillarGroup);
      }

      // Connecting Scalloped Palace Arches
      for (let a = -1.2; a <= 1.2; a += 0.6) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 16, Math.PI), stoneMat);
        arch.position.set(a, 1.70, 1.15);
        museum.add(arch);
      }

      // Cylindrical Drum Base for Dome
      const domeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.4, 20), stoneMat);
      domeDrum.position.set(0, 1.85, -0.2);
      museum.add(domeDrum);

      // Ribbed Grand Hemispherical Palace Dome
      const domeHemisphere = new THREE.Mesh(new THREE.SphereGeometry(0.90, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      domeHemisphere.position.set(0, 2.05, -0.2);
      domeHemisphere.castShadow = true;
      museum.add(domeHemisphere);

      // Octagonal Lantern Cupola & Golden Needle Spire
      const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.35, 8), stoneMat);
      cupola.position.set(0, 2.98, -0.2);
      museum.add(cupola);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.65, 12), goldMat);
      finial.position.set(0, 3.45, -0.2);
      museum.add(finial);

      // Nayak Courtyard Fountain Pool
      const fountainRim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 8, 20), stoneMat);
      fountainRim.rotation.x = Math.PI / 2;
      fountainRim.position.set(0, 0.32, 1.7);
      museum.add(fountainRim);

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
      badge.position.set(0, 6.5, -0.2);
      badge.userData.baseY = 6.5;
      museum.add(badge);
      popupBadges['gandhi-museum'] = badge;

      return museum;
    }

    const museumModel = createGandhiMuseum();
    museumModel.position.set(6.2, 0, -5.4);
    museumModel.rotation.y = -Math.PI * 0.75; // Facing North-West toward Road
    scene.add(museumModel);

    // F. ALAGAR KOVIL (KALLAZHAGAR SACRED TEMPLE - STEPPED OCTAGONAL VIMANA & ROCKY OUTCROP)
    function createAlagarTemple() {
      const temple = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e5a4a, roughness: 0.85 });
      const detailStoneMat = new THREE.MeshStandardMaterial({ color: 0x826f5d, roughness: 0.80 });
      const terracottaAccent = new THREE.MeshStandardMaterial({ color: 0x944222, roughness: 0.75 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.96, roughness: 0.12 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.85, roughness: 0.25 });
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x147892, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.92 });
      const boulderMat = new THREE.MeshStandardMaterial({ color: 0x363832, roughness: 0.95, flatShading: true });

      // Rocky Mountain Outcrops (Alagar Malai foothills)
      const rockCoords = [
        { x: -2.6, y: 0.5, z: -1.8, s: 1.1 },
        { x: -3.0, y: 0.7, z: -0.6, s: 1.2 },
        { x: 2.8,  y: 0.5, z: -1.6, s: 1.15 },
        { x: 2.4,  y: 0.4, z: -0.4, s: 0.95 }
      ];
      rockCoords.forEach(rc => {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rc.s, 1), boulderMat);
        rock.position.set(rc.x, rc.y, rc.z);
        rock.castShadow = true;
        temple.add(rock);
      });

      // Stepped Granite Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.28, 16), stoneMat);
      plinth.position.y = 0.14;
      plinth.receiveShadow = true;
      temple.add(plinth);

      // Pillared Mandapam Entrance with Stone Steps
      const mandapam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.1, 12), stoneMat);
      mandapam.position.set(0, 0.68, 0.2);
      mandapam.castShadow = true;
      temple.add(mandapam);

      // Carved Entrance Pillars
      for (let p = -0.8; p <= 0.8; p += 0.8) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 1.1, 10), detailStoneMat);
        pillar.position.set(p, 0.68, 1.2);
        temple.add(pillar);
      }

      // =======================================================================
      // 5-TIER SCULPTED DRAVIDIAN HILL TEMPLE GOPURAM
      // =======================================================================
      let currentY = 1.24;
      let baseR = 1.65;
      for (let t = 0; t < 5; t++) {
        const tierH = 0.42;
        const topR = baseR - 0.20;

        // Sloping 4-sided trapezoidal pyramidal tier
        const tierGeo = new THREE.CylinderGeometry(topR, baseR, tierH, 4, 1, false, Math.PI / 4);
        const tierMat = (t % 2 === 0) ? stoneMat : detailStoneMat;
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = currentY + tierH / 2;
        tier.castShadow = true;
        temple.add(tier);

        // Projecting Kapota Cornice
        const cornice = new THREE.Mesh(new THREE.CylinderGeometry(baseR + 0.14, baseR + 0.16, 0.08, 4, 1, false, Math.PI / 4), terracottaAccent);
        cornice.position.y = currentY + tierH;
        temple.add(cornice);

        // Arched Gavaksha niches on front face
        const kudu = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.03, 6, 12, Math.PI), detailStoneMat);
        kudu.position.set(0, currentY + tierH * 0.55, topR * 0.75);
        temple.add(kudu);

        currentY += tierH;
        baseR = topR;
      }

      // Barrel-Vaulted Wagon Roof (Sala Shikhara)
      const salaLength = baseR * 1.8;
      const sala = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, salaLength, 14, 1, false, 0, Math.PI), stoneMat);
      sala.rotation.z = Math.PI / 2;
      sala.rotation.y = Math.PI / 2;
      sala.position.y = currentY + 0.28;
      sala.castShadow = true;
      temple.add(sala);

      // 5 Gleaming Golden Kalasams
      for (let k = -2; k <= 2; k++) {
        const kalasamGroup = new THREE.Group();
        const pot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), goldMat);
        pot.position.y = 0.12;
        kalasamGroup.add(pot);

        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.32, 10), goldMat);
        spire.position.y = 0.30;
        kalasamGroup.add(spire);

        kalasamGroup.position.set(k * 0.18, currentY + 0.52, 0);
        temple.add(kalasamGroup);
      }

      // Golden Dhwaja Stambham (Sacred Temple Flagstaff)
      const flagGroup = new THREE.Group();
      const mastBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12), brassMat);
      mastBase.position.y = 0.18;
      flagGroup.add(mastBase);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.08, 3.4, 12), goldMat);
      mast.position.y = 1.85;
      flagGroup.add(mast);

      for (let fr = 0; fr < 3; fr++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 6, 12), goldMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1.2 + fr * 0.75;
        flagGroup.add(ring);
      }

      flagGroup.position.set(1.5, 0.28, -1.5);
      temple.add(flagGroup);

      // Sacred Noopura Gangai Spring Chute & Lotus Pushkarani
      const streamGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.4, 12, 1, false, 0, Math.PI);
      const stream = new THREE.Mesh(streamGeo, waterMat);
      stream.rotation.x = Math.PI / 2;
      stream.position.set(-2.0, 0.18, -1.0);
      temple.add(stream);

      const cistern = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.30, 16), stoneMat);
      cistern.position.set(-2.0, 0.15, 0.4);
      temple.add(cistern);

      const cisternWater = new THREE.Mesh(new THREE.CircleGeometry(0.52, 16), waterMat);
      cisternWater.rotation.x = -Math.PI / 2;
      cisternWater.position.set(-2.0, 0.28, 0.4);
      temple.add(cisternWater);

      const signTex = createSignboardTexture(
        'ALAGAR KOVIL (KALLAZHAGAR)',
        'SACRED HILL TEMPLE • CHITHIRAI FESTIVAL',
        '#160a04',
        '#ffffff',
        '#ff9933'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), signMat);
      sign.position.set(0, 1.45, -1.25);
      temple.add(sign);

      // Elevated Popup Badge (Floats at y = 6.5 in clear sky, depthTest: false)
      const badge = createBixiPopupBadge('Alagar Kovil', 'Sacred Hill Temple');
      badge.position.set(0, 6.5, 0);
      badge.userData.baseY = 6.5;
      temple.add(badge);
      popupBadges['alagar-kovil'] = badge;

      return temple;
    }

    const alagarModel = createAlagarTemple();
    alagarModel.position.set(-4.8, 0, -5.2);
    alagarModel.rotation.y = Math.PI * 0.25;
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
    // 7. AUTHENTIC 3D MARUTI SWIFT HATCHBACK (METALLIC BIXI ORANGE + FLOATING ROOF + ALLOY WHEELS)
    const carGroup = new THREE.Group();

    // High-Gloss Automotive Metallic Paint (Signature BIXI Sunset Orange)
    const carPaintMat = new THREE.MeshStandardMaterial({
      color: 0xeb6b12,
      metalness: 0.88,
      roughness: 0.16
    });

    // Gloss Black Trim for Floating Roof (A/B/C Pillars & Mirror Mounts)
    const glossBlackMat = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      metalness: 0.8,
      roughness: 0.2
    });

    // Dark Tinted Automotive Glass with Specular Reflection
    const carGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1e2d42,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 0.88
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.12
    });

    // Sculpted Main Chassis & Aerodynamic Beltline
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.24, 1.48), carPaintMat);
    chassis.position.y = 0.22;
    chassis.castShadow = true;
    carGroup.add(chassis);

    // Sculpted Front Clamshell Hood (Sloping forward aerodynamically)
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.42), carPaintMat);
    hood.position.set(0, 0.25, 0.62);
    hood.rotation.x = 0.12;
    carGroup.add(hood);

    // Front Bumper with Hexagonal Mesh Grille & Chrome Slat
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.16, 0.15), carPaintMat);
    frontBumper.position.set(0, 0.16, 0.82);
    carGroup.add(frontBumper);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.05), glossBlackMat);
    grille.position.set(0, 0.18, 0.88);
    carGroup.add(grille);

    const grilleChrome = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.015, 0.06), chromeMat);
    grilleChrome.position.set(0, 0.18, 0.885);
    carGroup.add(grilleChrome);

    // Iconic "Floating Roof" Architecture (Gloss Black Greenhouse Pillars)
    const cabinPillars = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.24, 0.78), glossBlackMat);
    cabinPillars.position.set(0, 0.42, -0.05);
    carGroup.add(cabinPillars);

    // Raked Front Windshield
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.04), carGlassMat);
    frontWindshield.position.set(0, 0.42, 0.32);
    frontWindshield.rotation.x = -0.52;
    carGroup.add(frontWindshield);

    // Rear Windshield Hatch
    const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.20, 0.04), carGlassMat);
    rearWindshield.position.set(0, 0.42, -0.42);
    rearWindshield.rotation.x = 0.45;
    carGroup.add(rearWindshield);

    // Side Window Panels
    const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.68), carGlassMat);
    sideGlassL.position.set(-0.31, 0.42, -0.05);
    carGroup.add(sideGlassL);
    const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.68), carGlassMat);
    sideGlassR.position.set(0.31, 0.42, -0.05);
    carGroup.add(sideGlassR);

    // Body-Colored Roof Canopy with Integrated Rear Spoiler Lip
    const roof = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.82), carPaintMat);
    roof.position.set(0, 0.54, -0.06);
    carGroup.add(roof);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.03, 0.12), glossBlackMat);
    spoiler.position.set(0, 0.54, -0.48);
    spoiler.rotation.x = -0.15;
    carGroup.add(spoiler);

    // Aerodynamic Wing Mirrors
    for (let side = -1; side <= 1; side += 2) {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.07), carPaintMat);
      mirror.position.set(side * 0.38, 0.40, 0.24);
      carGroup.add(mirror);
    }

    // Swept-Back Projector LED Headlamps (Clear Casing + White Projector Lens)
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlLensL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12), headMat);
    hlLensL.rotation.x = Math.PI / 2;
    hlLensL.position.set(-0.24, 0.24, 0.78);
    carGroup.add(hlLensL);

    const hlLensR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12), headMat);
    hlLensR.rotation.x = Math.PI / 2;
    hlLensR.position.set(0.24, 0.24, 0.78);
    carGroup.add(hlLensR);

    // Active Headlight Projector Beam
    const carHeadlightSpot = new THREE.SpotLight(0xfffaed, 3.8, 7, Math.PI / 6, 0.35);
    carHeadlightSpot.position.set(0, 0.28, 0.8);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, 4.0);
    carGroup.add(spotTarget);
    carHeadlightSpot.target = spotTarget;
    carGroup.add(carHeadlightSpot);

    // Sculpted C-Shaped 3D LED Taillights
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.04), tailMat);
    tl1.position.set(-0.26, 0.26, -0.74);
    carGroup.add(tl1);
    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.04), tailMat);
    tl2.position.set(0.26, 0.26, -0.74);
    carGroup.add(tl2);

    // Dual-Tone 5-Spoke Precision Alloy Wheels with Treaded Rubber Tires
    const tireRubberMat = new THREE.MeshStandardMaterial({ color: 0x121417, roughness: 0.92 });
    const alloyRimMat = new THREE.MeshStandardMaterial({ color: 0xd4d8e0, metalness: 0.95, roughness: 0.15 });
    const carWheels = [];

    const wheelOffsets = [
      { x: -0.34, y: 0.13, z: 0.44 },
      { x: 0.34, y: 0.13, z: 0.44 },
      { x: -0.34, y: 0.13, z: -0.44 },
      { x: 0.34, y: 0.13, z: -0.44 }
    ];

    wheelOffsets.forEach(wo => {
      const wGroup = new THREE.Group();

      // Deep Rubber Torus Tire
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.042, 12, 24), tireRubberMat);
      tire.rotation.y = Math.PI / 2;
      wGroup.add(tire);

      // Machined Alloy Wheel Hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 12), alloyRimMat);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      // 5-Spoke Star Rim Pattern
      for (let sp = 0; sp < 5; sp++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.07, 0.015), chromeMat);
        spoke.rotation.x = (sp * Math.PI * 2) / 5;
        spoke.position.set(0.038, 0, 0);
        wGroup.add(spoke);
      }

      wGroup.position.set(wo.x, wo.y, wo.z);
      carGroup.add(wGroup);
      carWheels.push(wGroup);
    });

    // Amber Hazard Indicators
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const hazards = [
      new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), hazardMat),
      new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), hazardMat),
      new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), hazardMat),
      new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), hazardMat)
    ];
    hazards[0].position.set(-0.33, 0.24, 0.76);
    hazards[1].position.set(0.33, 0.24, 0.76);
    hazards[2].position.set(-0.33, 0.26, -0.72);
    hazards[3].position.set(0.33, 0.26, -0.72);
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
