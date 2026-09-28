/* ==========================================================================
   Milhas com Fran Carrillo — interações
   Tudo que é essencial (links, turmas, FAQ, depoimentos) funciona sem as
   bibliotecas de animação; GSAP/Lenis apenas acrescentam movimento.
   ========================================================================== */
(() => {
  'use strict';

  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const fmt = new Intl.NumberFormat('pt-BR');

  const WA_NUMBER = '5511932688548';
  const WA_BASE = 'Olá, vim pelo site e quero reservar minha vaga para a Imersão Milhas com Fran Carrillo';
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa || WA_BASE); });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  let lenis = null;
  const scrollToEl = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
    });
  });

  /* ---------- header acompanha a faixa vermelha ---------- */
  const header = $('.header');
  const callbar = $('.callbar');
  const onScrollHeader = (y) => {
    const barH = callbar.offsetHeight;
    header.style.setProperty('--bar-offset', `${Math.max(0, barH - y)}px`);
    header.classList.toggle('is-solid', y > barH + 10);
  };

  /* ==========================================================================
     PAINEL SPLIT-FLAP: gastos do dia a dia → destinos
     ========================================================================== */
  const PAIRS = [
    ['MERCADO', 'LISBOA'],
    ['FARMÁCIA', 'SANTIAGO'],
    ['COMBUSTÍVEL', 'ORLANDO'],
    ['RESTAURANTE', 'PARIS'],
    ['CONTA DE LUZ', 'BUENOS AIRES'],
    ['ACADEMIA', 'CANCÚN'],
    ['PADARIA', 'GRAMADO'],
  ];
  const TILES = 12;
  const NOISE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rowFrom = $('[data-flaps="from"]');
  const rowTo = $('[data-flaps="to"]');

  const makeTile = () => {
    const t = document.createElement('span');
    t.className = 'flap';
    t.innerHTML = '<span class="flap__top"><b></b></span><span class="flap__bottom"><b></b></span><span class="flap__leaf-top"><b></b></span><span class="flap__leaf-bottom"><b></b></span>';
    const [top, bottom, leafTop, leafBottom] = $$('b', t);
    t._p = { top, bottom, leafTop, leafBottom, cur: ' ' };
    return t;
  };
  const setTile = (t, ch) => {
    const p = t._p;
    p.top.textContent = p.bottom.textContent = p.leafTop.textContent = p.leafBottom.textContent = ch;
    p.cur = ch;
  };
  const flipOnce = async (t, next, dur) => {
    const p = t._p;
    if (reduceMotion) { setTile(t, next); return; }
    p.top.textContent = next;
    p.leafTop.textContent = p.cur;
    p.leafBottom.textContent = next;
    p.bottom.textContent = p.cur;
    const leafTop = p.leafTop.parentNode;
    const leafBottom = p.leafBottom.parentNode;
    const a1 = leafTop.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: dur / 2, easing: 'ease-in', fill: 'forwards' });
    await a1.finished;
    const a2 = leafBottom.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { duration: dur / 2, easing: 'cubic-bezier(.3,1.6,.6,1)', fill: 'forwards' });
    await a2.finished;
    p.bottom.textContent = next;
    p.leafTop.textContent = next;
    a1.cancel();
    a2.cancel();
    p.cur = next;
  };
  const spinTo = async (t, target, delay) => {
    await new Promise((r) => setTimeout(r, delay));
    if (t._p.cur === target) return;
    const steps = reduceMotion ? 0 : 2 + Math.floor(Math.random() * 5);
    for (let s = 0; s < steps; s++) await flipOnce(t, NOISE[Math.floor(Math.random() * NOISE.length)], 62);
    await flipOnce(t, target, 120);
  };
  const showWord = (row, word) => {
    const chars = word.padEnd(TILES, ' ').slice(0, TILES).split('');
    return Promise.all(Array.from(row.children).map((t, i) => spinTo(t, chars[i], i * 45)));
  };

  if (rowFrom && rowTo) {
    [rowFrom, rowTo].forEach((row) => { for (let i = 0; i < TILES; i++) { const t = makeTile(); setTile(t, ' '); row.appendChild(t); } });
    let pairIndex = 0;
    let heroVisible = true;
    let running = false;
    const cycle = async () => {
      if (running) return;
      running = true;
      while (true) {
        if (heroVisible) {
          const [from, to] = PAIRS[pairIndex % PAIRS.length];
          await showWord(rowFrom, from);
          await new Promise((r) => setTimeout(r, 250));
          await showWord(rowTo, to);
          pairIndex++;
          await new Promise((r) => setTimeout(r, 2800));
        } else {
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    };
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe($('.hero'));
    window.__startBoard = () => cycle();
  }

  /* ==========================================================================
     CONTADOR DE MILHAS DA ROLAGEM + BARRA MOBILE
     ========================================================================== */
  const hud = $('.hud');
  const hudNum = $('[data-hud]');
  const hudLabel = $('[data-hud-label]');
  let hudTarget = 0;
  let hudShown = 0;
  const onScrollHud = (y) => {
    hudTarget = Math.round(y * 1.5);
    hud.classList.toggle('is-visible', y > 300);
    const max = document.documentElement.scrollHeight - innerHeight;
    hudLabel.textContent = y > max - 80 ? 'agora imagine com seus gastos reais' : 'milhas acumuladas só rolando a página';
  };
  const hudLoop = () => {
    hudShown += (hudTarget - hudShown) * 0.12;
    if (Math.abs(hudTarget - hudShown) < 1) hudShown = hudTarget;
    hudNum.textContent = fmt.format(Math.round(hudShown));
    requestAnimationFrame(hudLoop);
  };
  requestAnimationFrame(hudLoop);

  const mbar = $('.mbar');
  let pastHero = false;
  let offerInView = false;
  const syncMbar = () => mbar.classList.toggle('is-visible', pastHero && !offerInView);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; syncMbar(); }).observe($('.hero'));
  new IntersectionObserver(([e]) => { offerInView = e.isIntersecting; syncMbar(); }, { threshold: 0.15 }).observe($('#oferta'));

  const onScroll = (y) => { onScrollHeader(y); onScrollHud(y); };
  window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  onScroll(window.scrollY);

  /* ==========================================================================
     CHECKLIST DE EMBARQUE
     ========================================================================== */
  const checks = $$('.check');
  const checkedOut = $('[data-checked]');
  const checkIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-checked');
        checkIO.unobserve(e.target);
        checkedOut.textContent = $$('.check.is-checked').length;
      }
    });
  }, { rootMargin: '0px 0px -42% 0px' });
  checks.forEach((c) => checkIO.observe(c));

  /* ==========================================================================
     ETIQUETAS DE BAGAGEM (pêndulo que reage à rolagem e ao mouse)
     ========================================================================== */
  const tags = $$('.tag').map((el, i) => ({ el, a: 0, v: 0, phase: i * 1.7 }));
  if (tags.length && !reduceMotion) {
    let active = false;
    let lastY = window.scrollY;
    new IntersectionObserver(([e]) => { active = e.isIntersecting; }).observe($('.tags'));
    tags.forEach((t) => {
      let lastX = null;
      t.el.addEventListener('pointermove', (e) => {
        if (lastX !== null) t.v += Math.max(-0.6, Math.min(0.6, (e.clientX - lastX) * 0.02));
        lastX = e.clientX;
      });
      t.el.addEventListener('pointerleave', () => { lastX = null; });
    });
    const swing = (time) => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (active) {
        tags.forEach((t, i) => {
          t.v += Math.max(-1.4, Math.min(1.4, dy * 0.012)) * (i % 2 ? 1 : 0.8);
          const idle = Math.sin(time / 1100 + t.phase) * 0.9;
          t.v += (-(t.a - idle) * 0.014) - t.v * 0.045;
          t.a += t.v;
          t.a = Math.max(-24, Math.min(24, t.a));
          t.el.style.transform = `rotate(${t.a.toFixed(2)}deg)`;
        });
      }
      requestAnimationFrame(swing);
    };
    requestAnimationFrame(swing);
    window.__kickTags = (n) => tags.forEach((t, i) => { t.v += (i % 2 ? -n : n); });
  }

  /* ==========================================================================
     HODÔMETRO 5.000.000
     ========================================================================== */
  const odo = $('.odo');
  if (odo) {
    const str = fmt.format(parseInt(odo.dataset.odo, 10));
    odo.textContent = '';
    const cols = [];
    str.split('').forEach((ch) => {
      if (/\d/.test(ch)) {
        const col = document.createElement('span');
        col.className = 'odo__col';
        col.setAttribute('aria-hidden', 'true');
        const strip = document.createElement('span');
        for (let r = 0; r < 3; r++) for (let d = 0; d < 10; d++) { const s = document.createElement('span'); s.textContent = d; strip.appendChild(s); }
        col.appendChild(strip);
        odo.appendChild(col);
        cols.push({ strip, digit: parseInt(ch, 10) });
      } else {
        const sep = document.createElement('span');
        sep.className = 'odo__sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = ch;
        odo.appendChild(sep);
      }
    });
    const roll = () => {
      cols.forEach((c, i) => {
        c.strip.style.transition = reduceMotion ? 'none' : `transform ${1.6 + i * 0.12}s cubic-bezier(.16,1,.3,1) ${i * 0.06}s`;
        c.strip.style.transform = `translateY(${-(20 + c.digit) * 0.86}em)`;
      });
    };
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { roll(); io.disconnect(); } }, { threshold: 0.6 }).observe(odo);
  }

  /* ==========================================================================
     BILHETE: turmas, código de barras, link de reserva
     ========================================================================== */
  const reserve = $('[data-reserve]');
  const pick = $('[data-pick]');
  const updateTicket = () => {
    const sel = $('input[name="turma"]:checked');
    if (!sel) return;
    const time = sel.dataset.time;
    pick.textContent = `${sel.value} · ${time.split(' ')[0]}`;
    reserve.href = waLink(`${WA_BASE} — turma de ${sel.value}, das ${time}.`);
  };
  $$('input[name="turma"]').forEach((r) => r.addEventListener('change', updateTicket));
  updateTicket();

  const barcode = $('.barcode');
  if (barcode) {
    let x = 0;
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let rects = '';
    while (x < 200) {
      const w = 1 + Math.floor(rand() * 3.4);
      if (rand() > 0.35) rects += `<rect x="${x}" y="0" width="${w}" height="44"/>`;
      x += w + 1;
    }
    barcode.innerHTML = rects;
  }

  /* ==========================================================================
     FAQ com abertura suave
     ========================================================================== */
  $$('.qa').forEach((d) => {
    const summary = $('summary', d);
    const body = $('.qa__a', d);
    summary.addEventListener('click', (e) => {
      if (reduceMotion) return;
      e.preventDefault();
      if (d.open) {
        const h = body.offsetHeight;
        body.animate([{ height: `${h}px` }, { height: '0px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ==========================================================================
     VISUALIZADOR (prints e vídeo)
     ========================================================================== */
  const lb = $('.lightbox');
  const lbStage = $('.lightbox__stage');
  let lastFocus = null;
  const openLightbox = (node) => {
    lastFocus = document.activeElement;
    lbStage.innerHTML = '';
    lbStage.appendChild(node);
    lb.hidden = false;
    lenis && lenis.stop();
    $('.lightbox__close').focus();
  };
  const closeLightbox = () => {
    lb.hidden = true;
    lbStage.innerHTML = '';
    lenis && lenis.start();
    lastFocus && lastFocus.focus();
  };
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.lightbox__close')) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });

  let dragged = false;
  $$('.phone__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (dragged) return;
      if (btn.dataset.video) {
        const v = document.createElement('video');
        v.src = btn.dataset.video;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        v.poster = $('img', btn).src;
        openLightbox(v);
      } else {
        const img = document.createElement('img');
        img.src = btn.dataset.lightbox;
        img.alt = $('img', btn).alt;
        openLightbox(img);
      }
    });
  });

  /* ==========================================================================
     Daqui para baixo: movimento (GSAP + Lenis)
     ========================================================================== */
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (!hasGSAP || reduceMotion) {
    html.classList.remove('js');
    window.__startBoard && window.__startBoard();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if (window.Draggable) gsap.registerPlugin(Draggable);
  if (window.InertiaPlugin) gsap.registerPlugin(InertiaPlugin);

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const mm = gsap.matchMedia();

  /* ---------- botões magnéticos ---------- */
  if (finePointer) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- depoimentos arrastáveis + cursor ---------- */
  const viewport = $('.voices__viewport');
  const vtrack = $('.voices__track');
  const cursor = $('.drag-cursor');
  mm.add('(min-width: 901px) and (pointer: fine)', () => {
    if (!window.Draggable) return;
    const bounds = () => ({ minX: Math.min(0, viewport.clientWidth - vtrack.scrollWidth), maxX: 0 });
    const [drag] = Draggable.create(vtrack, {
      type: 'x',
      bounds: bounds(),
      inertia: !!window.InertiaPlugin,
      edgeResistance: 0.8,
      dragClickables: true,
      minimumMovement: 6,
      onPress: () => { dragged = false; cursor.classList.add('is-grab'); },
      onDragStart: () => { dragged = true; },
      onRelease: () => { cursor.classList.remove('is-grab'); setTimeout(() => { dragged = false; }, 60); },
    });
    const onResize = () => drag.applyBounds(bounds());
    window.addEventListener('resize', onResize);

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e) => { xTo(e.clientX); yTo(e.clientY); };
    const enter = () => cursor.classList.add('is-on');
    const leave = () => cursor.classList.remove('is-on');
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerenter', enter);
    viewport.addEventListener('pointerleave', leave);
    return () => {
      drag.kill();
      gsap.set(vtrack, { x: 0 });
      window.removeEventListener('resize', onResize);
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerenter', enter);
      viewport.removeEventListener('pointerleave', leave);
    };
  });

  /* ---------- bilhete: impressão + inclinação ---------- */
  const ticket = $('.ticket');
  gsap.set(ticket, { yPercent: -104, transformPerspective: 1400 });
  ScrollTrigger.create({
    trigger: '.printer',
    start: 'top 72%',
    once: true,
    onEnter: () => {
      gsap.timeline()
        .to(ticket, { yPercent: -60, duration: 0.9, ease: 'steps(9)' })
        .to(ticket, { yPercent: -18, duration: 0.8, ease: 'steps(8)' })
        .to(ticket, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
        .fromTo(ticket, { rotation: 0 }, { rotation: -0.6, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '-=0.5')
        .set(ticket, { rotation: 0 });
    },
  });
  if (finePointer) {
    const printer = $('.printer');
    const rx = gsap.quickTo(ticket, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(ticket, 'rotationY', { duration: 0.8, ease: 'power3' });
    printer.addEventListener('pointermove', (e) => {
      const r = printer.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 5);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
    });
    printer.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  /* ---------- títulos por linha ---------- */
  const splitReveal = (el) => {
    if (!window.SplitText) return;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  };

  const setupReveals = () => {
    $$('.split').forEach(splitReveal);

    gsap.set('[data-reveal]', { y: 30, autoAlpha: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (b) => gsap.to(b, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });

    $$('[data-clip]').forEach((el) => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
        .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        .from($('img', el), { scale: 1.3, duration: 1.8, ease: 'expo.out' }, '<0.2');
    });

    gsap.from('.group', {
      y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.groups__list', start: 'top 82%', once: true },
    });
    gsap.from('.fact', {
      y: 20, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: '.facts', start: 'top 92%', once: true },
    });
    gsap.from('.tag__body', {
      y: -70, autoAlpha: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: 0.14,
      scrollTrigger: { trigger: '.tags', start: 'top 78%', once: true, onEnter: () => setTimeout(() => window.__kickTags && window.__kickTags(1.4), 500) },
    });
    gsap.from('.voices__track', {
      x: 180, autoAlpha: 0, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '.voices__viewport', start: 'top 85%', once: true },
    });
    gsap.from('.archetypes li', {
      y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.archetypes', start: 'top 92%', once: true },
    });

    // leve parallax da foto do hero e da mentora
    gsap.to('.hero__photo img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.mentor__photo img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.mentor', start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  /* ---------- entrada do hero ---------- */
  const intro = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__photo img', { scale: 1.14, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2 })
      .from('.hero__kicker', { y: 16, autoAlpha: 0, duration: 0.9 }, 0.3)
      .from('.hero__title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.35)
      .from('.board', { y: 30, autoAlpha: 0, duration: 1.1 }, 0.6)
      .add(() => window.__startBoard && window.__startBoard(), 0.9)
      .from(['.hero__promise', '.hero__lead', '.hero__cta'], { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.8)
      .from('.hero__seal', { scale: 0.4, autoAlpha: 0, duration: 1.4 }, 1)
      .from('.header', { autoAlpha: 0, duration: 1 }, 0.2);
  };

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1800))]).then(() => {
    setupReveals();
    intro();
    ScrollTrigger.refresh();
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
