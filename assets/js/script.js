'use strict';

/*-----------------------------------*\
  #UTILITY
\*-----------------------------------*/

// toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
}


/*-----------------------------------*\
  #SIDEBAR TOGGLE
\*-----------------------------------*/

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}


/*-----------------------------------*\
  #PORTFOLIO FILTER
\*-----------------------------------*/

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

// filter function
const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// SELECT DROPDOWN FILTER
selectItems.forEach(item => {
  item.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// FILTER BUTTONS
let lastClickedBtn = filterBtn[0];

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});


/*-----------------------------------*\
  #CONTACT FORM
\*-----------------------------------*/

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach(input => {
  input.addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});


/*-----------------------------------*\
  #PAGE NAVIGATION
  Smooth fade transition between
  sections when nav links clicked
\*-----------------------------------*/

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
  link.addEventListener("click", function () {

    pages.forEach(page => {

      if (this.innerHTML.toLowerCase() === page.dataset.page) {

        // Fade out first
        page.style.opacity = "0";
        page.style.transform = "translateY(10px)";
        page.classList.add("active");
        link.classList.add("active");
        window.scrollTo(0, 0);

        // Fade in after small delay
        setTimeout(() => {
          page.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          page.style.opacity = "1";
          page.style.transform = "translateY(0)";

          // Trigger scroll reveal for newly visible section
          const revealEls = page.querySelectorAll('.reveal:not(.visible)');
          revealEls.forEach(el => {
            setTimeout(() => el.classList.add('visible'), 100);
          });

          // Re-animate skill bars when resume tab opened
          if (page.dataset.page === "resume") {
            triggerSkillBars();
          }

        }, 50);

      } else {
        page.classList.remove("active");
        page.style.opacity = "";
        page.style.transform = "";
        page.style.transition = "";
        link.classList.remove("active");
      }

    });

  });
});


/*-----------------------------------*\
  #SCROLL REVEAL ANIMATION
  Reveals elements with fade+slide
  as they enter the viewport
\*-----------------------------------*/

const revealElements = () => {

  // Elements to animate on scroll
  const selectors = [
    '.about-text p',
    '.tech-stack span',
    '.certifications-item',
    '.timeline-item',
    '.skills-item',
    '.project-item',
    '.contact-form',
    '.mapbox'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      // Stagger delay for siblings
      if (index > 0 && index <= 5) {
        el.classList.add(`reveal-delay-${index}`);
      }
    });
  });

  // Watch elements entering viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};


/*-----------------------------------*\
  #TYPING ANIMATION
  Cycles through role titles with
  typewriter effect in sidebar
\*-----------------------------------*/

const initTypingAnimation = () => {

  const titleEl = document.querySelector('.info-content .title');
  if (!titleEl) return;

  const texts = [
    'Full Stack Developer',
    'Cloud Enthusiast',
    'Problem Solver',
    'KL University Student'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Add blinking cursor
  titleEl.classList.add('typing-cursor');

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      titleEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      titleEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      speed = 1800; // Pause before deleting
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 400; // Pause before typing next
    }

    setTimeout(type, speed);
  };

  setTimeout(type, 1000);
};


/*-----------------------------------*\
  #SKILL BAR ANIMATION
  Animates progress bars from 0
  to target width when visible
\*-----------------------------------*/

const initSkillBars = () => {

  const skillFills = document.querySelectorAll('.skill-progress-fill');

  skillFills.forEach(fill => {
    // Save original width as CSS variable
    const originalWidth = fill.style.width;
    fill.style.setProperty('--target-width', originalWidth);
    fill.style.width = '0%';
  });

};

// Trigger skill bar animation (called on resume tab open)
const triggerSkillBars = () => {
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  skillFills.forEach(fill => {
    setTimeout(() => {
      fill.classList.add('animate');
    }, 200);
  });
};

// Also trigger on scroll via IntersectionObserver
const observeSkillBars = () => {
  const skillFills = document.querySelectorAll('.skill-progress-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, 200);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));
};


/*-----------------------------------*\
  #STICKY NAVBAR
  Adds scrolled class for enhanced
  blur/shadow when scrolling
\*-----------------------------------*/

const initStickyNavbar = () => {

  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

};


/*-----------------------------------*\
  #PROJECT CARD TILT
  Subtle 3D perspective tilt effect
  on project cards when hovering
\*-----------------------------------*/

const initCardTilt = () => {

  const cards = document.querySelectorAll('.project-item');

  cards.forEach(card => {

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 6 degrees tilt
      const tiltX = ((y - centerY) / centerY) * 6;
      const tiltY = ((x - centerX) / centerX) * -6;

      card.style.transform =
        `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.4s ease';
    });

  });

};


/*-----------------------------------*\
  #BUTTON RIPPLE EFFECT
  Gold ripple wave on button click
  for tactile visual feedback
\*-----------------------------------*/

const initRippleEffect = () => {

  const buttons = document.querySelectorAll('.download-btn, .form-btn');

  // Inject ripple keyframe once
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {

      // Remove any existing ripple
      const existingRipple = btn.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: hsla(45, 100%, 72%, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      // Clean up after animation
      setTimeout(() => ripple.remove(), 700);
    });
  });

};


/*-----------------------------------*\
  #INIT ALL EFFECTS
  Initialize everything after
  the DOM is fully loaded
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', () => {

  // Core interactions
  revealElements();
  initTypingAnimation();
  initSkillBars();
  observeSkillBars();
  initStickyNavbar();
  initCardTilt();
  initRippleEffect();

  // Trigger reveal for initially visible elements
  setTimeout(() => {
    const activeSection = document.querySelector('[data-page].active');
    if (activeSection) {
      activeSection.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });
    }
  }, 300);

});