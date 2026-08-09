(() => {
  const body = document.body;

  window.addEventListener("load", () => {
    setTimeout(() => body.classList.add("loaded"), 250);
    setTimeout(() => document.querySelector(".loader")?.classList.add("is-hidden"), 850);
  });

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

  const progress = document.querySelector(".progress-bar span");
  const blooms = [...document.querySelectorAll(".vine-bloom")];
  const vine = document.querySelector(".vine-track");
  const timelineProgress = document.querySelector(".timeline-progress span");
  const celebration = document.querySelector("#celebrations");
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
