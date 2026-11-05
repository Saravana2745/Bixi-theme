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
 *    - Authentic Tamil village mess with sloping Mangalore terracotta tiled roof, teak veranda pillars,
 *      glass snack showcase, banana-leaf dining, and warm illuminated signboard
 * 4. Power Kadai & Madurai Bun Parotta:
 *    - Iconic Madurai street food front with live circular parotta tava, sizzling bun parottas,
 *      parotta chef master figure with spatulas, stainless exhaust hood & rooftop chimney with animated billowing smoke
 * 5. Gandhi Memorial Museum:
 *    - Historic 17th-century Tamukkam Nayak Palace with grand plinth, colonnade pillars, copper dome & flag
 * 6. Alagar Kovil (Kallazhagar Temple):
 *    - Sacred hill temple at the foothills of Alagar Malai with golden vimanam and dhwaja stambham
 * 7. Sacred Vaigai River:
 *    - Isolated along the southern boundary at z = 7.8 with lush coconut palms; car NEVER touches water!
 * 
 * Advanced Roadside Architecture & Live Car Tour:
 * - All 3D models sit safely on the ROADSIDE curb, completely clear of the asphalt road loop.
 * - Dynamic auto-fitting signboards: font size scales dynamically so zero text is ever clipped!
 * - Tour Stop State Machine:
 *   - Car stops smoothly at each roadside stop.
 *   - Flashing amber hazard lights while parked.
 *   - 3D Passengers step out of the car, visit the entrance, and return!
 *   - Floating BIXI Logo Emblem Badge (pure favicon icon without name) pops up above the landmark,
 *     and smoothly disappears when the car departs!
 * - [ ✕ Zoom Out / Overview ] reset button and horizontal scrollable pill bar.
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
      icon: '🛕'
    },
    {
      id: 'alanganallur-vadivasal',
      name: 'Alanganallur Vadivasal (Jallikattu)',
      category: 'World Jallikattu Arena',
      roadPos: { x: -2.4, y: 0.25, z: 3.4 },
      modelPos: { x: -2.4, y: 0, z: 6.0 },
      facing: 0, // Facing South toward road
      camPos: { x: -2.4, y: 3.0, z: 1.2 },
      target: { x: -2.4, y: 1.4, z: 6.0 },
      distance: '16 km',
      time: '26 mins',
      vehicle: 'Hunter 350 / Maruti Swift',
      desc: 'World-famous Vadivasal entry gate where fierce Kangayam bulls charge into the Pongal Jallikattu arena and courageous tamers embrace the hump (திமில் தழுவுதல்).',
      badge: 'Jallikattu Arena',
      icon: '🐂'
    },
    {
      id: 'lucky-mess',
      name: 'Lucky Mess (Alanganallur)',
      category: 'Authentic Village Feast',
      roadPos: { x: 2.4, y: 0.25, z: 3.4 },
      modelPos: { x: 2.4, y: 0, z: 6.0 },
      facing: 0, // Facing South toward road
      camPos: { x: 2.4, y: 3.2, z: 1.2 },
      target: { x: 2.4, y: 1.2, z: 6.0 },
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
      icon: '🥩'
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
      icon: '🏛️'
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
      icon: '🛕'
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

    // Rich Dark Metallic Background with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 256);
    grad.addColorStop(0, bgColor || '#0d0f14');
    grad.addColorStop(1, '#161922');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);

    // Glowing BIXI Sunset Orange Borders
    ctx.strokeStyle = accentColor || '#e88124';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 1008, 240);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 216);

    // Corner Rivet Accents
    ctx.fillStyle = accentColor || '#e88124';
    const rivets = [[30, 30], [994, 30], [30, 226], [994, 226]];
    rivets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    const maxTextWidth = 920;

    // 1. Dynamic Auto-Scaling for Title
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

    // 2. Dynamic Auto-Scaling for Subtitle
    if (subtitle) {
      // Decorative orange underline
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
   * Contains the pure BIXI favicon emblem without name + bold location title!
   * Shows when car is parked at the stop; disappears when car leaves.
   */
  function createBixiPopupBadge(title, category) {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 384;
    const ctx = c.getContext('2d');

    function renderBadge() {
      ctx.clearRect(0, 0, 768, 384);

      // Rounded Shield / Capsule Container
      ctx.fillStyle = 'rgba(11, 13, 19, 0.95)';
      ctx.beginPath();
      ctx.roundRect(16, 16, 736, 352, 48);
      ctx.fill();

      // Glowing BIXI Sunset Orange Border
      ctx.strokeStyle = '#e88124';
      ctx.lineWidth = 8;
      ctx.shadowColor = 'rgba(232, 129, 36, 0.8)';
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw the pure BIXI favicon emblem (without name) at the top
      if (bixiEmblemImg.complete && bixiEmblemImg.naturalWidth > 0) {
        ctx.drawImage(bixiEmblemImg, (768 - 90) / 2, 34, 90, 105);
      } else {
        // Fallback stylish shield emblem if image still loading
        ctx.fillStyle = '#e88124';
        ctx.beginPath();
        ctx.arc(384, 85, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', 384, 85);
      }

      // Location Name (Bold White with shadow)
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

      // Subtitle / Tour Stop status pill
      ctx.fillStyle = '#e88124';
      ctx.font = 'bold 24px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(`★ BIXI TOUR STOP • ${category.toUpperCase()} ★`, 384, 280);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('PASSENGER PICKUP & DROPOFF', 384, 320);
    }

    renderBadge();

    // Re-render once image finishes loading
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
    // Initially hidden (scale = 0); smoothly scales up when car stops
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

    // Head with hair
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    head.position.y = 0.58;
    human.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.082, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x09090b }));
    hair.position.y = 0.58;
    human.add(hair);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.12), shirtMat);
    torso.position.y = 0.40;
    human.add(torso);

    // Left & Right Arms (pivoted at shoulders)
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), shirtMat);
    leftArm.position.set(-0.13, 0.36, 0);
    human.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), shirtMat);
    rightArm.position.set(0.13, 0.36, 0);
    human.add(rightArm);

    // Left & Right Legs (pivoted at hips)
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
      rightLeg: rightLeg,
      walkCycle: 0
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
    scene.background = new THREE.Color(0x0b0d13);
    scene.fog = new THREE.FogExp2(0x0b0d13, 0.024);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    const defaultCamPos = new THREE.Vector3(0, 14, 18);
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

    // Warm Sunset Atmosphere
    const ambLight = new THREE.AmbientLight(0xffeedd, 0.95);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(0xffa756, 1.75);
    sunLight.position.set(14, 24, 12);
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
      color: 0x11141e,
      roughness: 0.88,
      metalness: 0.12
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Sacred Alagar Malai Foothills (North background behind Alagar Kovil)
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x152219, // Lush temple forest green
      roughness: 0.92,
      flatShading: true
    });
    const am1 = new THREE.Mesh(new THREE.ConeGeometry(6.5, 7.5, 8), mountainMat);
    am1.position.set(-5.0, 3.5, -14);
    scene.add(am1);

    const am2 = new THREE.Mesh(new THREE.ConeGeometry(8.0, 8.5, 8), mountainMat);
    am2.position.set(2.0, 4.0, -15);
    scene.add(am2);

    const am3 = new THREE.Mesh(new THREE.ConeGeometry(5.5, 6.0, 7), mountainMat);
    am3.position.set(8.5, 2.8, -13);
    scene.add(am3);

    // =========================================================================
    // 2. SACRED VAIGAI RIVER (FAR SOUTH AT z = 7.8 - CAR NEVER TOUCHES RIVER!)
    // =========================================================================
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, 0.04, 8.2),
      new THREE.Vector3(-8, 0.04, 7.8),
      new THREE.Vector3(0, 0.04, 7.6),
      new THREE.Vector3(8, 0.04, 7.9),
      new THREE.Vector3(18, 0.04, 8.3)
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.2, 8, false);
    riverGeo.scale(1, 0.05, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    scene.add(riverMesh);

    // Riverbank Palms (far south)
    function createPalm(x, z, scale) {
      const palm = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1e, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.4, 6), trunkMat);
      trunk.position.y = 0.7;
      palm.add(trunk);
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x14532d });
      for (let p = 0; p < 5; p++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.15, 4), frondMat);
        frond.position.set(0, 1.4, 0);
        frond.rotation.z = 0.65;
        frond.rotation.y = (p * Math.PI * 2) / 5;
        palm.add(frond);
      }
      palm.scale.set(scale, scale, scale);
      palm.position.set(x, 0, z);
      return palm;
    }
    [-14, -9, -4, 2, 7, 12, 16].forEach(rx => {
      scene.add(createPalm(rx, 6.8, 0.85 + Math.random() * 0.25));
    });

    // =========================================================================
    // 3. LANDMARK 3D MODELS (ROADSIDE CURBS, ZERO ROAD OVERLAP!)
    // =========================================================================

    const popupBadges = {}; // id -> sprite

    // A. MADURAI MEENAKSHI AMMAN KOVIL
    function createMeenakshiTemple() {
      const temple = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb55220, roughness: 0.7 });
      const tierColors = [0x8f3510, 0x1e3a8a, 0x065f46, 0xb45309, 0x991b1b, 0x4c1d95, 0xd97706];
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Plinth & Temple Courtyard
      const baseCourtyard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 3.2), new THREE.MeshStandardMaterial({ color: 0x1a1614, roughness: 0.9 }));
      baseCourtyard.position.y = 0.08;
      temple.add(baseCourtyard);

      // Dravidian Raja Gopuram Base Gateway
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 1.9), stoneMat);
      base.position.y = 0.6;
      base.castShadow = true;
      temple.add(base);

      // Deep Arched Portal Gateway
      const portalMat = new THREE.MeshBasicMaterial({ color: 0x090a0d });
      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 1.95), portalMat);
      portal.position.y = 0.5;
      temple.add(portal);

      // Crystal-Clear Auto-Fitting Signboard (Facing East toward road)
      const signTex = createSignboardTexture(
        'SRI MEENAKSHI AMMAN TEMPLE',
        'MADURAI HERITAGE • 14 SACRED GOPURAMS',
        '#180c06',
        '#ffffff',
        '#e88124'
      );
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), signMat);
      sign.position.set(0, 1.0, 1.0);
      temple.add(sign);

      // 6 Stepped Tiers with Ornate Dravidian Cornices
      let tierY = 1.15;
      let tierW = 2.45;
      let tierD = 1.6;
      for (let t = 0; t < 6; t++) {
        tierY += 0.38;
        tierW -= 0.25;
        tierD -= 0.16;
        const mat = new THREE.MeshStandardMaterial({ color: tierColors[t % tierColors.length], roughness: 0.6 });
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.38, tierD), mat);
        tier.position.y = tierY;
        tier.castShadow = true;
        temple.add(tier);

        const cornice = new THREE.Mesh(new THREE.BoxGeometry(tierW + 0.16, 0.06, tierD + 0.16), stoneMat);
        cornice.position.y = tierY + 0.19;
        temple.add(cornice);
      }

      // Vaulted Gopuram Crown & 5 Golden Kalasams
      const topRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.38, 8), stoneMat);
      topRoof.rotation.z = Math.PI / 2;
      topRoof.position.y = tierY + 0.36;
      temple.add(topRoof);

      for (let k = -2; k <= 2; k++) {
        const kalasam = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.38, 6), goldMat);
        kalasam.position.set(k * 0.2, tierY + 0.68, 0);
        temple.add(kalasam);
      }

      // Temple Warm Ghee Diya Illumination
      const diyaLight = new THREE.PointLight(0xffa500, 2.8, 7);
      diyaLight.position.set(0, 1.2, 1.4);
      temple.add(diyaLight);

      // Floating BIXI Logo Emblem Badge above Temple
      const badge = createBixiPopupBadge('Meenakshi Amman Kovil', 'Temple Wonder');
      badge.position.set(0, tierY + 1.8, 0);
      badge.userData.baseY = tierY + 1.8;
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
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x993d14, roughness: 0.7 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11, roughness: 0.8 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const sandMat = new THREE.MeshStandardMaterial({ color: 0x785638, roughness: 0.95 });

      // Sandy Arena Floor
      const sandFloor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 5.0), sandMat);
      sandFloor.position.set(0, 0.06, 0.5);
      arena.add(sandFloor);

      // Vadivasal Brick Gate Pillars
      const leftGate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.8, 0.6), brickMat);
      leftGate.position.set(-1.4, 1.4, 2.0);
      arena.add(leftGate);

      const rightGate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.8, 0.6), brickMat);
      rightGate.position.set(1.4, 1.4, 2.0);
      arena.add(rightGate);

      // Heavy Timber Crossbeam Arch
      const archBeam = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.5, 0.65), brickMat);
      archBeam.position.set(0, 2.6, 2.0);
      arena.add(archBeam);

      // Terracotta Tiled Canopy over Vadivasal
      const tileRoof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 0.7, 4), roofMat);
      tileRoof.rotation.y = Math.PI / 4;
      tileRoof.position.set(0, 3.2, 2.0);
      arena.add(tileRoof);

      // Crystal-Clear Auto-Fitting Signboard
      const gateTex = createSignboardTexture(
        'ALANGANALLUR VADIVASAL',
        'அலங்காநல்லூர் வாடிவாசல் • JALLIKATTU ARENA',
        '#1a0b06',
        '#ffffff',
        '#e88124'
      );
      const gateSignMat = new THREE.MeshBasicMaterial({ map: gateTex });
      const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.55), gateSignMat);
      gateSign.position.set(0, 2.6, 1.65);
      arena.add(gateSign);

      // Arena Wooden Spectator Safety Barricades
      for (let r = 0; r < 4; r++) {
        const barL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 3.5), woodMat);
        barL.position.set(-1.4, 0.35 + r * 0.45, 0.25);
        arena.add(barL);

        const barR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 3.5), woodMat);
        barR.position.set(1.4, 0.35 + r * 0.45, 0.25);
        arena.add(barR);
      }

      // -----------------------------------------------------------------------
      // REALISTIC ANATOMICAL KANGAYAM JALLIKATTU BULL & BRAVE TAMER (மாடு தழுவுதல்)
      // -----------------------------------------------------------------------
      const bullGroup = new THREE.Group();

      // Realistic Materials (Iron-grey coat with muscular sheen & ivory-to-black horns)
      const coatMat = new THREE.MeshStandardMaterial({
        color: 0x24262b, // Muscular deep iron-grey
        roughness: 0.45,
        metalness: 0.25
      });
      const bellyMat = new THREE.MeshStandardMaterial({
        color: 0x383c46, // Shaded flank
        roughness: 0.55,
        metalness: 0.15
      });
      const muzzleMat = new THREE.MeshStandardMaterial({
        color: 0x141518,
        roughness: 0.4
      });
      const hornBaseMat = new THREE.MeshStandardMaterial({
        color: 0xe6ded1, // Ivory/bone tone
        roughness: 0.35,
        metalness: 0.25
      });
      const hornTipMat = new THREE.MeshStandardMaterial({
        color: 0x09090b, // Sharp jet-black pointed tip
        roughness: 0.2,
        metalness: 0.5
      });
      const hoofMat = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        roughness: 0.3
      });
      const ropeMat = new THREE.MeshStandardMaterial({
        color: 0xe88124, // Saffron nose-rope
        roughness: 0.7
      });

      // 1. ANATOMICAL CONTOURED TORSO
      // Muscular Barrel Chest & Withers
      const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.75, 12), coatMat);
      chest.rotation.x = Math.PI / 2;
      chest.scale.set(0.9, 1.0, 1.25);
      chest.position.set(0, 0.88, 0.25);
      chest.castShadow = true;
      bullGroup.add(chest);

      // Flank / Abdomen
      const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.38, 0.55, 12), bellyMat);
      belly.rotation.x = Math.PI / 2;
      belly.scale.set(0.85, 1.0, 1.15);
      belly.position.set(0, 0.86, -0.35);
      bullGroup.add(belly);

      // Muscular Rump / Pelvis
      const rump = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), coatMat);
      rump.scale.set(0.85, 1.05, 1.1);
      rump.position.set(0, 0.86, -0.7);
      rump.castShadow = true;
      bullGroup.add(rump);

      // 2. THE PROMINENT MUSCULAR HUMP (திமில் - TIMIL)
      const humpGroup = new THREE.Group();
      humpGroup.position.set(0, 1.18, 0.38);

      const humpMain = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), coatMat);
      humpMain.scale.set(0.85, 1.35, 1.15);
      humpMain.rotation.x = 0.25; // Leaning forward with charging momentum
      humpMain.castShadow = true;
      humpGroup.add(humpMain);

      const humpCrest = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 8), coatMat);
      humpCrest.rotation.x = 0.45;
      humpCrest.position.set(0, 0.26, 0.08);
      humpGroup.add(humpCrest);

      bullGroup.add(humpGroup);

      // 3. ARCHED NECK & DEWLAP (தாடை மடிப்பு / LOOSE THROAT SKIN)
      const neckGroup = new THREE.Group();
      neckGroup.position.set(0, 0.95, 0.65);

      const neckMuscles = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.5, 10), coatMat);
      neckMuscles.rotation.x = 0.6;
      neckMuscles.position.set(0, 0.1, 0.18);
      neckGroup.add(neckMuscles);

      // Signature Bovine Dewlap hanging beneath throat
      const dewlap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.55), bellyMat);
      dewlap.rotation.x = 0.45;
      dewlap.position.set(0, -0.15, 0.2);
      neckGroup.add(dewlap);

      // 4. SCULPTED HEAD & MUZZLE
      const head = new THREE.Group();
      head.position.set(0, 0.28, 0.45);

      const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.32), coatMat);
      cranium.position.set(0, 0.08, 0.05);
      head.add(cranium);

      // Sacred Kumkum & Sandal Tilak
      const kumkum = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      kumkum.position.set(0, 0.16, 0.22);
      kumkum.rotation.x = -Math.PI / 4;
      head.add(kumkum);

      const sandalDot = new THREE.Mesh(new THREE.CircleGeometry(0.03, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      sandalDot.position.set(0, 0.16, 0.225);
      sandalDot.rotation.x = -Math.PI / 4;
      head.add(sandalDot);

      // Muzzle & Nostrils
      const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.35, 8), muzzleMat);
      snout.rotation.x = Math.PI / 2 + 0.35;
      snout.position.set(0, -0.06, 0.28);
      head.add(snout);

      const nL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), new THREE.MeshBasicMaterial({ color: 0x050505 }));
      nL.position.set(-0.065, -0.14, 0.42);
      head.add(nL);

      const nR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), new THREE.MeshBasicMaterial({ color: 0x050505 }));
      nR.position.set(0.065, -0.14, 0.42);
      head.add(nR);

      // Traditional Saffron Nose-Rope (மூக்கணாங்கயிறு)
      const noseRope = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 6, 12), ropeMat);
      noseRope.rotation.y = Math.PI / 2;
      noseRope.position.set(0, -0.12, 0.38);
      head.add(noseRope);

      // Pointed Flaring Ears (செவிகள்)
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), coatMat);
      earL.rotation.set(-0.2, 0.4, 1.4);
      earL.position.set(-0.22, 0.12, 0.05);
      head.add(earL);

      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), coatMat);
      earR.rotation.set(-0.2, -0.4, -1.4);
      earR.position.set(0.22, 0.12, 0.05);
      head.add(earR);

      // Expressive Eyes
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9 });
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeMat);
      eyeL.position.set(-0.16, 0.08, 0.18);
      head.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeMat);
      eyeR.position.set(0.16, 0.08, 0.18);
      head.add(eyeR);

      // 5. REALISTIC COMPOUND-CURVED HORNS (பூர்வா கொம்புகள் - IVORY TO SHARP BLACK TIPS)
      function createRealisticHorn(isLeft) {
        const horn = new THREE.Group();
        const dir = isLeft ? 1 : -1;

        // Base segment (thick, ivory/bone)
        const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.3, 8), hornBaseMat);
        seg1.rotation.set(-0.2, dir * 0.35, dir * 0.7);
        seg1.position.set(dir * 0.1, 0.12, 0);
        horn.add(seg1);

        // Mid segment (curving upward)
        const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.055, 0.28, 8), hornBaseMat);
        seg2.rotation.set(-0.4, dir * 0.15, dir * 0.35);
        seg2.position.set(dir * 0.22, 0.32, -0.04);
        horn.add(seg2);

        // Pointed Sharp Black Tip (curving inward and forward)
        const seg3 = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.26, 8), hornTipMat);
        seg3.rotation.set(-0.7, -dir * 0.25, -dir * 0.2);
        seg3.position.set(dir * 0.26, 0.52, 0.05);
        horn.add(seg3);

        // Silk Pongal Ribbon wrap around horn base
        const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 6, 8), new THREE.MeshBasicMaterial({ color: 0xe88124 }));
        ribbon.position.set(dir * 0.08, 0.08, 0);
        ribbon.rotation.x = Math.PI / 3;
        horn.add(ribbon);

        return horn;
      }

      const hLeft = createRealisticHorn(true);
      hLeft.position.set(-0.1, 0.2, 0.05);
      head.add(hLeft);

      const hRight = createRealisticHorn(false);
      hRight.position.set(0.1, 0.2, 0.05);
      head.add(hRight);

      neckGroup.add(head);
      bullGroup.add(neckGroup);
      bullHead = neckGroup;

      // 6. 4 ARTICULATED GALLOPING LEGS WITH SHOULDERS, HOCKS & CLOVEN HOOVES
      bullLegs = [];
      function createLeg(isFront, isLeft) {
        const legGroup = new THREE.Group();

        if (isFront) {
          const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), coatMat);
          shoulder.scale.set(0.8, 1.2, 0.9);
          shoulder.position.y = -0.12;
          legGroup.add(shoulder);

          const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.36, 8), coatMat);
          forearm.position.y = -0.32;
          legGroup.add(forearm);

          const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.32, 8), coatMat);
          cannon.position.y = -0.62;
          legGroup.add(cannon);

          const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.14, 8), hoofMat);
          hoof.position.y = -0.82;
          legGroup.add(hoof);
        } else {
          const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), coatMat);
          thigh.scale.set(0.85, 1.3, 1.0);
          thigh.position.y = -0.12;
          legGroup.add(thigh);

          const hock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.065, 0.38, 8), coatMat);
          hock.position.set(0, -0.34, -0.06);
          hock.rotation.x = -0.25;
          legGroup.add(hock);

          const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.34, 8), coatMat);
          cannon.position.set(0, -0.64, 0.02);
          cannon.rotation.x = 0.2;
          legGroup.add(cannon);

          const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.14, 8), hoofMat);
          hoof.position.set(0, -0.83, 0.06);
          legGroup.add(hoof);
        }

        return legGroup;
      }

      const flLeg = createLeg(true, true);
      flLeg.position.set(-0.28, 0.82, 0.38);
      bullGroup.add(flLeg);
      bullLegs.push(flLeg);

      const frLeg = createLeg(true, false);
      frLeg.position.set(0.28, 0.82, 0.38);
      bullGroup.add(frLeg);
      bullLegs.push(frLeg);

      const rlLeg = createLeg(false, true);
      rlLeg.position.set(-0.28, 0.82, -0.58);
      bullGroup.add(rlLeg);
      bullLegs.push(rlLeg);

      const rrLeg = createLeg(false, false);
      rrLeg.position.set(0.28, 0.82, -0.58);
      bullGroup.add(rrLeg);
      bullLegs.push(rrLeg);

      // 7. SWISHING TAIL WITH BUSHY BLACK HAIR TUFT
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, 0.95, -0.82);

      const tailCord = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.65, 6), coatMat);
      tailCord.position.set(0, -0.3, -0.12);
      tailCord.rotation.x = -0.35;
      tailGroup.add(tailCord);

      const tailTuft = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 }));
      tailTuft.position.set(0, -0.65, -0.24);
      tailTuft.rotation.x = -0.35;
      tailGroup.add(tailTuft);

      bullGroup.add(tailGroup);
      bullTail = tailGroup;

      // 8. THE BRAVE JALLIKATTU TAMER (மாடு பிடி வீரர்) EMBRACING THE HUMP!
      const tamer = new THREE.Group();
      const tamerSkinMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.55 });
      const tamerJerseyMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 }); // Yellow arena jersey
      const tamerShortsMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 }); // Traditional red shorts

      const tHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), tamerSkinMat);
      tHead.position.set(0, 0.42, 0.12);
      tamer.add(tHead);

      const tHair = new THREE.Mesh(new THREE.SphereGeometry(0.092, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x09090b }));
      tHair.position.set(0, 0.42, 0.12);
      tamer.add(tHair);

      const tTorso = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.15), tamerJerseyMat);
      tTorso.position.y = 0.18;
      tTorso.rotation.x = 0.4; // Chest pressed tightly against hump
      tamer.add(tTorso);

      // Arms locked around the hump (one arm over the hump, one locked around base)
      const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.38, 6), tamerSkinMat);
      lArm.rotation.set(-0.4, 0.25, 1.25);
      lArm.position.set(0.2, 0.26, 0.16);
      tamer.add(lArm);

      const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.36, 6), tamerSkinMat);
      rArm.rotation.set(0.35, -0.3, -0.95);
      rArm.position.set(-0.18, 0.22, 0.08);
      tamer.add(rArm);

      const tShorts = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.16, 0.16), tamerShortsMat);
      tShorts.position.set(0, -0.04, -0.08);
      tamer.add(tShorts);

      const tLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.4, 6), tamerSkinMat);
      tLegL.position.set(-0.09, -0.28, -0.18);
      tLegL.rotation.x = -0.6;
      tamer.add(tLegL);

      const tLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.4, 6), tamerSkinMat);
      tLegR.position.set(0.09, -0.28, -0.28);
      tLegR.rotation.x = -0.9;
      tamer.add(tLegR);

      // Mount Tamer firmly to the Left Flank of the Hump!
      tamer.position.set(-0.35, 1.15, 0.35);
      tamer.rotation.z = 0.24; // Inward grasp
      bullGroup.add(tamer);
      bullTamer = tamer;

      // Position bull charging out of the Vadivasal gate towards the arena
      bullGroup.position.set(0, 0, 0.2);
      arena.add(bullGroup);
      bullMesh = bullGroup;

      // Floating BIXI Logo Emblem Badge
      const badge = createBixiPopupBadge('Alanganallur Vadivasal', 'Jallikattu Arena');
      badge.position.set(0, 4.3, 2.0);
      badge.userData.baseY = 4.3;
      arena.add(badge);
      popupBadges['alanganallur-vadivasal'] = badge;

      return arena;
    }

    const vadivasalModel = createAlanganallurVadivasal();
    vadivasalModel.position.set(-2.4, 0, 6.0);
    vadivasalModel.rotation.y = 0; // Facing South toward Road
    scene.add(vadivasalModel);

    // C. LUCKY MESS (AUTHENTIC VILLAGE HOTEL WITH MANGALORE TILED ROOF & THINNAI)
    function createLuckyMess() {
      const mess = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x2b221a, roughness: 0.85 });
      const woodPillarMat = new THREE.MeshStandardMaterial({ color: 0x543217, roughness: 0.6 });
      const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0xa84318, roughness: 0.65 }); // Terracotta tile roof
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f1813, roughness: 0.9 });

      // Raised Red-Oxide Veranda Plinth (Thinnai)
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.24, 2.8), plinthMat);
      plinth.position.y = 0.12;
      mess.add(plinth);

      // Main Mess Enclosure
      const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.5, 1.8), wallMat);
      mainBuilding.position.set(0, 0.87, 0.4);
      mainBuilding.castShadow = true;
      mess.add(mainBuilding);

      // Authentic Mangalore Sloped Tiled Roof with Hip Gables
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 0.85, 4), tileRoofMat);
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.3, 1.0, 0.95);
      roof.position.set(0, 2.0, 0.35);
      mess.add(roof);

      // Front Open Veranda (Thinnai) with Carved Wooden Pillars
      for (let p = -1.3; p <= 1.3; p += 0.86) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.3, 8), woodPillarMat);
        pillar.position.set(p, 0.77, -0.85);
        pillar.castShadow = true;
        mess.add(pillar);
      }

      // Veranda Overhang Eaves
      const eaves = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1.4), tileRoofMat);
      eaves.rotation.x = 0.15;
      eaves.position.set(0, 1.5, -0.4);
      mess.add(eaves);

      // Crystal-Clear Auto-Fitting Signboard
      const messTex = createSignboardTexture(
        'LUCKY MESS • ALANGANALLUR',
        'ESTD. 1968 • NATTU KOZHI & MUTTON CHUKKA',
        '#1f0d05',
        '#ffffff',
        '#e88124'
      );
      const messSignMat = new THREE.MeshBasicMaterial({ map: messTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.6), messSignMat);
      sign.position.set(0, 1.85, -0.55);
      mess.add(sign);

      // Front Street Showcase Counter (Glass snack/karam display & clay pots)
      const counter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.45), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 }));
      counter.position.set(0.6, 0.39, -0.75);
      mess.add(counter);

      const glassTop = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.28, 0.4), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 }));
      glassTop.position.set(0.6, 0.78, -0.75);
      mess.add(glassTop);

      // Banana Leaf Outdoor Dining Tables
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      for (let t = -1.0; t <= -0.3; t += 0.7) {
        const table = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.45), tableMat);
        table.position.set(t, 0.33, -0.75);
        mess.add(table);

        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.24), new THREE.MeshBasicMaterial({ color: 0x16a34a }));
        leaf.rotation.x = -Math.PI / 2;
        leaf.position.set(t, 0.55, -0.75);
        mess.add(leaf);
      }

      // Warm Interior Mess Lighting
      const interiorLight = new THREE.PointLight(0xffa756, 2.4, 6);
      interiorLight.position.set(0, 1.2, -0.5);
      mess.add(interiorLight);

      // Floating BIXI Logo Emblem Badge
      const badge = createBixiPopupBadge('Lucky Mess Alanganallur', 'Village Feast');
      badge.position.set(0, 3.2, 0);
      badge.userData.baseY = 3.2;
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
      const brickMat = new THREE.MeshStandardMaterial({ color: 0x332219, roughness: 0.8 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x16161a });
      const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });

      // Two-story Madurai Night Food Restaurant Building
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.1, 2.2), brickMat);
      bldg.position.set(0, 1.05, 0.3);
      bldg.castShadow = true;
      hotel.add(bldg);

      // Rooftop Industrial Chimney Pipe
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.2), darkMat);
      chimney.position.set(0.8, 2.6, 0.2);
      hotel.add(chimney);

      // Animated Billowing Chimney Smoke Particles
      const smokeMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.6 });
      for (let s = 0; s < 12; s++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.12 + Math.random() * 0.08, 6, 6), smokeMat.clone());
        puff.position.set(0.8 + (Math.random() - 0.5) * 0.1, 3.2 + s * 0.18, 0.2 + (Math.random() - 0.5) * 0.1);
        puff.userData = { baseY: 3.2, speed: 0.016 + Math.random() * 0.01, drift: (Math.random() - 0.5) * 0.006 };
        hotel.add(puff);
        chimneySmokeParticles.push(puff);
      }

      // Crystal-Clear Auto-Fitting Illuminated Neon Signboard
      const messTex = createSignboardTexture(
        '★ POWER KADAI ★',
        'MADURAI BUN PAROTTA & KARI DOSA • SIMMAKKAL',
        '#160804',
        '#ffffff',
        '#e88124'
      );
      const messSignMat = new THREE.MeshBasicMaterial({ map: messTex });
      const messSign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.6), messSignMat);
      messSign.position.set(0, 2.2, -0.82);
      hotel.add(messSign);

      // -----------------------------------------------------------------------
      // LIVE PAROTTA COUNTER & CHEF MASTER
      // -----------------------------------------------------------------------
      const counterBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      counterBase.position.set(0, 0.35, -0.85);
      hotel.add(counterBase);

      // Stainless Steel Exhaust Hood over the Tava
      const hood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.65), steelMat);
      hood.position.set(-0.2, 1.5, -0.85);
      hotel.add(hood);

      // Heavy Cast-Iron Circular Tava (Hotplate)
      const tava = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 }));
      tava.position.set(-0.35, 0.68, -0.85);
      hotel.add(tava);

      // Sizzling Golden-Brown Bun Parottas on the Tava!
      const bunMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
      for (let b = 0; b < 3; b++) {
        const parotta = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 8), bunMat);
        const ang = (b * Math.PI * 2) / 3;
        parotta.position.set(-0.35 + Math.cos(ang) * 0.14, 0.71, -0.85 + Math.sin(ang) * 0.14);
        hotel.add(parotta);
      }

      // Parotta Master Chef (Apron + Chef Cap + Spatulas!)
      const chef = new THREE.Group();
      const chefSkinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
      const apronMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });

      const cHead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), chefSkinMat);
      cHead.position.y = 1.15;
      chef.add(cHead);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.12, 8), apronMat);
      cap.position.y = 1.25;
      chef.add(cap);

      const cBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.38, 0.14), apronMat);
      cBody.position.y = 0.9;
      chef.add(cBody);

      // Spatula holding arm
      const spatulaArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.28), chefSkinMat);
      spatulaArm.rotation.set(0.6, 0, -0.5);
      spatulaArm.position.set(-0.16, 0.88, -0.1);
      chef.add(spatulaArm);

      const spatula = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.01), steelMat);
      spatula.position.set(-0.25, 0.74, -0.22);
      chef.add(spatula);

      chef.position.set(-0.35, 0, -0.4);
      hotel.add(chef);

      // Warm Golden Light Bathing the Parotta Counter
      const parottaGlow = new THREE.PointLight(0xffa500, 3.0, 6);
      parottaGlow.position.set(-0.35, 1.1, -0.85);
      hotel.add(parottaGlow);

      // Floating BIXI Logo Emblem Badge
      const badge = createBixiPopupBadge('Power Kadai & Bun Parotta', 'Street Food Legend');
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
      const stonePlinthMat = new THREE.MeshStandardMaterial({ color: 0x1f2330, roughness: 0.8 });
      const palaceWallMat = new THREE.MeshStandardMaterial({ color: 0x33384a, roughness: 0.5 });
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe88124, metalness: 0.85, roughness: 0.25 });

      // Grand Nayak Palace Plinth & Broad Front Steps
      const step1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 3.2), stonePlinthMat);
      step1.position.y = 0.1;
      museum.add(step1);

      const step2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 2.8), stonePlinthMat);
      step2.position.y = 0.3;
      museum.add(step2);

      // Palace Grand Hall
      const hall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 2.3), palaceWallMat);
      hall.position.set(0, 1.05, 0.2);
      hall.castShadow = true;
      museum.add(hall);

      // Crystal-Clear Auto-Fitting Signboard (No Text Clipping!)
      const museumTex = createSignboardTexture(
        'GANDHI MEMORIAL PALACE MUSEUM',
        'TAMUKKAM NAYAK PALACE • FREEDOM ARCHIVES',
        '#121624',
        '#ffffff',
        '#e88124'
      );
      const museumSignMat = new THREE.MeshBasicMaterial({ map: museumTex });
      const museumSign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.6), museumSignMat);
      museumSign.position.set(0, 1.95, -0.96);
      museum.add(museumSign);

      // Classical White Colonnade Pillars
      for (let p = -1.5; p <= 1.5; p += 0.6) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 1.4, 12), pillarMat);
        pillar.position.set(p, 1.1, -0.92);
        pillar.castShadow = true;
        museum.add(pillar);
      }

      // Nayak Architectural Dome & Drum
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.35, 8), stonePlinthMat);
      drum.position.set(0, 1.95, 0.2);
      museum.add(drum);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.set(0, 2.1, 0.2);
      museum.add(dome);

      // High Flagmast with Indian Tricolor Flag
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8), pillarMat);
      pole.position.set(0, 3.6, 0.2);
      museum.add(pole);

      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.3), new THREE.MeshBasicMaterial({ color: 0xe88124 }));
      flag.position.set(0.24, 4.3, 0.2);
      museum.add(flag);

      // Floating BIXI Logo Emblem Badge
      const badge = createBixiPopupBadge('Gandhi Memorial Museum', 'Palace Museum');
      badge.position.set(0, 4.8, 0.2);
      badge.userData.baseY = 4.8;
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
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9a3e18, roughness: 0.7 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

      // Temple Outer Fort Wall & Gateway
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 2.2), stoneMat);
      base.position.y = 0.6;
      base.castShadow = true;
      temple.add(base);

      const portal = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 2.25), new THREE.MeshBasicMaterial({ color: 0x090a0d }));
      portal.position.y = 0.5;
      temple.add(portal);

      // Crystal-Clear Auto-Fitting Signboard
      const alagarTex = createSignboardTexture(
        'ALAGAR KOVIL (KALLAZHAGAR)',
        'அழகர் கோவில் • CHITHIRAI FESTIVAL',
        '#160a04',
        '#ffffff',
        '#e88124'
      );
      const alagarSignMat = new THREE.MeshBasicMaterial({ map: alagarTex });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.55), alagarSignMat);
      sign.position.set(0, 1.05, -1.13);
      temple.add(sign);

      // Dravidian Raja Gopuram (4 stepped tiers)
      let tierY = 1.2;
      let tierW = 2.5;
      let tierD = 1.7;
      for (let t = 0; t < 4; t++) {
        tierY += 0.42;
        tierW -= 0.34;
        tierD -= 0.22;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(tierW, 0.42, tierD), stoneMat);
        tier.position.y = tierY;
        tier.castShadow = true;
        temple.add(tier);
      }

      // Golden Vimanam Spire
      const vimanam = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 6), goldMat);
      vimanam.position.set(0, tierY + 0.65, 0);
      temple.add(vimanam);

      // Sacred Golden Dhwaja Stambham (Flagmast)
      const flagmast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.6), goldMat);
      flagmast.position.set(1.4, 1.3, -1.4);
      temple.add(flagmast);

      // Warm Temple Bell Glow
      const templeLight = new THREE.PointLight(0xffb703, 2.8, 7);
      templeLight.position.set(0, 1.6, -1.4);
      temple.add(templeLight);

      // Floating BIXI Logo Emblem Badge
      const badge = createBixiPopupBadge('Alagar Kovil (Kallazhagar)', 'Alagar Temple');
      badge.position.set(0, tierY + 1.8, 0);
      badge.userData.baseY = tierY + 1.8;
      temple.add(badge);
      popupBadges['alagar-kovil'] = badge;

      return temple;
    }

    const alagarModel = createAlagarTemple();
    alagarModel.position.set(-4.8, 0, -6.0);
    alagarModel.rotation.y = Math.PI; // Facing South toward Road
    scene.add(alagarModel);

    // =========================================================================
    // 4. NATURAL SCENIC PALMS (CLEARED ENTIRELY FROM VADIVASAL FRONT!)
    // =========================================================================
    // Safe spots with ZERO obstruction to any landmark facade or arena
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
    // 5. HIGHWAY ROAD LOOP & PARKING BAYS (ELEVATED FIRMLY AT y = 0.25)
    // =========================================================================
    const ROAD_Y = 0.25;

    // Smooth racetrack CatmullRom loop through all 6 roadside checkpoints
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
    // 6. 3D MARUTI SWIFT HATCHBACK MODEL (BIXI SUNSET ORANGE)
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

    // 4 Wheels with Rotating Hubs
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

    // Twin Front LED Headlights
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

    // Twin Red LED Taillights
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl1.position.set(-0.22, 0.24, -0.62);
    carGroup.add(tl1);
    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.04), tailMat);
    tl2.position.set(0.22, 0.24, -0.62);
    carGroup.add(tl2);

    // Blinking Hazard Lights (Front & Rear Amber Indicators)
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

    // -------------------------------------------------------------------------
    // ANIMATED PASSENGER FIGURES (PEOPLE GOING IN & COMING OUT AT STOPS!)
    // -------------------------------------------------------------------------
    const touristOut = createPassengerFigure(0xffffff, 0x1e3a8a); // White shirt, blue trousers
    scene.add(touristOut);

    const touristIn = createPassengerFigure(0xe88124, 0x0f172a); // BIXI orange shirt, dark trousers
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

    // =========================================================================
    // 7. CHECKPOINT DIAMOND BEACONS & INTERACTION
    // =========================================================================
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
    let camDistance = 18;
    let camHeight = 14;
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

      // Pop up the selected landmark badge immediately
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

      // Retract all badges to match cruise mode
      Object.keys(popupBadges).forEach(k => {
        if (popupBadges[k]) popupBadges[k].userData.targetScale = 0.0;
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
    // 9. TOUR SIMULATION ENGINE (CAR STOPS, HAZARD BLINKERS & PEOPLE MOVING)
    // =========================================================================
    let carT = 0;
    const cruiseSpeed = 0.00065;
    let currentSpeed = cruiseSpeed;
    let carState = 'CRUISING'; // 'CRUISING' | 'STOPPED'
    let currentStopIdx = -1;
    let stopTimer = 0;
    const STOP_DURATION_FRAMES = 240; // ~4 seconds at 60fps

    let animationFrameId = null;
    let isVisible = false;

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();

      // -----------------------------------------------------------------------
      // A. TOUR STATE MACHINE: CAR DRIVING & STOPPING AT LANDMARKS
      // -----------------------------------------------------------------------
      if (carState === 'CRUISING') {
        // Advance car along road loop
        carT = (carT + currentSpeed) % 1;

        // Check if car reached any of the 6 checkpoint stops
        for (let i = 0; i < stopTValues.length; i++) {
          const targetT = stopTValues[i];
          let diff = Math.abs(carT - targetT);
          if (diff > 0.5) diff = 1.0 - diff;

          // If within stop proximity window and wasn't the stop just visited
          if (diff < 0.008 && currentStopIdx !== i) {
            carState = 'STOPPED';
            currentStopIdx = i;
            stopTimer = 0;
            currentSpeed = 0;

            // Trigger floating BIXI logo emblem badge popup above this landmark!
            const cp = CHECKPOINTS[i];
            if (popupBadges[cp.id]) {
              popupBadges[cp.id].userData.targetScale = 1.0;
            }

            // Update live telemetry HUD
            const liveHudLocation = document.getElementById('mapLiveCheckpointText');
            if (liveHudLocation) {
              liveHudLocation.textContent = `${cp.name} (Stop #${i + 1} of 6)`;
            }
            break;
          }
        }

        // Keep hazard lights OFF while driving
        hazards.forEach(h => { h.visible = false; });

        // Hide passengers while car is cruising
        touristOut.visible = false;
        touristIn.visible = false;

        // Accelerate smoothly if just resumed
        if (currentSpeed < cruiseSpeed) {
          currentSpeed += 0.00003;
        }

      } else if (carState === 'STOPPED') {
        stopTimer++;

        // Blinking amber hazard lights while parked
        const hazardBlink = Math.floor(now / 350) % 2 === 0;
        hazards.forEach(h => { h.visible = hazardBlink; });

        // ---------------------------------------------------------------------
        // PEOPLE ANIMATION: PASSENGERS STEPPING OUT AND RETURNING!
        // ---------------------------------------------------------------------
        const cp = CHECKPOINTS[currentStopIdx];
        const carWorldPos = new THREE.Vector3(cp.roadPos.x, ROAD_Y, cp.roadPos.z);
        const entranceWorldPos = new THREE.Vector3(cp.modelPos.x * 0.75 + cp.roadPos.x * 0.25, ROAD_Y, cp.modelPos.z * 0.75 + cp.roadPos.z * 0.25);

        // Phase 1 (0 to 110 frames): Passenger gets out and walks to the entrance
        if (stopTimer <= 110) {
          touristOut.visible = true;
          const prog = stopTimer / 110;
          touristOut.position.lerpVectors(carWorldPos, entranceWorldPos, prog);
          touristOut.lookAt(entranceWorldPos);

          // Walking limb swing
          const w = stopTimer * 0.25;
          touristOut.userData.leftLeg.rotation.x = Math.sin(w) * 0.6;
          touristOut.userData.rightLeg.rotation.x = -Math.sin(w) * 0.6;
          touristOut.userData.leftArm.rotation.x = -Math.sin(w) * 0.5;
          touristOut.userData.rightArm.rotation.x = Math.sin(w) * 0.5;
          touristOut.position.y = ROAD_Y + Math.abs(Math.sin(w)) * 0.04;
        } else {
          touristOut.visible = false;
        }

        // Phase 2 (110 to 220 frames): Returning passenger walks from entrance to car
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

        // Phase 3 (End of stop duration): Depart from stop!
        if (stopTimer >= STOP_DURATION_FRAMES) {
          // Floating BIXI emblem badge smoothly retracts and disappears!
          if (popupBadges[cp.id]) {
            popupBadges[cp.id].userData.targetScale = 0.0;
          }

          // Resume cruising
          carState = 'CRUISING';
          currentSpeed = 0.0001; // Start with gentle acceleration
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
      // C. ANIMATE FLOATING BIXI POPUP BADGES (SMOOTH POPUP / FADEOUT)
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
      // D. ANIMATE JALLIKATTU BULL & BRAVE TAMER (HUMP-EMBRACING GALLOP CYCLE!)
      // -----------------------------------------------------------------------
      const timeSec = now * 0.009;
      if (bullMesh && bullLegs.length === 4) {
        // Dynamic galloping stride
        bullLegs[0].rotation.x = Math.sin(timeSec) * 0.55;
        bullLegs[1].rotation.x = -Math.sin(timeSec) * 0.55;
        bullLegs[2].rotation.x = -Math.sin(timeSec + 0.6) * 0.55;
        bullLegs[3].rotation.x = Math.sin(timeSec + 0.6) * 0.55;

        // Fierce head bucking & horn tossing
        if (bullHead) {
          bullHead.rotation.x = Math.sin(timeSec * 0.7) * 0.2;
          bullHead.rotation.y = Math.cos(timeSec * 0.5) * 0.12;
        }

        // Tail swishing
        if (bullTail) {
          bullTail.rotation.z = Math.sin(timeSec * 1.4) * 0.35;
        }

        // Bull bucking forward and up
        bullMesh.position.z = 0.2 + Math.sin(timeSec * 0.5) * 0.3;
        bullMesh.position.y = Math.abs(Math.sin(timeSec * 0.5)) * 0.08;

        // Tamer holding onto the hump sways with the bull's bucking momentum!
        if (bullTamer) {
          bullTamer.rotation.x = 0.35 + Math.sin(timeSec * 0.5) * 0.12;
          bullTamer.rotation.z = 0.22 + Math.cos(timeSec * 0.7) * 0.06;
        }
      }

      // -----------------------------------------------------------------------
      // E. ANIMATE POWER KADAI BILLOWING CHIMNEY SMOKE
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
      // F. SPIN PIN BEACONS
      // -----------------------------------------------------------------------
      const beaconTime = now * 0.003;
      pinMeshes.forEach(mesh => {
        mesh.rotation.y += 0.025;
        mesh.position.y = mesh.userData.originalY + Math.sin(beaconTime + mesh.position.x) * 0.08;
      });

      // -----------------------------------------------------------------------
      // G. CAMERA SMOOTH TWEEN OR ORBIT
      // -----------------------------------------------------------------------
      if (camTargetPos && camTargetLook) {
        camera.position.lerp(camTargetPos, 0.045);
        currentLookAt.lerp(camTargetLook, 0.045);
        camera.lookAt(currentLookAt);
      } else {
        if (autoRotate) {
          cameraAngle += 0.001;
        }
        camera.position.x = Math.sin(cameraAngle) * camDistance;
        camera.position.z = Math.cos(cameraAngle) * camDistance;
        camera.position.y = camHeight;
        camera.lookAt(currentLookAt);
      }

      // -----------------------------------------------------------------------
      // H. RAYCASTING HOVER
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
