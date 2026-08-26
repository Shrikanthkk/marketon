/**
 * OmniLead AI — Interactive Vanilla JavaScript
 * High performance, zero dependencies, cross-browser compatible
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Bar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // 3. Smooth Anchor Scrolling
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 5. Pricing Toggle (Monthly vs Annual)
  const billingToggle = document.getElementById('billing-toggle');
  const starterPrice = document.getElementById('price-starter');
  const growthPrice = document.getElementById('price-growth');
  const enterprisePrice = document.getElementById('price-enterprise');
  const billingLabels = document.querySelectorAll('.price-billing-cycle');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      if (isAnnual) {
        if (starterPrice) starterPrice.textContent = '[PRICE PLACEHOLDER - ANNUAL]';
        if (growthPrice) growthPrice.textContent = '[PRICE PLACEHOLDER - ANNUAL]';
        if (enterprisePrice) enterprisePrice.textContent = '[PRICE PLACEHOLDER - ANNUAL]';
        billingLabels.forEach(label => label.textContent = 'per month (billed annually)');
      } else {
        if (starterPrice) starterPrice.textContent = '[PRICE PLACEHOLDER]';
        if (growthPrice) growthPrice.textContent = '[PRICE PLACEHOLDER]';
        if (enterprisePrice) enterprisePrice.textContent = '[PRICE PLACEHOLDER]';
        billingLabels.forEach(label => label.textContent = 'per month (billed monthly)');
      }
    });
  }

  // 6. Dashboard Mockup Filter Tabs (Interactive Demonstration)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const kpiLeads = document.getElementById('kpi-leads');
  const kpiHot = document.getElementById('kpi-hot');
  const kpiConv = document.getElementById('kpi-conv');
  const kpiRev = document.getElementById('kpi-rev');
  const kpiRoi = document.getElementById('kpi-roi');

  if (filterBtns.length > 0) {
    const dataset = {
      '7d': { leads: '6,140', hot: '1,590', conv: '810', rev: '₹62.8 Lakh', roi: '310%' },
      '30d': { leads: '25,630', hot: '6,521', conv: '3,245', rev: '₹2.45 Cr', roi: '320%' },
      '90d': { leads: '78,450', hot: '19,820', conv: '9,980', rev: '₹7.60 Cr', roi: '345%' }
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const period = btn.getAttribute('data-period') || '30d';
        const data = dataset[period];
        if (data) {
          if (kpiLeads) kpiLeads.textContent = data.leads;
          if (kpiHot) kpiHot.textContent = data.hot;
          if (kpiConv) kpiConv.textContent = data.conv;
          if (kpiRev) kpiRev.textContent = data.rev;
          if (kpiRoi) kpiRoi.textContent = data.roi;
        }
      });
    });
  }

  // 7. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 8. Contact & Demo Form Handler
  const contactForm = document.getElementById('demo-booking-form');
  const formSuccessAlert = document.getElementById('form-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Request My Demo';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Request...';
      }

      // Check if Formspree action is set or placeholder
      const formAction = contactForm.getAttribute('action');

      if (formAction && !formAction.includes('YOUR_FORM_ID')) {
        try {
          const formData = new FormData(contactForm);
          const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            contactForm.reset();
            if (formSuccessAlert) {
              formSuccessAlert.style.display = 'block';
              formSuccessAlert.scrollIntoView({ behavior: 'smooth' });
            } else {
              alert('Thank you! Your demo request has been received. Our specialist will contact you shortly.');
            }
          } else {
            alert('There was an issue submitting your request. Please check your details and try again.');
          }
        } catch (error) {
          console.error('Form submission error:', error);
          alert('Network error. Please try again or contact us directly via WhatsApp.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      } else {
        // Friendly local simulation when placeholder is present
        setTimeout(() => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'block';
            formSuccessAlert.scrollIntoView({ behavior: 'smooth' });
          } else {
            alert('Thank you! Your demo request has been received. (Demonstration mode: Formspree endpoint placeholder active).');
          }
        }, 800);
      }
    });
  }

  // 9. Galaxy Dark Mode Theme Toggle & Star Layer
  const initTheme = () => {
    const savedTheme = localStorage.getItem('marketon_theme') || localStorage.getItem('theme');
    const isGalaxy = savedTheme === 'galaxy' || savedTheme === 'dark';
    
    if (isGalaxy) {
      document.documentElement.classList.add('dark', 'galaxy');
      document.documentElement.setAttribute('data-theme', 'galaxy');
    } else {
      document.documentElement.classList.remove('dark', 'galaxy');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Build Galaxy Stars Layer
    let starLayer = document.querySelector('.galaxy-stars-layer');
    if (!starLayer) {
      starLayer = document.createElement('div');
      starLayer.className = 'galaxy-stars-layer';
      starLayer.style.backgroundColor = '#010104';
      
      const count = 260;
      for (let i = 0; i < count; i++) {
        const star = document.createElement('span');
        star.className = 'galaxy-star';
        
        const sizeRand = Math.random();
        const size = sizeRand < 0.68 ? 1 : sizeRand < 0.9 ? 2 : sizeRand < 0.97 ? 3 : 4;
        const opacities = [0.25, 0.45, 0.7, 1];
        const opacity = opacities[Math.floor(Math.random() * opacities.length)];
        
        const colRand = Math.random();
        let color = '#FFFFFF';
        if (colRand < 0.5) color = '#FFFFFF';
        else if (colRand < 0.82) color = 'rgba(255, 255, 255, 0.85)';
        else if (colRand < 0.95) color = 'rgba(180, 215, 255, 0.95)';
        else color = 'rgba(255, 245, 230, 0.95)';

        const duration = 2.2 + Math.random() * 4.2;
        const delay = Math.random() * 5;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = color;
        star.style.opacity = opacity;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        if (size >= 3 && Math.random() < 0.45) {
          star.style.boxShadow = `0 0 4px rgba(255, 255, 255, 0.8), 0 0 10px rgba(160, 190, 255, 0.5)`;
        } else if (size >= 3) {
          star.style.boxShadow = `0 0 3px ${color}`;
        }
        
        starLayer.appendChild(star);
      }
      document.body.appendChild(starLayer);
    }
  };

    // Sync checkboxes
    const checkboxes = document.querySelectorAll('.rocket-switch input[type="checkbox"], .toggle-input, .custom-toggle input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = isGalaxy;
    });
  };

  initTheme();

  // Attach toggle checkbox listeners
  const checkboxes = document.querySelectorAll('.rocket-switch input[type="checkbox"], .toggle-input, .custom-toggle input[type="checkbox"]');
  checkboxes.forEach(el => {
    el.addEventListener('change', (e) => {
      const isGalaxy = e.target.checked;
      const newTheme = isGalaxy ? 'galaxy' : 'light';
      
      document.documentElement.classList.add('theme-transition');
      
      if (newTheme === 'galaxy') {
        document.documentElement.classList.add('dark', 'galaxy');
        document.documentElement.setAttribute('data-theme', 'galaxy');
      } else {
        document.documentElement.classList.remove('dark', 'galaxy');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      localStorage.setItem('marketon_theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Sync other checkboxes if any
      document.querySelectorAll('.rocket-switch input[type="checkbox"], .toggle-input, .custom-toggle input[type="checkbox"]').forEach(cb => {
        cb.checked = isGalaxy;
      });

      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 450);
    });
  });
});
