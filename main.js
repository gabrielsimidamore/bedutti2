/* ============================================================
   BEDUTTI — interactivity
   ============================================================ */
(function () {
  'use strict';

  // ---- CONFIG (edite aqui) ----
  var WHATSAPP = '5511990000000'; // DDI+DDD+numero, só dígitos
  var WA_MSG = encodeURIComponent('Olá! Tenho interesse no sobrado The Square Village (Granja Viana, R$ 1.070.000). Gostaria de agendar uma visita.');

  // ---- Gallery data ----
  var PHOTOS = [
    { src: 'assets/photos/p17.jpeg', cap: 'Fachada do sobrado' },
    { src: 'assets/photos/p05.jpeg', cap: 'Living integrado ao quintal' },
    { src: 'assets/photos/p12.jpeg', cap: 'Sala de estar' },
    { src: 'assets/photos/p08.jpeg', cap: 'Área gourmet com churrasqueira' },
    { src: 'assets/photos/p10.jpeg', cap: 'Cozinha em granito preto' },
    { src: 'assets/photos/p03.jpeg', cap: 'Cozinha · marcenaria planejada' },
    { src: 'assets/photos/p02.jpeg', cap: 'Escada de mármore preto' },
    { src: 'assets/photos/p15.jpeg', cap: 'Banheiro em mármore Carrara' },
    { src: 'assets/photos/p01.jpeg', cap: 'Suíte · banheiro com mármore e madeira' },
    { src: 'assets/photos/p11.jpeg', cap: 'Dormitório com armário planejado' },
    { src: 'assets/photos/p16.jpeg', cap: 'Quarto com iluminação especial' },
    { src: 'assets/photos/p06.jpeg', cap: 'Dormitório com varanda' },
    { src: 'assets/photos/p04.jpeg', cap: 'Closet / armários embutidos' },
    { src: 'assets/photos/p14.jpeg', cap: 'Quintal gramado e bancada gourmet' },
    { src: 'assets/photos/p09.jpeg', cap: 'Lavanderia / área de serviço' },
    { src: 'assets/photos/p07.jpeg', cap: 'Detalhe da marcenaria' }
  ];

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function boot() {
    buildGallery();
    initLightbox();
    initNav();
    initReveal();
    initSimulator();
    initWhatsApp();
    initForm();
    initCountUp();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ---------- WhatsApp links ---------- */
  function initWhatsApp() {
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + WA_MSG;
    $all('.wa-link').forEach(function (a) { a.setAttribute('href', url); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); });
  }

  /* ---------- Gallery ---------- */
  function buildGallery() {
    var grid = $('#galGrid');
    if (!grid) return;
    PHOTOS.forEach(function (p, i) {
      var fig = document.createElement('figure');
      fig.setAttribute('data-i', i);
      var img = document.createElement('img');
      img.src = p.src; img.alt = p.cap; img.loading = 'lazy';
      var cap = document.createElement('figcaption');
      cap.textContent = p.cap;
      fig.appendChild(img); fig.appendChild(cap);
      grid.appendChild(fig);
    });
  }

  /* ---------- Lightbox ---------- */
  var lbIndex = 0;
  function initLightbox() {
    var lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap');
    if (!lb) return;

    function open(i) {
      lbIndex = (i + PHOTOS.length) % PHOTOS.length;
      img.src = PHOTOS[lbIndex].src;
      img.alt = PHOTOS[lbIndex].cap;
      cap.textContent = PHOTOS[lbIndex].cap + '  ·  ' + (lbIndex + 1) + '/' + PHOTOS.length;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }

    // gallery clicks
    $('#galGrid').addEventListener('click', function (e) {
      var fig = e.target.closest('figure'); if (fig) open(parseInt(fig.getAttribute('data-i'), 10));
    });
    // tour-card clicks (data-lb = filename, resolved by src — robust to array changes)
    $all('.tour-card[data-lb]').forEach(function (c) {
      c.style.cursor = 'pointer';
      c.addEventListener('click', function () {
        var key = c.getAttribute('data-lb');
        var i = PHOTOS.findIndex(function (p) { return p.src.indexOf(key) !== -1; });
        open(i < 0 ? 0 : i);
      });
    });

    $('#lbX').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { open(lbIndex - 1); });
    $('#lbNext').addEventListener('click', function () { open(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(lbIndex - 1);
      if (e.key === 'ArrowRight') open(lbIndex + 1);
    });
  }

  /* ---------- Nav scroll state ---------- */
  function initNav() {
    var nav = $('#nav');
    function upd() { nav.classList.toggle('flat', window.scrollY <= 40); }
    upd();
    window.addEventListener('scroll', upd, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $all('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Count up ---------- */
  function initCountUp() {
    var els = $all('[data-count]');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1100, start = performance.now();
        function tick(now) {
          var p = Math.min(1, (now - start) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Financing simulator ---------- */
  function brl(n) { return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 }); }
  function initSimulator() {
    var price = $('#inPrice'), down = $('#inDown'), term = $('#inTerm'), rate = $('#inRate');
    if (!price) return;
    function calc() {
      var P = +price.value, dPct = +down.value, yrs = +term.value, annual = +rate.value;
      var downVal = P * dPct / 100;
      var loan = P - downVal;
      var i = Math.pow(1 + annual / 100, 1 / 12) - 1; // monthly effective
      var n = yrs * 12;
      var parcela = i > 0 ? loan * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : loan / n;

      $('#lblPrice').textContent = 'R$ ' + brl(P);
      $('#lblDown').textContent = 'R$ ' + brl(downVal) + ' · ' + dPct + '%';
      $('#lblTerm').textContent = yrs + ' anos';
      $('#lblRate').textContent = annual.toFixed(1).replace('.', ',') + '%';

      $('#outParcela').textContent = brl(parcela);
      $('#outDown').textContent = 'R$ ' + brl(downVal);
      $('#outLoan').textContent = 'R$ ' + brl(loan);
      $('#outN').textContent = n + '×';
    }
    [price, down, term, rate].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }

  /* ---------- Lead form ---------- */
  function initForm() {
    var form = $('#leadForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $('#formInner').style.display = 'none';
      $('#formOk').classList.add('show');
      try {
        var d = new FormData(form);
        console.log('Lead Bedutti:', Object.fromEntries(d.entries()));
      } catch (_) {}
    });
  }
})();
