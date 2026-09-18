/**
 * 3D Holographic Gyro Tilt Physics with Specular Flare
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  function initTiltElements() {
    const tiltElements = document.querySelectorAll('[data-tilt], .holo-tilt-card, .project-cyber-card');

    tiltElements.forEach((el) => {
      let isHovered = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let animationFrame = null;

      const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 12;

      function updateTilt() {
        if (!isHovered) {
          // Smooth return to resting state
          currentRotX += (0 - currentRotX) * 0.1;
          currentRotY += (0 - currentRotY) * 0.1;

          if (Math.abs(currentRotX) < 0.01 && Math.abs(currentRotY) < 0.01) {
            currentRotX = 0;
            currentRotY = 0;
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            return;
          }
        } else {
          // Lerp towards mouse tilt target
          currentRotX += (targetRotX - currentRotX) * 0.14;
          currentRotY += (targetRotY - currentRotY) * 0.14;
        }

        el.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
        animationFrame = requestAnimationFrame(updateTilt);
      }

      el.addEventListener('mouseenter', () => {
        isHovered = true;
        if (window.cyberAudio) {
          window.cyberAudio.playHover();
        }
        if (!animationFrame) {
          animationFrame = requestAnimationFrame(updateTilt);
        }
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalize between -1 and 1
        const normX = (mouseX / rect.width - 0.5) * 2;
        const normY = (mouseY / rect.height - 0.5) * 2;

        targetRotY = normX * maxTilt;
        targetRotX = -normY * maxTilt;

        // Set CSS variables for specular glare
        el.style.setProperty('--mouse-x', `${(mouseX / rect.width * 100).toFixed(1)}%`);
        el.style.setProperty('--mouse-y', `${(mouseY / rect.height * 100).toFixed(1)}%`);
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltElements);
  } else {
    initTiltElements();
  }
})();
