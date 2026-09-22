/* ============================================================
   INFINITY PARTS — main.js
   Funções globais: favoritos, toasts, header, busca, menu
   mobile, botão WhatsApp e renderização da Home.
   ============================================================ */

/* ---------- FAVORITOS (localStorage) ---------- */
function getFavorites() {
  return JSON.parse(localStorage.getItem('ip_favorites') || '[]');
}
function isFavorite(id) {
  return getFavorites().includes(Number(id));
}
function toggleFavorite(id) {
  id = Number(id);
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    showToast('Produto removido dos favoritos.');
  } else {
    favs.push(id);
    showToast('Produto adicionado aos favoritos.');
  }
  localStorage.setItem('ip_favorites', JSON.stringify(favs));
  updateFavCount();
  return favs.includes(id);
}
function updateFavCount() {
  const el = document.getElementById('fav-count');
  if (el) el.textContent = getFavorites().length;
}

/* ---------- TOASTS ---------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast-ip toast-${type}`;
  toast.innerHTML = `<i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ---------- HEADER: scroll fixo ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* ---------- MENU MOBILE ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }));
}

/* ---------- SUBMENU MOBILE (dropdowns dentro do menu hamburguer) ---------- */
function initMobileDropdowns() {
  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    });
  });
}

/* ---------- BUSCA COM SUGESTÕES ---------- */
function initSearch() {
  const input = document.getElementById('search-input');
  const box = document.getElementById('search-suggestions');
  const form = document.getElementById('search-form');
  if (!input || !box) return;

  input.addEventListener('input', () => {
    const term = input.value.trim();
    if (term.length < 2) { box.classList.remove('active'); box.innerHTML = ''; return; }
    const results = searchProducts(term).slice(0, 6);
    if (results.length === 0) {
      box.innerHTML = '<div class="suggestion-empty">Nenhum produto encontrado.</div>';
    } else {
      box.innerHTML = results.map(p => `
        <a class="suggestion-item" href="produto.html?id=${p.id}">
          ${p.image
            ? `<img src="${resolveImageUrl(p.image)}" alt="${p.name}">`
            : `<div class="no-image-placeholder compact"><i class="bi bi-image"></i></div>`}
          <div>
            <span class="s-name">${p.name}</span>
            <span class="s-category">${p.category} • ${p.brand}</span>
          </div>
          <span class="s-price">${formatBRL(p.salePrice)}</span>
        </a>`).join('');
    }
    box.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('active');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const term = input.value.trim();
      window.location.href = `produtos.html?busca=${encodeURIComponent(term)}`;
    });
  }
}

/* ---------- WHATSAPP FLUTUANTE ---------- */
function initWhatsapp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const msg = encodeURIComponent('Olá! Vim pelo site da Infinity Parts e gostaria de ajuda com um produto.');
    window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
  });
}

/* ---------- ALTERNADOR DE TEMA (claro/escuro) ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }
  function syncAria() {
    toggle.setAttribute('aria-pressed', isLight() ? 'true' : 'false');
    toggle.title = isLight() ? 'Mudar para tema escuro' : 'Mudar para tema claro';
  }

  syncAria();

  toggle.addEventListener('click', () => {
    if (isLight()) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ip_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('ip_theme', 'light');
    }
    syncAria();
  });
}

/* ---------- BOTÃO FAVORITAR (delegado, funciona em qualquer página) ---------- */
function initFavButtons() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-fav');
    if (!btn) return;
    const id = btn.dataset.id;
    const active = toggleFavorite(id);
    btn.classList.toggle('active', active);
    btn.querySelector('i').className = `bi ${active ? 'bi-heart-fill' : 'bi-heart'}`;
  });
}

/* ---------- BOTÃO COMPRAR (delegado) ---------- */
function initBuyButtons() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-buy');
    if (!btn || btn.disabled) return;
    if (btn.classList.contains('notify-btn')) {
      showToast('Você será avisado quando o produto chegar!');
      return;
    }
    addToCart(Number(btn.dataset.id), 1);
  });
}

/* ---------- RENDER: DESTAQUES DA HOME ---------- */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.stock > 0 && p.category !== 'PC Montado').sort((a, b) => b.rating - a.rating).slice(0, 8);
  grid.innerHTML = featured.map(renderProductCard).join('');
}

/* ---------- RENDER: CARROSSEL DE PCS MONTADOS ---------- */
function renderPcCarousel() {
  const track = document.getElementById('pc-carousel');
  if (!track) return;
  const builds = PRODUCTS.filter(p => p.category === 'PC Montado');
  track.innerHTML = builds.map(renderPcCard).join('');

  const prevBtn = document.getElementById('pc-carousel-prev');
  const nextBtn = document.getElementById('pc-carousel-next');
  const scrollAmount = 290;
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount * 2, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount * 2, behavior: 'smooth' }));
}

/* ---------- Scroll reveal simples ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(item => observer.observe(item));
}

/* ---------- CARROSSEL DE BANNERS (HERO) ---------- */
function initHeroCarousel() {
  const track = document.getElementById('hero-carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('hero-dots');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let index = 0;
  let timer = null;

  dotsWrap.innerHTML = Array.from(slides).map((_, i) =>
    `<button aria-label="Ir para banner ${i + 1}" class="${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
  ).join('');
  const dots = dotsWrap.querySelectorAll('button');

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 5500);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(Number(d.dataset.index)); startAuto(); }));

  const section = document.getElementById('hero-carousel');
  section.addEventListener('mouseenter', stopAuto);
  section.addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();
}

/* ---------- ANO NO FOOTER ---------- */
function initFooterYear() {
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
}

/* ---------- LOADING STATE (enquanto os produtos carregam da API) ---------- */
function showProductsLoading() {
  document.querySelectorAll('#featured-grid, #pc-carousel, #catalog-grid, #related-grid, #favorites-grid').forEach(el => {
    el.innerHTML = '<div class="loading-state"><i class="bi bi-arrow-repeat spin"></i> Carregando produtos...</div>';
  });
}

/* ---------- INIT GERAL ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  // Parte que não depende dos produtos pode iniciar de imediato
  initHeaderScroll();
  initMobileMenu();
  initMobileDropdowns();
  initWhatsapp();
  initThemeToggle();
  initHeroCarousel();
  initFavButtons();
  initBuyButtons();
  initFooterYear();
  updateFavCount();
  if (typeof updateCartCount === 'function') updateCartCount();

  showProductsLoading();
  await window.productsReadyPromise; // aguarda a API (ou o fallback local)

  if (usedFallbackProducts && API_CONFIG.useApi) {
    showToast('Não foi possível conectar à API — exibindo catálogo de demonstração.', 'error');
  }

  initSearch();
  renderFeatured();
  renderPcCarousel();
  initReveal();
});
