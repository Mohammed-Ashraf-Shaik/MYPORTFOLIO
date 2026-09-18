/**
 * Three.js Interactive 3D Centerpiece
 * Inspired by Bruno Simon & Three.js Examples
 * Shaik Mohammed Ashraf // Portfolio
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

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 1. ORGANIC PARTICLES (Subtle, high-end floating dust field)
    // =========================================================================
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8); // Sky Cyan
    const color2 = new THREE.Color(0x818cf8); // Indigo
    const color3 = new THREE.Color(0xc084fc); // Violet

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 90;
      const y = (Math.random() - 0.5) * 90;
      const z = (Math.random() - 0.5) * 60;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const pick = Math.random();
      const col = pick < 0.4 ? color1 : pick < 0.75 ? color2 : color3;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow Texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(99, 102, 241, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 1.4,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // =========================================================================
    // 2. BRUNO SIMON INSPIRED INTERACTIVE 3D ARTIFACT
    // =========================================================================
    const artifactGroup = new THREE.Group();
    // Position comfortably in 3D space
    artifactGroup.position.set(13, 2, -4);
    scene.add(artifactGroup);

    // 2.1 Outer Wireframe Cage (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(7.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    artifactGroup.add(outerMesh);

    // 2.2 Middle Floating Faceted Core (Octahedron)
    const midGeo = new THREE.OctahedronGeometry(5.2, 0);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    artifactGroup.add(midMesh);

    // 2.3 Inner Luminous Energy Nucleus
    const innerGeo = new THREE.DodecahedronGeometry(2.8, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    artifactGroup.add(innerMesh);

    const innerWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerGeo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    );
    innerMesh.add(innerWire);

    // 2.4 Orbital Gyroscope Rings
    const ring1Geo = new THREE.TorusGeometry(10.5, 0.06, 8, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    artifactGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(11.8, 0.06, 8, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    artifactGroup.add(ring2);

    // =========================================================================
    // 3. TACTILE DRAG & INTERACTION PHYSICS (Bruno Simon style)
    // =========================================================================
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    const damping = 0.95;

    window.addEventListener('mousedown', (e) => {
      // Allow drag when clicking near center/right
      if (e.target.closest('button, a, input, textarea, .telemetry-card, .smartcare-card')) return;
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

    // Touch support for mobile
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

    // Cursor Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Scroll parallax tracking
    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    // Click to pulse core
    window.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      innerMesh.scale.set(1.4, 1.4, 1.4);
      if (window.cyberAudio && typeof window.cyberAudio.playClick === 'function') {
        window.cyberAudio.playClick();
      }
    });

    // =========================================================================
    // 4. ANIMATION LOOP
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

      // Adjust camera with mouse & natural scroll
      camera.position.x = currentMouseX * 3;
      camera.position.y = currentMouseY * 2.5 - (scrollY * 0.012);
      camera.lookAt(0, -(scrollY * 0.012), 0);

      // Apply drag inertia physics
      artifactGroup.rotation.y += rotationVelocityY;
      artifactGroup.rotation.x += rotationVelocityX;

      rotationVelocityX *= damping;
      rotationVelocityY *= damping;

      // Base idle rotations
      outerMesh.rotation.y += 0.003;
      outerMesh.rotation.x += 0.002;

      midMesh.rotation.y -= 0.006;
      midMesh.rotation.z += 0.004;

      innerMesh.rotation.x += 0.01;
      innerMesh.rotation.y += 0.012;

      // Smooth return to scale after click pulse
      innerMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);

      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.2;

      // Subtle float wave
      artifactGroup.position.y = 2 + Math.sin(elapsedTime * 1.2) * 0.8;

      // Responsive position adjustment
      if (window.innerWidth < 900) {
        artifactGroup.position.x = 0;
        artifactGroup.position.z = -12;
      } else {
        artifactGroup.position.x = 13;
        artifactGroup.position.z = -4;
      }

      // Organic Particle Field Drift
      const posAttr = particleGeo.attributes.position;
      const posArray = posAttr.array;
      for (let i = 0; i < particleCount; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        posArray[i + 1] = oy + Math.sin(elapsedTime * 0.8 + ox * 0.05) * 1.5;
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
