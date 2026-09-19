/**
 * Three.js Interactive 3D Kinetic Snowflake & Cosmic Snowfall
 * Shaik Mohammed Ashraf // Portfolio Visual Engine
 */

(function () {
  const container = document.getElementById('bg-canvas-container');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    window.addEventListener('load', initScene);
  } else {
    initScene();
  }

  function initScene() {
    if (typeof THREE === 'undefined') return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. PROCEDURAL 3D SNOWFLAKE PARTICLES (Cosmic Snowfall)
    // =========================================================================
    // =========================================================================
    // 2. PROCEDURAL 3D SNOWFLAKE PARTICLES (Realistic Multi-Layered Cosmic Snowfall)
    // =========================================================================
    function createRealisticSnowflakeTexture(isLightMode = false) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.translate(128, 128);

      const mainColor = isLightMode ? '#78350f' : '#ffffff';
      const glowColor = isLightMode ? 'rgba(180, 83, 9, 0.45)' : 'rgba(255, 255, 255, 0.95)';
      const coreFill = isLightMode ? '#92400e' : 'rgba(255, 255, 255, 0.98)';

      ctx.strokeStyle = mainColor;
      ctx.lineCap = 'round';
      ctx.shadowBlur = isLightMode ? 6 : 14;
      ctx.shadowColor = glowColor;

      const arms = 6;
      for (let a = 0; a < arms; a++) {
        ctx.save();
        ctx.rotate((a * Math.PI) / 3);

        // Main primary crystal shaft
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -108);
        ctx.stroke();

        // Primary lower branchlets (60-deg angle)
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(-28, -66);
        ctx.moveTo(0, -40);
        ctx.lineTo(28, -66);
        ctx.stroke();

        // Secondary sub-pinnules branching off lower arms
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-14, -53);
        ctx.lineTo(-24, -48);
        ctx.moveTo(14, -53);
        ctx.lineTo(24, -48);
        ctx.stroke();

        // Upper branchlets
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(0, -74);
        ctx.lineTo(-22, -92);
        ctx.moveTo(0, -74);
        ctx.lineTo(22, -92);
        ctx.stroke();

        // Near-tip micro-spurs
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -94);
        ctx.lineTo(-11, -103);
        ctx.moveTo(0, -94);
        ctx.lineTo(11, -103);
        ctx.stroke();

        // Crystal diamond starlet tip
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(0, -108, 4.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Central faceted crystal hexagon
      ctx.fillStyle = coreFill;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 15;
        const y = Math.sin(angle) * 15;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Inner core refraction star
      ctx.strokeStyle = isLightMode ? '#ffffff' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 11, Math.sin(angle) * 11);
      }
      ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    const darkSnowflakeTexture = createRealisticSnowflakeTexture(false);
    const lightSnowflakeTexture = createRealisticSnowflakeTexture(true);

    const particleCount = 520;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const swayAmps = new Float32Array(particleCount);
    const swayFreqs = new Float32Array(particleCount);
    const swayPhases = new Float32Array(particleCount);
    const baseColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 115;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 85;
      // Spread depth from foreground to background for realistic perspective scale
      positions[i * 3 + 2] = (Math.random() - 0.5) * 55;

      velocities[i] = 0.045 + Math.random() * 0.095;
      swayAmps[i] = 0.35 + Math.random() * 0.75;
      swayFreqs[i] = 0.75 + Math.random() * 1.35;
      swayPhases[i] = Math.random() * Math.PI * 2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(baseColors, 3));

    function updateSnowflakeColors(isLight, theme) {
      const colAttr = particleGeo.attributes.color;
      const colArray = colAttr.array;

      let c1, c2, c3;
      if (isLight) {
        if (theme === 'blue') {
          c1 = new THREE.Color(0x0369a1);
          c2 = new THREE.Color(0x0284c7);
          c3 = new THREE.Color(0x075985);
        } else if (theme === 'red') {
          c1 = new THREE.Color(0xb91c1c);
          c2 = new THREE.Color(0xdc2626);
          c3 = new THREE.Color(0x991b1b);
        } else {
          // High-contrast rich amber & antique bronze frost against parchment background
          c1 = new THREE.Color(0x92400e);
          c2 = new THREE.Color(0xb45309);
          c3 = new THREE.Color(0x78350f);
        }
      } else {
        if (theme === 'blue') {
          c1 = new THREE.Color(0xffffff);
          c2 = new THREE.Color(0x7dd3fc);
          c3 = new THREE.Color(0x38bdf8);
        } else if (theme === 'red') {
          c1 = new THREE.Color(0xffffff);
          c2 = new THREE.Color(0xfca5a5);
          c3 = new THREE.Color(0xf87171);
        } else {
          c1 = new THREE.Color(0xffffff);
          c2 = new THREE.Color(0xfef3c7);
          c3 = new THREE.Color(0xfcd34d);
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const pick = (i % 3);
        const col = pick === 0 ? c1 : pick === 1 ? c2 : c3;
        colArray[i * 3] = col.r;
        colArray[i * 3 + 1] = col.g;
        colArray[i * 3 + 2] = col.b;
      }
      colAttr.needsUpdate = true;
    }

    const particleMat = new THREE.PointsMaterial({
      size: 2.15,
      map: darkSnowflakeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const snowfall = new THREE.Points(particleGeo, particleMat);
    scene.add(snowfall);

    // =========================================================================
    // 3. KINETIC 3D CRYSTALLINE SNOWFLAKE CENTERPIECE
    // =========================================================================
    const snowflakeGroup = new THREE.Group();
    snowflakeGroup.position.set(13, 2, -4);
    scene.add(snowflakeGroup);

    // 3.1 Central Faceted Ice Core (Dodecahedron with Wireframe)
    const coreGeo = new THREE.OctahedronGeometry(2.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: false,
      transparent: true,
      opacity: 0.75
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    snowflakeGroup.add(coreMesh);

    const coreWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: 0xfff8e7, transparent: true, opacity: 0.95 })
    );
    coreMesh.add(coreWire);

    // 3.2 6 Symmetrical 3D Snowflake Dendrite Arms
    const armsGroup = new THREE.Group();
    snowflakeGroup.add(armsGroup);

    const shaftMat = new THREE.MeshBasicMaterial({ color: 0xd4a373, transparent: true, opacity: 0.85 });
    const branchMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.95 });

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const arm = new THREE.Group();
      arm.rotation.z = angle;

      // Main Crystal Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.12, 0.07, 13, 6);
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.y = 6.5;
      arm.add(shaft);

      // Primary Lower Branchlets (Left & Right)
      const b1Left = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 3.4, 5), branchMat);
      b1Left.position.set(-1.2, 5.2, 0);
      b1Left.rotation.z = Math.PI / 4;
      arm.add(b1Left);

      const b1Right = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 3.4, 5), branchMat);
      b1Right.position.set(1.2, 5.2, 0);
      b1Right.rotation.z = -Math.PI / 4;
      arm.add(b1Right);

      // Secondary Upper Branchlets (Left & Right)
      const b2Left = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.04, 2.6, 5), branchMat);
      b2Left.position.set(-0.95, 9.0, 0);
      b2Left.rotation.z = Math.PI / 4;
      arm.add(b2Left);

      const b2Right = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.04, 2.6, 5), branchMat);
      b2Right.position.set(0.95, 9.0, 0);
      b2Right.rotation.z = -Math.PI / 4;
      arm.add(b2Right);

      // Faceted Diamond Crystal Tip
      const tipGeo = new THREE.OctahedronGeometry(0.7, 0);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = 13.2;
      arm.add(tip);

      armsGroup.add(arm);
    }

    // 3.3 Concentric Celestial Frost Rings
    const ring1Geo = new THREE.TorusGeometry(9.2, 0.05, 8, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    snowflakeGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(13.2, 0.05, 8, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xb77e3f, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    snowflakeGroup.add(ring2);

    // =========================================================================
    // 4. TACTILE DRAG & INTERACTION PHYSICS
    // =========================================================================
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    const damping = 0.95;

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, input, textarea, .telemetry-row-card, .smartcare-spotlight-card, .arsenal-board')) return;
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch physics support
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Cursor Parallax & Wind Currents
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let windDrift = 0;

    window.addEventListener('mousemove', (e) => {
      const prevTargetX = targetMouseX;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      windDrift = (targetMouseX - prevTargetX) * 0.4;
    });

    // Scroll parallax tracking
    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    // Click to pulse snowflake
    window.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      snowflakeGroup.scale.set(1.22, 1.22, 1.22);
      if (window.cyberAudio && typeof window.cyberAudio.playClick === 'function') {
        window.cyberAudio.playClick();
      }
    });

    // =========================================================================
    // 5. ANIMATION LOOP: GENTLE SNOWFALL & CRYSTAL ROTATION
    // =========================================================================
    let clock = new THREE.Clock();
    let isVisible = true;

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax Smooth Lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Camera responds smoothly to mouse parallax without drifting away on scroll
      camera.position.x = currentMouseX * 2.5;
      camera.position.y = currentMouseY * 1.5;
      camera.lookAt(0, 0, 0);

      // Inertia drag on snowflake sculpture
      snowflakeGroup.rotation.y += rotationVelocityY;
      snowflakeGroup.rotation.x += rotationVelocityX;
      rotationVelocityX *= damping;
      rotationVelocityY *= damping;

      // Base idle rotations of the snowflake centerpiece
      snowflakeGroup.rotation.z = elapsedTime * 0.08;
      snowflakeGroup.rotation.y += 0.004;

      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.18;

      // Smooth return to unit scale after click pulse
      snowflakeGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);

      // Subtle float wave + natural parallax exit as user scrolls down past Hero section
      snowflakeGroup.position.y = 2 + Math.sin(elapsedTime * 1.1) * 0.7 - (scrollY * 0.022);

      // Responsive position
      if (window.innerWidth < 900) {
        snowflakeGroup.position.x = 0;
        snowflakeGroup.position.z = -14;
      } else {
        snowflakeGroup.position.x = 13;
        snowflakeGroup.position.z = -4;
      }

      // =======================================================================
      // Real 3D Snowfall Dynamics: Continuous Fall, Horizontal Sway & Wind
      // =======================================================================
      const posAttr = particleGeo.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Downward drift
        posArray[idx + 1] -= velocities[i];

        // Horizontal sinusoidal flutter + wind
        posArray[idx] += Math.sin(elapsedTime * swayFreqs[i] + swayPhases[i]) * 0.035 + windDrift;

        // Subtle depth drift
        posArray[idx + 2] += Math.cos(elapsedTime * 0.5 + swayPhases[i]) * 0.01;

        // Wrap around continuously so snowfall is perpetual at any scroll depth
        if (posArray[idx + 1] < -42) {
          posArray[idx + 1] = 42;
          posArray[idx] = (Math.random() - 0.5) * 115;
        }
      }
      posAttr.needsUpdate = true;
      windDrift *= 0.94; // Wind dissipates

      renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // =========================================================================
    // 6. THEME PALETTE & LIGHT/DARK MODE SYNCHRONIZATION
    // =========================================================================
    let currentActiveMode = localStorage.getItem('ashraf_theme_mode') || 'dark';
    let currentActiveTheme = localStorage.getItem('ashraf_color_theme') || 'brown';

    function applySceneTheme(theme) {
      currentActiveTheme = theme;
      const isLight = currentActiveMode === 'light';

      if (theme === 'blue') {
        coreMat.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
        shaftMat.color.setHex(isLight ? 0x0369a1 : 0x0284c7);
        branchMat.color.setHex(isLight ? 0x0284c7 : 0x0ea5e9);
        ring1Mat.color.setHex(isLight ? 0x075985 : 0x38bdf8);
        ring2Mat.color.setHex(isLight ? 0x0369a1 : 0x7dd3fc);
      } else if (theme === 'red') {
        coreMat.color.setHex(isLight ? 0xdc2626 : 0xf87171);
        shaftMat.color.setHex(isLight ? 0xb91c1c : 0xdc2626);
        branchMat.color.setHex(isLight ? 0xdc2626 : 0xef4444);
        ring1Mat.color.setHex(isLight ? 0x991b1b : 0xf87171);
        ring2Mat.color.setHex(isLight ? 0xb91c1c : 0xfca5a5);
      } else if (theme === 'white') {
        coreMat.color.setHex(isLight ? 0x334155 : 0xffffff);
        shaftMat.color.setHex(isLight ? 0x475569 : 0xe2e8f0);
        branchMat.color.setHex(isLight ? 0x334155 : 0xcbd5e1);
        ring1Mat.color.setHex(isLight ? 0x1e293b : 0xffffff);
        ring2Mat.color.setHex(isLight ? 0x475569 : 0xf8fafc);
      } else {
        // Vintage Brown / Warm Amber & Antique Bronze
        coreMat.color.setHex(isLight ? 0xb45309 : 0xf59e0b);
        shaftMat.color.setHex(isLight ? 0x92400e : 0xd4a373);
        branchMat.color.setHex(isLight ? 0xb45309 : 0xf59e0b);
        ring1Mat.color.setHex(isLight ? 0x78350f : 0xd97706);
        ring2Mat.color.setHex(isLight ? 0x92400e : 0xb77e3f);
      }

      updateSnowflakeColors(isLight, theme);
    }

    function applySceneMode(mode) {
      currentActiveMode = mode;
      const isLight = mode === 'light';

      if (isLight) {
        particleMat.map = lightSnowflakeTexture;
        particleMat.blending = THREE.NormalBlending;
        particleMat.opacity = 0.85;
      } else {
        particleMat.map = darkSnowflakeTexture;
        particleMat.blending = THREE.AdditiveBlending;
        particleMat.opacity = 0.85;
      }
      particleMat.needsUpdate = true;

      applySceneTheme(currentActiveTheme);
    }

    // Initialize initial colors and mode
    updateSnowflakeColors(currentActiveMode === 'light', currentActiveTheme);
    if (currentActiveMode === 'light') {
      applySceneMode('light');
    }
    if (currentActiveTheme !== 'brown') {
      applySceneTheme(currentActiveTheme);
    }

    window.addEventListener('colorThemeChanged', (e) => {
      const theme = e.detail?.theme || 'brown';
      applySceneTheme(theme);
    });

    window.addEventListener('themeModeChanged', (e) => {
      const mode = e.detail?.mode || 'dark';
      applySceneMode(mode);
    });
  }
})();
