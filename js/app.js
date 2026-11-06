(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const year = document.querySelector('#year');

  year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const commandEl = document.querySelector('#terminal-command');
  const outputEl = document.querySelector('#terminal-output');
  const inputEl = document.querySelector('#terminal-input');
  const submitEl = document.querySelector('#terminal-submit');
  const commandMap = {
    status: './zero-limits --status',
    stack: './zero-limits --inspect stack',
    connect: './zero-limits --open-channel',
    orchestrate: './zero-limits --module orchestration',
    edge: './zero-limits --module edge-intelligence',
    security: './zero-limits --module security',
    interface: './zero-limits --module interfaces'
  };
  const outputMap = {
    status: '[ok] core online\n[ok] 7 layers healthy\n[ok] 478 tools available\n[ok] verification loop armed\n\nNo incidents. Ready for your signal.',
    stack: '01 / memory\n02 / context router\n03 / agent mesh\n04 / tool execution\n05 / verification\n06 / interface\n07 / recovery\n\nStack inspection complete.',
    connect: 'Opening a secure channel...\n[ok] identity not required\n[ok] message boundary ready\n\nUse the signal form below to continue.',
    orchestrate: 'Loading orchestration module...\n[ok] task decomposition\n[ok] specialist routing\n[ok] state handoff\n\nModule ready.',
    edge: 'Loading edge module...\n[ok] local-first cache\n[ok] offline queue\n[ok] graceful recovery\n\nModule ready.',
    security: 'Loading security module...\n[ok] capability boundaries\n[ok] input validation\n[ok] audit trail\n\nModule ready.',
    interface: 'Loading interface module...\n[ok] touch targets\n[ok] reduced motion\n[ok] responsive layout\n\nModule ready.'
  };

  const runCommand = (rawCommand) => {
    const normalized = rawCommand.trim().toLowerCase().replace(/^\.\/zero-limits\s+--(?:module\s+)?/, '');
    const key = normalized.split(/\s+/)[0] || 'status';
    const resolved = commandMap[key] ? key : 'status';
    commandEl.textContent = commandMap[resolved];
    outputEl.textContent = outputMap[resolved];
  };

  submitEl?.addEventListener('click', () => runCommand(inputEl?.value || 'status'));
  inputEl?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') runCommand(inputEl.value);
  });
  document.querySelectorAll('[data-terminal-command]').forEach((button) => {
    button.addEventListener('click', () => runCommand(button.dataset.terminalCommand));
  });
  document.querySelectorAll('[data-command]').forEach((link) => {
    link.addEventListener('click', () => runCommand(link.dataset.command));
  });

  const canvas = document.querySelector('#particle-field');
  const context = canvas?.getContext('2d');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (canvas && context && !reduceMotion) {
    let width = 0;
    let height = 0;
    let particles = [];
    const palette = ['#ff4554', '#ff7d6c', '#7de8ed', '#b78cff'];
    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * .18 + .04,
      drift: (Math.random() - .5) * .15,
      alpha: Math.random() * .55 + .16,
      color: palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - .5) * .01
    });
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = width < 700 ? 26 : 52;
      particles = Array.from({ length: count }, createParticle);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;
        particle.rotation += particle.rotationSpeed;
        if (particle.y < -10) { particle.y = height + 10; particle.x = Math.random() * width; }
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = particle.alpha;
        context.strokeStyle = particle.color;
        context.lineWidth = .7;
        context.beginPath();
        context.moveTo(0, -particle.size);
        context.lineTo(particle.size, particle.size);
        context.lineTo(-particle.size, particle.size);
        context.closePath();
        context.stroke();
        context.restore();
      });
      requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    draw();
  }

  const brushCanvas = document.querySelector('#brush-cursor');
  const initBrushCursor = () => {
    if (!brushCanvas || !brushCanvas.getContext || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const brushContext = brushCanvas.getContext('2d', { alpha: true });
    if (!brushContext) return;

    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    const trail = [];
    const sparks = [];
    const maxTrail = 54;
    const maxSparks = 30;
    const colors = {
      hot: [255, 69, 84],
      coral: [255, 125, 108],
      cyan: [125, 232, 237]
    };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = 0;
    let running = false;
    let pointerInside = false;
    let touchActive = false;
    let lastInput = null;
    let pointer = { x: 0, y: 0 };
    let hoveredTarget = null;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const rgba = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    const isTouch = (event) => event.pointerType === 'touch';
    const isPointerAllowed = (event) => !isTouch(event) || touchActive;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      brushCanvas.width = Math.floor(width * pixelRatio);
      brushCanvas.height = Math.floor(height * pixelRatio);
      brushCanvas.style.width = `${width}px`;
      brushCanvas.style.height = `${height}px`;
      brushContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const setVisible = (visible) => {
      brushCanvas.style.opacity = visible ? '1' : '0';
    };

    const schedule = () => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(render);
    };

    const addSpark = (point, speedFactor) => {
      if (sparks.length >= maxSparks || Math.random() > .16 + speedFactor * .2) return;
      const angle = Math.random() * Math.PI * 2;
      const force = 0.18 + Math.random() * (.45 + speedFactor * 1.4);
      sparks.push({
        x: point.x + (Math.random() - .5) * point.size * 2,
        y: point.y + (Math.random() - .5) * point.size * 2,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - .08,
        size: Math.random() * 1.6 + .7,
        life: 1,
        color: Math.random() > .75 ? colors.cyan : colors.coral
      });
    };

    const addPoint = (x, y, speed, sourceType, now) => {
      const previous = trail[trail.length - 1];
      const speedFactor = clamp(speed * 18, 0, 1);
      const angle = previous ? Math.atan2(y - previous.y, x - previous.x) : 0;
      const normalX = -Math.sin(angle);
      const normalY = Math.cos(angle);
      const organicOffset = (Math.random() - .5) * (1.5 + speedFactor * 8);
      const point = {
        x: x + normalX * organicOffset,
        y: y + normalY * organicOffset,
        size: clamp(2.6 + speedFactor * 6 + Math.random() * 2, 2.6, 10),
        life: 1,
        phase: Math.random() * Math.PI * 2,
        wobble: 1.5 + speedFactor * 5,
        sourceType,
        color: Math.random() > .88 ? colors.cyan : colors.hot,
        createdAt: now
      };
      trail.push(point);
      if (trail.length > maxTrail) trail.splice(0, trail.length - maxTrail);
      addSpark(point, speedFactor);
    };

    const pointPosition = (point, now) => ({
      x: point.x + Math.sin(now * .004 + point.phase) * point.wobble,
      y: point.y + Math.cos(now * .0032 + point.phase * 1.3) * point.wobble * .55
    });

    const traceTrail = (now) => {
      if (trail.length < 2) return false;
      const positions = trail.map((point) => pointPosition(point, now));
      brushContext.beginPath();
      brushContext.moveTo(positions[0].x, positions[0].y);
      for (let index = 1; index < positions.length; index += 1) {
        const previous = positions[index - 1];
        const current = positions[index];
        const middleX = (previous.x + current.x) * .5;
        const middleY = (previous.y + current.y) * .5;
        brushContext.quadraticCurveTo(previous.x, previous.y, middleX, middleY);
      }
      const last = positions[positions.length - 1];
      brushContext.lineTo(last.x, last.y);
      return true;
    };

    const drawTrail = (now) => {
      if (!traceTrail(now)) return;
      const first = pointPosition(trail[0], now);
      const last = pointPosition(trail[trail.length - 1], now);
      const gradient = brushContext.createLinearGradient(first.x, first.y, last.x, last.y);
      gradient.addColorStop(0, rgba(colors.hot, 0));
      gradient.addColorStop(.18, rgba(colors.hot, .06));
      gradient.addColorStop(.65, rgba(colors.coral, .42));
      gradient.addColorStop(1, rgba(colors.coral, .88));

      brushContext.save();
      brushContext.globalCompositeOperation = 'lighter';
      brushContext.filter = 'blur(7px)';
      brushContext.globalAlpha = .4;
      brushContext.strokeStyle = gradient;
      brushContext.lineWidth = last.size * 2.7 + 7;
      brushContext.lineCap = 'round';
      brushContext.lineJoin = 'round';
      brushContext.stroke();
      brushContext.restore();

      brushContext.save();
      brushContext.globalCompositeOperation = 'lighter';
      brushContext.globalAlpha = .78;
      brushContext.filter = 'none';
      brushContext.strokeStyle = gradient;
      brushContext.lineWidth = Math.max(1.8, last.size * .58);
      brushContext.lineCap = 'round';
      brushContext.lineJoin = 'round';
      brushContext.stroke();

      // A pair of low-alpha bristles makes the trail feel painted rather than geometric.
      const bristleOffset = Math.sin(now * .005) * 2.5;
      brushContext.globalAlpha = .16;
      brushContext.lineWidth = .65;
      brushContext.translate(bristleOffset, -bristleOffset * .4);
      brushContext.strokeStyle = rgba(colors.coral, .8);
      brushContext.stroke();
      brushContext.translate(-bristleOffset * 1.6, bristleOffset * .8);
      brushContext.strokeStyle = rgba(colors.hot, .7);
      brushContext.stroke();
      brushContext.restore();
    };

    const drawSparks = (delta) => {
      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.life -= delta * .0018;
        spark.x += spark.vx * delta;
        spark.y += spark.vy * delta;
        spark.vy += .0015 * delta;
        if (spark.life <= .02) {
          sparks.splice(index, 1);
          continue;
        }
        const radius = spark.size * (1 + (1 - spark.life) * 1.5);
        const glow = brushContext.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, radius * 5);
        glow.addColorStop(0, rgba(spark.color, .65 * spark.life));
        glow.addColorStop(1, rgba(spark.color, 0));
        brushContext.fillStyle = glow;
        brushContext.beginPath();
        brushContext.arc(spark.x, spark.y, radius * 5, 0, Math.PI * 2);
        brushContext.fill();
        brushContext.fillStyle = rgba(spark.color, .85 * spark.life);
        brushContext.beginPath();
        brushContext.arc(spark.x, spark.y, radius, 0, Math.PI * 2);
        brushContext.fill();
      }
    };

    const drawCursorDot = (now) => {
      if (!pointerInside || !finePointer?.matches) return;
      const hoverScale = hoveredTarget ? 1.45 : 1;
      const pulse = 1 + Math.sin(now * .008) * .08;
      const radius = 2.6 * hoverScale * pulse;
      const glow = brushContext.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 7);
      glow.addColorStop(0, rgba(colors.coral, .5));
      glow.addColorStop(.32, rgba(colors.hot, .16));
      glow.addColorStop(1, rgba(colors.hot, 0));
      brushContext.fillStyle = glow;
      brushContext.beginPath();
      brushContext.arc(pointer.x, pointer.y, radius * 7, 0, Math.PI * 2);
      brushContext.fill();
      brushContext.fillStyle = rgba(colors.coral, .92);
      brushContext.beginPath();
      brushContext.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
      brushContext.fill();
    };

    let previousFrame = performance.now();
    const render = (now) => {
      const delta = clamp(now - previousFrame, 8, 40);
      previousFrame = now;
      brushContext.clearRect(0, 0, width, height);

      for (let index = trail.length - 1; index >= 0; index -= 1) {
        trail[index].life -= delta * .00078;
        if (trail[index].life <= .02) trail.splice(index, 1);
      }
      drawTrail(now);
      brushContext.save();
      brushContext.globalCompositeOperation = 'lighter';
      drawSparks(delta);
      drawCursorDot(now);
      brushContext.restore();

      const hasWork = trail.length > 0 || sparks.length > 0 || (pointerInside && finePointer?.matches);
      if (hasWork) {
        setVisible(true);
        frameId = requestAnimationFrame(render);
      } else {
        running = false;
        frameId = 0;
        setVisible(false);
      }
    };

    const movePointer = (event) => {
      if (!isPointerAllowed(event)) return;
      const current = { x: event.clientX, y: event.clientY };
      const now = performance.now();
      const sourceType = event.pointerType || 'mouse';
      pointer = current;
      pointerInside = true;
      if (!lastInput || lastInput.sourceType !== sourceType || now - lastInput.time > 140) {
        lastInput = { ...current, time: now, sourceType };
        addPoint(current.x, current.y, 0, sourceType, now);
        setVisible(true);
        schedule();
        return;
      }

      const previous = lastInput;
      const distanceMoved = distance(previous, current);
      const elapsed = clamp(now - previous.time, 8, 120);
      const speed = distanceMoved / elapsed;
      const steps = clamp(Math.ceil(distanceMoved / (sourceType === 'touch' ? 8 : 5)), 1, 16);
      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        addPoint(
          previous.x + (current.x - previous.x) * progress,
          previous.y + (current.y - previous.y) * progress,
          speed,
          sourceType,
          now
        );
      }
      lastInput = { ...current, time: now, sourceType };
      schedule();
    };

    const startTouch = (event) => {
      if (!isTouch(event)) return;
      touchActive = true;
      pointerInside = true;
      lastInput = null;
      movePointer(event);
    };

    const endTouch = (event) => {
      if (!isTouch(event)) return;
      touchActive = false;
      pointerInside = false;
      lastInput = null;
      schedule();
    };

    const leavePointer = (event) => {
      if (isTouch(event)) return;
      pointerInside = false;
      lastInput = null;
      schedule();
    };

    const setHoveredTarget = (element) => {
      const nextTarget = element?.closest?.('a, button, input, textarea, select, img, .system-card, .project-card');
      if (nextTarget === hoveredTarget) return;
      hoveredTarget?.classList.remove('brush-hover-target', 'brush-is-hovered');
      hoveredTarget = nextTarget || null;
      hoveredTarget?.classList.add('brush-hover-target', 'brush-is-hovered');
      schedule();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', movePointer, { passive: true });
    window.addEventListener('pointerdown', startTouch, { passive: true });
    window.addEventListener('pointerup', endTouch, { passive: true });
    window.addEventListener('pointercancel', endTouch, { passive: true });
    window.addEventListener('pointerout', (event) => {
      if (!event.relatedTarget) leavePointer(event);
    }, { passive: true });
    window.addEventListener('blur', () => {
      pointerInside = false;
      touchActive = false;
      lastInput = null;
      schedule();
    }, { passive: true });
    document.addEventListener('pointerover', (event) => {
      if (!isTouch(event)) setHoveredTarget(event.target);
    }, { passive: true });
    document.addEventListener('pointerout', (event) => {
      if (!isTouch(event) && hoveredTarget && !hoveredTarget.contains(event.relatedTarget)) setHoveredTarget(null);
    }, { passive: true });
    finePointer?.addEventListener?.('change', () => {
      pointerInside = false;
      lastInput = null;
      schedule();
    });
  };

  initBrushCursor();

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
