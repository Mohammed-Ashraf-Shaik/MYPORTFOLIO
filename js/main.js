/**
 * Main Application Orchestrator & UI Micro-Interactions
 * Shaik Mohammed Ashraf // Vintage Brown Developer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Typewriter Role Rotator
  const roles = [
    'Full-Stack Software Engineer',
    'DSA Enthusiast & Problem Solver',
    'System Architect & Builder',
    'Creative Technologist'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const roleElem = document.getElementById('typewriter-role') || document.getElementById('hero-role-text');

  function typeRole() {
    if (!roleElem) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(typeRole, typeSpeed);
  }

  typeRole();

  // 2. Header Scroll Observer
  const header = document.querySelector('.header-hud');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Audio Mute / Unmute Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    const isMuted = localStorage.getItem('sma_audio_muted') === 'true';
    updateAudioIcon(isMuted);

    audioToggleBtn.addEventListener('click', () => {
      if (window.cyberAudio) {
        const muted = window.cyberAudio.toggleMute();
        updateAudioIcon(muted);
        showToast(muted ? 'AUDIO SFX: MUTED' : 'AUDIO SFX: ONLINE');
        if (!muted) window.cyberAudio.playClick();
      }
    });
  }

  function updateAudioIcon(isMuted) {
    if (!audioToggleBtn) return;
    if (isMuted) {
      audioToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
        </svg>
      `;
      audioToggleBtn.classList.remove('active');
    } else {
      audioToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
      audioToggleBtn.classList.add('active');
    }
  }

  // 4. One-Click Copy To Clipboard
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`COPIED: ${textToCopy}`);
          if (window.cyberAudio) window.cyberAudio.playClick();
        });
      } else {
        showToast(`COPIED: ${textToCopy}`);
      }
    });
  });

  // 5. Toast Notification System
  function showToast(msg) {
    let toast = document.getElementById('cyber-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cyber-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 84px;
        right: 24px;
        background: #1c140e;
        border: 1px solid var(--border-brass);
        color: #faf5ee;
        padding: 0.65rem 1.25rem;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(10px);
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span style="color:var(--accent-amber);font-weight:bold;">// ASHRAF</span>
      <span>${msg}</span>
    `;

    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  // 6. Interactive Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        showToast('PLEASE FILL ALL TRANSMISSION FIELDS');
        return;
      }

      if (window.cyberAudio) window.cyberAudio.playClick();
      showToast('TRANSMITTING PACKET...');

      setTimeout(() => {
        showToast('MESSAGE SENT DIRECTLY TO ASHRAF!');
        contactForm.reset();
        const mailtoLink = `mailto:ashubasha52@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
        window.location.href = mailtoLink;
      }, 900);
    });
  }

  // 7. Active Navigation Spy via Scroll Position (Header & Bottom Dock)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const dockItems = document.querySelectorAll('.dock-item');

  function updateActiveNavSpy() {
    const scrollPos = window.scrollY + 220;
    let currentId = 'hero';

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      if (scrollPos >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
    dockItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveNavSpy, { passive: true });
  updateActiveNavSpy();

  // 8. Mobile Menu Toggle & Click Outside Handler
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('active', isOpen);
      if (isOpen) {
        mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      } else {
        mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
      if (window.cyberAudio) window.cyberAudio.playClick();
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
        mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileToggle.contains(e.target)) {
        if (navLinksContainer.classList.contains('mobile-open')) {
          navLinksContainer.classList.remove('mobile-open');
          mobileToggle.classList.remove('active');
          mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
      }
    });
  }

  // 9. Interactive Audio Event Listeners
  document.querySelectorAll('a, button, .skill-pill, .metric-tile, .dock-item, .tactile-badge, .tactile-link-badge').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (window.cyberAudio) window.cyberAudio.playHover();
    });
  });

  // 10. Kinetic 3D Name Visual Monolith Parallax
  const nameMonolith = document.getElementById('name-visual-monolith');
  if (nameMonolith) {
    nameMonolith.addEventListener('mousemove', (e) => {
      const rect = nameMonolith.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      nameMonolith.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(12px)`;
    });

    nameMonolith.addEventListener('mouseleave', () => {
      nameMonolith.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });

    nameMonolith.addEventListener('click', () => {
      if (window.cyberAudio && typeof window.cyberAudio.playItemPick === 'function') {
        window.cyberAudio.playItemPick();
      }
    });
  }

  // =========================================================================
  // 11. Millisecond Count-Up Visuals for Important Statistics (0 to Target)
  // =========================================================================
  function setupCountUpVisuals() {
    const statElements = document.querySelectorAll('.count-up-num');

    function animateCount(elem) {
      if (!elem) return;
      if (elem.dataset.hasCounted === 'true') return;
      elem.dataset.hasCounted = 'true';

      const targetAttr = elem.getAttribute('data-target');
      const targetVal = targetAttr !== null 
        ? parseFloat(targetAttr) 
        : parseFloat(elem.textContent.replace(/[^0-9.]/g, ''));

      if (isNaN(targetVal)) return;

      const decimals = parseInt(elem.getAttribute('data-decimals') || '0', 10);
      const suffix = elem.getAttribute('data-suffix') || '';
      const prefix = elem.getAttribute('data-prefix') || '';
      const duration = 1100; // Fast millisecond rolling effect
      let startTimestamp = null;

      function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Quartic ease out for snappy start and satisfying deceleration
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = ease * targetVal;

        if (decimals > 0) {
          elem.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;
        } else {
          elem.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          if (decimals > 0) {
            elem.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
          } else {
            elem.textContent = `${prefix}${targetVal.toLocaleString()}${suffix}`;
          }
        }
      }

      window.requestAnimationFrame(step);
    }

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
        }
      });
    }, { threshold: 0.15 });

    statElements.forEach((elem) => countObserver.observe(elem));

    // Immediately trigger any elements visible above the fold on initial load
    setTimeout(() => {
      statElements.forEach((elem) => {
        const rect = elem.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          animateCount(elem);
        }
      });
    }, 150);

    // Global trigger for live API refreshes
    window.triggerStatCountUp = function(elem, target) {
      if (!elem) return;
      elem.dataset.hasCounted = 'false';
      elem.setAttribute('data-target', target);
      animateCount(elem);
    };
  }

  setupCountUpVisuals();

  // =========================================================================
  // 12. Theme Accent Palette (Blue, Red, White, Brown) & Light/Dark Mode Toggle
  // =========================================================================
  function setupThemeSystem() {
    const paletteBtn = document.getElementById('theme-palette-btn');
    const popover = document.getElementById('theme-palette-popover');
    const swatchBtns = document.querySelectorAll('.swatch-btn');
    const modeBtn = document.getElementById('theme-mode-btn');
    const modeSymbol = document.getElementById('theme-mode-symbol');

    // 12.1 Restore saved Color Theme
    const savedColor = localStorage.getItem('ashraf_color_theme') || 'brown';
    applyColorTheme(savedColor, false);

    // 12.2 Restore saved Light/Dark Mode
    const savedMode = localStorage.getItem('ashraf_theme_mode') || 'dark';
    applyThemeMode(savedMode, false);

    // Toggle Palette Popover on Click
    if (paletteBtn && popover) {
      paletteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('active');
        if (window.cyberAudio) window.cyberAudio.playClick();
      });

      document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && e.target !== paletteBtn) {
          popover.classList.remove('active');
        }
      });
    }

    // Color Swatch Clicks
    swatchBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = btn.getAttribute('data-color');
        applyColorTheme(color, true);
        if (popover) popover.classList.remove('active');
        if (window.cyberAudio) window.cyberAudio.playClick();
        showToast(`ACCENT COLOR: ${color.toUpperCase()}`);
      });
    });

    function applyColorTheme(themeName, animate = true) {
      if (themeName === 'brown') {
        document.documentElement.removeAttribute('data-color-theme');
      } else {
        document.documentElement.setAttribute('data-color-theme', themeName);
      }
      localStorage.setItem('ashraf_color_theme', themeName);

      swatchBtns.forEach((b) => {
        if (b.getAttribute('data-color') === themeName) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      // Dispatch event to 3D WebGL Scene
      window.dispatchEvent(new CustomEvent('colorThemeChanged', { detail: { theme: themeName } }));
    }

    // Light / Dark Mode Toggle Button (Moon Symbol)
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        const isCurrentLight = document.documentElement.getAttribute('data-theme-mode') === 'light';
        const newMode = isCurrentLight ? 'dark' : 'light';
        applyThemeMode(newMode, true);
        if (window.cyberAudio) window.cyberAudio.playClick();
        showToast(newMode === 'light' ? 'MODE: PARCHMENT LIGHT' : 'MODE: ESPRESSO DARK');
      });
    }

    function applyThemeMode(mode, notify = true) {
      if (mode === 'light') {
        document.documentElement.setAttribute('data-theme-mode', 'light');
        if (modeSymbol) {
          modeSymbol.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
        }
        if (modeBtn) modeBtn.title = 'Switch to Dark Mode (Espresso)';
      } else {
        document.documentElement.removeAttribute('data-theme-mode');
        if (modeSymbol) {
          modeSymbol.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
        }
        if (modeBtn) modeBtn.title = 'Switch to Light Mode (Parchment)';
      }
      localStorage.setItem('ashraf_theme_mode', mode);

      // Dispatch event to 3D WebGL Scene
      window.dispatchEvent(new CustomEvent('themeModeChanged', { detail: { mode } }));
    }
  }

  setupThemeSystem();

  // =========================================================================
  // 13. Interactive Cartoon Cat Mascot & Color Palette Guide
  // =========================================================================
  function setupCatMascotGuide() {
    const catContainer = document.getElementById('cat-mascot-container');
    const actionBubble = document.getElementById('cat-action-bubble');
    const bubbleClose = document.getElementById('cat-bubble-close');
    const cyclePaletteBtn = document.getElementById('cat-cycle-palette-btn');
    const toggleModeBtn = document.getElementById('cat-toggle-mode-btn');
    const paletteBtn = document.getElementById('theme-palette-btn');
    const modeBtn = document.getElementById('theme-mode-btn');

    if (!catContainer) return;

    function openCatBubble() {
      if (actionBubble) {
        actionBubble.classList.add('visible');
      }
      catContainer.classList.add('bubble-open');

      if (window.cyberAudio && typeof window.cyberAudio.playItemPick === 'function') {
        window.cyberAudio.playItemPick();
      }

      // Spotlight pulse on HUD icons to show the user where they are
      if (paletteBtn) {
        paletteBtn.classList.remove('cat-spotlight-pulse');
        void paletteBtn.offsetWidth;
        paletteBtn.classList.add('cat-spotlight-pulse');
      }
      if (modeBtn) {
        modeBtn.classList.remove('cat-spotlight-pulse');
        void modeBtn.offsetWidth;
        modeBtn.classList.add('cat-spotlight-pulse');
      }
    }

    function closeCatBubble() {
      if (actionBubble) {
        actionBubble.classList.remove('visible');
      }
      catContainer.classList.remove('bubble-open');
    }

    // Toggle bubble on cat click
    catContainer.addEventListener('click', (e) => {
      // Ignore clicks inside the speech bubble
      if (e.target.closest('#cat-action-bubble')) return;
      
      if (actionBubble && actionBubble.classList.contains('visible')) {
        closeCatBubble();
      } else {
        openCatBubble();
      }
    });

    catContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (actionBubble && actionBubble.classList.contains('visible')) {
          closeCatBubble();
        } else {
          openCatBubble();
        }
      }
    });

    // Cycle palettes directly from the cat's speech bubble!
    if (cyclePaletteBtn) {
      cyclePaletteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const themes = ['brown', 'blue', 'red', 'white'];
        const currentTheme = localStorage.getItem('ashraf_color_theme') || 'brown';
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];

        const targetSwatch = document.querySelector(`.swatch-btn[data-color="${nextTheme}"]`);
        if (targetSwatch) {
          targetSwatch.click();
        } else if (paletteBtn) {
          paletteBtn.click();
        }

        // Highlight HUD palette button
        if (paletteBtn) {
          paletteBtn.classList.remove('cat-spotlight-pulse');
          void paletteBtn.offsetWidth;
          paletteBtn.classList.add('cat-spotlight-pulse');
        }
      });
    }

    // Toggle Light / Dark mode directly from the cat's speech bubble!
    if (toggleModeBtn) {
      toggleModeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modeBtn) {
          modeBtn.click();
          modeBtn.classList.remove('cat-spotlight-pulse');
          void modeBtn.offsetWidth;
          modeBtn.classList.add('cat-spotlight-pulse');
        }
      });
    }

    if (bubbleClose) {
      bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCatBubble();
      });
    }

    // Close cat bubble on document click outside
    document.addEventListener('click', (e) => {
      if (actionBubble && !catContainer.contains(e.target)) {
        closeCatBubble();
      }
    });

    // Auto-close cat bubble if user scrolls down away from the hero section
    window.addEventListener('scroll', () => {
      if (actionBubble && actionBubble.classList.contains('visible') && window.scrollY > 380) {
        closeCatBubble();
      }
    }, { passive: true });
  }

  setupCatMascotGuide();

  // Initialize Lucide icons if available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});
