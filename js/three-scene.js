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
    // 3. RYAN KING ART 3D METALLIC GOLD SNOWFLAKE CENTERPIECE
    // (Accurate recreation of Sketchfab fd080903544e47b4a2a86ff3dabe3efa - Row 3 Middle)
    // =========================================================================
    const snowflakeGroup = new THREE.Group();
    snowflakeGroup.position.set(13, 0.5, -4);
    snowflakeGroup.scale.set(0.75, 0.75, 0.75);
    scene.add(snowflakeGroup);

    // Dynamic scene lighting for metallic highlights matching reference renders
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(20, 30, 25);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.1);
    dirLight2.position.set(-25, -15, 15);
    scene.add(dirLight2);

    // Warm Golden Brass Metallic Shader matching user screenshots (media_1789816339054/068)
    const snowflakeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.82,
      roughness: 0.28,
      wireframe: false
    });

    // 3.1 Central 12-Pointed Extruded Star Hub (Solid flat center, no middle diamond)
    const starShape = new THREE.Shape();
    const numStarPoints = 12;
    const rStarOuter = 3.3;
    const rStarInner = 1.95;
    for (let i = 0; i < numStarPoints * 2; i++) {
      const angle = (i * Math.PI) / numStarPoints;
      const r = (i % 2 === 0) ? rStarOuter : rStarInner;
      const x = Math.sin(angle) * r;
      const y = Math.cos(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starExtrudeSettings = {
      depth: 0.75,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06
    };
    const starGeo = new THREE.ExtrudeGeometry(starShape, starExtrudeSettings);
    starGeo.center();
    const centerStarMesh = new THREE.Mesh(starGeo, snowflakeMat);
    snowflakeGroup.add(centerStarMesh);

    // 3.2 Helper function to build 3D rectangular extruded struts connecting any 2 points in XY plane
    function create3DStrut(p1, p2, width = 0.38, depth = 0.75) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const geo = new THREE.BoxGeometry(len, width, depth);
      const mesh = new THREE.Mesh(geo, snowflakeMat);
      mesh.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 0);
      mesh.rotation.z = angle;
      return mesh;
    }

    // 3.3 6 Radial Sectors with Identical Snowflake Arms & Nested Diamond Lattice
    const strutWidth = 0.38;
    const extrusionDepth = 0.75;

    for (let k = 0; k < 6; k++) {
      const sectorAngle = (k * Math.PI) / 3;
      const sectorGroup = new THREE.Group();
      sectorGroup.rotation.z = sectorAngle;

      // 1. Main Radial Shaft (Spine) extending from hub (R=2.8) to tip (R=15.8)
      const shaftLen = 15.8 - 2.8;
      const shaftMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, shaftLen, extrusionDepth),
        snowflakeMat
      );
      shaftMesh.position.set(0, 2.8 + shaftLen / 2, 0);
      sectorGroup.add(shaftMesh);

      // 2. Outer Branch Pair 1 at R = 11.2 (pointing forward at 45 deg)
      const b1Len = 3.5;
      const b1Y = 11.2;
      const b1Left = new THREE.Mesh(new THREE.BoxGeometry(0.36, b1Len, extrusionDepth), snowflakeMat);
      b1Left.position.set(- (b1Len / 2) * Math.sin(Math.PI / 4), b1Y + (b1Len / 2) * Math.cos(Math.PI / 4), 0);
      b1Left.rotation.z = Math.PI / 4;
      sectorGroup.add(b1Left);

      const b1Right = new THREE.Mesh(new THREE.BoxGeometry(0.36, b1Len, extrusionDepth), snowflakeMat);
      b1Right.position.set((b1Len / 2) * Math.sin(Math.PI / 4), b1Y + (b1Len / 2) * Math.cos(Math.PI / 4), 0);
      b1Right.rotation.z = -Math.PI / 4;
      sectorGroup.add(b1Right);

      // 3. Outer Branch Pair 2 at R = 13.6 (pointing forward at 45 deg)
      const b2Len = 3.1;
      const b2Y = 13.6;
      const b2Left = new THREE.Mesh(new THREE.BoxGeometry(0.36, b2Len, extrusionDepth), snowflakeMat);
      b2Left.position.set(- (b2Len / 2) * Math.sin(Math.PI / 4), b2Y + (b2Len / 2) * Math.cos(Math.PI / 4), 0);
      b2Left.rotation.z = Math.PI / 4;
      sectorGroup.add(b2Left);

      const b2Right = new THREE.Mesh(new THREE.BoxGeometry(0.36, b2Len, extrusionDepth), snowflakeMat);
      b2Right.position.set((b2Len / 2) * Math.sin(Math.PI / 4), b2Y + (b2Len / 2) * Math.cos(Math.PI / 4), 0);
      b2Right.rotation.z = -Math.PI / 4;
      sectorGroup.add(b2Right);

      // 4. Nested Diamond Web and Chevrons between this arm (0 deg) and adjacent arm (60 deg)
      // Attachment points along Arm 0 (along Y axis):
      const ptA0 = { x: 0, y: 4.4 };
      const ptB0 = { x: 0, y: 7.6 };

      // Attachment points along Arm 1 (at 60 deg):
      const cos60 = Math.cos(Math.PI / 3);
      const sin60 = Math.sin(Math.PI / 3);
      const ptA1 = { x: 4.4 * sin60, y: 4.4 * cos60 };
      const ptB1 = { x: 7.6 * sin60, y: 7.6 * cos60 };

      // Midpoints along 30 deg axis:
      const cos30 = Math.cos(Math.PI / 6);
      const sin30 = Math.sin(Math.PI / 6);
      // Inner diamond peak:
      const rMidInner = 6.1;
      const ptJ1 = { x: rMidInner * sin30, y: rMidInner * cos30 };

      // Outer chevron peak:
      const rMidOuter = 9.9;
      const ptJ2 = { x: rMidOuter * sin30, y: rMidOuter * cos30 };

      // Strut 4.1: Lower diamond arm 0
      sectorGroup.add(create3DStrut(ptA0, ptJ1, strutWidth, extrusionDepth));
      // Strut 4.2: Lower diamond arm 1
      sectorGroup.add(create3DStrut(ptJ1, ptA1, strutWidth, extrusionDepth));

      // Strut 4.3: Upper diamond arm 0
      sectorGroup.add(create3DStrut(ptB0, ptJ1, strutWidth, extrusionDepth));
      // Strut 4.4: Upper diamond arm 1
      sectorGroup.add(create3DStrut(ptJ1, ptB1, strutWidth, extrusionDepth));

      // Strut 4.5: Outer chevron arm 0
      sectorGroup.add(create3DStrut(ptB0, ptJ2, strutWidth, extrusionDepth));
      // Strut 4.6: Outer chevron arm 1
      sectorGroup.add(create3DStrut(ptJ2, ptB1, strutWidth, extrusionDepth));

      snowflakeGroup.add(sectorGroup);
    }

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

      // Smooth return to unit scale after click pulse
      snowflakeGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);

      // Subtle float wave — stays visible at all scroll depths
      snowflakeGroup.position.y = 0.5 + Math.sin(elapsedTime * 1.1) * 0.7;

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
    let currentActiveMode = 'dark';
    let currentActiveTheme = 'brown';

    function applySceneTheme(theme) {
      currentActiveTheme = theme;
      const isLight = currentActiveMode === 'light';

      if (theme === 'blue') {
        snowflakeMat.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
        dirLight2.color.setHex(isLight ? 0x0369a1 : 0x38bdf8);
      } else if (theme === 'red') {
        snowflakeMat.color.setHex(isLight ? 0xdc2626 : 0xf87171);
        dirLight2.color.setHex(isLight ? 0xb91c1c : 0xf87171);
      } else if (theme === 'white') {
        snowflakeMat.color.setHex(isLight ? 0x475569 : 0xe2e8f0);
        dirLight2.color.setHex(isLight ? 0x64748b : 0xcbd5e1);
      } else {
        // Vintage Brown / Warm Amber & Antique Bronze (Default for all devices)
        snowflakeMat.color.setHex(isLight ? 0xb45309 : 0xf59e0b);
        dirLight2.color.setHex(isLight ? 0x92400e : 0xf59e0b);
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

    // Initialize initial colors and mode: Always default brown
    updateSnowflakeColors(false, 'brown');

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
