/**
 * BIXI RIDE - INSTAGRAM REEL-INSPIRED ROTATING HEADER SHOWCASE
 * Recreates the exact signature spinning platter, text slide reveal,
 * circular thumbnail selector, and progress bar animation from the reference video.
 *
 * Features:
 * - 6 Featured Vehicles (Cars, Cruiser Bikes, Scooters, Adventure)
 * - Inertia-driven spinning circular platter with metallic grooves & neon rim
 * - Smooth rotational vehicle spin-in / spin-out transitions
 * - Dynamic headline flip animation
 * - Interactive circular thumbnail discs with glowing active ring
 * - Auto-advancing progress line (4.0s) with pause on hover/touch
 * - Arrow navigation & touch swipe support
 * - Seamless integration with docked booking engine (#homeQuickBookForm)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var showcase = document.getElementById('heroSplitStage');
    if (!showcase) return;

    var FLEET = [
      {
        index: 0,
        name: 'Maruti Suzuki Swift',
        shortName: 'Swift',
        category: 'Hatchback',
        badge: 'FAST COMMUTE • AIR CONDITIONED',
        price: '2,200',
        specs: '5 Seater • AC • 300 km/day',
        mode: 'car',
        themeColor: '#FF7A18',
        themeGlow: 'rgba(255, 122, 24, 0.45)'
      },
      {
        index: 1,
        name: 'Royal Enfield Classic 350',
        shortName: 'Classic 350',
        category: 'Cruiser Bike',
        badge: 'ROYAL CRUISER • DUAL CHANNEL ABS',
        price: '1,000',
        specs: '350cc • Dual ABS • 2 Helmets',
        mode: 'bike',
        themeColor: '#F59E0B',
        themeGlow: 'rgba(245, 158, 11, 0.45)'
      },
      {
        index: 2,
        name: 'Honda Activa 6G',
        shortName: 'Activa 6G',
        category: 'City Scooter',
        badge: 'EASY AUTOMATIC • 60 KM/L MILEAGE',
        price: '600',
        specs: '110cc • Automatic • 2 Helmets',
        mode: 'bike',
        themeColor: '#FF8D36',
        themeGlow: 'rgba(255, 141, 54, 0.45)'
      },
      {
        index: 3,
        name: 'Maruti Suzuki Ertiga',
        shortName: 'Ertiga 7-Seater',
        category: '7-Seater Premium MPV',
        badge: 'FAMILY EXPEDITION • DUAL AC VENTS',
        price: '3,500',
        specs: '7 Seater • Dual AC • 300 km/day',
        mode: 'car',
        themeColor: '#E6690B',
        themeGlow: 'rgba(230, 105, 11, 0.45)'
      },
      {
        index: 4,
        name: 'Royal Enfield Himalayan 450',
        shortName: 'Himalayan 450',
        category: 'Adventure Tourer',
        badge: 'ALL-TERRAIN TOURING • HILL SPECIAL',
        price: '1,200',
        specs: '450cc • Liquid Cooled • Long Ride',
        mode: 'bike',
        themeColor: '#FF6F00',
        themeGlow: 'rgba(255, 111, 0, 0.45)'
      },
      {
        index: 5,
        name: 'Yamaha Ray ZR 125',
        shortName: 'Ray ZR 125',
        category: 'Sporty Hybrid Scooter',
        badge: 'SPORTY HYBRID • LIGHTWEIGHT CORNERING',
        price: '600',
        specs: '125cc Fi • Ultra Lightweight',
        mode: 'bike',
        themeColor: '#FF9A44',
        themeGlow: 'rgba(255, 154, 68, 0.45)'
      }
    ];

    // DOM Elements
    var platterDisc = document.getElementById('turntablePlatterDisc');
    var vehiclesWrap = document.getElementById('turntableVehiclesWrap');
    var vehicleSlides = vehiclesWrap ? Array.prototype.slice.call(vehiclesWrap.querySelectorAll('.turntable-vehicle-slide')) : [];
    var thumbRow = document.getElementById('reelThumbnailRow');
    var thumbDiscs = thumbRow ? Array.prototype.slice.call(thumbRow.querySelectorAll('.reel-thumb-disc')) : [];
    var prevBtn = document.getElementById('turntablePrevBtn');
    var nextBtn = document.getElementById('turntableNextBtn');
    var btnBookNow = document.getElementById('reelBtnBookNow');
    var btnText = document.getElementById('reelBtnText');

    var dynamicTitle = document.getElementById('reelDynamicTitle');
    var categoryPill = document.getElementById('reelCategoryPill');
    var badgeTag = document.getElementById('reelBadgeTag');
    var priceVal = document.getElementById('reelPriceVal');
    var specsText = document.getElementById('reelSpecsText');
    var currentIndexSpan = document.getElementById('reelCurrentIndex');
    var progressFill = document.getElementById('reelProgressFill');
    var ambientGlow = document.getElementById('turntableAmbientGlow');
    var fluidBlob = document.getElementById('heroReelBlob');

    var currentIndex = 0;
    var total = FLEET.length;
    var currentRotationDeg = 0;
    var isAnimating = false;
    var isPaused = false;
    var autoPlayTimer = null;
    var progressTimer = null;
    var progressStartTime = 0;
    var DURATION = 2000; // 2.0 seconds per slide (fast, snappy reel rotation)

    function switchVehicle(newIndex, direction) {
      if (newIndex === currentIndex && !direction) return;

      var dir = direction || (newIndex > currentIndex ? 1 : -1);
      var prevIndex = currentIndex;
      currentIndex = ((newIndex % total) + total) % total;
      var item = FLEET[currentIndex];

      // 1. Platter Disc Rotational Spin (The Signature Reel Effect!)
      currentRotationDeg += dir * 60;
      if (platterDisc) {
        platterDisc.style.transform = 'perspective(900px) rotateX(46deg) rotate(' + currentRotationDeg + 'deg)';
      }

      // 2. Vehicle Slides Smooth Rotational Spin-In / Spin-Out (Snappy 0.35s)
      vehicleSlides.forEach(function (slide, idx) {
        if (idx === currentIndex) {
          slide.classList.remove('spin-out-left', 'spin-out-right');
          slide.classList.add('active', dir > 0 ? 'spin-in-right' : 'spin-in-left');
          slide.setAttribute('aria-hidden', 'false');
        } else if (idx === prevIndex) {
          slide.classList.remove('active', 'spin-in-right', 'spin-in-left');
          slide.classList.add(dir > 0 ? 'spin-out-left' : 'spin-out-right');
          slide.setAttribute('aria-hidden', 'true');
        } else {
          slide.classList.remove('active', 'spin-in-right', 'spin-in-left', 'spin-out-left', 'spin-out-right');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      // 3. Dynamic Title & Typography Reveal Flip (Instant Snappy Switch)
      if (dynamicTitle) {
        dynamicTitle.classList.add('title-flip-out');
        setTimeout(function () {
          dynamicTitle.textContent = item.name;
          dynamicTitle.classList.remove('title-flip-out');
          dynamicTitle.classList.add('title-flip-in');
          setTimeout(function () {
            dynamicTitle.classList.remove('title-flip-in');
          }, 150);
        }, 90);
      }

      // 4. Update Badges, Price, and Specs
      if (categoryPill) categoryPill.textContent = item.category;
      if (badgeTag) badgeTag.textContent = item.badge;
      if (priceVal) priceVal.textContent = item.price;
      if (specsText) specsText.textContent = item.specs;
      if (btnText) btnText.textContent = 'Book ' + item.shortName + ' Today';
      if (currentIndexSpan) {
        currentIndexSpan.textContent = (currentIndex + 1 < 10 ? '0' : '') + (currentIndex + 1);
      }

      // 5. Ambient Glow & Fluid Blob Color Shifting
      if (ambientGlow) {
        ambientGlow.style.background = 'radial-gradient(ellipse at center, ' + item.themeGlow + ' 0%, rgba(9, 10, 14, 0) 70%)';
      }
      if (fluidBlob) {
        fluidBlob.style.background = 'radial-gradient(circle at 40% 50%, ' + item.themeGlow + ' 0%, rgba(255, 122, 24, 0.08) 50%, rgba(9, 10, 14, 0) 75%)';
      }

      // 6. Thumbnail Discs Activation
      thumbDiscs.forEach(function (disc, idx) {
        if (idx === currentIndex) {
          disc.classList.add('active');
          disc.setAttribute('aria-selected', 'true');
        } else {
          disc.classList.remove('active');
          disc.setAttribute('aria-selected', 'false');
        }
      });

      // 7. Restart Progress Bar
      startProgress();
    }

    function nextSlide() {
      switchVehicle(currentIndex + 1, 1);
    }

    function prevSlide() {
      switchVehicle(currentIndex - 1, -1);
    }

    // Progress Bar Animation
    function startProgress() {
      if (progressFill) {
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        // Force reflow
        void progressFill.offsetWidth;
        if (!isPaused) {
          progressFill.style.transition = 'width ' + DURATION + 'ms linear';
          progressFill.style.width = '100%';
        }
      }

      clearTimeout(autoPlayTimer);
      if (!isPaused) {
        autoPlayTimer = setTimeout(function () {
          nextSlide();
        }, DURATION);
      }
    }

    function pauseProgress() {
      isPaused = true;
      clearTimeout(autoPlayTimer);
      if (progressFill) {
        var computedWidth = window.getComputedStyle(progressFill).width;
        progressFill.style.transition = 'none';
        progressFill.style.width = computedWidth;
      }
    }

    function resumeProgress() {
      isPaused = false;
      startProgress();
    }

    // Event Listeners: Next / Prev Arrows
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
      });
    }

    // Event Listeners: Thumbnail Discs
    thumbDiscs.forEach(function (disc, idx) {
      disc.addEventListener('click', function (e) {
        e.preventDefault();
        var dir = idx > currentIndex ? 1 : -1;
        switchVehicle(idx, dir);
      });
    });

    // Pause on Hover / Touch
    if (showcase) {
      showcase.addEventListener('mouseenter', pauseProgress);
      showcase.addEventListener('mouseleave', resumeProgress);
    }

    // Touch Swipe Gestures for Mobile
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;

    var turntableStage = document.getElementById('turntablePlateStage');
    if (turntableStage) {
      turntableStage.addEventListener('touchstart', function (e) {
        pauseProgress();
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      turntableStage.addEventListener('touchend', function (e) {
        resumeProgress();
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        var diffX = touchEndX - touchStartX;
        var diffY = touchEndY - touchStartY;
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) nextSlide();
          else prevSlide();
        }
      }, { passive: true });
    }

    // ═══════════════ BOOKING ENGINE INTEGRATION ═══════════════
    function bookSelectedVehicle() {
      var item = FLEET[currentIndex];
      if (!item) return;

      var tabBikes = document.getElementById('tabSelectBikes');
      var tabCars = document.getElementById('tabSelectCars');

      // 1. Switch Tab
      if (item.mode === 'car' && tabCars && !tabCars.classList.contains('active')) {
        tabCars.click();
      } else if (item.mode === 'bike' && tabBikes && !tabBikes.classList.contains('active')) {
        tabBikes.click();
      }

      // 2. Select Model in dropdown
      setTimeout(function () {
        var modelOptionsPanel = document.getElementById('modelOptionsPanel');
        if (modelOptionsPanel) {
          var options = modelOptionsPanel.querySelectorAll('.custom-option-item');
          var matched = false;
          options.forEach(function (opt) {
            if (opt.getAttribute('data-value') === item.name) {
              opt.click();
              matched = true;
            }
          });
          if (!matched) {
            options.forEach(function (opt) {
              var val = (opt.getAttribute('data-value') || '').toLowerCase();
              if (val.indexOf(item.shortName.toLowerCase()) !== -1 || item.name.toLowerCase().indexOf(val) !== -1) {
                opt.click();
              }
            });
          }
        }

        // 3. Scroll to Booking Form & Highlight
        var bookingCard = document.querySelector('.banner-docked-widget');
        if (bookingCard) {
          bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          bookingCard.classList.add('booking-card-highlight');
          setTimeout(function () {
            bookingCard.classList.remove('booking-card-highlight');
          }, 1800);
        }
      }, 60);
    }

    if (btnBookNow) {
      btnBookNow.addEventListener('click', function (e) {
        e.preventDefault();
        bookSelectedVehicle();
      });
    }

    // Initialize first slide and start progress timer
    switchVehicle(0, 1);
  });
})();
