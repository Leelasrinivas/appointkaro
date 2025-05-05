document.addEventListener('DOMContentLoaded', function() {
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
  
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
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
          if (navList.classList.contains('show')) {
            navList.classList.remove('show');
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
      window.addEventListener('scroll', function() {
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
      calculateBtn.addEventListener('click', function() {
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
      notifyForm.addEventListener('submit', function(e) {
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
  
    // Utility Functions
    function calculateTimeSaved(age, expectancy) {
      // Average time wasted per appointment: 25 minutes
      // Average time with AppointKaro: 2 minutes
      // Time saved per appointment: 23 minutes
      // Average appointments per year: 12 (monthly)
      
      const appointmentsPerYear = 12;
      const minutesSavedPerAppointment = 23;
      const yearsRemaining = expectancy - age;
      
      const totalMinutesSaved = yearsRemaining * appointmentsPerYear * minutesSavedPerAppointment;
      const hoursSaved = totalMinutesSaved / 60;
      const daysSaved = hoursSaved / 24;
      const yearsSaved = daysSaved / 365;
      
      return {
        hours: Math.round(hoursSaved),
        days: Math.round(daysSaved),
        years: yearsSaved
      };
    }
    
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  });