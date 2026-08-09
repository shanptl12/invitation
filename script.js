(() => {
  const body = document.body;
  const cover = document.getElementById("inviteCover");
  const coverBtn = document.getElementById("openInvitation");
  const music = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const main = document.getElementById("top");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let opened = false;
  let musicStarted = false;

  /* ------------------------------------------------------------------
   * Cover intro sequence
   * Lock the scroll, paint the cover, then on the next frame add
   * `cover-loaded` so the staggered fade-up animation can run.
   * ------------------------------------------------------------------ */
  body.classList.add("cover-active");
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("cover-loaded")));

  /* ------------------------------------------------------------------
   * Music — started only after the user clicks "Open Invitation".
   * Browsers block audio that tries to autoplay before a user gesture,
   * so play() is deliberately called from inside the click handler.
   * ------------------------------------------------------------------ */
  const MUSIC_TARGET_VOLUME = 0.4;
  const MUSIC_FADE_MS = prefersReduced ? 300 : 2000;

  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    music.volume = 0;
    music.play().catch(() => { /* file missing / blocked — continue silently */ });

    /* Fade-in: ramp the volume from 0 to MUSIC_TARGET_VOLUME over
     * MUSIC_FADE_MS using requestAnimationFrame, so the music eases in
     * smoothly instead of popping in at full volume. */
    const start = performance.now();
    (function ramp(now) {
      const t = Math.min(1, (now - start) / MUSIC_FADE_MS);
      music.volume = MUSIC_TARGET_VOLUME * t;
      if (t < 1) requestAnimationFrame(ramp);
    })(start);
  }

  /* ------------------------------------------------------------------
   * Music toggle — pause/resume. play()/pause() are the only calls, so
   * scrolling, opening menus or following section links never restart
   * the song. The volume stays at the faded-in level.
   * ------------------------------------------------------------------ */
  function setPlaying(playing) {
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.classList.toggle("is-paused", !playing);
    musicToggle.querySelector(".music-glyph").textContent = playing ? "♫" : "♪";
    musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    if (playing) music.play().catch(() => {});
    else music.pause();
  }
  musicToggle.addEventListener("click", () => setPlaying(music.paused));

  /* ------------------------------------------------------------------
   * Opening transition — triggered by clicking the Open button.
   * The button press, music start and card-open classes are applied
   * together. Once the transition has played out, `body.loaded` is added
   * so the hero performs its normal entrance, and the cover is removed.
   * ------------------------------------------------------------------ */
  const OPEN_DELAY = prefersReduced ? 350 : 1300;

  function openInvitation() {
    if (opened) return;
    opened = true;
    coverBtn.classList.add("is-pressed");
    startMusic();
    body.classList.add("cover-opening");
    body.classList.remove("cover-active");
    main.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      body.classList.add("loaded");
      musicToggle.hidden = false;
      cover.classList.add("is-gone");
      window.setTimeout(() => {
        cover.remove();
        body.classList.remove("cover-opening");
      }, 700);
    }, OPEN_DELAY);
  }
  coverBtn.addEventListener("click", openInvitation);

  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach(item => observer.observe(item));

  const garland = document.querySelector(".mg-garland");
  function qPoint(x0, y0, cx, cy, x1, y1, t) {
    const mt = 1 - t;
    return { x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1, y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1 };
  }
  function buildMarigolds() {
    if (!garland) return;
    const ns = "http://www.w3.org/2000/svg";
    const main = Array.from({ length: 21 }, (_, i) => i / 20).map(t => qPoint(110, 182, 240, 294, 370, 182, t));
    const sub = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(t => qPoint(122, 190, 240, 302, 358, 190, t));
    const mk = (p, r, color, delay) => {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", p.x.toFixed(1));
      c.setAttribute("cy", p.y.toFixed(1));
      c.setAttribute("r", r);
      c.setAttribute("class", "mg-marigold");
      c.setAttribute("fill", color);
      c.style.setProperty("--d", `${delay}s`);
      return c;
    };
    const frag = document.createDocumentFragment();
    main.forEach((p, i) => frag.appendChild(mk(p, 4.6, i % 2 ? "#b58a3c" : "#ca8743", 0.55 + i * 0.028)));
    sub.forEach((p, i) => frag.appendChild(mk(p, 4.0, i % 2 ? "#d9826e" : "#d9a25f", 0.6 + i * 0.04)));
    garland.prepend(frag);
  }
  buildMarigolds();

  const progress = document.querySelector(".progress-bar span");
  const blooms = [...document.querySelectorAll(".vine-bloom")];
  const vine = document.querySelector(".vine-track");
  const timelineProgress = document.querySelector(".timeline-progress span");
  const celebration = document.querySelector("#celebrations");
  const mandapArt = document.querySelector(".venue-art .mandap");
  const mandapBg = mandapArt?.querySelector(".parallax-bg");
  const mandapFg = mandapArt?.querySelector(".parallax-fg");
  let ticking = false;

  function updateScrollEffects() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    progress.style.width = `${pageProgress * 100}%`;
    document.documentElement.style.setProperty("--section-progress", pageProgress);
    blooms.forEach((bloom, index) => bloom.classList.toggle("is-grown", pageProgress >= [0.18, 0.42, 0.67, 0.91][index]));

    if (celebration && timelineProgress) {
      const rect = celebration.getBoundingClientRect();
      const visible = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      timelineProgress.style.width = `${Math.max(0, Math.min(100, visible * 135 - 12))}%`;
    }

    if (mandapArt && mandapBg && mandapFg) {
      const rect = mandapArt.getBoundingClientRect();
      const offset = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / (window.innerHeight * 0.55)));
      mandapBg.style.setProperty("--mg-bg", `${offset * 7}px`);
      mandapFg.style.setProperty("--mg-fg", `${-offset * 4}px`);
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateScrollEffects); ticking = true; }
  }, { passive: true });
  updateScrollEffects();

  const themeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.theme === "dark") body.classList.add("theme-dark");
      else if (entry.isIntersecting && entry.target.dataset.theme === "light") body.classList.remove("theme-dark");
    });
  }, { threshold: 0.45 });
  document.querySelectorAll("[data-theme]").forEach(section => themeObserver.observe(section));

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menu.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
  }));

  const petalLayer = document.querySelector(".petal-layer");
  let lastScrollY = window.scrollY, scrollVelocity = 0;
  window.addEventListener("scroll", () => { const current=window.scrollY; scrollVelocity=Math.min(4,Math.abs(current-lastScrollY)); lastScrollY=current; }, {passive:true});
  function createPetal() {
    if (document.hidden) return;
    const petal=document.createElement("span"); petal.className="petal"; petal.style.left=`${Math.random()*100}%`;
    petal.style.setProperty("--drift",`${-100+Math.random()*200}px`);
    petal.style.animationDuration=`${Math.max(4,9-scrollVelocity*.8)+Math.random()*4}s`;
    petal.style.animationDelay=`${Math.random()*.7}s`; petal.style.transform=`rotate(${Math.random()*180}deg)`;
    petalLayer.appendChild(petal); setTimeout(()=>petal.remove(),15000);
  }
  setInterval(createPetal,1500);

  const heroFlowers=document.querySelectorAll(".floral");
  window.addEventListener("scroll",()=>{const y=window.scrollY;heroFlowers.forEach((flower,index)=>{const direction=index===0?1:-1;flower.style.translate=`0 ${Math.min(y*.035*direction,25)}px`;});},{passive:true});

  const countdown=document.querySelector(".countdown");
  const weddingDate=countdown?new Date(countdown.dataset.date).getTime():null;
  function updateCountdown(){
    if(!weddingDate)return; const distance=Math.max(0,weddingDate-Date.now());
    const values={days:String(Math.floor(distance/86400000)).padStart(3,"0"),hours:String(Math.floor(distance%86400000/3600000)).padStart(2,"0"),minutes:String(Math.floor(distance%3600000/60000)).padStart(2,"0"),seconds:String(Math.floor(distance%60000/1000)).padStart(2,"0")};
    Object.entries(values).forEach(([unit,value])=>{const el=countdown.querySelector(`[data-unit="${unit}"]`);if(el&&el.textContent!==value){el.animate([{transform:"translateY(-8px)",opacity:.25},{transform:"translateY(0)",opacity:1}],{duration:320,easing:"cubic-bezier(.2,.8,.2,1)"});el.textContent=value;}});
  }
  updateCountdown(); setInterval(updateCountdown,1000);
})();
