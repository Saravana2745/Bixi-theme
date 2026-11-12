/**
 * BIXI RIDE — Multi-Layer Realistic Automotive Scrollytelling Experience
 * 
 * Featuring:
 * 1. Ultra-photorealistic commercial imagery of the white Maruti Suzuki Swift:
 *    - Stage 1: Aerodynamic 90° Side Profile on Madurai Road with temple gopurams.
 *    - Stage 2: Windshield Cockpit Zoom with smiling Indian travelers & illuminated GPS.
 *    - Stage 3: Wide Cinematic Pull-back showing the Swift + glowing BIXI Ride Flagship Hub.
 * 2. High-DPI Canvas with sub-pixel cinematic camera morphing & scale-lerping.
 * 3. Dynamic Telemetry HUD + 3 Sequential Diva Cards.
 * 4. 60fps momentum lerp engine with complete mobile responsiveness.
 */

(function () {
  'use strict';

  function initAboutJourney() {
    var section = document.getElementById('about-scrolly-journey');
    var canvas = document.getElementById('about-car-canvas');
    var hudLabel = document.getElementById('journeyHudLabel');
    var progressBar = document.getElementById('journeyProgressBar');
    var scrollHint = document.getElementById('journeyScrollHint');
    var diva1 = document.getElementById('aboutDiva1');
    var diva2 = document.getElementById('aboutDiva2');
    var diva3 = document.getElementById('aboutDiva3');

    if (!section || !canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution image sources (WebP with JPG fallback)
    var imageConfigs = [
      {
        webp: 'assets/images/about-journey/swift-side-view.webp',
        jpg: 'assets/images/about-journey/swift-side-view.jpg',
        label: 'STAGE 1/3 • AERODYNAMIC SIDE PROFILE',
        focalDesktop: { x: 0.5, y: 0.5 },
        focalMobile: { x: 0.52, y: 0.42 }
      },
      {
        webp: 'assets/images/about-journey/swift-cockpit-zoom.webp',
        jpg: 'assets/images/about-journey/swift-cockpit-zoom.jpg',
        label: 'STAGE 2/3 • IN-CABIN PASSENGER COMFORT',
        focalDesktop: { x: 0.5, y: 0.45 },
        focalMobile: { x: 0.5, y: 0.38 }
      },
      {
        webp: 'assets/images/about-journey/swift-shop-wide.webp',
        jpg: 'assets/images/about-journey/swift-shop-wide.jpg',
        label: 'STAGE 3/3 • THE BIXI FLAGSHIP SHOP & DISPATCH',
        focalDesktop: { x: 0.48, y: 0.5 },
        focalMobile: { x: 0.48, y: 0.42 }
      }
    ];

    var loadedImages = [null, null, null];
    var imagesLoadedCount = 0;

    // Preload all 3 images with fallback
    imageConfigs.forEach(function (cfg, index) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        loadedImages[index] = img;
        imagesLoadedCount++;
        render();
      };
      img.onerror = function () {
        // Fallback to JPG
        var fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = function () {
          loadedImages[index] = fallbackImg;
          imagesLoadedCount++;
          render();
        };
        fallbackImg.src = cfg.jpg;
      };
      // Try WebP first
      img.src = cfg.webp;
    });

    var targetProgress = 0;
    var currentProgress = 0;
    var isTicking = false;
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      render();
    }

    function calculateScrollProgress() {
      var rect = section.getBoundingClientRect();
      var totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return 0;
      var scrolled = -rect.top;
      var p = scrolled / totalScrollable;
      return Math.max(0, Math.min(1, p));
    }

    function onScroll() {
      targetProgress = calculateScrollProgress();
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(update);
      }
    }

    function update() {
      // Smooth lerp damping (0.09 factor gives silky cinematic feel)
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.09;
        isTicking = true;
        requestAnimationFrame(update);
      } else {
        currentProgress = targetProgress;
        isTicking = false;
      }

      render();
      updateUI();
    }

    function updateUI() {
      var p = currentProgress;

      // Update progress bar
      if (progressBar) {
        var pct = Math.max(5, Math.min(100, Math.round(p * 100)));
        progressBar.style.width = pct + '%';
      }

      // Hide scroll hint once user has initiated scrolling
      if (scrollHint) {
        scrollHint.style.opacity = p > 0.04 ? '0' : '1';
        scrollHint.style.pointerEvents = 'none';
      }

      // Determine active stage: Stage 1 (0 to 0.33), Stage 2 (0.33 to 0.66), Stage 3 (0.66 to 1.0)
      var activeStage = 1;
      if (p >= 0.62) {
        activeStage = 3;
      } else if (p >= 0.28) {
        activeStage = 2;
      } else {
        activeStage = 1;
      }

      if (hudLabel && imageConfigs[activeStage - 1]) {
        hudLabel.textContent = imageConfigs[activeStage - 1].label;
      }

      // Toggle active classes on Diva cards
      if (diva1) {
        if (activeStage === 1) diva1.classList.add('active');
        else diva1.classList.remove('active');
      }
      if (diva2) {
        if (activeStage === 2) diva2.classList.add('active');
        else diva2.classList.remove('active');
      }
      if (diva3) {
        if (activeStage === 3) diva3.classList.add('active');
        else diva3.classList.remove('active');
      }
    }

    // Helper: Draw an image with custom scale, opacity, and focal offset
    function drawLayer(img, opacity, scale, focalX, focalY) {
      if (!img || opacity <= 0.001) return;

      var cw = canvas.width;
      var ch = canvas.height;
      var nw = img.naturalWidth || img.width;
      var nh = img.naturalHeight || img.height;
      if (!nw || !nh) return;

      // Object-fit: cover calculation
      var imgAspect = nw / nh;
      var canvasAspect = cw / ch;

      var renderW, renderH;
      if (canvasAspect > imgAspect) {
        renderW = cw * scale;
        renderH = (cw / imgAspect) * scale;
      } else {
        renderH = ch * scale;
        renderW = (ch * imgAspect) * scale;
      }

      // Center around focal point
      var renderX = (cw * focalX) - (renderW * focalX);
      var renderY = (ch * focalY) - (renderH * focalY);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, renderX, renderY, renderW, renderH);
      ctx.restore();
    }

    function render() {
      if (!ctx || width === 0 || height === 0) return;

      var cw = canvas.width;
      var ch = canvas.height;
      var isMobile = width < 768;

      // Clear with dark studio backdrop
      ctx.fillStyle = '#07080B';
      ctx.fillRect(0, 0, cw, ch);

      var p = currentProgress;

      // Stage weights & transitions:
      // Stage 1 -> 2 transition happens between p = 0.22 and 0.45
      // Stage 2 -> 3 transition happens between p = 0.55 and 0.78
      var w1 = 0, w2 = 0, w3 = 0;
      var s1 = 1.0, s2 = 1.0, s3 = 1.0;

      if (p < 0.22) {
        // Pure Stage 1
        w1 = 1.0;
        s1 = 1.0 + p * 0.15; // subtle push-in
      } else if (p < 0.45) {
        // Transition Stage 1 -> Stage 2
        var t = (p - 0.22) / (0.45 - 0.22); // 0 to 1
        // Smooth Hermite interpolation
        var smoothT = t * t * (3 - 2 * t);
        w1 = 1 - smoothT;
        w2 = smoothT;
        s1 = 1.03 + smoothT * 0.12; // zooms in as it fades out
        s2 = 1.1 - (1 - smoothT) * 0.1; // zooms into cockpit
      } else if (p < 0.55) {
        // Pure Stage 2
        w2 = 1.0;
        var pLocal = (p - 0.45) / 0.10;
        s2 = 1.0 + pLocal * 0.04;
      } else if (p < 0.78) {
        // Transition Stage 2 -> Stage 3
        var t2 = (p - 0.55) / (0.78 - 0.55);
        var smoothT2 = t2 * t2 * (3 - 2 * t2);
        w2 = 1 - smoothT2;
        w3 = smoothT2;
        s2 = 1.04 + smoothT2 * 0.12;
        s3 = 1.08 - smoothT2 * 0.08; // pull-back reveals shop
      } else {
        // Pure Stage 3
        w3 = 1.0;
        var pLocal3 = (p - 0.78) / 0.22;
        s3 = 1.0 + pLocal3 * 0.03;
      }

      // Draw Layers
      var f1 = isMobile ? imageConfigs[0].focalMobile : imageConfigs[0].focalDesktop;
      var f2 = isMobile ? imageConfigs[1].focalMobile : imageConfigs[1].focalDesktop;
      var f3 = isMobile ? imageConfigs[2].focalMobile : imageConfigs[2].focalDesktop;

      if (w1 > 0 && loadedImages[0]) {
        drawLayer(loadedImages[0], w1, s1, f1.x, f1.y);
      }
      if (w2 > 0 && loadedImages[1]) {
        drawLayer(loadedImages[1], w2, s2, f2.x, f2.y);
      }
      if (w3 > 0 && loadedImages[2]) {
        drawLayer(loadedImages[2], w3, s3, f3.x, f3.y);
      }

      // Cinematic Vignette & Bottom Text Contrast Gradient
      ctx.save();
      // Bottom fade so diva text cards have maximum readability
      var grad = ctx.createLinearGradient(0, ch * 0.45, 0, ch);
      grad.addColorStop(0, 'rgba(7, 8, 11, 0)');
      grad.addColorStop(0.7, 'rgba(7, 8, 11, 0.45)');
      grad.addColorStop(1, 'rgba(7, 8, 11, 0.88)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // Subtle top vignette
      var topGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.25);
      topGrad.addColorStop(0, 'rgba(7, 8, 11, 0.6)');
      topGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Warm luxury ambient orange corner glow
      var radial = ctx.createRadialGradient(cw * 0.88, ch * 0.12, 10, cw * 0.88, ch * 0.12, cw * 0.45);
      radial.addColorStop(0, 'rgba(255, 122, 24, 0.14)');
      radial.addColorStop(1, 'rgba(255, 122, 24, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, cw, ch);

      ctx.restore();
    }

    // Event Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    resize();
    targetProgress = calculateScrollProgress();
    currentProgress = targetProgress;
    updateUI();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutJourney);
  } else {
    initAboutJourney();
  }
})();
