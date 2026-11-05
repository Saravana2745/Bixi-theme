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

    // 2c. Custom Luxury Dropdown & Interactive Calendar Controller
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

    function closeAllDropdowns() {
      document.querySelectorAll('.custom-select-box').forEach((box) => {
        box.classList.remove('open');
      });
      if (datePickerBox) {
        datePickerBox.classList.remove('open');
      }
    }

    // Generic Custom Select Box Toggle
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

    // Close when clicking outside or pressing Escape
    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    // Hub select options click
    const hubBox = document.getElementById('hubSelectBox');
    if (hubBox) {
      hubBox.querySelectorAll('.custom-option-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.dataset.value;
          const header = item.querySelector('.custom-option-header')?.textContent?.trim() || val;
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
          const days = parseInt(item.dataset.value, 10) || 1;
          const header = item.querySelector('.custom-option-header')?.textContent?.trim() || `${days} Day (24 Hours)`;
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

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
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

