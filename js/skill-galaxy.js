/**
 * Interactive 3D Skill Galaxy / Orbital Tech Universe
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  const canvas = document.getElementById('skill-galaxy-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  const skills = [
    { name: 'Python', color: '#00f5ff', radius: 85, angle: 0, speed: 0.012, category: 'Language' },
    { name: 'Java', color: '#f59e0b', radius: 85, angle: (Math.PI * 2) / 3, speed: 0.012, category: 'Language' },
    { name: 'DSA & Algorithms', color: '#10b981', radius: 85, angle: (Math.PI * 4) / 3, speed: 0.012, category: 'Core' },

    { name: 'MongoDB', color: '#10b981', radius: 145, angle: 0.5, speed: -0.009, category: 'Database' },
    { name: 'Vite', color: '#a855f7', radius: 145, angle: 0.5 + (Math.PI * 2) / 4, speed: -0.009, category: 'Frontend' },
    { name: 'JavaScript', color: '#facc15', radius: 145, angle: 0.5 + Math.PI, speed: -0.009, category: 'Frontend' },
    { name: 'CSS3 / HTML5', color: '#38bdf8', radius: 145, angle: 0.5 + (Math.PI * 3) / 2, speed: -0.009, category: 'Frontend' },

    { name: 'OpenCV', color: '#ec4899', radius: 205, angle: 1.2, speed: 0.006, category: 'AI/Vision' },
    { name: 'Git & GitHub', color: '#f97316', radius: 205, angle: 1.2 + (Math.PI * 2) / 3, speed: 0.006, category: 'DevOps' },
    { name: 'Figma', color: '#c084fc', radius: 205, angle: 1.2 + (Math.PI * 4) / 3, speed: 0.006, category: 'Design' }
  ];

  let rotX = 0.45;
  let rotY = 0.2;
  let targetRotX = 0.45;
  let targetRotY = 0.2;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let hoveredSkill = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Mouse Interaction for 3D Drag Rotation
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    } else {
      // Check hover on nodes
      let found = null;
      for (const skill of skills) {
        if (skill.screenX !== undefined) {
          const dx = mouseX - skill.screenX;
          const dy = mouseY - skill.screenY;
          if (Math.sqrt(dx * dx + dy * dy) < 26) {
            found = skill;
            break;
          }
        }
      }
      if (found !== hoveredSkill) {
        hoveredSkill = found;
        if (hoveredSkill && window.cyberAudio) {
          window.cyberAudio.playHover();
        }
        canvas.style.cursor = hoveredSkill ? 'pointer' : 'grab';
      }
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth inertia interpolation
    rotX += (targetRotX - rotX) * 0.06;
    rotY += (targetRotY - rotY) * 0.06;

    if (!isDragging) {
      targetRotY += 0.0025; // Gentle constant rotation
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Central Pulsing Core
    const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.08;
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 38 * pulseScale);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.35, '#00f5ff');
    coreGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.4)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38 * pulseScale, 0, Math.PI * 2);
    ctx.fill();

    // Central Core Label
    ctx.fillStyle = '#06070d';
    ctx.font = 'bold 9px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASHRAF', centerX, centerY - 4);
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#006677';
    ctx.fillText('// CORE', centerX, centerY + 6);

    // Draw Orbit Rings in 3D perspective
    const orbitRadii = [85, 145, 205];
    for (const r of orbitRadii) {
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.08) {
        // 3D circle coordinates
        const x3d = r * Math.cos(theta);
        const y3d = 0;
        const z3d = r * Math.sin(theta);

        // Apply Y and X rotations
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const xRotY = x3d * cosY + z3d * sinY;
        const zRotY = -x3d * sinY + z3d * cosY;

        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const yRotX = y3d * cosX - zRotY * sinX;
        const zFinal = y3d * sinX + zRotY * cosX;

        // Perspective projection
        const fov = 380;
        const scale = fov / (fov + zFinal);
        const sx = centerX + xRotY * scale;
        const sy = centerY + yRotX * scale;

        if (theta === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Calculate Skill 3D Positions & Sort by Depth for proper rendering
    const nodes = [];

    for (const skill of skills) {
      skill.angle += skill.speed;

      const x3d = skill.radius * Math.cos(skill.angle);
      const y3d = 0;
      const z3d = skill.radius * Math.sin(skill.angle);

      // Rotations
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const xRotY = x3d * cosY + z3d * sinY;
      const zRotY = -x3d * sinY + z3d * cosY;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const yRotX = y3d * cosX - zRotY * sinX;
      const zFinal = y3d * sinX + zRotY * cosX;

      const fov = 380;
      const scale = fov / (fov + zFinal);
      const sx = centerX + xRotY * scale;
      const sy = centerY + yRotX * scale;

      skill.screenX = sx;
      skill.screenY = sy;
      skill.scale = scale;
      skill.z = zFinal;

      nodes.push(skill);
    }

    // Sort back-to-front
    nodes.sort((a, b) => b.z - a.z);

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredSkill === node;
      const baseRadius = (isHovered ? 18 : 13) * node.scale;

      // Glow halo
      const glowGrad = ctx.createRadialGradient(node.screenX, node.screenY, 0, node.screenX, node.screenY, baseRadius * 2.5);
      glowGrad.addColorStop(0, node.color);
      glowGrad.addColorStop(0.5, 'rgba(0, 245, 255, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(node.screenX, node.screenY, baseRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner Node Circle
      ctx.fillStyle = '#0a0d18';
      ctx.beginPath();
      ctx.arc(node.screenX, node.screenY, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#ffffff' : node.color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Connector line to center core when hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.screenX, node.screenY);
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Text label
      ctx.font = `${isHovered ? 'bold 12px' : '10px'} "JetBrains Mono", monospace`;
      ctx.fillStyle = isHovered ? '#ffffff' : '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.screenX, node.screenY + baseRadius + 14);

      if (isHovered) {
        // Show category tag
        ctx.font = '8px "Orbitron", monospace';
        ctx.fillStyle = node.color;
        ctx.fillText(`[${node.category}]`, node.screenX, node.screenY - baseRadius - 8);
      }
    }

    requestAnimationFrame(render);
  }

  render();
})();
