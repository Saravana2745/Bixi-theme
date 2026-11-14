/**
 * BIXI RIDE — React Bits Modern Interactive UI Animation Suite
 * Zero-dependency, ultra-lightweight vanilla JS/CSS animations inspired by React Bits:
 * 
 * 1. Spotlight Effect (Cursor-following radial highlight on cards & bento boxes)
 * 2. Magnetic Buttons (Interactive elastic cursor pull on CTAs)
 * 3. Shiny Text Shimmer (Metallic animated gradient sweeps)
 * 4. Border Beam (Luminous animated glowing border travel)
 * 5. Scramble / Decrypted Text (Alphanumeric decoding on scroll into view)
 */

(function () {
  'use strict';

  function initReactBits() {
    // ═══════════════ 1. SPOTLIGHT EFFECT ═══════════════
    var spotlightCards = document.querySelectorAll('.spotlight-card, .vehicle-card, .lux-bento-card, .circuit-card, .lux-storefront-spotlight-card, .lux-customer-card, [data-spotlight]');
    
    spotlightCards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--mouse-x', '-999px');
        card.style.setProperty('--mouse-y', '-999px');
      });
    });

    // ═══════════════ 2. MAGNETIC BUTTONS ═══════════════
    // Disable magnetic pull on touch devices to prevent mobile scroll jitter
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouch) {
      var magnetButtons = document.querySelectorAll('.magnet-btn, .btn-primary, .btn-hotline, .map-zoom-btn');
      
      magnetButtons.forEach(function (btn) {
        var bounding = null;

        btn.addEventListener('mouseenter', function () {
          bounding = btn.getBoundingClientRect();
        });

        btn.addEventListener('mousemove', function (e) {
          if (!bounding) bounding = btn.getBoundingClientRect();
          var x = e.clientX - bounding.left - bounding.width / 2;
          var y = e.clientY - bounding.top - bounding.height / 2;
          // Subtly pull toward cursor (damped by factor of 0.28)
          btn.style.transform = 'translate(' + (x * 0.28) + 'px, ' + (y * 0.28) + 'px)';
          btn.style.transition = 'transform 0.08s ease-out';
        });

        btn.addEventListener('mouseleave', function () {
          btn.style.transform = 'translate(0px, 0px)';
          btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          bounding = null;
        });
      });
    }

    // ═══════════════ 3. SCRAMBLE / DECRYPTED TEXT ═══════════════
    var scrambleElements = document.querySelectorAll('.scramble-text, [data-scramble]');
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦◆#@&%';

    function scrambleText(el) {
      if (el.getAttribute('data-scrambled') === 'true') return;
      el.setAttribute('data-scrambled', 'true');

      var originalText = el.getAttribute('data-original') || el.textContent;
      el.setAttribute('data-original', originalText);
      
      var iteration = 0;
      var maxIterations = originalText.length;
      
      var interval = setInterval(function () {
        el.textContent = originalText
          .split('')
          .map(function (char, index) {
            if (char === ' ') return ' ';
            if (index < iteration) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= maxIterations) {
          clearInterval(interval);
          el.textContent = originalText;
        }

        iteration += 1 / 2;
      }, 35);
    }

    // Trigger scramble on intersection observer
    if ('IntersectionObserver' in window) {
      var scrambleObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scrambleText(entry.target);
            scrambleObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      scrambleElements.forEach(function (el) {
        scrambleObserver.observe(el);
      });
    }

    // ═══════════════ 6. ABOUT US HERO DUAL-SHOWCASE (REACT BITS) ═══════════════
    var tabHub = document.getElementById('tabBtnHub');
    var tabRiders = document.getElementById('tabBtnRiders');
    var panelHub = document.getElementById('viewPanelHub');
    var panelRiders = document.getElementById('viewPanelRiders');
    var pipToRiders = document.getElementById('pipToRiders');
    var pipToHub = document.getElementById('pipToHub');

    function switchHeroShowcase(toView) {
      if (toView === 'riders') {
        if (tabHub) { tabHub.classList.remove('active'); tabHub.setAttribute('aria-selected', 'false'); }
        if (tabRiders) { tabRiders.classList.add('active'); tabRiders.setAttribute('aria-selected', 'true'); }
        if (panelHub) { panelHub.classList.remove('active'); panelHub.style.display = 'none'; }
        if (panelRiders) { panelRiders.classList.add('active'); panelRiders.style.display = 'block'; }
      } else {
        if (tabRiders) { tabRiders.classList.remove('active'); tabRiders.setAttribute('aria-selected', 'false'); }
        if (tabHub) { tabHub.classList.add('active'); tabHub.setAttribute('aria-selected', 'true'); }
        if (panelRiders) { panelRiders.classList.remove('active'); panelRiders.style.display = 'none'; }
        if (panelHub) { panelHub.classList.add('active'); panelHub.style.display = 'block'; }
      }
    }

    if (tabHub) {
      tabHub.addEventListener('click', function() { switchHeroShowcase('hub'); });
    }
    if (tabRiders) {
      tabRiders.addEventListener('click', function() { switchHeroShowcase('riders'); });
    }
    if (pipToRiders) {
      pipToRiders.addEventListener('click', function(e) {
        e.stopPropagation();
        switchHeroShowcase('riders');
      });
    }
    if (pipToHub) {
      pipToHub.addEventListener('click', function(e) {
        e.stopPropagation();
        switchHeroShowcase('hub');
      });
    }

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactBits);
  } else {
    initReactBits();
  }
})();
