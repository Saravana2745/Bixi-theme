/**
 * BIXI RIDE - CURVED ORBITAL VEHICLE PLATE ROTATOR
 * Smooth 3D curved "food plate" rotation animation for featured vehicles:
 * - 6 Vehicles (Cars, Cruiser Bikes, Scooters, Adventure)
 * - Elliptical curved trajectory with realistic 3D perspective transforms
 * - Glowing pedestal disc under each vehicle
 * - Auto-rotation (3.5s) with pause on hover / touch
 * - Curved arrow controls, dot pagination, and direct-plate click selection
 * - Touch swipe support for mobile
 * - Seamless pre-fill & focus for the docked booking engine (#homeQuickBookForm)
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var stage = document.getElementById('curvedOrbitStage');
    if (!stage) return;

    var plateItems = Array.prototype.slice.call(stage.querySelectorAll('.vehicle-plate-item'));
    if (!plateItems.length) return;

    var prevBtn = document.getElementById('orbitPrevBtn');
    var nextBtn = document.getElementById('orbitNextBtn');
    var bookShortcutBtn = document.getElementById('orbitBookActiveRide');
    var dotsBar = document.getElementById('orbitDotsBar');
    var dots = dotsBar ? Array.prototype.slice.call(dotsBar.querySelectorAll('.orbit-dot')) : [];
    var categoryBadge = document.getElementById('activeVehicleCategory');
    var counterIndex = document.getElementById('activeSlideIndex');
    var container = document.getElementById('heroPlateCarousel');

    var currentIndex = 0;
    var total = plateItems.length;
    var autoPlayTimer = null;
    var isPaused = false;
    var isAnimating = false;

    // Slot classes representing positions along the curved arc
    // slot 0: active front spotlight
    // slot 1: right curve (incoming)
    // slot 2: far right along curve
    // slot 3: top / back apex
    // slot 4: far left along curve
    // slot 5: left curve (outgoing)
    var SLOT_CLASSES = ['active', 'slot-next', 'slot-far-right', 'slot-back', 'slot-far-left', 'slot-prev'];

    function updateCarousel(newIndex) {
      if (isAnimating) return;
      isAnimating = true;

      // Wrap index
      currentIndex = ((newIndex % total) + total) % total;

      // Update positions along curved orbit
      plateItems.forEach(function(plate, i) {
        // Calculate offset k from currentIndex (0..total-1)
        var offset = ((i - currentIndex) % total + total) % total;

        // Remove all slot classes
        SLOT_CLASSES.forEach(function(cls) {
          plate.classList.remove(cls);
        });

        // Add corresponding slot class
        var assignedClass = SLOT_CLASSES[offset] || 'slot-back';
        plate.classList.add(assignedClass);

        // Update accessibility attributes
        if (offset === 0) {
          plate.setAttribute('aria-hidden', 'false');
          plate.setAttribute('tabindex', '0');
        } else {
          plate.setAttribute('aria-hidden', 'true');
          plate.setAttribute('tabindex', '-1');
        }
      });

      // Update active plate info in HUD
      var activePlate = plateItems[currentIndex];
      if (activePlate) {
        var cat = activePlate.getAttribute('data-category') || 'Vehicle';
        if (categoryBadge) categoryBadge.textContent = cat;
        if (counterIndex) {
          counterIndex.textContent = (currentIndex + 1 < 10 ? '0' : '') + (currentIndex + 1);
        }
      }

      // Update dot pagination
      dots.forEach(function(dot, idx) {
        if (idx === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });

      setTimeout(function() {
        isAnimating = false;
      }, 650);
    }

    function nextPlate() {
      updateCarousel(currentIndex + 1);
    }

    function prevPlate() {
      updateCarousel(currentIndex - 1);
    }

    // Auto-advance every 3.5 seconds
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(function() {
        if (!isPaused) {
          nextPlate();
        }
      }, 3500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Event Listeners for Nav Arrows
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextPlate();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevPlate();
        startAutoPlay();
      });
    }

    // Clicking directly on any plate rotates it into focus
    plateItems.forEach(function(plate, idx) {
      plate.addEventListener('click', function(e) {
        // If clicking a non-active plate, rotate to it
        if (idx !== currentIndex) {
          e.preventDefault();
          updateCarousel(idx);
          startAutoPlay();
        } else {
          // If clicking active plate, trigger booking shortcut
          bookActiveVehicle();
        }
      });
    });

    // Clicking pagination dots
    dots.forEach(function(dot, idx) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        updateCarousel(idx);
        startAutoPlay();
      });
    });

    // Pause auto-rotation on mouse enter, resume on leave
    if (container) {
      container.addEventListener('mouseenter', function() {
        isPaused = true;
      });
      container.addEventListener('mouseleave', function() {
        isPaused = false;
      });
    }

    // Touch Swipe Support for Mobile
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;

    if (stage) {
      stage.addEventListener('touchstart', function(e) {
        isPaused = true;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      stage.addEventListener('touchend', function(e) {
        isPaused = false;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      var diffX = touchEndX - touchStartX;
      var diffY = touchEndY - touchStartY;
      // Ensure horizontal swipe is dominant and significant
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          // Swiped left -> next
          nextPlate();
        } else {
          // Swiped right -> prev
          prevPlate();
        }
        startAutoPlay();
      }
    }

    // ═══════════════ INTEGRATION WITH QUICK BOOKING ENGINE ═══════════════
    function bookActiveVehicle() {
      var activePlate = plateItems[currentIndex];
      if (!activePlate) return;

      var mode = activePlate.getAttribute('data-mode') || 'bike';
      var modelName = activePlate.getAttribute('data-model') || '';

      // 1. Switch Tab if needed (tabSelectBikes or tabSelectCars)
      var tabBikes = document.getElementById('tabSelectBikes');
      var tabCars = document.getElementById('tabSelectCars');

      if (mode === 'car' && tabCars && !tabCars.classList.contains('active')) {
        tabCars.click();
      } else if (mode === 'bike' && tabBikes && !tabBikes.classList.contains('active')) {
        tabBikes.click();
      }

      // 2. Select this vehicle in the model options panel
      setTimeout(function() {
        var modelOptionsPanel = document.getElementById('modelOptionsPanel');
        if (modelOptionsPanel) {
          var options = modelOptionsPanel.querySelectorAll('.custom-option-item');
          var matched = false;
          options.forEach(function(opt) {
            if (opt.getAttribute('data-value') === modelName) {
              opt.click();
              matched = true;
            }
          });
          // If exact name didn't match, match by substring
          if (!matched) {
            options.forEach(function(opt) {
              var val = (opt.getAttribute('data-value') || '').toLowerCase();
              if (val.indexOf(modelName.toLowerCase()) !== -1 || modelName.toLowerCase().indexOf(val) !== -1) {
                opt.click();
              }
            });
          }
        }

        // 3. Smoothly scroll to the booking widget
        var bookingWidget = document.getElementById('homeQuickBookForm') || document.getElementById('booking-engine');
        if (bookingWidget) {
          bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add pulse highlight animation to booking card
          var card = document.querySelector('.banner-docked-widget');
          if (card) {
            card.classList.add('booking-card-highlight');
            setTimeout(function() {
              card.classList.remove('booking-card-highlight');
            }, 1800);
          }
        }
      }, 50);
    }

    if (bookShortcutBtn) {
      bookShortcutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        bookActiveVehicle();
      });
    }

    // Also link heroBtnRentNow on left half
    var heroBtnRentNow = document.getElementById('heroBtnRentNow');
    if (heroBtnRentNow) {
      heroBtnRentNow.addEventListener('click', function(e) {
        e.preventDefault();
        bookActiveVehicle();
      });
    }

    // Initialize carousel on load
    updateCarousel(0);
    startAutoPlay();
  });
})();
