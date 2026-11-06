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

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
