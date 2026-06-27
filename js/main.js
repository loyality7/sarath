/* ═══════════════════════════════════════════════════════
   SARATH.OS — MAIN.JS
   Signature elements: boot sequence, matrix rain, glitch,
   typewriter, live clock, stat counters, skill bars,
   scroll reveals, Konami code.
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── DOM REFS ────────────────────────────────────────── */
const bootScreen   = document.getElementById('boot-screen');
const bootOutput   = document.getElementById('boot-output');
const app          = document.getElementById('app');
const scanEl       = document.getElementById('scanlines');
const noiseCanvas  = document.getElementById('noise-canvas');
const matrixCanvas = document.getElementById('matrix-canvas');
const konamiFlash  = document.getElementById('konami-flash');
const heroName     = document.getElementById('hero-name');
const roleTextEl   = document.getElementById('role-text');
const liveClockEl  = document.getElementById('live-clock');
const certSection  = document.getElementById('certifications');
const uptimeEl     = document.getElementById('uptime-counter');

/* ── STATE ───────────────────────────────────────────── */
let bootDone        = false;
let countersAnimated = false;
let skillsAnimated   = false;
let konamiUnlocked   = false;
const pageStartTime  = Date.now();

/* ═══════════════════════════════════════════════════════
   1. BOOT SEQUENCE
   ═══════════════════════════════════════════════════════ */
const BOOT_LINES = [
  { text: 'SARATH.OS BIOS v2.4.1 — INITIALIZING...',    cls: 'system'  },
  { text: '',                                            cls: ''        },
  { text: 'CPU: QUAD-CORE @ 3.6GHz ............. OK',   cls: 'system'  },
  { text: 'RAM: 16384MB DDR5 .................... OK',   cls: 'system'  },
  { text: 'STORAGE: NVMe 1TB ................... DETECTED', cls: 'system' },
  { text: 'NETWORK: STELLAR LINK ............... ONLINE',    cls: 'success' },
  { text: '',                                                       cls: ''        },
  { text: '[ SECURITY PROTOCOLS ]',                                 cls: 'amber'   },
  { text: '> FIREWALL .............. LOADED',                      cls: 'success' },
  { text: '> ENCRYPTION ............ AES-256-GCM',                 cls: 'success' },
  { text: '> KEY VAULT ............. UNLOCKED',                    cls: 'success' },
  { text: '',                                                       cls: ''        },
  { text: '[ LOADING MODULES ]',                                    cls: 'amber'   },
  { text: '> devsecops.dll ......... OK',                           cls: 'blue'    },
  { text: '> security.krn .......... OK',                           cls: 'blue'    },
  { text: '> ai_agents.so .......... OK',                           cls: 'blue'    },
  { text: '> rust_toolchain ........ OK',                           cls: 'blue'    },
  { text: '',                                                       cls: ''        },
  { text: 'KERNEL: sarath-os/2.4.1 .............. OK',             cls: 'success' },
  { text: 'IDENTITY: C SARATH BABU .............. LOADED',         cls: 'amber'   },
  { text: '',                                                       cls: ''        },
  { text: '▶ SYSTEM READY. LAUNCHING PORTFOLIO...',                cls: 'green'   },
];

async function runBootSequence() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (const line of BOOT_LINES) {
    await sleep(reducedMotion ? 10 : 35);

    const lineEl = document.createElement('div');
    lineEl.className = 'boot-line ' + line.cls;

    if (reducedMotion) {
      lineEl.textContent = line.text;
      bootOutput.appendChild(lineEl);
    } else {
      bootOutput.appendChild(lineEl);
      await typeText(lineEl, line.text, 4);
    }
  }

  await sleep(400);

  /* fade boot screen out */
  bootScreen.style.transition = 'opacity 600ms ease';
  bootScreen.style.opacity = '0';

  await sleep(600);
  bootScreen.style.display = 'none';
  bootDone = true;

  /* show main app */
  app.setAttribute('aria-hidden', 'false');
  app.style.opacity = '1';
  app.style.transition = 'opacity 400ms ease';

  /* start post-boot animations */
  startGlitchLoop();
  startMatrixRain();
  startNoiseCanvas();
  startTypewriter();
  startClock();
  startUptime();
}

function typeText(el, text, speedMs) {
  return new Promise(resolve => {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'boot-cursor';
    el.appendChild(cursor);
    const tick = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(tick, speedMs + Math.random() * 20);
      } else {
        cursor.remove();
        resolve();
      }
    };
    tick();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ═══════════════════════════════════════════════════════
   2. GLITCH EFFECT
   ═══════════════════════════════════════════════════════ */
function startGlitchLoop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  scheduleGlitch();
}

function scheduleGlitch() {
  const delay = 4000 + Math.random() * 4000;
  setTimeout(() => {
    if (!bootDone) { scheduleGlitch(); return; }
    triggerGlitch();
    scheduleGlitch();
  }, delay);
}

function triggerGlitch() {
  heroName.classList.add('glitch-active');

  const shifts = [
    { translateX: [-3, 4, -2, 0] },
  ];

  anime({
    targets: heroName,
    translateX: function () { return anime.random(-5, 5) + 'px'; },
    duration: 80,
    easing: 'steps(1, end)',
    direction: 'alternate',
    loop: 3,
    complete: function () {
      anime.set(heroName, { translateX: 0 });
      heroName.classList.remove('glitch-active');
    }
  });
}

/* ═══════════════════════════════════════════════════════
   3. MATRIX RAIN (single column, right side)
   ═══════════════════════════════════════════════════════ */
function startMatrixRain() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) { matrixCanvas.style.display = 'none'; return; }

  const ctx = matrixCanvas.getContext('2d');
  const KATAKANA = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const ASCII   = '01';

  function resize() {
    matrixCanvas.width  = 60;
    matrixCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const cols = Math.floor(matrixCanvas.width / 14);
  const drops = Array(cols).fill(0).map(() => Math.random() * -100);

  ctx.font = '13px Share Tech Mono, monospace';

  function draw() {
    ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = '#00ff41';
    for (let i = 0; i < cols; i++) {
      const charSet = KATAKANA + ASCII;
      const ch = charSet[Math.floor(Math.random() * charSet.length)];
      const y  = drops[i] * 14;
      ctx.globalAlpha = 0.12;
      ctx.fillText(ch, i * 14, y);
      if (y > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.5;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════
   4. NOISE CANVAS (very subtle)
   ═══════════════════════════════════════════════════════ */
function startNoiseCanvas() {
  const ctx = noiseCanvas.getContext('2d');

  function resize() {
    noiseCanvas.width  = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawNoise() {
    const w = noiseCanvas.width;
    const h = noiseCanvas.height;
    if (w === 0 || h === 0) { requestAnimationFrame(drawNoise); return; }
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i+1] = v;
      data[i+2] = v;
      data[i+3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawNoise);
  }
  drawNoise();
}

/* ═══════════════════════════════════════════════════════
   5. TYPEWRITER — crawls roles below hero name
   ═══════════════════════════════════════════════════════ */
const ROLES = [
  'SECURITY RESEARCHER_',
  'DEVSECOPS ENGINEER_',
  'FREELANCE CONSULTANT_',
  'BUILDING QUBASE_',
  'AI AGENT BUILDER_',
];
let roleIdx = 0;
let typing  = false;

function startTypewriter() {
  cycleRole();
}

async function cycleRole() {
  if (!bootDone) { setTimeout(cycleRole, 500); return; }
  await typeRole(ROLES[roleIdx]);
  await sleep(2000);
  await deleteRole(ROLES[roleIdx]);
  await sleep(400);
  roleIdx = (roleIdx + 1) % ROLES.length;
  cycleRole();
}

function typeRole(text) {
  return new Promise(resolve => {
    let i = 0;
    const add = () => {
      if (i < text.length) {
        roleTextEl.textContent = text.slice(0, i + 1);
        i++;
        setTimeout(add, 50 + Math.random() * 40);
      } else {
        resolve();
      }
    };
    add();
  });
}

function deleteRole(text) {
  return new Promise(resolve => {
    let len = text.length;
    const remove = () => {
      if (len > 0) {
        roleTextEl.textContent = text.slice(0, len - 1);
        len--;
        setTimeout(remove, 30);
      } else {
        resolve();
      }
    };
    remove();
  });
}

/* ═══════════════════════════════════════════════════════
   6. LIVE CLOCK
   ═══════════════════════════════════════════════════════ */
function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now  = new Date();
  const hh   = String(now.getHours()).padStart(2, '0');
  const mm   = String(now.getMinutes()).padStart(2, '0');
  const ss   = String(now.getSeconds()).padStart(2, '0');
  liveClockEl.textContent = `[ SYS // ${hh}:${mm}:${ss} ]`;
}

/* ═══════════════════════════════════════════════════════
   UPTIME COUNTER (footer)
   ═══════════════════════════════════════════════════════ */
function startUptime() {
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - pageStartTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    uptimeEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ═══════════════════════════════════════════════════════
   7. SCROLL REVEAL (section content)
   ═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(
          'p, .sys-row, .t-entry, .proj-card, .about-bio p'
        );
        anime({
          targets: items,
          translateX: [ -20, 0 ],
          opacity:   [ 0,   1 ],
          duration:  400,
          easing: 'easeOutQuad',
          delay: anime.stagger(80),
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-body').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════
   STAT COUNTERS — removed (stats section dropped)
   ═══════════════════════════════════════════════════════ */
function initStatCounters() {
  /* no-op: stat counters removed from design */
}

/* ═══════════════════════════════════════════════════════
   9. SKILL BARS (fill on scroll)
   ═══════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-fill]');
  const pctEls = document.querySelectorAll('.skill-pct[data-target]');

  if (!bars.length && !pctEls.length) {
    console.warn('[SARATH.OS] No skill bars found — check HTML markup');
    return;
  }

  if (typeof anime === 'undefined') {
    console.warn('[SARATH.OS] anime.js not loaded — skill bars disabled');
    return;
  }

  const doAnimate = () => {
    if (skillsAnimated) return;
    skillsAnimated = true;

    pctEls.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      anime({
        targets: el,
        innerHTML: [0, target + '%'],
        round: 1,
        duration: 1600,
        easing: 'easeOutExpo',
        delay: 200,
      });
    });

    bars.forEach(bar => {
      const fill = bar.querySelector('.skill-bar-fill');
      const pct  = parseInt(bar.dataset.fill, 10);
      anime({
        targets: fill,
        width: ['0%', pct + '%'],
        duration: 1800,
        easing: 'easeInOutQuad',
        delay: anime.random(0, 300),
      });
    });

    console.log('[SARATH.OS] Skill bars animated ✓');
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        doAnimate();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const target = bars[0]?.closest('.skills-row') || pctEls[0]?.closest('.skills-row');
  if (target) {
    observer.observe(target);
  } else {
    console.warn('[SARATH.OS] .skills-row not found — triggering fallback');
    setTimeout(doAnimate, 1500);
  }

  /* safety fallback: if observer misses after 3s, force animate */
  setTimeout(() => {
    if (!skillsAnimated) doAnimate();
  }, 3000);
}

/* ═══════════════════════════════════════════════════════
   10. KONAMI CODE EASTER EGG
   ═══════════════════════════════════════════════════════ */
const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'KeyB','KeyA'
];
let konamiIdx = 0;

document.addEventListener('keydown', (e) => {
  if (konamiUnlocked) return;
  if (e.code === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiUnlocked = true;
      triggerKonami();
    }
  } else {
    konamiIdx = e.code === 'ArrowUp' ? 1 : 0;
  }
});

function triggerKonami() {
  /* screen flash */
  konamiFlash.style.transition = 'opacity 150ms ease';
  konamiFlash.style.opacity = '0.9';
  setTimeout(() => {
    konamiFlash.style.transition = 'opacity 600ms ease';
    konamiFlash.style.opacity = '0';
  }, 150);

  /* print header message to boot output area (reuse for effect) */
  const msg = document.createElement('div');
  msg.className = 'boot-line amber';
  msg.textContent = '';
  msg.style.cssText = `
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10002; font-size: 18px;
    letter-spacing: 4px;
    text-align: center;
    color: var(--color-amber);
    text-shadow: 0 0 20px rgba(255,179,0,0.8);
    pointer-events: none;
  `;
  document.body.appendChild(msg);

  typeText(msg, 'ACCESS GRANTED // SARATH.EXE UNLOCKED', 40).then(() => {
    setTimeout(() => {
      msg.remove();
    }, 2500);
  });

  /* reveal certifications */
  setTimeout(() => {
    certSection.classList.add('unlocked');
    certSection.setAttribute('aria-hidden', 'false');
    certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    anime({
      targets: certSection.querySelectorAll('.cert-card'),
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 400,
      easing: 'easeOutQuad',
      delay: anime.stagger(50),
    });
  }, 800);
}

/* ═══════════════════════════════════════════════════════
   BACKGROUND CANVAS — hover animation on empty space
   Subtle grid dots + glow pulse around cursor on bg hover
   ═══════════════════════════════════════════════════════ */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const SPACING = 32;
  const DOT_R   = 1;
  let mouseX = -200, mouseY = -200;
  let active = false;
  let animId;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dotColor = { r: 0, g: 255, b: 65 };   // default green
  let targetColor = { r: 0, g: 255, b: 65 };

  window.setDotColor = function(hex) {
    const m = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return;
    targetColor = {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  };

  window.resetDotColor = function() {
    targetColor = { r: 0, g: 255, b: 65 };
  };

  function lerp(a, b, t) { return a + (b - a) * t; }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function isBgTarget(el) {
    if (!el) return false;
    if (el.closest('a, button, .proj-card, .nav, .cta-btn, .skill-bar, footer, #boot-screen, .cert-card')) return false;
    return true;
  }

  document.addEventListener('mousemove', (e) => {
    const t = e.target;
    const section = t.closest('.section, .hero, #experience');

    if (section && isBgTarget(t)) {
      active = true;
      mouseX = e.clientX;
      mouseY = e.clientY;

      const id = section.id;
      if (id === 'projects') {
        window.setDotColor('#00cfff');
      } else if (id === 'experience') {
        window.setDotColor('#ffb300');
      } else if (id === 'skills') {
        window.setDotColor('#00ff41');
      } else if (id === 'certifications') {
        window.setDotColor('#ffb300');
      } else {
        window.resetDotColor();
      }
    } else if (isBgTarget(t)) {
      active = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      window.resetDotColor();
    } else {
      active = false;
      mouseX = -200;
      mouseY = -200;
      window.resetDotColor();
    }
  });

  document.addEventListener('mouseleave', () => {
    active = false;
    mouseX = -200;
    mouseY = -200;
    window.resetDotColor();
  });

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    dotColor.r = lerp(dotColor.r, targetColor.r, 0.06);
    dotColor.g = lerp(dotColor.g, targetColor.g, 0.06);
    dotColor.b = lerp(dotColor.b, targetColor.b, 0.06);

    const cols = Math.ceil(W / SPACING);
    const rows = Math.ceil(H / SPACING);

    const { r, g, b } = dotColor;
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * SPACING;
        const y = j * SPACING;
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const RADIUS = 140;

        if (active && !prefersReduced && dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          const wave = prefersReduced ? 1 : Math.sin(ts * 0.004 + dist * 0.04) * 0.5 + 0.5;
          const radius = DOT_R + t * 3 * wave;
          const alpha = 0.06 + t * 0.7;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          if (t > 0.4) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = t * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
          }
        } else {
          ctx.globalAlpha = 0.04;
          ctx.beginPath();
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  draw(0);
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  runBootSequence().then(() => {
    initScrollReveal();
    initStatCounters();
    initSkillBars();
  });

  /* pre-hide proj-card outputs (CSS handles rest) */
  document.querySelectorAll('.proj-output').forEach(el => {
    el.style.overflow = 'hidden';
  });
});
