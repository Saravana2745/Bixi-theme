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

    const BIKE_MODELS = [
      { name: 'Royal Enfield Hunter 350', price: 899, sub: 'Retro Roadster • 350cc • Free Helmets' },
      { name: 'Royal Enfield Himalayan 450', price: 1499, sub: 'Adventure Tourer • Kodaikanal Ready' },
      { name: 'Yamaha MT-15 V2', price: 799, sub: 'Hyper Naked Street • 50+ kmpl' },
      { name: 'Honda Activa 6G', price: 499, sub: 'Automatic Scooter • Lightweight City Ride' },
      { name: 'Ather 450X Gen 3', price: 599, sub: 'Smart EV Scooter • Fast Charging Included' }
    ];

    const CAR_MODELS = [
      { name: 'Maruti Suzuki Swift (2026)', price: 2200, sub: '5-Seater Hatchback • 22 km/l • Self-Drive AC' },
      { name: 'Hyundai i20 N-Line', price: 2600, sub: '5-Seater Premium • Automatic • Sunroof' },
      { name: 'Mahindra Thar 4x4', price: 3800, sub: '4-Seater Off-Road SUV • Kodaikanal Expedition' },
      { name: 'Maruti Ertiga Hybrid', price: 3200, sub: '7-Seater Family MPV • Dual AC • Rameswaram Tour' }
    ];

    let currentVehicleMode = 'bike';
    let currentSelectedPrice = 899;
    let currentDays = 1;

    function renderModelOptions(mode) {
      if (!modelOptionsPanel) return;
      modelOptionsPanel.innerHTML = '';
      const list = mode === 'car' ? CAR_MODELS : BIKE_MODELS;

      list.forEach((item, index) => {
        const opt = document.createElement('div');
        opt.className = `custom-option-item ${index === 0 ? 'selected' : ''}`;
        opt.dataset.value = item.name;
        opt.dataset.price = item.price;
        opt.innerHTML = `
          <div class="custom-option-header">
            <span>${item.name}</span>
            <span class="custom-option-price">₹${item.price.toLocaleString('en-IN')}/day</span>
          </div>
          <div class="custom-option-sub">${item.sub}</div>
        `;
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          selectModel(item);
        });
        modelOptionsPanel.appendChild(opt);
      });

      selectModel(list[0]);
    }

    function selectModel(item) {
      if (selectedModelText) selectedModelText.textContent = item.name;
      if (hiddenModel) hiddenModel.value = item.name;
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
      closeAllDropdowns();
    }

    function updateFareEstimate() {
      if (!liveEstimate) return;
      const total = currentSelectedPrice * currentDays;
      liveEstimate.innerHTML = `₹${total.toLocaleString('en-IN')} <span style="font-weight:400;font-size:0.8rem;">(${currentDays} Day${currentDays > 1 ? 's' : ''})</span>`;
    }

    if (tabBikes && tabCars) {
      tabBikes.addEventListener('click', () => {
        tabBikes.classList.add('active');
        tabCars.classList.remove('active');
        currentVehicleMode = 'bike';
        if (hiddenType) hiddenType.value = 'bike';
        if (vehicleLabelText) vehicleLabelText.textContent = 'Select Rental Bike';
        renderModelOptions('bike');
      });

      tabCars.addEventListener('click', () => {
        tabCars.classList.add('active');
        tabBikes.classList.remove('active');
        currentVehicleMode = 'car';
        if (hiddenType) hiddenType.value = 'car';
        if (vehicleLabelText) vehicleLabelText.textContent = 'Select Self-Drive Car';
        renderModelOptions('car');
      });

      renderModelOptions('bike');
    }

    // Generic Custom Dropdown Click Handlers
    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-box').forEach((box) => {
        box.classList.remove('open');
      });
    }

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
    });

    document.addEventListener('click', closeAllDropdowns);

    // Hub select options click
    const hubBox = document.getElementById('hubSelectBox');
    if (hubBox) {
      hubBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.dataset.value;
          const header = item.querySelector('.custom-option-header')?.textContent || val;
          const selectedText = document.getElementById('selectedHubText');
          if (selectedText) selectedText.textContent = header;
          if (hiddenHub) hiddenHub.value = val;
          hubBox.querySelectorAll('.custom-option-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');
          hubBox.classList.remove('open');
        });
      });
    }

    // Duration select options click
    const durationBox = document.getElementById('durationSelectBox');
    if (durationBox) {
      durationBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const days = parseInt(item.dataset.days, 10) || 1;
          const header = item.querySelector('.custom-option-header')?.textContent || `${days} Days`;
          const selectedText = document.getElementById('selectedDurationText');
          if (selectedText) selectedText.textContent = header;
          if (hiddenDuration) hiddenDuration.value = days;
          currentDays = days;
          updateFareEstimate();
          durationBox.querySelectorAll('.custom-option-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');
          durationBox.classList.remove('open');
        });
      });
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

    // 4. Booking Modal & Rate Calculator
    const bookingModal = document.getElementById('bookingModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBikeName = document.getElementById('modalBikeName');
    const modalBikePrice = document.getElementById('modalBikePrice');
    const modalBikeInput = document.getElementById('modalBikeInput');
    const modalTotalEstimate = document.getElementById('modalTotalEstimate');
    const daysCountInput = document.getElementById('rentalDaysInput');
    const extraHelmetCheckbox = document.getElementById('extraHelmetCheckbox');
    const modalForm = document.getElementById('rentalBookingForm');

    let currentDailyRate = 599;

    function openBookingModal(bikeName, dailyRate) {
      if (!bookingModal) return;
      currentDailyRate = parseInt(dailyRate, 10) || 599;
      if (modalBikeName) modalBikeName.textContent = bikeName;
      if (modalBikePrice) modalBikePrice.textContent = `₹${currentDailyRate} / day`;
      if (modalBikeInput) modalBikeInput.value = bikeName;

      updateModalTotal();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeBookingModal() {
      if (!bookingModal) return;
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateModalTotal() {
      if (!modalTotalEstimate) return;
      const days = parseInt(daysCountInput ? daysCountInput.value : 1, 10) || 1;
      let total = currentDailyRate * days;
      if (extraHelmetCheckbox && extraHelmetCheckbox.checked) {
        total += 50 * days;
      }
      modalTotalEstimate.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    if (daysCountInput) {
      daysCountInput.addEventListener('input', updateModalTotal);
    }
    if (extraHelmetCheckbox) {
      extraHelmetCheckbox.addEventListener('change', updateModalTotal);
    }

    // Attach to all "Book Now" buttons
    const bookNowBtns = document.querySelectorAll('.btn-book-now');
    bookNowBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bike = btn.dataset.bike || 'Royal Enfield Hunter 350';
        const rate = btn.dataset.rate || '999';
        openBookingModal(bike, rate);
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

    // Modal Form Submission to WhatsApp / Toast
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bike = modalBikeInput ? modalBikeInput.value : 'Rental Bike';
        const name = document.getElementById('userNameInput')?.value || 'Guest';
        const phone = document.getElementById('userPhoneInput')?.value || '';
        const pickupDate = document.getElementById('userDateInput')?.value || 'Today';
        const days = daysCountInput ? daysCountInput.value : '1';
        const location = document.getElementById('userLocationSelect')?.value || 'Madurai Junction';

        const message = `Hello BIXI Ride! I would like to book a ${bike} for ${days} day(s) from ${pickupDate} at ${location}. Name: ${name}, Phone: ${phone}. Please confirm availability!`;
        const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;

        closeBookingModal();
        showToast('Booking request submitted! Connecting with Madurai Hub...');
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 800);
      });
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

    // 6. Generic Contact Form Handler
    const contactForm = document.getElementById('generalContactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you! Your message has been sent to BIXI Ride Madurai.');
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

    window.showBixiToast = showToast;
  });
})();
