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
  const roleElem = document.getElementById('hero-role-text');

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
      <span style="color:var(--accent-amber);font-weight:bold;">// ASHRAF.DEV</span>
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

  // 7. Active Navigation Spy via IntersectionObserver (Header & Bottom Dock)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const dockItems = document.querySelectorAll('.dock-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        dockItems.forEach((item) => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((sec) => observer.observe(sec));

  // 8. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
      if (window.cyberAudio) window.cyberAudio.playClick();
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
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
});
