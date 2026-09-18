/**
 * Three.js Interactive 3D Dimensional Bag & Spatial Quantum Nexus
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  const container = document.getElementById('bg-canvas-container');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    window.addEventListener('load', initThreeScene);
  } else {
    initThreeScene();
  }

  function initThreeScene() {
    if (typeof THREE === 'undefined') return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 42);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Color Palette
    const cyanColor = new THREE.Color(0x00f5ff);
    const violetColor = new THREE.Color(0xa855f7);
    const emeraldColor = new THREE.Color(0x10b981);
    const amberColor = new THREE.Color(0xf59e0b);

    // =========================================================================
    // 1. DYNAMIC QUANTUM PARTICLE FIELD
    // =========================================================================
    const particleCount = 850;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const pickColor = Math.random() > 0.45 ? cyanColor : violetColor;
      colors[i * 3] = pickColor.r;
      colors[i * 3 + 1] = pickColor.g;
      colors[i * 3 + 2] = pickColor.b;
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
    grad.addColorStop(0.35, 'rgba(0, 245, 255, 0.85)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 1.5,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // =========================================================================
    // 2. THE 3D HOLOGRAPHIC DIMENSIONAL BAG (CYBER-VAULT)
    // =========================================================================
    const bagGroup = new THREE.Group();
    bagGroup.position.set(0, -1, 0);
    scene.add(bagGroup);

    // 2.1 Bag Main Body: Geometric Cybernetic Capsule
    const bagBodyGeo = new THREE.CylinderGeometry(4.8, 5.6, 8.5, 16, 2, true);
    const bagBodyMat = new THREE.MeshBasicMaterial({
      color: 0x050814,
      wireframe: false,
      transparent: true,
      opacity: 0.82
    });
    const bagBody = new THREE.Mesh(bagBodyGeo, bagBodyMat);
    bagGroup.add(bagBody);

    // Bag Neon Edge Contours
    const bagEdgesGeo = new THREE.EdgesGeometry(bagBodyGeo);
    const bagEdgesMat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.65,
      linewidth: 2
    });
    const bagEdges = new THREE.LineSegments(bagEdgesGeo, bagEdgesMat);
    bagBody.add(bagEdges);

    // 2.2 Bag Reinforcement Ribs / Cyber Straps
    for (let r = 0; r < 3; r++) {
      const ribGeo = new THREE.TorusGeometry(5.1 + r * 0.15, 0.12, 8, 32);
      const ribMat = new THREE.MeshBasicMaterial({
        color: r === 1 ? 0xa855f7 : 0x00f5ff,
        transparent: true,
        opacity: 0.7
      });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.rotation.x = Math.PI / 2;
      rib.position.y = -3 + r * 2.8;
      bagGroup.add(rib);
    }

    // 2.3 Bag Top Hatch / Flap (Opens when interacting)
    const hatchGroup = new THREE.Group();
    hatchGroup.position.set(0, 4.25, -2);
    bagGroup.add(hatchGroup);

    const hatchGeo = new THREE.CylinderGeometry(5.2, 5.0, 1.8, 16);
    const hatchMat = new THREE.MeshBasicMaterial({
      color: 0x0c1124,
      transparent: true,
      opacity: 0.85
    });
    const hatchMesh = new THREE.Mesh(hatchGeo, hatchMat);
    hatchMesh.position.set(0, 0.9, 2);
    hatchGroup.add(hatchMesh);

    const hatchEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(hatchGeo),
      new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 })
    );
    hatchMesh.add(hatchEdges);

    // Neon Clasp / Lock Crystal
    const claspGeo = new THREE.OctahedronGeometry(0.85, 0);
    const claspMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.95
    });
    const clasp = new THREE.Mesh(claspGeo, claspMat);
    clasp.position.set(0, 1.2, 5.2);
    hatchGroup.add(clasp);

    // 2.4 Orbiting Quantum Dimensional Rings
    const ring1Geo = new THREE.TorusGeometry(8.5, 0.08, 6, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = 1.1;
    bagGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(9.8, 0.08, 6, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = 0.9;
    ring2.rotation.x = -0.5;
    bagGroup.add(ring2);

    // =========================================================================
    // 3. 7 HOLOGRAPHIC INVENTORY RELIC ORBS (Inside & Orbiting Bag)
    // =========================================================================
    const relicItems = [];
    const relicConfigs = [
      { id: 'item-1', name: 'Neural Identity', color: 0x00f5ff, angle: 0 },
      { id: 'item-2', name: 'Live Telemetry', color: 0x10b981, angle: (Math.PI * 2) / 7 * 1 },
      { id: 'item-3', name: 'Skill Matrix', color: 0xa855f7, angle: (Math.PI * 2) / 7 * 2 },
      { id: 'item-4', name: 'SmartCare Flagship', color: 0x00f5ff, angle: (Math.PI * 2) / 7 * 3 },
      { id: 'item-5', name: 'Mindset & DNA', color: 0xf59e0b, angle: (Math.PI * 2) / 7 * 4 },
      { id: 'item-6', name: 'Academic Ledger', color: 0x38bdf8, angle: (Math.PI * 2) / 7 * 5 },
      { id: 'item-7', name: 'Comms Uplink', color: 0xec4899, angle: (Math.PI * 2) / 7 * 6 }
    ];

    const relicGeo = new THREE.IcosahedronGeometry(1.1, 1);

    relicConfigs.forEach((cfg, idx) => {
      const relicMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const relicMesh = new THREE.Mesh(relicGeo, relicMat);

      // Inner glowing core
      const coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 12),
        new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.6 })
      );
      relicMesh.add(coreMesh);

      // Position in orbit around/above the bag
      const radius = 7.5;
      const x = Math.cos(cfg.angle) * radius;
      const z = Math.sin(cfg.angle) * radius;
      const y = 3.5 + Math.sin(idx * 1.2) * 1.5;

      relicMesh.position.set(x, y, z);
      relicMesh.userData = {
        id: cfg.id,
        name: cfg.name,
        baseX: x,
        baseY: y,
        baseZ: z,
        angle: cfg.angle,
        speed: 0.008 + (idx % 3) * 0.003
      };

      bagGroup.add(relicMesh);
      relicItems.push(relicMesh);
    });

    // =========================================================================
    // 4. INTERACTION & CAMERA STATE MACHINE
    // =========================================================================
    let targetCameraZ = 42;
    let targetCameraY = 2;
    let targetBagY = -1;
    let targetHatchAngle = 0;
    let activeExtractedRelic = null;

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Raycaster for 3D Relic Clicks
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    window.addEventListener('click', (e) => {
      // Ignore clicks on HUD buttons or forms
      if (e.target.closest('#bag-dock, .relic-viewport-card, .btn-cli, #terminal-modal, header, button, a, input, textarea')) return;

      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(relicItems, false);

      if (intersects.length > 0) {
        const hitRelic = intersects[0].object;
        if (window.inventoryBag && hitRelic.userData.id) {
          window.inventoryBag.pickItem(hitRelic.userData.id);
        }
      }
    });

    // Public API to notify 3D scene of inventory state changes
    window.setThreeBagState = function (state, itemId) {
      if (state === 'overview') {
        // Full panoramic bag view
        targetCameraZ = 36;
        targetCameraY = 1.5;
        targetBagY = -0.5;
        targetHatchAngle = 0.55; // Hatch open
        activeExtractedRelic = null;
      } else if (state === 'picked') {
        // Relic extracted & inspected: camera backs up, bag rests as background node
        targetCameraZ = 48;
        targetCameraY = -3;
        targetBagY = -7;
        targetHatchAngle = 0.85; // Wide open
        activeExtractedRelic = relicItems.find(r => r.userData.id === itemId);
      } else {
        targetCameraZ = 42;
        targetCameraY = 2;
        targetBagY = -1;
        targetHatchAngle = 0;
        activeExtractedRelic = null;
      }
    };

    // =========================================================================
    // 5. ANIMATION LOOP
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

      // Camera Lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.z += (targetCameraZ - camera.position.z) * 0.06;
      camera.position.y += (targetCameraY + currentMouseY * 3 - camera.position.y) * 0.06;
      camera.position.x += (currentMouseX * 5 - camera.position.x) * 0.06;
      camera.lookAt(0, targetBagY * 0.5, 0);

      // Bag Group Lerp
      bagGroup.position.y += (targetBagY - bagGroup.position.y) * 0.06;
      bagGroup.rotation.y += 0.004;

      // Hatch open/close animation
      hatchGroup.rotation.x += (targetHatchAngle - hatchGroup.rotation.x) * 0.1;
      clasp.rotation.y = elapsedTime * 2;

      // Rotate Dimensional Rings
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Animate Relic Orbs (Floating orbital dance)
      relicItems.forEach((relic, idx) => {
        relic.userData.angle += relic.userData.speed;
        const r = 7.8 + Math.sin(elapsedTime * 1.5 + idx) * 0.5;
        relic.position.x = Math.cos(relic.userData.angle) * r;
        relic.position.z = Math.sin(relic.userData.angle) * r;
        relic.position.y = relic.userData.baseY + Math.sin(elapsedTime * 2 + idx) * 0.8;

        relic.rotation.x = elapsedTime * (0.8 + idx * 0.1);
        relic.rotation.y = elapsedTime * (1.2 + idx * 0.1);

        // Highlight if active
        if (activeExtractedRelic === relic) {
          relic.scale.set(1.6, 1.6, 1.6);
        } else {
          relic.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Particle Waves
      particles.rotation.y = elapsedTime * 0.02;
      const posAttr = particleGeo.attributes.position;
      const posArray = posAttr.array;
      for (let i = 0; i < particleCount; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        posArray[i + 1] = oy + Math.sin(elapsedTime * 1.4 + ox * 0.06) * 1.2;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // Window Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();

