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
    const hubBox = document.getElementById('hubSelectBox');
    const durationBox = document.getElementById('durationSelectBox');
    const datePickerBox = document.getElementById('bixiDatePickerBox');
    const dateTrigger = document.getElementById('bixiDateTrigger');
    const selectedDateText = document.getElementById('selectedDateText');
    const startDateInput = document.getElementById('startDate');
    const prevMonthBtn = document.getElementById('bixiPrevMonth');
    const nextMonthBtn = document.getElementById('bixiNextMonth');
    const monthTitle = document.getElementById('bixiMonthTitle');
    const daysGrid = document.getElementById('bixiDaysGrid');
    const hourSelect = document.getElementById('bixiTimeHour');
    const minuteSelect = document.getElementById('bixiTimeMinute');
    const btnAM = document.getElementById('bixiBtnAM');
    const btnPM = document.getElementById('bixiBtnPM');
    const btnToday = document.getElementById('bixiBtnToday');
    const btnConfirm = document.getElementById('bixiBtnConfirm');

    // Bulletproof close function - queries directly to avoid TDZ
    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-box').forEach((box) => {
        box.classList.remove('open');
      });
      document.querySelectorAll('.custom-datepicker-box').forEach((box) => {
        box.classList.remove('open');
      });
    }

    const BIKE_MODELS = [
      { name: 'Royal Enfield Hunter 350', price: 1000, sub: 'Retro Roadster • Comfortable in Different Terrains • 120km: ₹1,000 / 240km: ₹1,500' },
      { name: 'Royal Enfield Himalayan 450', price: 1200, sub: 'Adventure Tourer • Comfortable in Different Terrains • 120km: ₹1,200 / 300km: ₹2,000' },
      { name: 'Royal Enfield Classic 350', price: 1000, sub: 'Heritage Cruiser • Comfortable in Different Terrains • 120km: ₹1,000 / 240km: ₹1,500' },
      { name: 'Yamaha MT-15 V2', price: 900, sub: 'Hyper Naked Street • Comfortable in Different Terrains • 120km: ₹900 / 240km: ₹1,400' },
      { name: 'Yamaha FZ-S V4', price: 800, sub: 'Street Commuter • Comfortable in Different Terrains • 120km: ₹800 / 240km: ₹1,200' },
      { name: 'Honda Activa 6G', price: 600, sub: 'Automatic Scooter • Comfortable in Different Terrains • 120km: ₹600 / 240km: ₹800' },
      { name: 'Suzuki Access 125', price: 600, sub: 'Family Scooter • Comfortable in Different Terrains • 120km: ₹600 / 240km: ₹800' }
    ];

    const CAR_MODELS = [
      { name: 'Maruti Suzuki Swift (2026)', price: 2200, sub: '5-Seater Hatchback • Comfortable in Different Terrains • 300 km limit' },
      { name: 'Maruti Suzuki Dzire', price: 2400, sub: '5-Seater Sedan • Comfortable in Different Terrains • 300 km limit' },
      { name: 'Hyundai i20', price: 2400, sub: '5-Seater Premium • Comfortable in Different Terrains • 300 km limit' },
      { name: 'Tata Punch', price: 2500, sub: '5-Seater SUV • Comfortable in Different Terrains • 300 km limit' },
      { name: 'Maruti Suzuki Ertiga', price: 3500, sub: '7-Seater Family MPV • Comfortable in Different Terrains • 300 km limit' },
      { name: 'Maruti Suzuki Wagon R', price: 1800, sub: '5-Seater City Commuter • Comfortable in Different Terrains • 300 km limit' }
    ];

    let currentVehicleMode = 'bike';
    let currentSelectedPrice = 1000;
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
          selectModel(item, true);
        });
        modelOptionsPanel.appendChild(opt);
      });

      selectModel(list[0], false);
    }

    function selectModel(item, closeDropdown = true) {
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
      if (closeDropdown) {
        closeAllDropdowns();
      }
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

    // Hub select options click
    if (hubBox) {
      hubBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.dataset.value;
          const header = item.querySelector('.custom-option-header')?.textContent?.trim() || val;
          if (selectedHubText) selectedHubText.textContent = header;
          if (hiddenHub) hiddenHub.value = val;
          hubBox.querySelectorAll('.custom-option-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');
          hubBox.classList.remove('open');
        });
      });
    }

    // Duration select options click
    if (durationBox) {
      durationBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const days = parseInt(item.dataset.value, 10) || 1;
          const header = item.querySelector('.custom-option-header')?.textContent?.trim() || `${days} Day (24 Hours)`;
          if (selectedDurationText) selectedDurationText.textContent = header;
          if (hiddenDuration) hiddenDuration.value = days;
          currentDays = days;
          updateFareEstimate();
          durationBox.querySelectorAll('.custom-option-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');
          durationBox.classList.remove('open');
        });
      });
    }

    // 2d. Interactive BIXI Custom Calendar & DateTime Picker
    if (datePickerBox && dateTrigger && daysGrid) {
      const MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const now = new Date();
      let viewYear = now.getFullYear();
      let viewMonth = now.getMonth();
      let selYear = now.getFullYear();
      let selMonth = now.getMonth();
      let selDay = now.getDate();
      let selHour = hourSelect ? hourSelect.value : '10';
      let selMinute = minuteSelect ? minuteSelect.value : '00';
      let selAmPm = 'AM';

      function renderCalendar(year, month) {
        if (monthTitle) {
          monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;
        }
        daysGrid.innerHTML = '';

        const firstWeekday = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // Empty padding cells before first weekday
        for (let i = 0; i < firstWeekday; i++) {
          const emptyCell = document.createElement('div');
          emptyCell.className = 'bixi-cal-day empty';
          daysGrid.appendChild(emptyCell);
        }

        // Days of month
        for (let d = 1; d <= totalDays; d++) {
          const dayDate = new Date(year, month, d).getTime();
          const isPast = dayDate < todayStart;
          const isToday = (year === now.getFullYear() && month === now.getMonth() && d === now.getDate());
          const isSelected = (year === selYear && month === selMonth && d === selDay);

          const dayBtn = document.createElement('button');
          dayBtn.type = 'button';
          dayBtn.className = `bixi-cal-day${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}${isPast ? ' disabled' : ''}`;
          dayBtn.textContent = d;
          dayBtn.setAttribute('aria-label', `${d} ${MONTH_NAMES[month]} ${year}`);

          if (isPast) {
            dayBtn.disabled = true;
          } else {
            dayBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              selYear = year;
              selMonth = month;
              selDay = d;
              daysGrid.querySelectorAll('.bixi-cal-day').forEach((el) => el.classList.remove('selected'));
              dayBtn.classList.add('selected');
              syncDateTimeValue(false);
            });
          }

          daysGrid.appendChild(dayBtn);
        }
      }

      function syncDateTimeValue(closeOnSync = false) {
        const monthShort = MONTH_SHORT[selMonth] || 'Nov';
        const dayFormatted = String(selDay).padStart(2, '0');
        const displayText = `${monthShort} ${dayFormatted}, ${selYear} • ${selHour}:${selMinute} ${selAmPm}`;

        if (selectedDateText) {
          selectedDateText.textContent = displayText;
        }

        let h24 = parseInt(selHour, 10) || 10;
        if (selAmPm === 'PM' && h24 < 12) h24 += 12;
        if (selAmPm === 'AM' && h24 === 12) h24 = 0;

        const isoValue = `${selYear}-${String(selMonth + 1).padStart(2, '0')}-${dayFormatted}T${String(h24).padStart(2, '0')}:${selMinute}`;
        if (startDateInput) {
          startDateInput.value = isoValue;
        }

        if (closeOnSync && datePickerBox) {
          datePickerBox.classList.remove('open');
        }
      }

      // Prev & Next Month buttons
      if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          viewMonth--;
          if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
          }
          renderCalendar(viewYear, viewMonth);
        });
      }

      if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          viewMonth++;
          if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
          }
          renderCalendar(viewYear, viewMonth);
        });
      }

      // Time inputs
      if (hourSelect) {
        hourSelect.addEventListener('change', () => {
          selHour = hourSelect.value;
          syncDateTimeValue(false);
        });
      }

      if (minuteSelect) {
        minuteSelect.addEventListener('change', () => {
          selMinute = minuteSelect.value;
          syncDateTimeValue(false);
        });
      }

      if (btnAM && btnPM) {
        btnAM.addEventListener('click', (e) => {
          e.stopPropagation();
          selAmPm = 'AM';
          btnAM.classList.add('active');
          btnPM.classList.remove('active');
          syncDateTimeValue(false);
        });

        btnPM.addEventListener('click', (e) => {
          e.stopPropagation();
          selAmPm = 'PM';
          btnPM.classList.add('active');
          btnAM.classList.remove('active');
          syncDateTimeValue(false);
        });
      }

      // Today button
      if (btnToday) {
        btnToday.addEventListener('click', (e) => {
          e.stopPropagation();
          viewYear = now.getFullYear();
          viewMonth = now.getMonth();
          selYear = viewYear;
          selMonth = viewMonth;
          selDay = now.getDate();
          renderCalendar(viewYear, viewMonth);
          syncDateTimeValue(false);
        });
      }

      // Confirm button
      if (btnConfirm) {
        btnConfirm.addEventListener('click', (e) => {
          e.stopPropagation();
          syncDateTimeValue(true);
          showToast(`Pickup scheduled for ${selectedDateText.textContent}`);
        });
      }

      // Toggle Datepicker popup
      dateTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = datePickerBox.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          datePickerBox.classList.add('open');
        }
      });

      // Prevent clicks inside panel from closing it
      const datePanel = document.getElementById('bixiDatePickerPanel');
      if (datePanel) {
        datePanel.addEventListener('click', (e) => e.stopPropagation());
      }

      // Initial Calendar Render
      renderCalendar(viewYear, viewMonth);
      syncDateTimeValue(false);
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
        const whatsappUrl = `https://wa.me/919037000266?text=${encodeURIComponent(message)}`;

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

    // 8. Universal Buttery-Smooth Scroll Reveal Engine Across Every Page
    function initScrollReveal() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.bixi-reveal').forEach((el) => el.classList.add('bixi-revealed'));
        return;
      }

      const revealSelectors = [
        '.section-head',
        '.section-badge',
        '.section-title',
        '.section-desc',
        '.hero-content',
        '.hero-preview-col',
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
        '.stat-item',
        '.stats-grid > *',
        '.cta-box',
        '.about-grid > *',
        '.value-card',
        '.team-card',
        '.timeline-item',
        '.page-header',
        '.filter-bar'
      ];

      const elements = document.querySelectorAll(revealSelectors.join(', '));
      if (!elements.length) return;

      // Group sibling items in containers to apply staggered cascading delays
      const parents = new Map();
      elements.forEach((el) => {
        if (el.classList.contains('bixi-reveal')) return;
        el.classList.add('bixi-reveal');

        const p = el.parentElement;
        if (p) {
          if (!parents.has(p)) parents.set(p, []);
          parents.get(p).push(el);
        }
      });

      parents.forEach((children) => {
        if (children.length > 1) {
          children.forEach((child, idx) => {
            const delay = (idx % 4) + 1;
            child.classList.add(`delay-${delay}`);
          });
        }
      });

      const revealElement = (el) => {
        el.classList.add('bixi-revealed');
      };

      if (typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'undefined') {
        const observer = new window.IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealElement(entry.target);
              obs.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08
        });

        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Instantly reveal elements already visible or above fold
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            revealElement(el);
          } else {
            observer.observe(el);
          }
        });
      } else {
        elements.forEach(revealElement);
      }
    }

    // Initialize Scroll Reveal Engine
    initScrollReveal();

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
    tagline: 'Madurai\'s favorite 5-seater self-drive hatchback for city & hills.',
    rate: 2200,
    rateStr: '₹2,200',
    img: 'assets/images/bikes/car-swift.webp',
    haloColor: 'rgba(232, 129, 36, 0.4)',
    engine: '1.2L DualJet Petrol • 90 PS',
    mileage: 'Comfortable in different terrains • Smooth highway & city drive',
    safety: 'Dual Airbags • RTO Yellow Plate • 300 km limit',
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
    mileage: 'Comfortable in different terrains • Long-travel suspension for ghats, highways & rough roads',
    safety: 'Dual ABS • All-Terrain Spoke Wheels • 120km: ₹1,200 / 300km: ₹2,000',
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
    mileage: 'Comfortable in different terrains • Easy maneuvering across urban traffic & countryside roads',
    safety: 'Dual Disc ABS • RTO Permitted • 120km: ₹1,000 / 240km: ₹1,500',
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
    mileage: 'Comfortable in different terrains • Heavy-set stability & upright posture on any road',
    safety: 'Dual Channel ABS • RTO Yellow Plate • 120km: ₹1,000 / 240km: ₹1,500',
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
    mileage: 'Comfortable in different terrains • USD forks & Deltabox chassis for sharp control & bumpy roads',
    safety: 'Dual Disc ABS • Assist & Slipper Clutch • 120km: ₹900 / 240km: ₹1,400',
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
    mileage: 'Comfortable in different terrains • Telescopic suspension & high clearance for temple streets',
    safety: 'Combi-Brake System (CBS) • Tubeless • 120km: ₹600 / 240km: ₹800',
    bookRate: '600'
  },
  ertiga: {
    name: 'Maruti Suzuki Ertiga (2026)',
    tagline: 'Spacious 7-seater self-drive MPV with chilled AC for family pilgrimages.',
    rate: 3500,
    rateStr: '₹3,500',
    img: 'assets/images/bikes/car-ertiga.webp',
    haloColor: 'rgba(52, 152, 219, 0.4)',
    engine: '1.5L K15C Smart Hybrid • 103 PS',
    mileage: 'Comfortable in different terrains • Ergonomic 7-seater comfort for long family tours & varied roads',
    safety: 'Dual Airbags • Rear AC Vents • 300 km limit included',
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
      img.src = data.img;
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
  if (!modal) {
    window.location.href = 'bikes.html';
    return;
  }
  var nameEl = document.getElementById('modalBikeName');
  var priceEl = document.getElementById('modalBikePrice');
  var inputEl = document.getElementById('modalBikeInput');
  var totalEl = document.getElementById('modalTotalEstimate');

  if (nameEl) nameEl.textContent = data.name;
  if (priceEl) priceEl.textContent = data.rateStr + ' / day';
  if (inputEl) inputEl.value = data.name;
  if (totalEl) totalEl.textContent = data.rateStr;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
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
// 3D PERSPECTIVE TILT INTERACTION ENGINE
// ==========================================================================
(function() {
  function init3DTiltCards() {
    var cards = document.querySelectorAll('.card-3d-tilt, [data-tilt="true"]');
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -7;
        var rotateY = ((x - centerX) / centerX) * 7;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
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
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 75;
  const frameImages = [];
  let isLoaded = false;
  let loadedCount = 0;
  let currentRenderedFrame = -1;
  let animFrameId = null;

  const hudCount = document.getElementById('scrollyFrameCount');
  const hudBar = document.getElementById('scrollyProgressBar');
  const stage1 = document.getElementById('storyStage1');
  const stage2 = document.getElementById('storyStage2');
  const stage3 = document.getElementById('storyStage3');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    if (currentRenderedFrame > 0) {
      drawFrame(currentRenderedFrame);
    }
  }

  function drawCover(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
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
    const img = frameImages[idx];
    if (img && img.complete) {
      drawCover(img);
      currentRenderedFrame = idx;
    }
  }

  // Preload all 75 frames progressively
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const pad = String(i).padStart(3, '0');
    img.src = `assets/images/scrolly-frames/frame_${pad}.webp`;
    img.onload = () => {
      loadedCount++;
      if (i === 1 && currentRenderedFrame === -1) {
        drawFrame(1);
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

    if (targetFrame !== currentRenderedFrame) {
      drawFrame(targetFrame);
    }

    if (hudCount) {
      hudCount.textContent = `${String(targetFrame).padStart(2, '0')} / ${TOTAL_FRAMES}`;
    }
    if (hudBar) {
      hudBar.style.width = `${(progress * 100).toFixed(1)}%`;
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
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScroll();
  });

  resizeCanvas();
  updateScroll();
})();
