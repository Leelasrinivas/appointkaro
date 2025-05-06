document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navList = document.querySelector('.nav-list');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent event bubbling

      // Toggle classes for both the button and navigation
      mobileMenuBtn.classList.toggle('active');
      mainNav.classList.toggle('show');
      
      console.log('Mobile menu toggled:', mainNav.classList.contains('show')); // Debug info
    });

    // Close menu when clicking elsewhere on the page
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
      }
    });

    // Prevent closing when clicking within the menu
    mainNav.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        mainNav.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (mainNav.classList.contains('show')) {
          mainNav.classList.remove('show');
          mobileMenuBtn.classList.remove('active');
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Sticky Header
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero-section');

  if (header && hero) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }

  // Time Saving Calculator
  const calculateBtn = document.getElementById('calculateBtn');
  const calculatorResult = document.getElementById('calculatorResult');
  const hoursValue = document.getElementById('hoursValue');
  const daysValue = document.getElementById('daysValue');
  const yearsValue = document.getElementById('yearsValue');
  const timeInWords = document.getElementById('timeInWords');

  if (calculateBtn && calculatorResult) {
    calculateBtn.addEventListener('click', function () {
      const age = parseInt(document.getElementById('age').value);
      const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);

      if (!isNaN(age) && !isNaN(lifeExpectancy) && age < lifeExpectancy) {
        const result = calculateTimeSaved(age, lifeExpectancy);

        hoursValue.textContent = formatNumber(result.hours);
        daysValue.textContent = formatNumber(result.days);
        yearsValue.textContent = (result.years).toFixed(1);

        const years = Math.floor(result.years);
        const months = Math.floor((result.years - years) * 12);
        const remainingDays = Math.floor(result.days - (years * 365) - (months * 30));

        let timeWords = '';
        if (years > 0) {
          timeWords += `${years} year${years !== 1 ? 's' : ''}`;
        }
        if (months > 0) {
          timeWords += timeWords ? `, ${months} month${months !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`;
        }
        if (remainingDays > 0) {
          timeWords += timeWords ? `, and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}` : `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
        }

        timeInWords.textContent = timeWords;
        calculatorResult.classList.remove('hidden');
      } else {
        alert('Please enter valid age and life expectancy values. Age should be less than life expectancy.');
      }
    });
  }

  // Email Subscription Form
  const notifyForm = document.getElementById('notifyForm');
  const formMessage = document.getElementById('formMessage');

  if (notifyForm && formMessage) {
    notifyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;

      // Simulate form submission
      formMessage.innerHTML = '<div class="success-message">Thank you! You\'ve been added to our waitlist.</div>';
      notifyForm.reset();

      // In a real application, you would send this to your server
      console.log('Subscription email:', email);
    });
  }

  // Calculator Alert Modal for First-Time Visitors
  const calculatorAlert = document.getElementById('calculatorAlert');
  const closeModal = document.querySelector('.close-modal');
  const goToCalculator = document.getElementById('goToCalculator');
  const dismissModal = document.getElementById('dismissModal');

  if (calculatorAlert && !localStorage.getItem('calculatorAlertShown')) {
    // Show modal after 3 seconds on first visit
    setTimeout(() => {
      calculatorAlert.classList.add('show');

      // Set flag in localStorage with expiration (30 minutes)
      const now = new Date();
      const expiration = now.getTime() + (30 * 60 * 1000); // 30 minutes
      localStorage.setItem('calculatorAlertShown', expiration);
    }, 3000);

    // Close modal event handlers
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        calculatorAlert.classList.remove('show');
      });
    }

    if (dismissModal) {
      dismissModal.addEventListener('click', () => {
        calculatorAlert.classList.remove('show');
      });
    }

    if (goToCalculator) {
      goToCalculator.addEventListener('click', () => {
        calculatorAlert.classList.remove('show');

        // Scroll to calculator section
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
          window.scrollTo({
            top: calculatorSection.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  // Check if calculator alert should be shown or if it expired
  const checkCalculatorAlert = () => {
    const expiration = localStorage.getItem('calculatorAlertShown');
    if (expiration) {
      const now = new Date().getTime();
      if (now > parseInt(expiration)) {
        // Alert expired, remove from localStorage
        localStorage.removeItem('calculatorAlertShown');
      }
    }
  };

  checkCalculatorAlert();

  // Function to calculate time saved based on age and life expectancy
  function calculateTimeSaved(age, expectancy) {
    const yearsRemaining = expectancy - age;
    const waitingDaysPerYear = 6.5; // ~15 months over 70 years converted to days per year

    // Total waiting days for remaining lifespan
    const totalWaitingDays = yearsRemaining * waitingDaysPerYear;

    // AppointKaro saves 92% of that time (23 out of 25 minutes)
    const daysSaved = totalWaitingDays * (23 / 25);
    const hoursSaved = daysSaved * 24;
    const yearsSaved = daysSaved / 365;

    return {
      hours: Math.round(hoursSaved),
      days: Math.round(daysSaved),
      years: yearsSaved
    };
  }

  // Function to format numbers with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});
