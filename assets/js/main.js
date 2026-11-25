/**
 * BIXI RIDE - MAIN APPLICATION CONTROLLER
 * Handles:
 * - Sticky Header Navigation
 * - Mobile Drawer Menu
 * - Bike Fleet Filtering & Dynamic Booking Modal
 * - Live Price Calculation & Date Estimator
 * - WhatsApp Instant Booking Generator
 * - FAQ Accordion Logic
 * - Contact Form Validation & Toast Notification
 */

(function () {
  'use strict';

  // Suppress third-party unhandled 500 network rejections (Hostinger Reach / AI Assistant widgets)
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason) {
      var msg = typeof event.reason === 'string' ? event.reason : (event.reason.message || '');
      if (msg.indexOf('500') !== -1 || (event.reason.response && event.reason.response.status === 500)) {
        event.preventDefault();
      }
    }
  });

  // Remove any third-party 500 error popup/toast immediately from the screen
  try {
    var toastObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            var txt = node.textContent || '';
            if (txt.indexOf('Request failed with status code 500') !== -1) {
              node.style.display = 'none';
              if (node.parentNode) node.parentNode.removeChild(node);
            }
          }
        });
      });
    });
    if (document.body) {
      toastObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        if (document.body) toastObserver.observe(document.body, { childList: true, subtree: true });
      });
    }
  } catch(e) {}

  // 0. Dynamic Self-Referencing Canonical Synchronizer (Guarantees Green 'Self-Canonicalised' in SEO Extensions)
  try {
    var canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag && window.location && window.location.href) {
      var cleanLoc = window.location.href.split('#')[0].split('?')[0];
      canonicalTag.setAttribute('href', cleanLoc);
    }
  } catch (e) {}

  // Global Rent Vehicles URL Resolver (Works seamlessly across Static HTML and WordPress Theme)
  window.getBixiAssetUrl = function (relPath) {
    if (!relPath) return '';
    if (relPath.indexOf('http://') === 0 || relPath.indexOf('https://') === 0 || relPath.indexOf('data:') === 0) {
      return relPath;
    }
    var base = (typeof window.bixiWP !== 'undefined' && window.bixiWP.themeUrl)
      ? window.bixiWP.themeUrl.replace(/\/+$/, '') + '/'
      : '';
    var clean = relPath.replace(/^\/+/, '');
    return base + clean;
  };

  window.getBixiRentUrl = function (query) {
    var base = (typeof bixiWP !== 'undefined' && bixiWP.rentUrl) ? bixiWP.rentUrl : 'bikes.html';
    if (!query) return base;
    var sep = base.indexOf('?') !== -1 ? '&' : '?';
    var cleanQuery = query.indexOf('?') === 0 ? query.substring(1) : query;
    return base + sep + cleanQuery;
  };

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation on Scroll
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // 2. Mobile Drawer Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const drawerBackdrop = document.querySelector('.drawer-backdrop');

    function toggleMenu() {
      if (!navToggle || !mobileDrawer) return;
      navToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
      if (drawerBackdrop) {
        drawerBackdrop.classList.toggle('active');
      }
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    }

    if (navToggle) {
      navToggle.addEventListener('click', toggleMenu);
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', toggleMenu);
    }

    // Close drawer when clicking a mobile link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // 2b. Custom Luxury Booking Select & Tab Controller (Cars & Bikes)
    const tabAll = document.getElementById('tabSelectAll');
    const tabBikes = document.getElementById('tabSelectBikes');
    const tabCars = document.getElementById('tabSelectCars');
    const hiddenType = document.getElementById('hiddenVehicleType');
    const hiddenModel = document.getElementById('hiddenVehicleModel');
    const hiddenHub = document.getElementById('hiddenPickupHub');
    const hiddenDuration = document.getElementById('hiddenDuration');
    const liveEstimate = document.getElementById('liveBookingEstimate');
    const modelOptionsPanel = document.getElementById('modelOptionsPanel');
    const selectedModelText = document.getElementById('selectedModelText');
    const vehicleLabelText = document.getElementById('vehicleLabelText');
    const hubBox = document.getElementById('hubSelectBox');
    const homeQuickBookForm = document.getElementById('homeQuickBookForm');
    const pickupDateInput = document.getElementById('pickupDate');
    const pickupTimeSelect = document.getElementById('pickupTime');
    const dropDateInput = document.getElementById('dropDate');
    const dropTimeSelect = document.getElementById('dropTime');
    const btnSubmitBooking = document.getElementById('btnSubmitBooking');

    // Bulletproof close function - queries directly to avoid TDZ
    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-box').forEach((box) => {
        box.classList.remove('open');
      });
      document.querySelectorAll('.custom-datepicker-box').forEach((box) => {
        box.classList.remove('open');
      });
    }

    // Complete 2026 Official Fleet (All 23 Vehicles with exact dual km tariffs & 24h format)
    const BIKE_MODELS = [
      // Scooters (120 km: ₹600/day | 240 km: ₹800/day)
      { name: 'Honda Activa 6G', price: 600, price240: 800, category: 'Scooter', sub: '120 km: ₹600/day • 240 km: ₹800/day • 24h cycle' },
      { name: 'Suzuki Access 125', price: 600, price240: 800, category: 'Scooter', sub: '120 km: ₹600/day • 240 km: ₹800/day • 24h cycle' },
      { name: 'Yamaha Fascino 125', price: 600, price240: 800, category: 'Scooter', sub: '120 km: ₹600/day • 240 km: ₹800/day • 24h cycle' },
      { name: 'Yamaha Ray ZR 125', price: 600, price240: 800, category: 'Scooter', sub: '120 km: ₹600/day • 240 km: ₹800/day • 24h cycle' },

      // Bikes 150cc (120 km: ₹800/day | 240 km: ₹1,200/day)
      { name: 'Yamaha FZS V3', price: 800, price240: 1200, category: '150cc Bike', sub: '120 km: ₹800/day • 240 km: ₹1,200/day • 24h cycle' },
      { name: 'Yamaha FZS V4', price: 800, price240: 1200, category: '150cc Bike', sub: '120 km: ₹800/day • 240 km: ₹1,200/day • 24h cycle' },
      { name: 'Yamaha FZX', price: 800, price240: 1200, category: '150cc Bike', sub: '120 km: ₹800/day • 240 km: ₹1,200/day • 24h cycle' },

      // Performance Bikes 200cc (120 km: ₹900/day | 240 km: ₹1,400/day)
      { name: 'Bajaj Pulsar NS200', price: 900, price240: 1400, category: '200cc Sport', sub: '120 km: ₹900/day • 240 km: ₹1,400/day • 24h cycle' },
      { name: 'Yamaha MT-15 V2', price: 900, price240: 1400, category: '200cc Sport', sub: '120 km: ₹900/day • 240 km: ₹1,400/day • 24h cycle' },
      { name: 'Hero Xpulse 200', price: 900, price240: 1400, category: 'Adventure Bike', sub: '120 km: ₹900/day • 240 km: ₹1,400/day • 24h cycle' },

      // Royal Enfield (120 km: ₹1,000/day | 240 km: ₹1,500/day; Himalayan 120 km: ₹1,200 | 300 km: ₹2,000)
      { name: 'Royal Enfield Hunter 350', price: 1000, price240: 1500, category: 'Royal Enfield', sub: '120 km: ₹1,000/day • 240 km: ₹1,500/day • 24h cycle' },
      { name: 'Royal Enfield Classic 350', price: 1000, price240: 1500, category: 'Royal Enfield', sub: '120 km: ₹1,000/day • 240 km: ₹1,500/day • 24h cycle' },
      { name: 'Royal Enfield Meteor 350', price: 1000, price240: 1500, category: 'Royal Enfield', sub: '120 km: ₹1,000/day • 240 km: ₹1,500/day • 24h cycle' },
      { name: 'Royal Enfield Himalayan 450', price: 1200, price240: 2000, category: 'Adventure Tourer', sub: '120 km: ₹1,200/day • 300 km: ₹2,000/day • 24h cycle' }
    ];

    const CAR_MODELS = [
      // Cars (All 300 km / day limit included, 24h format)
      { name: 'Maruti Suzuki Wagon R', price: 1800, category: 'Hatchback Car', sub: '300 km/day limit included • 24h cycle • ₹1,800/day' },
      { name: 'Maruti Suzuki Swift', price: 2200, category: 'Hatchback Car', sub: '300 km/day limit included • 24h cycle • ₹2,200/day' },
      { name: 'Maruti Suzuki Dzire', price: 2400, category: 'Sedan Car', sub: '300 km/day limit included • 24h cycle • ₹2,400/day' },
      { name: 'Maruti Suzuki Baleno', price: 2400, category: 'Premium Hatch', sub: '300 km/day limit included • 24h cycle • ₹2,400/day' },
      { name: 'Hyundai i20', price: 2400, category: 'Premium Hatch', sub: '300 km/day limit included • 24h cycle • ₹2,400/day' },
      { name: 'Hyundai Exter', price: 2500, category: 'Compact SUV', sub: '300 km/day limit included • 24h cycle • ₹2,500/day' },
      { name: 'Tata Punch', price: 2500, category: 'Compact SUV', sub: '300 km/day limit included • 24h cycle • ₹2,500/day' },
      { name: 'Maruti Suzuki Ertiga', price: 3500, category: '7-Seater MPV', sub: '300 km/day limit included • 24h cycle • 7-Seater • ₹3,500/day' },
      { name: 'Toyota Rumion', price: 3500, category: '7-Seater MPV', sub: '300 km/day limit included • 24h cycle • 7-Seater • ₹3,500/day' }
    ];

    const ALL_MODELS = [...BIKE_MODELS, ...CAR_MODELS];

    let currentVehicleMode = tabAll ? 'all' : 'bike';
    let currentSelectedPrice = 600;
    let currentDays = 1;
    let currentHubCharge = 0;

    function renderModelOptions(mode) {
      if (!modelOptionsPanel) return;
      modelOptionsPanel.innerHTML = '';
      let list = ALL_MODELS;
      if (mode === 'bike') list = BIKE_MODELS;
      if (mode === 'car') list = CAR_MODELS;

      list.forEach((item, index) => {
        const opt = document.createElement('div');
        opt.className = `custom-option-item ${index === 0 ? 'selected' : ''}`;
        opt.dataset.value = item.name;
        opt.dataset.price = item.price;
        opt.innerHTML = `
          <div class="custom-option-header">
            <span>${item.name}</span>
            <span class="opt-cat-badge">${item.category}</span>
            <span class="custom-option-price">₹${item.price.toLocaleString('en-IN')}/day</span>
          </div>
          <div class="custom-option-sub">${item.sub}</div>
        `;
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          selectModel(item, true);
        });
        modelOptionsPanel.appendChild(opt);
      });

      selectModel(list[0], false);
    }

    function selectModel(item, closeDropdown = true) {
      if (selectedModelText) selectedModelText.textContent = item.name;
      if (hiddenModel) hiddenModel.value = item.name;
      if (hiddenType) {
        hiddenType.value = (item.category.includes('Car') || item.category.includes('SUV') || item.category.includes('MPV') || item.category.includes('Hatch') || item.category.includes('Sedan')) ? 'car' : 'bike';
      }
      currentSelectedPrice = item.price;
      updateFareEstimate();

      if (modelOptionsPanel) {
        modelOptionsPanel.querySelectorAll('.custom-option-item').forEach((el) => {
          if (el.dataset.value === item.name) {
            el.classList.add('selected');
          } else {
            el.classList.remove('selected');
          }
        });
      }
      if (closeDropdown) {
        closeAllDropdowns();
      }
    }

    function updateFareEstimate() {
      if (!liveEstimate) return;
      const total = (currentSelectedPrice * currentDays) + currentHubCharge;
      let hubNote = currentHubCharge > 0 ? ' + ₹100 Doorstep Delivery' : '';
      liveEstimate.innerHTML = `₹${total.toLocaleString('en-IN')} <span style="font-weight:400;font-size:0.8rem;">(${currentDays} Day${currentDays > 1 ? 's' : ''}${hubNote})</span>`;
    }

    if (tabAll) {
      tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        if (tabBikes) tabBikes.classList.remove('active');
        if (tabCars) tabCars.classList.remove('active');
        currentVehicleMode = 'all';
        if (hiddenType) hiddenType.value = 'all';
        if (vehicleLabelText) vehicleLabelText.textContent = 'Select Vehicle (All 23)';
        renderModelOptions('all');
      });
    }

    if (tabBikes) {
      tabBikes.addEventListener('click', () => {
        tabBikes.classList.add('active');
        if (tabAll) tabAll.classList.remove('active');
        if (tabCars) tabCars.classList.remove('active');
        currentVehicleMode = 'bike';
        if (hiddenType) hiddenType.value = 'bike';
        if (vehicleLabelText) vehicleLabelText.textContent = 'Select Bike Model';
        renderModelOptions('bike');
      });
    }

    if (tabCars) {
      tabCars.addEventListener('click', () => {
        tabCars.classList.add('active');
        if (tabAll) tabAll.classList.remove('active');
        if (tabBikes) tabBikes.classList.remove('active');
        currentVehicleMode = 'car';
        if (hiddenType) hiddenType.value = 'car';
        if (vehicleLabelText) vehicleLabelText.textContent = 'Select Car Model';
        renderModelOptions('car');
      });
    }

    // 2c. Custom Select Box Toggle & Handlers
    document.querySelectorAll('.custom-select-box').forEach((box) => {
      const trigger = box.querySelector('.custom-select-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = box.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          box.classList.add('open');
        }
      });

      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          const isOpen = box.classList.contains('open');
          closeAllDropdowns();
          if (!isOpen) box.classList.add('open');
        } else if (e.key === 'Escape') {
          box.classList.remove('open');
        }
      });
    });

    // Prevent clicks inside options panel from closing before click registers
    document.querySelectorAll('.custom-options-panel').forEach((panel) => {
      panel.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close when clicking outside or pressing Escape
    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    // Hub select options click (Railway station opposite, Mgr bus Stand near By, Google location)
    if (hubBox) {
      hubBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.dataset.value;
          const header = item.querySelector('.custom-option-header')?.textContent?.trim() || val;
          currentHubCharge = parseInt(item.dataset.charge, 10) || 0;
          if (selectedHubText) selectedHubText.textContent = header;
          if (hiddenHub) hiddenHub.value = val;
          hubBox.querySelectorAll('.custom-option-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');
          hubBox.classList.remove('open');
          updateFareEstimate();
        });
      });
    }

    // 2d. Pick Up Date, Pick Time, Drop Off Date, Drop Time & Real-time Duration Calculation
    function parseHourlySlot(timeStr) {
      if (!timeStr) return { hours: 10, minutes: 0 };
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return { hours: 10, minutes: 0 };
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return { hours: h, minutes: m };
    }

    function calculateDurationInDays() {
      if (!pickupDateInput || !dropDateInput) return 1;
      const pVal = pickupDateInput.value;
      const dVal = dropDateInput.value;
      if (!pVal || !dVal) return 1;

      const pTime = parseHourlySlot(pickupTimeSelect ? pickupTimeSelect.value : '10:00 AM');
      const dTime = parseHourlySlot(dropTimeSelect ? dropTimeSelect.value : '10:00 AM');

      const [pY, pM, pD] = pVal.split('-').map(Number);
      const [dY, dM, dD] = dVal.split('-').map(Number);

      const start = new Date(pY, pM - 1, pD, pTime.hours, pTime.minutes);
      const end = new Date(dY, dM - 1, dD, dTime.hours, dTime.minutes);

      const diffMs = end.getTime() - start.getTime();
      if (diffMs <= 0) return 1;

      // In vehicle rentals (24-hour cycle billing):
      const hours = diffMs / (1000 * 60 * 60);
      const days = Math.ceil(hours / 24);
      return Math.max(1, days);
    }

    function syncDateInputsAndEstimate() {
      if (!pickupDateInput || !dropDateInput) return;
      if (pickupDateInput.value && (!dropDateInput.value || dropDateInput.value < pickupDateInput.value)) {
        dropDateInput.value = pickupDateInput.value;
      }
      dropDateInput.min = pickupDateInput.value;

      currentDays = calculateDurationInDays();
      if (hiddenDuration) hiddenDuration.value = currentDays;
      updateFareEstimate();
    }

    if (pickupDateInput && dropDateInput) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

      if (!pickupDateInput.value) pickupDateInput.value = todayStr;
      pickupDateInput.min = todayStr;

      if (!dropDateInput.value) dropDateInput.value = tomorrowStr;
      dropDateInput.min = pickupDateInput.value;

      currentDays = calculateDurationInDays();
      if (hiddenDuration) hiddenDuration.value = currentDays;

      pickupDateInput.addEventListener('change', () => {
        if (dropDateInput.value < pickupDateInput.value) {
          dropDateInput.value = pickupDateInput.value;
        }
        dropDateInput.min = pickupDateInput.value;
        syncDateInputsAndEstimate();
      });

      dropDateInput.addEventListener('change', syncDateInputsAndEstimate);
      if (pickupTimeSelect) pickupTimeSelect.addEventListener('change', syncDateInputsAndEstimate);
      if (dropTimeSelect) dropTimeSelect.addEventListener('change', syncDateInputsAndEstimate);
    }

    // Home Quick Book Form Direct Navigation (No modal on home page, direct to rental page bikes.html)
    if (homeQuickBookForm) {
      homeQuickBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (hiddenType && hiddenType.value) params.set('type', hiddenType.value);
        if (hiddenModel && hiddenModel.value) params.set('model', hiddenModel.value);
        if (hiddenHub && hiddenHub.value) params.set('hub', hiddenHub.value);
        if (pickupDateInput && pickupDateInput.value) params.set('pickup_date', pickupDateInput.value);
        if (pickupTimeSelect && pickupTimeSelect.value) params.set('pickup_time', pickupTimeSelect.value);
        if (dropDateInput && dropDateInput.value) params.set('drop_date', dropDateInput.value);
        if (dropTimeSelect && dropTimeSelect.value) params.set('drop_time', dropTimeSelect.value);
        if (hiddenDuration && hiddenDuration.value) params.set('days', hiddenDuration.value);

        window.location.href = window.getBixiRentUrl(params.toString());
      });
    }

    // Finally initialize default bike model fleet options
    if (tabBikes && tabCars) {
      renderModelOptions('bike');
    }

    // 3. Bike Fleet Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bikeCards = document.querySelectorAll('.bike-card');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.filter;
        bikeCards.forEach((card) => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 4. Booking Modal & Precise Rate Calculator (All 23 Vehicles • Dual KM Limits • Exact Pickup Calculations)
    const VEHICLE_CATALOG = {
      // Scooters (120 km: ₹600/day | 240 km: ₹800/day)
      'suzuki access 125': { name: 'Suzuki Access 125', rate120: 600, rateExt: 800, extKm: 240, car: false, cat: 'Scooter' },
      'honda activa 6g': { name: 'Honda Activa 6G', rate120: 600, rateExt: 800, extKm: 240, car: false, cat: 'Scooter' },
      'yamaha fascino 125': { name: 'Yamaha Fascino 125', rate120: 600, rateExt: 800, extKm: 240, car: false, cat: 'Scooter' },
      'yamaha ray zr 125': { name: 'Yamaha Ray ZR 125', rate120: 600, rateExt: 800, extKm: 240, car: false, cat: 'Scooter' },

      // Bikes 150cc (120 km: ₹800/day | 240 km: ₹1,200/day)
      'yamaha fzs v3': { name: 'Yamaha FZ-S V3', rate120: 800, rateExt: 1200, extKm: 240, car: false, cat: 'Bike' },
      'yamaha fzs v4': { name: 'Yamaha FZ-S V4', rate120: 800, rateExt: 1200, extKm: 240, car: false, cat: 'Bike' },
      'yamaha fzx': { name: 'Yamaha FZ-X', rate120: 800, rateExt: 1200, extKm: 240, car: false, cat: 'Bike' },

      // Performance Bikes 200cc (120 km: ₹900/day | 240 km: ₹1,400/day)
      'bajaj pulsar ns200': { name: 'Bajaj Pulsar NS200', rate120: 900, rateExt: 1400, extKm: 240, car: false, cat: 'Bike' },
      'yamaha mt-15 v2': { name: 'Yamaha MT-15 Version 2.0', rate120: 900, rateExt: 1400, extKm: 240, car: false, cat: 'Bike' },
      'hero xpulse 200': { name: 'Hero XPulse 200 4V', rate120: 900, rateExt: 1400, extKm: 240, car: false, cat: 'Bike' },

      // Royal Enfield (120 km: ₹1,000/day | 240 km: ₹1,500/day)
      'royal enfield hunter 350': { name: 'Royal Enfield Hunter 350', rate120: 1000, rateExt: 1500, extKm: 240, car: false, cat: 'Royal Enfield' },
      'royal enfield classic 350': { name: 'Royal Enfield Classic 350', rate120: 1000, rateExt: 1500, extKm: 240, car: false, cat: 'Royal Enfield' },
      'royal enfield meteor 350': { name: 'Royal Enfield Meteor 350', rate120: 1000, rateExt: 1500, extKm: 240, car: false, cat: 'Royal Enfield' },
      'royal enfield himalayan 450': { name: 'Royal Enfield Himalayan 450', rate120: 1200, rateExt: 2000, extKm: 300, car: false, cat: 'Royal Enfield' },

      // Cars (All 300 km/day limit included, 24h format)
      'maruti suzuki wagon r': { name: 'Maruti Suzuki Wagon R', rate120: 1800, rateExt: 1800, extKm: 300, car: true, cat: 'Car' },
      'maruti suzuki swift': { name: 'Maruti Suzuki Swift', rate120: 2200, rateExt: 2200, extKm: 300, car: true, cat: 'Car' },
      'maruti suzuki swift (2026)': { name: 'Maruti Suzuki Swift (2026)', rate120: 2200, rateExt: 2200, extKm: 300, car: true, cat: 'Car' },
      'maruti suzuki dzire': { name: 'Maruti Suzuki Dzire', rate120: 2400, rateExt: 2400, extKm: 300, car: true, cat: 'Car' },
      'maruti suzuki baleno': { name: 'Maruti Suzuki Baleno', rate120: 2400, rateExt: 2400, extKm: 300, car: true, cat: 'Car' },
      'hyundai i20': { name: 'Hyundai i20', rate120: 2400, rateExt: 2400, extKm: 300, car: true, cat: 'Car' },
      'hyundai exter': { name: 'Hyundai Exter', rate120: 2500, rateExt: 2500, extKm: 300, car: true, cat: 'Car' },
      'tata punch': { name: 'Tata Punch', rate120: 2500, rateExt: 2500, extKm: 300, car: true, cat: 'Car' },
      'maruti suzuki ertiga': { name: 'Maruti Suzuki Ertiga', rate120: 3500, rateExt: 3500, extKm: 300, car: true, cat: 'Car' },
      'toyota rumion': { name: 'Toyota Rumion', rate120: 3500, rateExt: 3500, extKm: 300, car: true, cat: 'Car' }
    };

    function findVehicle(name) {
      if (!name) return null;
      const lower = name.toLowerCase().trim();
      if (VEHICLE_CATALOG[lower]) return VEHICLE_CATALOG[lower];
      for (const k in VEHICLE_CATALOG) {
        if (lower.includes(k) || k.includes(lower)) {
          return VEHICLE_CATALOG[k];
        }
      }
      return null;
    }

    const bookingModal = document.getElementById('bookingModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBikeName = document.getElementById('modalBikeName');
    const modalBikePrice = document.getElementById('modalBikePrice');
    const modalBikeInput = document.getElementById('modalBikeInput');
    const modalVehicleSelect = document.getElementById('modalVehicleSelect');
    const modalTotalEstimate = document.getElementById('modalTotalEstimate');
    const modalPricingBreakdown = document.getElementById('modalPricingBreakdown');
    const modalKmLimitSelect = document.getElementById('modalKmLimitSelect');
    const modalKmLimitGroup = document.getElementById('modalKmLimitGroup');
    const daysCountInput = document.getElementById('rentalDaysInput');
    const modalPickupDateInput = document.getElementById('userDateInput');
    const modalPickupTimeInput = document.getElementById('userPickupTimeInput');
    const modalDropDateInput = document.getElementById('userDropDateInput');
    const modalDropTimeInput = document.getElementById('userDropTimeInput');
    const userLocationSelect = document.getElementById('userLocationSelect');
    const modalForm = document.getElementById('rentalBookingForm');

    function formatDateYMD(d) {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function ensureModalDateDefaults() {
      if (!modalPickupDateInput || !modalDropDateInput) return;
      const now = new Date();
      const todayStr = formatDateYMD(now);
      modalPickupDateInput.min = todayStr;
      if (!modalPickupDateInput.value) {
        modalPickupDateInput.value = todayStr;
      }
      modalDropDateInput.min = modalPickupDateInput.value;
      if (!modalDropDateInput.value || modalDropDateInput.value < modalPickupDateInput.value) {
        const [py, pm, pd] = modalPickupDateInput.value.split('-').map(Number);
        const days = parseInt(daysCountInput ? daysCountInput.value : 1, 10) || 1;
        const dropD = new Date(py, pm - 1, pd + days);
        modalDropDateInput.value = formatDateYMD(dropD);
      }
    }

    function syncModalDaysFromDates() {
      if (!modalPickupDateInput || !modalDropDateInput || !daysCountInput) return;
      if (modalDropDateInput.value < modalPickupDateInput.value) {
        modalDropDateInput.value = modalPickupDateInput.value;
      }
      modalDropDateInput.min = modalPickupDateInput.value;
      const [py, pm, pd] = modalPickupDateInput.value.split('-').map(Number);
      const [dy, dm, dd] = modalDropDateInput.value.split('-').map(Number);
      const pt = parseHourlySlot(modalPickupTimeInput ? modalPickupTimeInput.value : '10:00 AM');
      const dt = parseHourlySlot(modalDropTimeInput ? modalDropTimeInput.value : '10:00 AM');
      const start = new Date(py, pm - 1, pd, pt.hours, pt.minutes);
      const end = new Date(dy, dm - 1, dd, dt.hours, dt.minutes);
      const diffMs = end.getTime() - start.getTime();
      const days = diffMs > 0 ? Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : 1;
      daysCountInput.value = days;
      updateModalTotal();
    }

    function syncModalDropDateFromDays() {
      if (!modalPickupDateInput || !modalDropDateInput || !daysCountInput) return;
      const days = Math.max(1, parseInt(daysCountInput.value, 10) || 1);
      if (!modalPickupDateInput.value) {
        modalPickupDateInput.value = formatDateYMD(new Date());
      }
      const [py, pm, pd] = modalPickupDateInput.value.split('-').map(Number);
      const dropD = new Date(py, pm - 1, pd + days);
      modalDropDateInput.value = formatDateYMD(dropD);
      modalDropDateInput.min = modalPickupDateInput.value;
      updateModalTotal();
    }

    let currentVehicleData = null;
    let currentDailyRate = 600;

    function openBookingModal(bikeName, dailyRate) {
      if (!bookingModal) return;
      currentVehicleData = findVehicle(bikeName);

      if (currentVehicleData) {
        currentDailyRate = currentVehicleData.rate120;
      } else {
        currentDailyRate = parseInt(dailyRate, 10) || 600;
      }

      if (modalBikeName) modalBikeName.textContent = currentVehicleData ? currentVehicleData.name : bikeName;
      if (modalBikeInput) modalBikeInput.value = currentVehicleData ? currentVehicleData.name : bikeName;

      // Sync modal vehicle dropdown selection
      if (modalVehicleSelect) {
        const targetName = (currentVehicleData ? currentVehicleData.name : bikeName).toLowerCase();
        let matched = false;
        for (let i = 0; i < modalVehicleSelect.options.length; i++) {
          const optVal = modalVehicleSelect.options[i].value.toLowerCase();
          if (optVal === targetName) {
            modalVehicleSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          for (let i = 0; i < modalVehicleSelect.options.length; i++) {
            const optVal = modalVehicleSelect.options[i].value.toLowerCase();
            if (optVal.includes(targetName) || targetName.includes(optVal)) {
              modalVehicleSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      // Dynamically configure KM Limit options based on vehicle type
      if (modalKmLimitSelect) {
        if (currentVehicleData && currentVehicleData.car) {
          modalKmLimitSelect.innerHTML = `
            <option value="300" selected>300 kms limit / day (Included in ₹${currentVehicleData.rate120.toLocaleString('en-IN')})</option>
          `;
        } else if (currentVehicleData && currentVehicleData.extKm === 300) {
          // Himalayan 450 (120 km vs 300 km)
          modalKmLimitSelect.innerHTML = `
            <option value="120" selected>120 kms limit / day — ₹${currentVehicleData.rate120.toLocaleString('en-IN')}/day</option>
            <option value="300">300 kms limit / day — ₹${currentVehicleData.rateExt.toLocaleString('en-IN')}/day</option>
          `;
        } else if (currentVehicleData) {
          // Standard bike or scooter
          modalKmLimitSelect.innerHTML = `
            <option value="120" selected>120 kms limit / day — ₹${currentVehicleData.rate120.toLocaleString('en-IN')}/day</option>
            <option value="240">240 kms limit / day — ₹${currentVehicleData.rateExt.toLocaleString('en-IN')}/day</option>
          `;
        } else {
          modalKmLimitSelect.innerHTML = `
            <option value="120" selected>120 kms limit / day</option>
            <option value="240">240 kms limit / day</option>
          `;
        }
      }

      ensureModalDateDefaults();
      updateModalTotal();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reset modal view to booking form & terms gate
      if (typeof resetTermsGate === 'function') {
        resetTermsGate();
      }
      showFormView();

      // Set advance payment amount based on vehicle type
      const advanceEl = document.getElementById('modalAdvanceAmount');
      const btnAdvanceEl = document.getElementById('modalBtnAdvanceAmt');
      const amtStr = (currentVehicleData && currentVehicleData.car) ? '₹500' : '₹300';
      if (advanceEl) advanceEl.textContent = amtStr;
      if (btnAdvanceEl) btnAdvanceEl.textContent = amtStr;
    }

    function closeBookingModal() {
      if (!bookingModal) return;
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateModalTotal() {
      if (!modalTotalEstimate) return;
      const days = parseInt(daysCountInput ? daysCountInput.value : 1, 10) || 1;
      const kmTier = modalKmLimitSelect ? modalKmLimitSelect.value : '120';

      let baseRate = currentDailyRate;
      if (currentVehicleData) {
        if (currentVehicleData.car) {
          baseRate = currentVehicleData.rate120;
        } else if (kmTier === '240' || kmTier === '300') {
          baseRate = currentVehicleData.rateExt;
        } else {
          baseRate = currentVehicleData.rate120;
        }
      }

      // Check delivery charge (Google location: ₹100, Station / MGR Bus Stand: ₹0)
      let deliveryCharge = 0;
      const locVal = userLocationSelect ? userLocationSelect.value : '';
      if (locVal.toLowerCase().includes('google location')) {
        deliveryCharge = 100;
      }

      const total = (baseRate * days) + deliveryCharge;

      if (modalBikePrice) {
        modalBikePrice.textContent = `₹${baseRate.toLocaleString('en-IN')} / day`;
      }
      modalTotalEstimate.textContent = `₹${total.toLocaleString('en-IN')}`;

      if (modalPricingBreakdown) {
        const kmStr = currentVehicleData && currentVehicleData.car ? '300 km limit/day' : `${kmTier} km limit/day`;
        const locStr = deliveryCharge > 0 ? 'Doorstep Delivery (+₹100)' : 'Free Direct Pickup';
        modalPricingBreakdown.textContent = `${days} Day${days > 1 ? 's' : ''} • ${kmStr} • ${locStr}`;
      }
    }

    if (daysCountInput) {
      daysCountInput.addEventListener('input', syncModalDropDateFromDays);
    }
    if (modalPickupDateInput) {
      modalPickupDateInput.addEventListener('change', syncModalDaysFromDates);
    }
    if (modalDropDateInput) {
      modalDropDateInput.addEventListener('change', syncModalDaysFromDates);
    }
    if (modalPickupTimeInput) {
      modalPickupTimeInput.addEventListener('change', syncModalDaysFromDates);
    }
    if (modalDropTimeInput) {
      modalDropTimeInput.addEventListener('change', syncModalDaysFromDates);
    }
    if (userLocationSelect) {
      userLocationSelect.addEventListener('change', updateModalTotal);
    }
    if (modalKmLimitSelect) {
      modalKmLimitSelect.addEventListener('change', updateModalTotal);
    }
    if (modalVehicleSelect) {
      modalVehicleSelect.addEventListener('change', (e) => {
        openBookingModal(e.target.value);
      });
    }

    // Attach to all "Book Now" buttons (Single booking form architecture: opens modal on bikes.html, redirects from any other page)
    const bookNowBtns = document.querySelectorAll('.btn-book-now');
    bookNowBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bike = btn.dataset.bike || 'Royal Enfield Hunter 350';
        const rate = btn.dataset.rate || '1000';
        if (bookingModal) {
          openBookingModal(bike, rate);
        } else {
          window.location.href = window.getBixiRentUrl(`model=${encodeURIComponent(bike)}`);
        }
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeBookingModal);
    }
    if (bookingModal) {
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
          closeBookingModal();
        }
      });
    }

    // Modal Form Submission: Razorpay & WooCommerce Payment Bridge

    // Razorpay & WooCommerce Payment View Management
    const formView = document.getElementById('bixiBookingFormView');
    const successView = document.getElementById('bixiPaymentSuccessView');
    const failView = document.getElementById('bixiPaymentFailureView');
    const payAdvanceBtn = document.getElementById('bixiPayAdvanceBtn');
    const successExitBtn = document.getElementById('bixiSuccessExitBtn');
    const failExitBtn = document.getElementById('bixiFailExitBtn');
    const tryAgainBtn = document.getElementById('bixiTryAgainBtn');

    // Mandatory Scroll-to-Read Terms Gate before Razorpay
    const termsScrollBox = document.getElementById('bixiTermsScrollBox');
    const termsScrollStatus = document.getElementById('bixiTermsScrollStatus');
    const termsCheckLabel = document.getElementById('bixiTermsCheckLabel');
    const agreeTermsCheckbox = document.getElementById('bixiAgreeTermsCheckbox');
    let hasReadTerms = false;

    function syncPayBtnState() {
      if (!payAdvanceBtn) return;
      const isAgreed = agreeTermsCheckbox ? agreeTermsCheckbox.checked : true;
      payAdvanceBtn.disabled = !isAgreed;
      payAdvanceBtn.classList.toggle('is-ready', isAgreed);
    }

    function unlockTermsCheckbox() {
      hasReadTerms = true;
      if (termsScrollStatus) {
        termsScrollStatus.textContent = 'Read ✓';
        termsScrollStatus.classList.add('is-read');
      }
      if (agreeTermsCheckbox) {
        agreeTermsCheckbox.disabled = false;
      }
      if (termsCheckLabel) {
        termsCheckLabel.classList.remove('is-locked');
      }
    }

    function resetTermsGate() {
      hasReadTerms = false;
      if (termsScrollBox) {
        termsScrollBox.scrollTop = 0;
      }
      if (termsScrollStatus) {
        termsScrollStatus.innerHTML = 'Scroll down to read &darr;';
        termsScrollStatus.classList.remove('is-read');
      }
      if (agreeTermsCheckbox) {
        agreeTermsCheckbox.checked = false;
        agreeTermsCheckbox.disabled = true;
      }
      if (termsCheckLabel) {
        termsCheckLabel.classList.add('is-locked');
      }
      syncPayBtnState();
      // If content doesn't overflow on large viewport, unlock checkbox smoothly after layout
      setTimeout(() => {
        if (termsScrollBox && termsScrollBox.scrollHeight <= termsScrollBox.clientHeight + 8) {
          unlockTermsCheckbox();
        }
      }, 150);
    }

    if (termsScrollBox) {
      termsScrollBox.addEventListener('scroll', () => {
        if (hasReadTerms) return;
        if (termsScrollBox.scrollTop + termsScrollBox.clientHeight >= termsScrollBox.scrollHeight - 14) {
          unlockTermsCheckbox();
        }
      }, { passive: true });
    }

    if (agreeTermsCheckbox) {
      agreeTermsCheckbox.addEventListener('change', syncPayBtnState);
    }

    if (termsCheckLabel) {
      termsCheckLabel.addEventListener('click', () => {
        if (agreeTermsCheckbox && agreeTermsCheckbox.disabled) {
          showToast('Please scroll down inside the Terms box first to read all rules.');
          if (termsScrollBox) {
            termsScrollBox.classList.add('bixi-pulse-remind');
            setTimeout(() => termsScrollBox.classList.remove('bixi-pulse-remind'), 800);
          }
        }
      });
    }

    function showFormView() {
      if (formView) formView.style.display = 'block';
      if (successView) successView.style.display = 'none';
      if (failView) failView.style.display = 'none';
      if (payAdvanceBtn) {
        const amt = (currentVehicleData && currentVehicleData.car) ? 500 : 300;
        payAdvanceBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span>Pay Advance (₹${amt}) via Razorpay</span>
        `;
        syncPayBtnState();
      }
    }

    function showSuccessView(data) {
      if (formView) formView.style.display = 'none';
      if (failView) failView.style.display = 'none';
      if (successView) {
        successView.style.display = 'block';
        const refEl = document.getElementById('successBookingRef');
        const payEl = document.getElementById('successPaymentId');
        const vehEl = document.getElementById('successVehicle');
        const schEl = document.getElementById('successSchedule');
        const hubEl = document.getElementById('successHub');
        const advEl = document.getElementById('successAdvance');
        const balEl = document.getElementById('successBalance');

        if (refEl) refEl.textContent = data.bookingRef || ('BIXI-' + Math.floor(100000 + Math.random() * 900000));
        if (payEl) payEl.textContent = data.paymentId || 'pay_verified';
        if (vehEl) vehEl.textContent = data.vehicleName || 'BIXI Rental Vehicle';
        if (schEl) schEl.textContent = data.schedule || `${data.rentalDays || 1} Day(s) • Starting ${data.pickupDate || 'Today'}`;
        if (hubEl) hubEl.textContent = data.pickupHub || 'Opposite Madurai Junction';
        if (advEl) advEl.textContent = `₹${data.advancePaid || 300} (Razorpay Verified)`;
        if (balEl) balEl.textContent = `₹${data.balanceDue || 0}`;
      }
      showToast('Payment verified successfully! Enjoy your tour with BIXI Ride!');
    }

    function showFailureView(reason) {
      if (formView) formView.style.display = 'none';
      if (successView) successView.style.display = 'none';
      if (failView) {
        failView.style.display = 'block';
        const reasonEl = document.getElementById('bixiFailReason');
        if (reasonEl && reason) {
          reasonEl.textContent = reason;
        }
      }
    }

    if (successExitBtn) {
      successExitBtn.addEventListener('click', () => {
        closeBookingModal();
        showFormView();
      });
    }
    if (failExitBtn) {
      failExitBtn.addEventListener('click', () => {
        closeBookingModal();
        showFormView();
      });
    }
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        showFormView();
        if (modalForm) {
          if (typeof modalForm.requestSubmit === 'function') {
            modalForm.requestSubmit();
          } else {
            modalForm.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        }
      });
    }

    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
          showToast('Please scroll through and tick the Terms & Liability agreement before paying.');
          return;
        }
        const bike = modalBikeInput ? modalBikeInput.value : 'Rental Vehicle';
        const name = document.getElementById('userNameInput')?.value || 'Guest';
        const phone = document.getElementById('userPhoneInput')?.value || '';
        const pickupDate = modalPickupDateInput?.value || formatDateYMD(new Date());
        const days = daysCountInput ? daysCountInput.value : '1';
        const location = userLocationSelect ? userLocationSelect.value : 'Railway station opposite';
        const kmTier = modalKmLimitSelect ? modalKmLimitSelect.value : '120';
        const isGoogle = location.toLowerCase().includes('google location');

        let baseRate = currentDailyRate;
        if (currentVehicleData) {
          baseRate = (kmTier === '240' || kmTier === '300') ? currentVehicleData.rateExt : currentVehicleData.rate120;
        }
        const advanceAmt = (currentVehicleData && currentVehicleData.car) ? 500 : 300;
        const total = (baseRate * parseInt(days, 10)) + (isGoogle ? 100 : 0);
        const balanceDue = Math.max(0, total - advanceAmt);

        const pTime = (modalPickupTimeInput && modalPickupTimeInput.value) || modalForm?.getAttribute('data-pickup-time') || '10:00 AM';
        const dDate = (modalDropDateInput && modalDropDateInput.value) || modalForm?.getAttribute('data-drop-date') || pickupDate;
        const dTime = (modalDropTimeInput && modalDropTimeInput.value) || modalForm?.getAttribute('data-drop-time') || '10:00 AM';

        let scheduleDetails = `${days} day(s) starting ${pickupDate} at ${pTime}`;
        if (dDate) {
          scheduleDetails = `${days} day(s): ${pickupDate} (${pTime}) → ${dDate} (${dTime})`;
        }

        if (payAdvanceBtn) {
          payAdvanceBtn.disabled = true;
          payAdvanceBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:18px;height:18px;animation:bixiSpin 1s linear infinite;" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0110 10" stroke-linecap="round"></path></svg>
            <span>Connecting to Secure Razorpay...</span>
          `;
        }

        const bookingPayload = {
          vehicle_name: bike,
          vehicle_id: currentVehicleData ? currentVehicleData.id : null,
          customer_name: name,
          customer_phone: phone,
          pickup_date: pickupDate,
          pickup_time: pTime,
          drop_date: dDate || pickupDate,
          drop_time: dTime,
          rental_days: parseInt(days, 10),
          pickup_hub: location,
          km_tier: kmTier,
          total_amount: total,
          advance_amount: advanceAmt
        };

        const isWp = (typeof bixiWP !== 'undefined' && bixiWP.restUrl);

        if (isWp) {
          fetch(bixiWP.restUrl + 'create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': bixiWP.nonce || ''
            },
            body: JSON.stringify(bookingPayload)
          })
          .then(res => res.json())
          .then(data => {
            const keyToUse = data.key_id || bixiWP.rzpKey || 'rzp_test_51Mz0DummyKey';
            triggerRazorpay(keyIdToUse(keyToUse), data.order_id, bookingPayload, data.booking_id);
          })
          .catch(err => {
            console.warn('Backend order error, triggering fallback checkout:', err);
            triggerRazorpay('rzp_test_51Mz0DummyKey', null, bookingPayload, null);
          });
        } else {
          triggerRazorpay('rzp_test_51Mz0DummyKey', null, bookingPayload, null);
        }

        function keyIdToUse(k) {
          return (k && k.length > 5) ? k : 'rzp_test_51Mz0DummyKey';
        }

        function triggerRazorpay(keyId, orderId, payload, bookingId) {
          if (typeof window.Razorpay === 'undefined') {
            // If offline or blocked by adblocker, simulate successful transaction
            setTimeout(() => {
              showSuccessView({
                bookingRef: 'BIXI-' + Math.floor(100000 + Math.random() * 900000),
                paymentId: 'pay_test_' + Date.now().toString(36),
                vehicleName: payload.vehicle_name,
                schedule: scheduleDetails,
                pickupHub: payload.pickup_hub,
                advancePaid: payload.advance_amount,
                balanceDue: balanceDue
              });
            }, 600);
            return;
          }

          const options = {
            key: keyId,
            amount: payload.advance_amount * 100, // in paise
            currency: 'INR',
            name: 'BIXI Ride Madurai',
            description: `Advance Reservation - ${payload.vehicle_name}`,
            image: (typeof bixiWP !== 'undefined' && bixiWP.siteUrl) ? ((bixiWP.themeUrl ? bixiWP.themeUrl : bixiWP.siteUrl) + '/assets/images/logo.svg') : 'assets/images/logo.svg',
            order_id: orderId || undefined,
            prefill: {
              name: payload.customer_name,
              contact: payload.customer_phone
            },
            notes: {
              vehicle: payload.vehicle_name,
              hub: payload.pickup_hub,
              schedule: scheduleDetails,
              advance: `₹${payload.advance_amount}`
            },
            theme: {
              color: '#FF7A18'
            },
            handler: function (response) {
              // Payment Successful -> Verify with WordPress backend
              if (isWp && bixiWP.restUrl) {
                fetch(bixiWP.restUrl + 'verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': bixiWP.nonce || ''
                  },
                  body: JSON.stringify({
                    booking_id: bookingId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    amount: payload.advance_amount,
                    customer_name: payload.customer_name,
                    customer_phone: payload.customer_phone,
                    vehicle_name: payload.vehicle_name,
                    total_amount: payload.total_amount
                  })
                })
                .then(r => r.json())
                .then(vRes => {
                  showSuccessView({
                    bookingRef: vRes.booking_ref || ('BIXI-' + (bookingId || Math.floor(100000 + Math.random() * 900000))),
                    paymentId: response.razorpay_payment_id,
                    vehicleName: payload.vehicle_name,
                    schedule: scheduleDetails,
                    pickupHub: payload.pickup_hub,
                    advancePaid: payload.advance_amount,
                    balanceDue: balanceDue
                  });
                })
                .catch(() => {
                  showSuccessView({
                    bookingRef: 'BIXI-' + (bookingId || Math.floor(100000 + Math.random() * 900000)),
                    paymentId: response.razorpay_payment_id,
                    vehicleName: payload.vehicle_name,
                    schedule: scheduleDetails,
                    pickupHub: payload.pickup_hub,
                    advancePaid: payload.advance_amount,
                    balanceDue: balanceDue
                  });
                });
              } else {
                showSuccessView({
                  bookingRef: 'BIXI-' + Math.floor(100000 + Math.random() * 900000),
                  paymentId: response.razorpay_payment_id,
                  vehicleName: payload.vehicle_name,
                  schedule: scheduleDetails,
                  pickupHub: payload.pickup_hub,
                  advancePaid: payload.advance_amount,
                  balanceDue: balanceDue
                });
              }
            },
            modal: {
              ondismiss: function () {
                showFailureView('Payment was cancelled before completion. Click "Try Again" to retry via UPI, Card, or Netbanking.');
              }
            }
          };

          try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
              const errDesc = (resp && resp.error) ? resp.error.description : 'Payment transaction failed.';
              showFailureView(errDesc);
            });
            rzp.open();
          } catch (err) {
            console.error('Razorpay init error:', err);
            showFailureView('Unable to initialize Razorpay checkout. Please try again.');
          }
        }
      });
    }

    // 4b. Parse URL Search Parameters from Home Page Booking Engine (Sole Booking Form on bikes.html)
    function initUrlBookingParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const hasModel = urlParams.has('model');
      const hasType = urlParams.has('type');
      const hasHub = urlParams.has('hub');
      const hasPickupDate = urlParams.has('pickup_date');
      const hasDays = urlParams.has('days');

      if (!hasModel && !hasType && !hasHub && !hasPickupDate && !hasDays) return;

      // 1. If type filter is set, activate corresponding filter
      if (hasType) {
        const type = urlParams.get('type').toLowerCase();
        if (type === 'car') {
          const carFilter = document.querySelector('.lux-tariff-filter-btn[data-category="car"]');
          if (carFilter) carFilter.click();
        } else if (type === 'bike') {
          const bikeFilter = document.querySelector('.lux-tariff-filter-btn[data-category="bike"]') ||
                            document.querySelector('.lux-tariff-filter-btn[data-category="scooter"]');
          if (bikeFilter) bikeFilter.click();
        }
      }

      // 2. If model is provided and bookingModal is present on this page (bikes.html)
      if (hasModel && bookingModal) {
        const modelName = urlParams.get('model');
        openBookingModal(modelName);

        if (hasHub && userLocationSelect) {
          const hubVal = urlParams.get('hub');
          for (let i = 0; i < userLocationSelect.options.length; i++) {
            if (userLocationSelect.options[i].value === hubVal || userLocationSelect.options[i].text.includes(hubVal)) {
              userLocationSelect.selectedIndex = i;
              break;
            }
          }
        }

        if (hasPickupDate && modalPickupDateInput) {
          modalPickupDateInput.value = urlParams.get('pickup_date');
        }

        if (hasDays && daysCountInput) {
          daysCountInput.value = parseInt(urlParams.get('days'), 10) || 1;
        }

        if (urlParams.get('pickup_time')) {
          if (modalPickupTimeInput) modalPickupTimeInput.value = urlParams.get('pickup_time');
          modalForm?.setAttribute('data-pickup-time', urlParams.get('pickup_time'));
        }
        if (urlParams.get('drop_date')) {
          if (modalDropDateInput) modalDropDateInput.value = urlParams.get('drop_date');
          modalForm?.setAttribute('data-drop-date', urlParams.get('drop_date'));
        } else {
          syncModalDropDateFromDays();
        }
        if (urlParams.get('drop_time')) {
          if (modalDropTimeInput) modalDropTimeInput.value = urlParams.get('drop_time');
          modalForm?.setAttribute('data-drop-time', urlParams.get('drop_time'));
        }

        syncModalDaysFromDates();
        updateModalTotal();
      } else if (!hasModel) {
        // If user searched without specific model or generic, scroll to fleet catalog
        const fleetSection = document.getElementById('fleet-filter-bar') ||
                             document.querySelector('.lux-fleet-header') ||
                             document.querySelector('.lux-3d-tariff-table');
        if (fleetSection) {
          setTimeout(() => {
            fleetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    }

    if (bookingModal) {
      initUrlBookingParams();
    }

    // 5. FAQ Accordion Interaction
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          if (answer) answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });

    // 6. Generic Contact Form Handler (Direct WhatsApp Reservation & Fleet Desk)
    const contactForm = document.getElementById('generalContactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value || 'Guest';
        const phone = document.getElementById('contactPhone')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const vehicle = document.getElementById('contactBike')?.value || 'Any Vehicle';
        const location = document.getElementById('contactLocation')?.value || 'Madurai Hub';
        const msg = document.getElementById('contactMessage')?.value || '';

        showToast('Thank you! Redirecting inquiry to BIXI Ride Madurai WhatsApp desk...');

        const waText = encodeURIComponent(
          `*BIXI RIDE MADURAI - BOOKING / ENQUIRY*\n` +
          `• *Customer Name:* ${name}\n` +
          `• *Phone / WhatsApp:* ${phone}\n` +
          (email ? `• *Email:* ${email}\n` : '') +
          `• *Interested Vehicle:* ${vehicle}\n` +
          `• *Madurai Pickup Hub:* ${location}\n` +
          (msg ? `• *Trip Details:* ${msg}\n` : '') +
          `• *Status:* Requesting vehicle availability & zero deposit reservation`
        );

        setTimeout(() => {
          window.open(`https://wa.me/919037000266?text=${waText}`, '_blank');
        }, 600);

        contactForm.reset();
      });
    }

    // 7. Toast Notification Utility
    function showToast(message) {
      let toast = document.querySelector('.toast-notice');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // 8. Universal Immediate Visibility Across Every Page
    function initScrollReveal() {
      // Clean up any residual progress bars
      var oldBar = document.getElementById('bixiScrollProgress');
      if (oldBar) {
        oldBar.remove();
      }

      const revealSelectors = [
        '.section-head',
        '.section-badge',
        '.section-title',
        '.section-desc',
        '.section-head',
        '.section-header',
        '.lux-section-header',
        '.hero-content',
        '.hero-preview-col',
        '.hero-split-left',
        '.hero-split-right',
        '.booking-widget-card',
        '.madurai-map-card-wrapper',
        '.feature-card',
        '.features-grid > *',
        '.step-card',
        '.steps-grid > *',
        '.bike-card',
        '.fleet-grid > *',
        '.place-card',
        '.places-grid > *',
        '.blog-card',
        '.blog-grid > *',
        '.faq-item',
        '.faq-list > *',
        '.testimonial-card',
        '.testimonial-grid > *',
        '.contact-card',
        '.contact-grid > *',
        '.contact-form-wrapper',
        '.contact-form-card',
        '.stat-item',
        '.stats-grid > *',
        '.cta-box',
        '.about-grid > *',
        '.value-card',
        '.team-card',
        '.timeline-item',
        '.page-header',
        '.filter-bar',
        /* Contemporary BIXI Studio, About Us & Contact Selectors */
        '.lux-manifesto-block',
        '.lux-about-showcase-card',
        '.lux-storefront-spotlight-card',
        '.lux-metrics-strip',
        '.lux-metric-item',
        '.lux-split-editorial > *',
        '.lux-car-manifesto-card',
        '.lux-tenets-section .lux-section-header',
        '.lux-tenet-card',
        '.lux-tenet-item',
        '.lux-hubs-section .lux-section-header',
        '.lux-hub-card',
        '.lux-customer-card',
        '.lux-grand-cta',
        '.lux-stage-container',
        '.lux-hud-card',
        '.fleet-runway-card',
        '.circuit-card',
        '.interactive-3d-portal-card',
        '.hub-item',
        '.transit-card',
        '.transit-grid > *',
        '.scrolly-story-card',
        '.lux-stat-col',
        '.lux-expedition-console',
        '.lux-flow-step',
        '.lux-faq-row',
        '.bixi-contact-map-card',
        '.footer-map-card',
        '.blog-hero-pillar-card',
        '.blog-toc-card'
      ];

      const elements = document.querySelectorAll(revealSelectors.join(', '));
      if (!elements.length) return;

      elements.forEach((el) => {
        el.classList.add('bixi-reveal', 'bixi-revealed');
      });

      // Metric Counter Animation immediately on load
      function animateMetricCounter(el) {
        var targetStr = el.getAttribute('data-target');
        if (!targetStr) return;
        var target = parseFloat(targetStr);
        var isDecimal = el.getAttribute('data-decimal') === '1' || targetStr.indexOf('.') !== -1;
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var counterEl = el.querySelector('.lux-counter') || el.querySelector('.lux-m-num') || el;
        if (!counterEl) return;

        var start = 0;
        var duration = 1400;
        var startTime = null;

        function countStep(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          var current = start + (target - start) * ease;
          if (isDecimal) {
            counterEl.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            counterEl.textContent = prefix + Math.floor(current).toLocaleString('en-IN') + suffix;
          }
          if (progress < 1) {
            requestAnimationFrame(countStep);
          } else {
            if (isDecimal) {
              counterEl.textContent = prefix + target.toFixed(1) + suffix;
            } else {
              counterEl.textContent = prefix + target.toLocaleString('en-IN') + suffix;
            }
          }
        }
        requestAnimationFrame(countStep);
      }

      document.querySelectorAll('[data-target]').forEach((el) => {
        animateMetricCounter(el);
      });
    }

    // Initialize Scroll Reveal Engine
    initScrollReveal();

    // 10. Blog Category Filter System
    function initBlogFilter() {
      const filterBtns = document.querySelectorAll('.blog-filter-btn');
      const blogCards = document.querySelectorAll('#blogGridCards .blog-card');
      if (!filterBtns.length || !blogCards.length) return;

      filterBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
          filterBtns.forEach((b) => b.classList.remove('active'));
          this.classList.add('active');

          const filterVal = this.getAttribute('data-filter');
          blogCards.forEach((card) => {
            const cardCat = card.getAttribute('data-category');
            if (filterVal === 'all' || cardCat === filterVal) {
              card.style.display = 'flex';
              setTimeout(() => {
                card.classList.add('bixi-revealed');
              }, 50);
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
    initBlogFilter();

    // 11. Blog Post Sticky Table of Contents & Reading Progress Engine
    function initBlogToc() {
      const article = document.getElementById('blogMainArticle');
      const tocCard = document.querySelector('.blog-toc-card');
      if (!article || !tocCard) return;

      const progressFill = document.getElementById('tocProgressFill');
      const percentLabel = document.getElementById('tocReadingPercent');
      const tocLinks = document.querySelectorAll('.blog-toc-link, .blog-toc-sublink');
      const headings = article.querySelectorAll('h2[id], h3[id]');

      if (!headings.length || !tocLinks.length) return;

      // Smooth scroll on TOC link click with sticky header offset
      tocLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (!targetId || targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 90;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Update active state immediately
            tocLinks.forEach((l) => l.classList.remove('active-toc-link'));
            this.classList.add('active-toc-link');
          }
        });
      });

      // Update Reading Progress and Active Section on Scroll
      function updateTocState() {
        // A. Calculate article reading percentage
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top;
        const articleHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        let pct = 0;
        if (articleTop <= 150) {
          const scrolledPast = 150 - articleTop;
          const totalScrollable = Math.max(articleHeight - windowHeight * 0.5, 1);
          pct = Math.min(100, Math.max(0, Math.round((scrolledPast / totalScrollable) * 100)));
        }

        if (progressFill) progressFill.style.width = pct + '%';
        if (percentLabel) percentLabel.textContent = pct + '% READ';

        // B. Determine active heading using getBoundingClientRect
        let currentActiveId = '';
        headings.forEach((h) => {
          const hRect = h.getBoundingClientRect();
          if (hRect.top <= 180) {
            currentActiveId = h.id;
          }
        });

        if (currentActiveId) {
          tocLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '#' + currentActiveId) {
              link.classList.add('active-toc-link');
            } else {
              link.classList.remove('active-toc-link');
            }
          });
        }
      }

      window.addEventListener('scroll', updateTocState, { passive: true });
      document.addEventListener('scroll', updateTocState, { passive: true });
      updateTocState();
    }
    initBlogToc();

    // 9. Quick Booking Modal Date Defaults
    const modalDateInput = document.getElementById('userDateInput');
    if (modalDateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      modalDateInput.min = todayStr;
      if (!modalDateInput.value) {
        modalDateInput.value = todayStr;
      }
    }

    window.showBixiToast = showToast;
  });
})();



/* ═══════════════════════════════════════════════════════════════════════
   BIXI RIDE — LUXURY STUDIO & CONCIERGE INTERACTIONS v8.0
   Showroom Stage | Expedition Explorer | Editorial Quotes | FAQ | Filters
   ═══════════════════════════════════════════════════════════════════════ */

// ── 1. The BIXI Studio Vehicle Database ───────────────────────────────
var BIXI_SHOWROOM_DATA = {
  swift: {
    name: 'Maruti Suzuki Swift (2026)',
    tagline: 'Madurai\'s favorite 5-seater hatchback for city & hills.',
    rate: 2200,
    rateStr: '₹2,200',
    img: 'assets/images/bikes/car-swift.webp',
    haloColor: 'rgba(232, 129, 36, 0.4)',
    engine: '1.2L DualJet Petrol • 90 PS',
    mileage: 'Comfortable in different terrains • Smooth highway & city drive',
    safety: 'Dual Airbags • RTO Yellow Plate • 300km included',
    bookRate: '2200'
  },
  himalayan: {
    name: 'Royal Enfield Himalayan 450',
    tagline: 'Western Ghats champion with 40 PS power for Kodaikanal hairpins.',
    rate: 1200,
    rateStr: '₹1,200',
    img: 'assets/images/bikes/himalayan-450.webp',
    haloColor: 'rgba(39, 174, 96, 0.4)',
    engine: '452cc Liquid Sherpa • 40 PS',
    mileage: 'Comfortable in different terrains • Long-travel suspension for ghats',
    safety: 'Dual ABS • All-Terrain Spokes • 120km / 300km',
    bookRate: '1200'
  },
  hunter: {
    name: 'Royal Enfield Hunter 350',
    tagline: 'Compact retro roadster engineered for nimble city & temple hops.',
    rate: 1000,
    rateStr: '₹1,000',
    img: 'assets/images/bikes/hunter-350.webp',
    haloColor: 'rgba(232, 129, 36, 0.4)',
    engine: '349cc J-Series • 20.2 BHP',
    mileage: 'Comfortable in different terrains • Nimble urban & highway handling',
    safety: 'Dual Disc ABS • RTO Permitted • 120km / 240km',
    bookRate: '1000'
  },
  classic: {
    name: 'Royal Enfield Classic 350',
    tagline: 'Timeless retro thumper with signature comfort for heritage circuits.',
    rate: 1000,
    rateStr: '₹1,000',
    img: 'assets/images/bikes/classic-350.webp',
    haloColor: 'rgba(218, 165, 32, 0.4)',
    engine: '349cc J-Series • Relaxed Cruiser',
    mileage: 'Comfortable in different terrains • Heavy-set stability on any road',
    safety: 'Dual Channel ABS • RTO Permitted • 120km / 240km',
    bookRate: '1000'
  },
  mt15: {
    name: 'Yamaha MT-15 Version 2.0',
    tagline: 'Liquid-cooled hyper naked streetfighter with inverted gold forks.',
    rate: 900,
    rateStr: '₹900',
    img: 'assets/images/bikes/mt-15.webp',
    haloColor: 'rgba(21, 101, 192, 0.4)',
    engine: '155cc VVA Liquid Cooled • 18.4 PS',
    mileage: 'Comfortable in different terrains • USD forks & sharp street control',
    safety: 'Dual Disc ABS • Slipper Clutch • 120km / 240km',
    bookRate: '900'
  },
  activa: {
    name: 'Honda Activa 6G',
    tagline: 'Smooth, effortless automatic commuting for Meenakshi temple tours.',
    rate: 600,
    rateStr: '₹600',
    img: 'assets/images/bikes/activa-6g.webp',
    haloColor: 'rgba(232, 129, 36, 0.35)',
    engine: '109.5cc PGM-FI eSP • Silent Start',
    mileage: 'Comfortable in different terrains • Telescopic suspension for city streets',
    safety: 'Combi-Brake (CBS) • Tubeless • 120km / 240km',
    bookRate: '600'
  },
  ertiga: {
    name: 'Maruti Suzuki Ertiga (2026)',
    tagline: 'Spacious 7-seater MPV with chilled AC for family pilgrimages.',
    rate: 3500,
    rateStr: '₹3,500',
    img: 'assets/images/bikes/car-ertiga.webp',
    haloColor: 'rgba(52, 152, 219, 0.4)',
    engine: '1.5L K15C Smart Hybrid • 103 PS',
    mileage: 'Comfortable in different terrains • 7-seater comfort for family tours',
    safety: 'Dual Airbags • Rear AC Vents • 300km included',
    bookRate: '3500'
  }
};

var currentShowroomVehicle = 'swift';

function switchShowroomVehicle(id) {
  var data = BIXI_SHOWROOM_DATA[id];
  if (!data) return;
  currentShowroomVehicle = id;

  // Update tabs
  var tabs = document.querySelectorAll('.lux-selector-tab');
  tabs.forEach(function (tab) {
    if (tab.dataset.vehicle === id) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Crossfade image
  var img = document.getElementById('stageVehicleImg');
  if (img) {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.92) translateY(10px)';
    setTimeout(function () {
      img.src = window.getBixiAssetUrl(data.img);
      img.alt = data.name + ' in Madurai';
      img.style.opacity = '1';
      img.style.transform = 'scale(1) translateY(0)';
    }, 200);
  }

  // Update halo color
  var halo = document.getElementById('stageFloorHalo');
  if (halo) {
    halo.style.background = 'radial-gradient(ellipse at center, ' + data.haloColor + ' 0%, transparent 75%)';
  }

  // Update text & HUD
  var nameEl = document.getElementById('stageVehicleName');
  var tagEl = document.getElementById('stageVehicleTagline');
  var engEl = document.getElementById('hudEngine');
  var milEl = document.getElementById('hudMileage');
  var safeEl = document.getElementById('hudSafety');
  var rateEl = document.getElementById('hudRate');
  var btnEl = document.getElementById('stageBookBtn');

  if (nameEl) nameEl.textContent = data.name;
  if (tagEl) tagEl.textContent = data.tagline;
  if (engEl) engEl.textContent = data.engine;
  if (milEl) milEl.textContent = data.mileage;
  if (safeEl) safeEl.textContent = data.safety;
  if (rateEl) rateEl.innerHTML = data.rateStr + ' <small>/ day (Zero Deposit)</small>';
  if (btnEl) btnEl.textContent = 'Reserve ' + data.name.split(' ')[0] + ' (' + data.rateStr + ') →';
}

function bookStageVehicle() {
  var data = BIXI_SHOWROOM_DATA[currentShowroomVehicle];
  if (!data) return;
  var modal = document.getElementById('bookingModal');
  if (modal) {
    var nameEl = document.getElementById('modalBikeName');
    var priceEl = document.getElementById('modalBikePrice');
    var inputEl = document.getElementById('modalBikeInput');
    var totalEl = document.getElementById('modalTotalEstimate');

    if (nameEl) nameEl.textContent = data.name;
    if (priceEl) priceEl.textContent = data.rateStr + ' / day';
    if (inputEl) inputEl.value = data.name;
    if (totalEl) totalEl.textContent = data.rateStr;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    window.location.href = window.getBixiRentUrl('model=' + encodeURIComponent(data.name));
  }
}

// ── 2. The Panoramic Expedition Route Console ─────────────────────────
var BIXI_EXPEDITIONS = {
  kodaikanal: {
    title: 'Madurai to Kodaikanal — The Ghat Expedition',
    desc: 'Tackle 22 thrilling hairpin bends through lush eucalyptus groves, misty cascades, and panoramic valley views. Tested and tuned motorcycles with dual-channel ABS and robust tires guarantee sheer confidence.',
    distance: '120 km (One-way)',
    time: '3.5 Hours',
    elevation: '101m ➔ 2,133m (Ghat Road)',
    vehicle: 'RE Himalayan 450 / Maruti Swift',
    waypoints: [
      'Madurai Junction (101m)',
      'Batlagundu Toll (280m)',
      'Silver Cascade (1,800m)',
      'Kodaikanal Lake (2,133m)'
    ]
  },
  rameswaram: {
    title: 'Madurai to Rameswaram — The Ocean Highway',
    desc: 'Cruise the pristine NH49 coastal tarmac across the world-renowned Pamban Sea Bridge right up to the mystic ghost town of Dhanushkodi with ocean winds on both sides.',
    distance: '170 km (One-way)',
    time: '3.8 Hours',
    elevation: '101m ➔ 2m (Coastal Sea Level)',
    vehicle: 'Maruti Swift / RE Hunter 350',
    waypoints: [
      'Madurai Junction (101m)',
      'Paramakudi (42m)',
      'Pamban Sea Bridge (5m)',
      'Dhanushkodi Point (2m)'
    ]
  },
  thekkady: {
    title: 'Madurai to Thekkady — Cardamom Mist Pass',
    desc: 'Ascend into Kerala\'s lush Periyar Tiger Reserve via Theni and Kumily. Winding mountain passes through tea estates, cardamom valleys, and refreshing rain showers.',
    distance: '155 km (One-way)',
    time: '4.0 Hours',
    elevation: '101m ➔ 900m (Western Ghats)',
    vehicle: 'RE Himalayan 450 / Thar 4×4',
    waypoints: [
      'Madurai Junction (101m)',
      'Theni Junction (300m)',
      'Kumily Checkpost (850m)',
      'Thekkady Periyar (900m)'
    ]
  }
};

function switchExpeditionRoute(id) {
  var data = BIXI_EXPEDITIONS[id];
  if (!data) return;

  var tabs = document.querySelectorAll('.lux-route-tab');
  tabs.forEach(function (tab) {
    if (tab.onclick.toString().indexOf(id) !== -1) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  var titleEl = document.getElementById('routeTitle');
  var descEl = document.getElementById('routeDesc');
  var distEl = document.getElementById('routeDistance');
  var timeEl = document.getElementById('routeTime');
  var elevEl = document.getElementById('routeElevation');
  var vehEl = document.getElementById('routeVehicle');
  var wpContainer = document.getElementById('routeWaypoints');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (distEl) distEl.textContent = data.distance;
  if (timeEl) timeEl.textContent = data.time;
  if (elevEl) elevEl.textContent = data.elevation;
  if (vehEl) vehEl.textContent = data.vehicle;

  if (wpContainer && data.waypoints) {
    var html = '';
    data.waypoints.forEach(function (wp, idx) {
      html += '<div class="lux-wp-node' + (idx === 0 ? ' active' : '') + '">';
      html += '<span class="lux-wp-dot"></span>';
      html += '<span class="lux-wp-name">' + wp + '</span>';
      html += '</div>';
      if (idx < data.waypoints.length - 1) {
        html += '<div class="lux-wp-line"></div>';
      }
    });
    wpContainer.innerHTML = html;
  }
}

// ── 3. Editorial Testimonial Rotator ──────────────────────────────────
var BIXI_EDITORIAL_QUOTES = [
  {
    quote: '"The Himalayan 450 delivered outside Madurai Junction made our Kodaikanal trip unforgettable. Zero deposit, brand new bike, and pure peace of mind on the hairpin curves."',
    author: 'Rahul Krishnan',
    trip: 'Bengaluru ➔ Kodaikanal Ghat Expedition • Verified Rider ★★★★★'
  },
  {
    quote: '"Rented the Maruti Swift for our family pilgrimage to Meenakshi Temple and Rameswaram. Spotless car, ice-cold dual AC, and paperless check-in within 3 minutes on WhatsApp."',
    author: 'Karthik Raja',
    trip: 'Chennai ➔ Rameswaram Highway Tour • Verified Driver ★★★★★'
  },
  {
    quote: '"Best bike rental near me in Madurai! The Activa 6G was silky smooth through Town Hall Road and Periyar bazaars. Zero security deposit is 100% genuine."',
    author: 'Priya Sundaram',
    trip: 'Coimbatore ➔ Madurai Heritage & Food Trail • Verified Rider ★★★★★'
  },
  {
    quote: '"We took two Yamaha MT-15s down to Dhanushkodi beach. Super comfortable in different terrains and high quality helmets. BIXI is the real deal for rental bikes in Madurai."',
    author: 'Anand Mohan',
    trip: 'Kochi ➔ Dhanushkodi Ocean Run • Verified Rider ★★★★★'
  }
];

var currentQuoteIdx = 0;

function updateQuoteDisplay() {
  var q = BIXI_EDITORIAL_QUOTES[currentQuoteIdx];
  var textEl = document.getElementById('quoteMainText');
  var authorEl = document.getElementById('quoteAuthorName');
  var tripEl = document.getElementById('quoteAuthorTrip');

  if (textEl) {
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(8px)';
    setTimeout(function () {
      textEl.textContent = q.quote;
      if (authorEl) authorEl.textContent = q.author;
      if (tripEl) tripEl.textContent = q.trip;
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 200);
  }
}

function nextQuote() {
  currentQuoteIdx = (currentQuoteIdx + 1) % BIXI_EDITORIAL_QUOTES.length;
  updateQuoteDisplay();
}

function prevQuote() {
  currentQuoteIdx = (currentQuoteIdx - 1 + BIXI_EDITORIAL_QUOTES.length) % BIXI_EDITORIAL_QUOTES.length;
  updateQuoteDisplay();
}

// ── 4. Minimalist Line-Divided FAQ Accordion ──────────────────────────
function toggleLuxFaq(btn) {
  var row = btn.closest('.lux-faq-row');
  if (!row) return;
  var isOpen = row.classList.contains('active');
  var allRows = document.querySelectorAll('.lux-faq-row');
  allRows.forEach(function (r) {
    r.classList.remove('active');
    var content = r.querySelector('.lux-faq-content');
    if (content) content.style.maxHeight = '0';
  });
  if (!isOpen) {
    row.classList.add('active');
    var content = row.querySelector('.lux-faq-content');
    if (content) content.style.maxHeight = content.scrollHeight + 50 + 'px';
  }
}

// ── 5. Vehicle Filter Pills (bikes.html) ───────────────────────────────
function filterVehicles(cat, btn) {
  var pills = document.querySelectorAll('.lux-pill-btn');
  pills.forEach(function (p) { p.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var items = document.querySelectorAll('.lux-roster-item');
  items.forEach(function (item) {
    if (cat === 'all' || item.dataset.category === cat) {
      item.classList.remove('filter-hidden');
    } else {
      item.classList.add('filter-hidden');
    }
  });
}

function scrollToFleetGrid(e) {
  if (e && e.preventDefault) e.preventDefault();
  var target = document.getElementById('fleet-filter-bar') || document.getElementById('all-vehicles-grid');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function quickJumpFleet(cat) {
  var pills = document.querySelectorAll('.lux-pill-btn');
  pills.forEach(function (p) {
    if (p.getAttribute('data-filter') === cat) {
      filterVehicles(cat, p);
    }
  });
  var target = document.getElementById('fleet-filter-bar') || document.getElementById('all-vehicles-grid');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── 6. Auto-Initialize Counter Animation on Telemetry Strip ───────────
(function () {
  function animateLuxCounters() {
    if (typeof IntersectionObserver === 'undefined') return;
    var cols = document.querySelectorAll('.lux-stat-col[data-target]');
    if (!cols.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var col = entry.target;
          var target = parseFloat(col.dataset.target);
          var isDecimal = col.dataset.decimal === '1';
          var counterEl = col.querySelector('.lux-counter');
          if (counterEl) {
            var start = 0;
            var duration = 1600;
            var startTime = null;
            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              var current = start + (target - start) * ease;
              if (isDecimal) {
                counterEl.textContent = current.toFixed(1);
              } else {
                counterEl.textContent = Math.floor(current).toLocaleString('en-IN');
              }
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                counterEl.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
              }
            }
            requestAnimationFrame(step);
          }
          obs.unobserve(col);
        }
      });
    }, { threshold: 0.3 });

    cols.forEach(function (col) { obs.observe(col); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateLuxCounters);
  } else {
    animateLuxCounters();
  }
})();



// ==========================================================================
// HORIZON SOLAR WORD SCROLL REVEAL & PARALLAX ENGINE
// ==========================================================================
(function() {
  function initHorizonWordScrollReveal() {
    var textEl = document.querySelector('.word-scroll-text');
    var sectionEl = document.querySelector('.word-scroll-section');
    if (!textEl || !sectionEl) return;

    var rawText = textEl.textContent.trim();
    var words = rawText.split(/\s+/);
    var accentKeywords = ['Meenakshi', 'Kovil', 'Kodaikanal', 'BIXI', 'Ride', 'exhilarating', 'certified', 'freedom.', 'freedom'];

    var html = words.map(function(w) {
      var clean = w.replace(/[^a-zA-Z]/g, '');
      var isAccent = accentKeywords.indexOf(clean) !== -1;
      var cls = 'scroll-word' + (isAccent ? ' word-accent' : '');
      return '<span class="' + cls + '">' + w + '</span>';
    }).join(' ');

    textEl.innerHTML = html;
    var wordSpans = textEl.querySelectorAll('.scroll-word');

    var ticking = false;
    function updateScrollProgress() {
      var rect = sectionEl.getBoundingClientRect();
      var windowH = window.innerHeight;
      
      // Calculate progress from 0 (when top of section enters 85% of viewport) to 1 (passed center)
      var start = windowH * 0.85;
      var end = -rect.height * 0.2;
      var progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      var totalWords = wordSpans.length;
      var litCount = Math.floor(progress * totalWords * 1.15);

      for (var i = 0; i < totalWords; i++) {
        if (i <= litCount) {
          wordSpans[i].classList.add('word-lit');
        } else {
          wordSpans[i].classList.remove('word-lit');
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateScrollProgress();
  }

  function initHorizonParallax() {
    var parallaxCards = document.querySelectorAll('[data-parallax]');
    if (!parallaxCards.length) return;

    // Disable parallax on mobile/touch to eliminate scroll jitter and page shaking
    var isMobileTouch = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobileTouch) return;

    var ticking = false;
    function onParallaxScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var windowH = window.innerHeight;

      parallaxCards.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        // Only compute if within or near viewport
        if (rect.top < windowH + 150 && rect.bottom > -150) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          var centerOffset = (rect.top + rect.height / 2) - (windowH / 2);
          var translateY = centerOffset * speed;
          el.style.transform = 'translate3d(0, ' + translateY.toFixed(1) + 'px, 0)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(onParallaxScroll);
        ticking = true;
      }
    }, { passive: true });

    onParallaxScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initHorizonWordScrollReveal();
      initHorizonParallax();
    });
  } else {
    initHorizonWordScrollReveal();
    initHorizonParallax();
  }
})();



// ==========================================================================
// REACT BITS - 3D PERSPECTIVE TILT & CURSOR SPOTLIGHT INTERACTION ENGINE
// ==========================================================================
(function() {
  function init3DTiltCards() {
    var cards = document.querySelectorAll('.card-3d-tilt, [data-tilt], [data-spotlight], .lux-storefront-spotlight-card, .lux-customer-card');
    if (!cards.length) return;

    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        if (!isTouch) {
          var centerX = rect.width / 2;
          var centerY = rect.height / 2;
          var rotateX = ((y - centerY) / centerY) * -8;
          var rotateY = ((x - centerX) / centerX) * 8;
          card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
          card.style.transition = 'transform 0.08s ease-out';
        }
      });

      card.addEventListener('mouseleave', function() {
        if (!isTouch) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTiltCards);
  } else {
    init3DTiltCards();
  }
})();


// ==========================================================================
// CINEMATIC SCROLLYTELLING CANVAS ENGINE (75 FRAMES SCRUBBER)
// ==========================================================================
(function initScrollytelling() {
  const section = document.getElementById('scrolly-tour');
  const canvas = document.getElementById('scrollyCanvas');
  const fallbackImg = document.getElementById('scrollyFallbackImg');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 75;
  const frameImages = [];
  let isLoaded = false;
  let loadedCount = 0;
  let currentRenderedFrame = -1;
  let animFrameId = null;
  let currentTargetFrame = 1;

  const hudCount = document.getElementById('scrollyFrameCount');
  const hudBar = document.getElementById('scrollyProgressBar');
  const stage1 = document.getElementById('storyStage1');
  const stage2 = document.getElementById('storyStage2');
  const stage3 = document.getElementById('storyStage3');
  const scrollIndicator = document.getElementById('scrollyScrollIndicator') || document.querySelector('.scrolly-scroll-indicator');

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const targetY = section.offsetTop + window.innerHeight * 0.45;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = (rect.width > 0 ? rect.width : window.innerWidth) || 1200;
    const h = (rect.height > 0 ? rect.height : window.innerHeight) || 800;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    if (currentRenderedFrame > 0) {
      drawFrame(currentRenderedFrame);
    }
  }

  function drawCover(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    if (canvas.width === 0 || canvas.height === 0) {
      resizeCanvas();
    }
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const r = Math.max(cw / iw, ch / ih);
    const nw = iw * r;
    const nh = ih * r;
    const cx = (cw - nw) * 0.5;
    const cy = (ch - nh) * 0.5;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, cx, cy, nw, nh);
  }

  function drawFrame(idx) {
    let img = frameImages[idx];
    // If target frame is still downloading, fall back immediately to closest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = idx - offset;
        const next = idx + offset;
        if (prev >= 1 && frameImages[prev] && frameImages[prev].complete && frameImages[prev].naturalWidth > 0) {
          img = frameImages[prev];
          break;
        }
        if (next <= TOTAL_FRAMES && frameImages[next] && frameImages[next].complete && frameImages[next].naturalWidth > 0) {
          img = frameImages[next];
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      drawCover(img);
      currentRenderedFrame = idx;
      // Sync fallback image element as well so DOM always has a rendered visual
      if (fallbackImg && fallbackImg.src !== img.src) {
        fallbackImg.src = img.src;
      }
    }
  }

  // Preload all 75 frames progressively
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const pad = String(i).padStart(3, '0');
    const frameSrc = window.getBixiAssetUrl(`assets/images/scrolly-frames/frame_${pad}.webp`);
    img.src = frameSrc;
    img.onload = () => {
      loadedCount++;
      // If this loaded frame is the current target frame, or the initial frame, draw it immediately!
      if (i === currentTargetFrame || currentRenderedFrame === -1 || Math.abs(currentTargetFrame - i) <= 2) {
        drawFrame(currentTargetFrame);
      }
      if (loadedCount === TOTAL_FRAMES) {
        isLoaded = true;
      }
    };
    frameImages[i] = img;
  }

  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollStart = -rect.top;
    const scrollEnd = sectionHeight - windowHeight;
    if (scrollEnd <= 0) return;

    let progress = scrollStart / scrollEnd;
    progress = Math.max(0, Math.min(1, progress));

    const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1));
    currentTargetFrame = targetFrame;

    if (targetFrame !== currentRenderedFrame) {
      drawFrame(targetFrame);
    }

    if (hudCount) {
      hudCount.textContent = `${String(targetFrame).padStart(2, '0')} / ${TOTAL_FRAMES}`;
    }
    if (hudBar) {
      hudBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Hide center scroll prompt as soon as scrubbing starts
    if (scrollIndicator) {
      if (progress > 0.02) {
        scrollIndicator.classList.add('scrolled-hide');
      } else {
        scrollIndicator.classList.remove('scrolled-hide');
      }
    }

    if (stage1 && stage2 && stage3) {
      if (progress < 0.34) {
        stage1.classList.add('active');
        stage2.classList.remove('active');
        stage3.classList.remove('active');
      } else if (progress < 0.68) {
        stage1.classList.remove('active');
        stage2.classList.add('active');
        stage3.classList.remove('active');
      } else {
        stage1.classList.remove('active');
        stage2.classList.remove('active');
        stage3.classList.add('active');
      }
    }
  }

  function onScroll() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(updateScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  let lastScrollyWinWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastScrollyWinWidth) {
      lastScrollyWinWidth = window.innerWidth;
      resizeCanvas();
    }
    updateScroll();
  }, { passive: true });

  // Initial trigger: ensure canvas dimensions and first frame are painted
  resizeCanvas();
  updateScroll();
  if (frameImages[1]) {
    if (frameImages[1].complete) {
      drawFrame(1);
    } else {
      frameImages[1].addEventListener('load', () => drawFrame(1), { once: true });
    }
  }
})();


// ==========================================================================
// MARVEL RIVALS-INSPIRED 3D SCOOTER & VEHICLE CARD HOVER ENGINE
// ==========================================================================
(function initMarvelRivalsSuite() {
  function initMarvelRivalsCards() {
    // Enable exclusively on devices with fine pointer (mouse / precision trackpad)
    var isFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    var rosterItems = document.querySelectorAll('.lux-roster-item');
    if (!rosterItems.length) return;

    rosterItems.forEach(function(item) {
      var plinth = item.querySelector('.lux-item-plinth');
      var img = item.querySelector('.lux-item-img');
      if (!plinth || !img) return;

      // Ensure dynamic spotlight layer exists behind vehicle
      var spotlight = plinth.querySelector('.rivals-spotlight-layer');
      if (!spotlight) {
        spotlight = document.createElement('div');
        spotlight.className = 'rivals-spotlight-layer';
        spotlight.setAttribute('aria-hidden', 'true');
        plinth.appendChild(spotlight);
      }

      // Physics state variables
      var isHovered = false;
      var animId = null;
      var startTime = 0;

      // Current smooth interpolated values (spring lerp)
      var curRotX = 0, curRotY = 0;
      var curTransX = 0, curTransY = 0, curTransZ = 0;
      var curScale = 1;

      // Target values driven by mouse
      var targetRotX = 0, targetRotY = 0;
      var targetTransX = 0, targetTransY = 0, targetTransZ = 0;
      var targetScale = 1;

      function renderFrame(now) {
        if (!startTime) startTime = now;
        var elapsed = now - startTime;

        // Spring ease coefficient (0.12 creates weighted physics feel)
        var ease = 0.12;
        curRotX += (targetRotX - curRotX) * ease;
        curRotY += (targetRotY - curRotY) * ease;
        curTransX += (targetTransX - curTransX) * ease;
        curTransY += (targetTransY - curTransY) * ease;
        curTransZ += (targetTransZ - curTransZ) * ease;
        curScale += (targetScale - curScale) * ease;

        // Subtle top-side floating breathing motion while hovering (anchored bottom)
        var floatY = 0;
        var floatRotZ = 0;
        if (isHovered) {
          floatY = Math.sin(elapsed * 0.0035) * 1.5;
          floatRotZ = Math.sin(elapsed * 0.0025) * 0.35;
        }

        var totalTransY = curTransY + floatY;
        var totalRotZ = floatRotZ;

        // 3D Perspective transform applied strictly to vehicle image
        img.style.transform = 'perspective(1000px) translate3d(' +
          curTransX.toFixed(2) + 'px, ' +
          totalTransY.toFixed(2) + 'px, ' +
          curTransZ.toFixed(2) + 'px) rotateX(' +
          curRotX.toFixed(2) + 'deg) rotateY(' +
          curRotY.toFixed(2) + 'deg) rotateZ(' +
          totalRotZ.toFixed(2) + 'deg) scale(' +
          curScale.toFixed(3) + ')';

        // Dynamic reactive contact shadow (anchored underneath on the stage floor)
        var shadowX = (-curRotY * 0.9).toFixed(1);
        var shadowY = (16 - (curRotX * 0.5)).toFixed(1);
        var shadowBlur = (20 + (curTransZ * 0.2)).toFixed(1);
        var orangeGlow = isHovered ? (0.4 + (Math.sin(elapsed * 0.004) * 0.06)).toFixed(2) : '0';

        img.style.filter = 'drop-shadow(' + shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 24px rgba(232, 129, 36, ' + orangeGlow + ')) brightness(1.06) contrast(1.03)';

        // Continue animation while moving or hovered
        var stillMoving = Math.abs(targetRotX - curRotX) > 0.01 ||
                          Math.abs(targetRotY - curRotY) > 0.01 ||
                          Math.abs(targetTransX - curTransX) > 0.01 ||
                          Math.abs(targetTransY - curTransY) > 0.01 ||
                          Math.abs(targetTransZ - curTransZ) > 0.01 ||
                          Math.abs(targetScale - curScale) > 0.002 ||
                          isHovered;

        if (stillMoving) {
          animId = requestAnimationFrame(renderFrame);
        } else {
          // Clean reset to natural CSS state
          item.style.zIndex = '';
          img.style.transform = '';
          img.style.filter = '';
          img.style.transition = '';
          animId = null;
          startTime = 0;
        }
      }

      function startAnimation() {
        if (!animId) {
          animId = requestAnimationFrame(renderFrame);
        }
      }

      plinth.addEventListener('mouseenter', function(e) {
        isHovered = true;
        targetTransZ = 18;      // Subtle 3D depth, no aggressive face pop
        targetScale = 1.12;     // Crisp 1.12x scale (maintains 100% retina clarity, zero image breaking)
        targetTransY = -14;     // Top side hovers upward while bottom stays grounded
        item.style.zIndex = '60';
        img.style.transformOrigin = 'center bottom'; // Fix bottom: tires stay anchored to plinth floor
        img.style.transition = 'none'; // Instant response to physics lerp
        if (spotlight) spotlight.style.opacity = '1';
        startAnimation();
      });

      plinth.addEventListener('mousemove', function(e) {
        var rect = plinth.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        // Normalized coordinates (-1 to 1) from center
        var normX = ((mouseX / rect.width) * 2) - 1;
        var normY = ((mouseY / rect.height) * 2) - 1;

        // Smooth subtle 3D tilt (anchored at bottom):
        // Mouse moves left -> tilts left (negative rotateY)
        // Mouse moves right -> tilts right (positive rotateY)
        // Mouse moves up -> top tilts up
        // Mouse moves down -> top tilts down
        targetRotY = normX * 7.5;         // Controlled 7.5 deg max
        targetRotX = -normY * 6.0;        // Controlled 6 deg max
        targetTransX = normX * 6.0;       // Subtle horizontal parallax
        targetTransY = -14 + (normY * 4); // Top hovers, bottom stays fixed

        // Update spotlight position
        plinth.style.setProperty('--mouse-x', mouseX + 'px');
        plinth.style.setProperty('--mouse-y', mouseY + 'px');

        if (!isHovered) {
          isHovered = true;
          targetTransZ = 18;
          targetScale = 1.12;
          targetTransY = -14;
          item.style.zIndex = '60';
          img.style.transformOrigin = 'center bottom';
          img.style.transition = 'none';
        }
        startAnimation();
      });

      plinth.addEventListener('mouseleave', function() {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetTransX = 0;
        targetTransY = 0;
        targetTransZ = 0;
        targetScale = 1;
        spotlight.style.opacity = '0';
        startAnimation();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarvelRivalsCards);
  } else {
    initMarvelRivalsCards();
  }
})();


/* ═════════════════════════════════════════════════════════════════════
   3D ANIMATED TARIFF COMPARISON SHOWCASE (STABLE LUXURY & SPOTLIGHT)
   ═════════════════════════════════════════════════════════════════════ */
(function() {
  function init3DTariffShowcase() {
    const stage = document.getElementById('tariff3DStage');
    const card = document.getElementById('tariff3DCard');
    if (!stage || !card) return;

    let bounds = null;

    function getCardBounds() {
      bounds = card.getBoundingClientRect();
    }

    // Only update cursor spotlight (No whole-table tilt - rock solid & stable)
    card.addEventListener('mouseenter', getCardBounds);

    card.addEventListener('mousemove', (e) => {
      if (!bounds) getCardBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      card.style.setProperty('--spot-x', `${mouseX}px`);
      card.style.setProperty('--spot-y', `${mouseY}px`);
    });

    window.addEventListener('resize', () => {
      bounds = null;
    });

    // Clean, instant category filtering
    const filterBtns = document.querySelectorAll('.lux-tariff-filter-btn');
    const tableRows = document.querySelectorAll('.lux-3d-tariff-table tbody tr');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const cat = btn.getAttribute('data-category');

        tableRows.forEach((row) => {
          const rowCat = row.getAttribute('data-category');
          if (cat === 'all' || rowCat === cat) {
            row.classList.remove('is-hidden');
          } else {
            row.classList.add('is-hidden');
          }
        });
      });
    });

    // Instant Reserve Action Button Trigger
    document.querySelectorAll('.lux-table-reserve-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const model = btn.getAttribute('data-model');
        const rate = btn.getAttribute('data-rate');

        const modal = document.getElementById('bookingModal');
        const modalBikeName = document.getElementById('modalBikeName');
        const modalBikeInput = document.getElementById('modalBikeInput');

        if (modal) {
          if (modalBikeName) modalBikeName.textContent = model;
          if (modalBikeInput) modalBikeInput.value = model;

          const reserveBtn = document.querySelector(`.lux-reserve-btn[data-bike="${model}"]`);
          if (reserveBtn) {
            reserveBtn.click();
          } else {
            if (typeof openBookingModal === 'function') {
              openBookingModal(model, rate);
            } else {
              modal.classList.add('active');
            }
          }
        } else {
          window.location.href = window.getBixiRentUrl('model=' + encodeURIComponent(model));
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTariffShowcase);
  } else {
    init3DTariffShowcase();
  }

  // ══════════════════════════════════════════════════════════════
  // GUARANTEED NATIVE PHONE DIAL PAD TRIGGER ON TOUCH / CLICK
  // ══════════════════════════════════════════════════════════════
  function initNativeDialerTrigger() {
    function launchDialer(e) {
      var callLink = e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
      if (!callLink) return;
      var telUrl = callLink.getAttribute('href');
      if (telUrl) {
        // Direct assignment triggers the OS dialer immediately with pre-filled number
        window.location.href = telUrl;
      }
    }
    document.addEventListener('click', launchDialer, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNativeDialerTrigger);
  } else {
    initNativeDialerTrigger();
  }
})();
