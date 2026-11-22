/* ==========================================================================
   素廓 Sukuo — Interactive Boutique Application Controller
   Lookbook Hotspot Sync · Dual-View Catalog · Dynamic Flats · Bag & Checkout
   ========================================================================== */

import {
  CATEGORIES,
  MOODS,
  HERO_SLIDES,
  PRODUCTS,
  LOOKBOOKS,
  SILHOUETTES
} from './data.js';
import { renderFlatSvg, renderSilhouetteBlueprint } from './patterns.js';
import { renderStudioGarmentSvg, renderAtelierLookboard } from './studio-renders.js';

const STORAGE_KEYS = {
  BAG: 'sukuo_bag_v1',
  WISHLIST: 'sukuo_wishlist_v1'
};

const FREE_SHIPPING_THRESHOLD = 599;
const PROMO_CODE_VALID = 'SUKUO10';

const productsById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const lookbooksById = Object.fromEntries(LOOKBOOKS.map((l) => [l.id, l]));

/* --------------------------------------------------------------------------
   Application State
   -------------------------------------------------------------------------- */
const state = {
  heroIndex: 0,
  activeLookId: LOOKBOOKS[0].id,
  activeHotspotId: LOOKBOOKS[0].hotspots[0].productId,
  lookSelectedSizes: {},
  category: '全部',
  mood: '全部风格',
  silhouetteFilter: null,
  sortBy: 'featured',
  searchQuery: '',
  cardColorIdx: {},
  cardViewMode: {},
  activeSilhouetteId: SILHOUETTES[0].id,
  modalProductId: null,
  modalView: 'studio',
  modalColorIdx: 0,
  modalSize: 'M',
  activeOverlay: null,
  bag: loadStorage(STORAGE_KEYS.BAG, []),
  wishlist: loadStorage(STORAGE_KEYS.WISHLIST, []),
  promoInput: '',
  promoApplied: false,
  promoError: '',
  checkoutStep: 'bag', // 'bag' | 'form' | 'done'
  lastOrderId: ''
};

/* --------------------------------------------------------------------------
   DOM References
   -------------------------------------------------------------------------- */
const dom = {
  searchToggleBtn: document.getElementById('searchToggleBtn'),
  searchBarPanel: document.getElementById('searchBarPanel'),
  catalogSearchInput: document.getElementById('catalogSearchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  mobileNavPanel: document.getElementById('mobileNavPanel'),
  wishlistOpenBtn: document.getElementById('wishlistOpenBtn'),
  wishlistCountBadge: document.getElementById('wishlistCountBadge'),
  bagOpenBtn: document.getElementById('bagOpenBtn'),
  bagCountBadge: document.getElementById('bagCountBadge'),

  heroSeasonTag: document.getElementById('heroSeasonTag'),
  heroHeadline: document.getElementById('heroHeadline'),
  heroLead: document.getElementById('heroLead'),
  heroPrimaryCta: document.getElementById('heroPrimaryCta'),
  heroSwitcherList: document.getElementById('heroSwitcherList'),
  heroPhoto: document.getElementById('heroPhoto'),
  heroCaptionTitle: document.getElementById('heroCaptionTitle'),
  heroCaptionMeta: document.getElementById('heroCaptionMeta'),
  heroCaptionBtn: document.getElementById('heroCaptionBtn'),

  lookbookTabs: document.getElementById('lookbookTabs'),
  lookbookCanvas: document.getElementById('lookbookCanvas'),
  lookMoodTag: document.getElementById('lookMoodTag'),
  lookCountNote: document.getElementById('lookCountNote'),
  lookTitle: document.getElementById('lookTitle'),
  lookDesc: document.getElementById('lookDesc'),
  lookItemsList: document.getElementById('lookItemsList'),
  bundleLabel: document.getElementById('bundleLabel'),
  bundleSavingsNote: document.getElementById('bundleSavingsNote'),
  bundleOriginalPrice: document.getElementById('bundleOriginalPrice'),
  bundleFinalPrice: document.getElementById('bundleFinalPrice'),
  addBundleBtn: document.getElementById('addBundleBtn'),

  categoryTabs: document.getElementById('categoryTabs'),
  catalogCountText: document.getElementById('catalogCountText'),
  catalogSortSelect: document.getElementById('catalogSortSelect'),
  moodPills: document.getElementById('moodPills'),
  activeFilterChips: document.getElementById('activeFilterChips'),
  productGrid: document.getElementById('productGrid'),
  catalogEmpty: document.getElementById('catalogEmpty'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  atelierTabs: document.getElementById('atelierTabs'),
  atelierBlueprint: document.getElementById('atelierBlueprint'),
  atelierTitle: document.getElementById('atelierTitle'),
  atelierSummary: document.getElementById('atelierSummary'),
  atelierFitNote: document.getElementById('atelierFitNote'),
  atelierMetrics: document.getElementById('atelierMetrics'),
  atelierFilterBtn: document.getElementById('atelierFilterBtn'),

  newsletterForm: document.getElementById('newsletterForm'),
  newsletterEmail: document.getElementById('newsletterEmail'),
  newsletterMsg: document.getElementById('newsletterMsg'),

  overlayBackdrop: document.getElementById('overlayBackdrop'),
  productModal: document.getElementById('productModal'),
  modalMediaStage: document.getElementById('modalMediaStage'),
  modalPhotoViewBtn: document.getElementById('modalPhotoViewBtn'),
  modalFlatViewBtn: document.getElementById('modalFlatViewBtn'),
  modalInfoCol: document.getElementById('modalInfoCol'),

  bagDrawer: document.getElementById('bagDrawer'),
  shippingMeter: document.getElementById('shippingMeter'),
  bagDrawerBody: document.getElementById('bagDrawerBody'),
  bagDrawerFooter: document.getElementById('bagDrawerFooter'),

  wishlistDrawer: document.getElementById('wishlistDrawer'),
  wishlistDrawerBody: document.getElementById('wishlistDrawerBody'),

  toastContainer: document.getElementById('toastContainer')
};

/* --------------------------------------------------------------------------
   Utility Helpers
   -------------------------------------------------------------------------- */
function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in private mode
  }
}

function formatPrice(num) {
  return `¥${Number(num).toLocaleString('zh-CN')}`;
}

function getDefaultSize(product) {
  if (!product?.sizes?.length) return '均码';
  return product.sizes.includes('M') ? 'M' : product.sizes[0];
}

function getLookItemSize(lookId, product) {
  const key = `${lookId}:${product.id}`;
  return state.lookSelectedSizes[key] || getDefaultSize(product);
}

/**
 * Renders either the real studio photograph (when available & on default colorway)
 * or our shaded couture studio SVG render (reacting live to colorway selection!)
 */
function renderProductVisual(product, colorIdx = 0, suffix = 'card') {
  const activeColor = product.colors[colorIdx] || product.colors[0];
  if (product.photo && colorIdx === 0) {
    return `<img class="product-photo" src="${product.photo}" alt="${product.name}（${activeColor.name}）" loading="lazy" />`;
  }
  return renderStudioGarmentSvg(product, activeColor.hex, `${suffix}_${colorIdx}`);
}

/**
 * Renders a small square/portrait thumbnail for rails and drawers
 */
function renderMiniThumb(product, colorHex, suffix = 'thumb') {
  if (product.photo && (!colorHex || colorHex === product.colors[0].hex)) {
    return `<img src="${product.photo}" alt="${product.name}" loading="lazy" />`;
  }
  return renderStudioGarmentSvg(product, colorHex || product.colors[0].hex, suffix);
}

function showToast(message) {
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = message;
  dom.toastContainer.appendChild(item);

  requestAnimationFrame(() => {
    item.classList.add('is-visible');
  });

  setTimeout(() => {
    item.classList.remove('is-visible');
    setTimeout(() => item.remove(), 220);
  }, 2400);
}

/* --------------------------------------------------------------------------
   1. Hero Section
   -------------------------------------------------------------------------- */
function renderHero(animateSwap = false) {
  const slide = HERO_SLIDES[state.heroIndex];
  dom.heroSeasonTag.textContent = slide.seasonTag;
  dom.heroHeadline.innerHTML = slide.headlineHtml || slide.headline;
  dom.heroLead.textContent = slide.lead;
  dom.heroCaptionTitle.textContent = slide.captionTitle;
  dom.heroCaptionMeta.textContent = slide.captionMeta;

  if (animateSwap) {
    dom.heroPhoto.classList.add('is-swapping');
    setTimeout(() => {
      dom.heroPhoto.src = slide.image;
      dom.heroPhoto.alt = slide.imageAlt;
      dom.heroPhoto.classList.remove('is-swapping');
    }, 150);
  } else {
    dom.heroPhoto.src = slide.image;
    dom.heroPhoto.alt = slide.imageAlt;
  }

  dom.heroSwitcherList.innerHTML = HERO_SLIDES.map((item, idx) => `
    <button
      class="hero-slide-btn ${idx === state.heroIndex ? 'is-active' : ''}"
      type="button"
      data-hero-idx="${idx}"
      aria-pressed="${idx === state.heroIndex}"
    >
      <span>${item.title}</span>
      <span class="hero-slide-scene">${item.scene}</span>
    </button>
  `).join('');
}

function jumpToLook(lookId, focusProductId = null) {
  const look = lookbooksById[lookId];
  if (!look) return;
  state.activeLookId = lookId;
  state.activeHotspotId = focusProductId || look.hotspots[0].productId;
  renderLookbook();
  document.getElementById('lookbook')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* --------------------------------------------------------------------------
   2. Signature Lookbook Hotspot Stage
   -------------------------------------------------------------------------- */
function renderLookbook() {
  const look = lookbooksById[state.activeLookId] || LOOKBOOKS[0];

  // Tabs
  dom.lookbookTabs.innerHTML = LOOKBOOKS.map((l) => `
    <button
      class="lookbook-tab ${l.id === look.id ? 'is-active' : ''}"
      type="button"
      role="tab"
      aria-selected="${l.id === look.id}"
      data-look-tab="${l.id}"
    >
      ${l.tabLabel}
    </button>
  `).join('');

  // Left Canvas (Real Photo for Look 1, Atelier Styling Board for Look 2 & 3)
  const mediaMarkup = look.mode === 'photo'
    ? `<img class="lookbook-photo" src="${look.image}" alt="${look.imageAlt}" />`
    : renderAtelierLookboard(look, productsById);

  const pinsMarkup = look.hotspots.map((spot) => {
    const product = productsById[spot.productId];
    if (!product) return '';
    const isActive = state.activeHotspotId === spot.productId;
    const tooltipSideClass = spot.x > 58 ? 'tooltip-left' : '';
    return `
      <button
        class="hotspot-pin ${isActive ? 'is-active' : ''} ${tooltipSideClass}"
        type="button"
        style="left: ${spot.x}%; top: ${spot.y}%;"
        data-hotspot-id="${spot.productId}"
        aria-label="查看${spot.role}：${product.name} ${formatPrice(product.price)}"
        aria-pressed="${isActive}"
      >
        <span class="hotspot-tooltip">
          ${product.name}
          <span class="hotspot-tooltip-price tabular">${formatPrice(product.price)}</span>
        </span>
      </button>
    `;
  }).join('');

  dom.lookbookCanvas.innerHTML = `
    ${mediaMarkup}
    <div class="hotspot-layer">${pinsMarkup}</div>
    <div class="lookbook-hint" aria-hidden="true">点击光点切换单品焦点</div>
  `;

  // Right Breakdown Rail
  dom.lookMoodTag.textContent = look.mood;
  dom.lookCountNote.textContent = `共 ${look.hotspots.length} 件搭配单品`;
  dom.lookTitle.textContent = look.title;
  dom.lookDesc.textContent = look.stylingNote;

  let totalOriginal = 0;

  dom.lookItemsList.innerHTML = look.hotspots.map((spot, idx) => {
    const product = productsById[spot.productId];
    if (!product) return '';
    totalOriginal += product.price;
    const isActive = state.activeHotspotId === spot.productId;
    const selectedSize = getLookItemSize(look.id, product);

    return `
      <div
        class="look-item ${isActive ? 'is-active' : ''}"
        data-look-item="${product.id}"
        tabindex="0"
        role="button"
        aria-label="定位画报中的 ${product.name}"
      >
        <div class="look-item-thumb">
          ${renderMiniThumb(product, product.colors[0].hex, `look_${look.id}_${idx}`)}
        </div>
        <div class="look-item-body">
          <div>
            <div class="look-item-top">
              <div>
                <div class="look-item-role">${spot.role}</div>
                <div class="look-item-name">${product.name}</div>
              </div>
              <div class="look-item-price tabular">${formatPrice(product.price)}</div>
            </div>
            <p class="look-item-note">${spot.note}</p>
          </div>
          <div class="look-item-controls">
            <div class="mini-size-group" role="group" aria-label="选择 ${product.name} 尺码">
              ${product.sizes.map((sz) => `
                <button
                  class="mini-size-btn ${sz === selectedSize ? 'is-selected' : ''}"
                  type="button"
                  data-look-size="${sz}"
                  data-product-id="${product.id}"
                >${sz}</button>
              `).join('')}
            </div>
            <div class="look-item-actions">
              <button class="text-link-btn" type="button" data-open-modal="${product.id}">详情</button>
              <button class="look-single-add" type="button" data-look-add-single="${product.id}">加入购物袋</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const finalPrice = Math.max(0, totalOriginal - look.bundleDiscount);
  dom.bundleLabel.textContent = `整套 ${look.hotspots.length} 件组合购`;
  dom.bundleSavingsNote.textContent = `整套选购立减 ${formatPrice(look.bundleDiscount)} 搭配礼遇`;
  dom.bundleOriginalPrice.textContent = formatPrice(totalOriginal);
  dom.bundleFinalPrice.textContent = formatPrice(finalPrice);
}

/**
 * Lightweight active highlight sync without rebuilding the entire Lookbook DOM
 */
function syncHotspotHighlight(productId) {
  if (state.activeHotspotId === productId) return;
  state.activeHotspotId = productId;

  dom.lookbookCanvas.querySelectorAll('.hotspot-pin').forEach((pin) => {
    const active = pin.dataset.hotspotId === productId;
    pin.classList.toggle('is-active', active);
    pin.setAttribute('aria-pressed', String(active));
  });

  dom.lookItemsList.querySelectorAll('.look-item').forEach((row) => {
    const active = row.dataset.lookItem === productId;
    row.classList.toggle('is-active', active);
  });
}

/* --------------------------------------------------------------------------
   3. Curated Collection Catalog (Filtering, Search, Swatches & Dual View)
   -------------------------------------------------------------------------- */
function getFilteredProducts() {
  const q = state.searchQuery.trim().toLowerCase();

  const filtered = PRODUCTS.filter((p) => {
    if (state.category !== '全部' && p.category !== state.category) return false;
    if (state.mood !== '全部风格' && !p.moods.includes(state.mood)) return false;
    if (state.silhouetteFilter && p.silhouetteType !== state.silhouetteFilter) return false;
    if (q) {
      const haystack = [
        p.name,
        p.category,
        p.fabricSummary,
        p.description,
        ...p.moods,
        ...p.colors.map((c) => c.name)
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  if (state.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'newest') {
    sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.featuredRank - b.featuredRank);
  } else {
    sorted.sort((a, b) => a.featuredRank - b.featuredRank);
  }

  return sorted;
}

function renderCatalogControls() {
  dom.categoryTabs.innerHTML = CATEGORIES.map((cat) => `
    <button
      class="cat-tab ${state.category === cat ? 'is-active' : ''}"
      type="button"
      role="tab"
      aria-selected="${state.category === cat}"
      data-cat="${cat}"
    >${cat}</button>
  `).join('');

  dom.moodPills.innerHTML = `
    <span class="mood-label">穿衣氛围</span>
    ${MOODS.map((m) => `
      <button
        class="mood-pill ${state.mood === m ? 'is-active' : ''}"
        type="button"
        aria-pressed="${state.mood === m}"
        data-mood="${m}"
      >${m}</button>
    `).join('')}
  `;

  const chips = [];
  if (state.silhouetteFilter) {
    const sil = SILHOUETTES.find((s) => s.id === state.silhouetteFilter);
    if (sil) {
      chips.push(`
        <button class="active-filter-chip" type="button" data-clear-silhouette>
          廓形：${sil.name} &times;
        </button>
      `);
    }
  }
  if (state.searchQuery.trim()) {
    chips.push(`
      <button class="active-filter-chip" type="button" data-clear-search>
        搜索：${escapeHtml(state.searchQuery.trim())} &times;
      </button>
    `);
  }
  dom.activeFilterChips.innerHTML = chips.join(' ');
}

function renderCatalogGrid() {
  const items = getFilteredProducts();
  dom.catalogCountText.textContent = `共 ${items.length} 件单品`;

  if (items.length === 0) {
    dom.productGrid.innerHTML = '';
    dom.catalogEmpty.hidden = false;
    return;
  }

  dom.catalogEmpty.hidden = true;
  dom.productGrid.innerHTML = items.map((product) => {
    const colorIdx = state.cardColorIdx[product.id] || 0;
    const activeColor = product.colors[colorIdx] || product.colors[0];
    const viewMode = state.cardViewMode[product.id] || 'studio';
    const isFlat = viewMode === 'flat';
    const isWished = state.wishlist.includes(product.id);

    const mediaHtml = isFlat
      ? `<div class="product-flat-wrap">${renderFlatSvg(product, { colorHex: activeColor.hex, showDimensions: false })}</div>`
      : renderProductVisual(product, colorIdx, `grid_${product.id}`);

    return `
      <article class="product-card" data-card-id="${product.id}">
        <div class="product-media">
          <button
            class="card-view-toggle ${isFlat ? 'is-flat' : ''}"
            type="button"
            data-toggle-view="${product.id}"
            aria-pressed="${isFlat}"
          >
            ${isFlat ? '返回实景图' : '版型图'}
          </button>

          <button
            class="card-wish-btn ${isWished ? 'is-wished' : ''}"
            type="button"
            data-toggle-wish="${product.id}"
            aria-label="${isWished ? '取消收藏' : '加入收藏'} ${product.name}"
            aria-pressed="${isWished}"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4l-1.35-1.23C5.6 14.6 2.5 11.8 2.5 8.3A4.7 4.7 0 0 1 7.2 3.6c1.66 0 3.25.8 4.2 2.08A5.25 5.25 0 0 1 15.6 3.6a4.7 4.7 0 0 1 4.7 4.7c0 3.5-3.1 6.3-8.15 10.87L12 20.4z" /></svg>
          </button>

          <button class="product-media-btn" type="button" data-open-modal="${product.id}" aria-label="查看 ${product.name} 详情">
            ${mediaHtml}
          </button>

          <div class="card-quick-add">
            <div class="quick-add-label">快捷选码加入购物袋</div>
            <div class="quick-size-row">
              ${product.sizes.map((sz) => `
                <button class="quick-size-btn" type="button" data-quick-add="${product.id}" data-size="${sz}">${sz}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card-swatches" role="group" aria-label="切换 ${product.name} 颜色">
          ${product.colors.map((c, idx) => `
            <button
              class="swatch-dot ${idx === colorIdx ? 'is-active' : ''}"
              type="button"
              style="background-color: ${c.hex};"
              data-swatch-product="${product.id}"
              data-swatch-idx="${idx}"
              aria-label="${c.name}"
              title="${c.name}"
            ></button>
          `).join('')}
          <span class="swatch-name">${activeColor.name}</span>
        </div>

        <div class="card-title-row">
          <button class="card-title-btn" type="button" data-open-modal="${product.id}">${product.name}</button>
          <span class="card-price tabular">${formatPrice(product.price)}</span>
        </div>
        <p class="card-fabric">${product.fabricSummary}</p>
      </article>
    `;
  }).join('');
}

/* --------------------------------------------------------------------------
   4. Silhouette & Fabric Archive (廓形与织物工坊)
   -------------------------------------------------------------------------- */
function renderAtelier() {
  const active = SILHOUETTES.find((s) => s.id === state.activeSilhouetteId) || SILHOUETTES[0];

  dom.atelierTabs.innerHTML = SILHOUETTES.map((s) => `
    <button
      class="atelier-tab ${s.id === active.id ? 'is-active' : ''}"
      type="button"
      role="tab"
      aria-selected="${s.id === active.id}"
      data-silhouette-tab="${s.id}"
    >${s.name}</button>
  `).join('');

  dom.atelierBlueprint.innerHTML = renderSilhouetteBlueprint(active.id);
  dom.atelierTitle.textContent = active.name;
  dom.atelierSummary.textContent = active.summary;
  dom.atelierFitNote.textContent = active.fitNote;

  dom.atelierMetrics.innerHTML = active.metrics.map((m) => `
    <div>
      <div class="metric-head">
        <span>${m.label}</span>
        <span>${m.text}</span>
      </div>
      <div class="metric-track">
        <div class="metric-fill" style="width: ${m.value}%;"></div>
      </div>
    </div>
  `).join('');

  const matchCount = PRODUCTS.filter((p) => p.silhouetteType === active.id).length;
  dom.atelierFilterBtn.textContent = `查看 ${matchCount} 款同廓形单品`;
}

/* --------------------------------------------------------------------------
   5. Product Detail Modal (with Interactive Size-Reactive SVG Blueprints)
   -------------------------------------------------------------------------- */
function openProductModal(productId, initialView = 'studio') {
  const product = productsById[productId];
  if (!product) return;

  state.modalProductId = productId;
  state.modalView = initialView;
  state.modalColorIdx = state.cardColorIdx[productId] || 0;
  state.modalSize = getDefaultSize(product);

  renderProductModal();
  showOverlay('modal');
}

function renderProductModal() {
  const product = productsById[state.modalProductId];
  if (!product) return;

  const activeColor = product.colors[state.modalColorIdx] || product.colors[0];
  const isFlat = state.modalView === 'flat';
  const isWished = state.wishlist.includes(product.id);

  dom.modalPhotoViewBtn.classList.toggle('is-active', !isFlat);
  dom.modalFlatViewBtn.classList.toggle('is-active', isFlat);

  dom.modalMediaStage.innerHTML = isFlat
    ? renderFlatSvg(product, {
        size: state.modalSize,
        colorHex: activeColor.hex,
        showDimensions: true
      })
    : renderProductVisual(product, state.modalColorIdx, `modal_${product.id}`);

  const activeSpecs = product.measurements?.[state.modalSize] || {};
  const specsHtml = Object.entries(activeSpecs)
    .map(([label, val]) => `<span class="modal-spec-item">${label} <strong class="tabular">${val}</strong></span>`)
    .join('');

  const linkedLook = product.inLooks?.[0] ? lookbooksById[product.inLooks[0]] : null;

  dom.modalInfoCol.innerHTML = `
    <div class="modal-head-row">
      <div>
        <div class="modal-cat-tag">${product.category}</div>
        <h2 class="modal-title" id="modalProductTitle">${product.name}</h2>
        <div class="modal-price tabular">${formatPrice(product.price)}</div>
      </div>
      <button class="close-icon-btn" type="button" data-close-overlay aria-label="关闭商品详情">
        <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>

    <p class="modal-desc">${product.description}</p>

    <div>
      <div class="modal-control-label">
        <span>已选颜色：${activeColor.name}</span>
      </div>
      <div class="card-swatches">
        ${product.colors.map((c, idx) => `
          <button
            class="swatch-dot ${idx === state.modalColorIdx ? 'is-active' : ''}"
            type="button"
            style="background-color: ${c.hex}; width: 20px; height: 20px;"
            data-modal-color="${idx}"
            aria-label="${c.name}"
            title="${c.name}"
          ></button>
        `).join('')}
      </div>
    </div>

    <div>
      <div class="modal-control-label">
        <span>选择尺码（切换尺码同步更新制版尺寸）</span>
        <button class="text-link-btn" type="button" id="modalJumpFlatBtn">查看线稿标注</button>
      </div>
      <div class="modal-size-grid">
        ${product.sizes.map((sz) => `
          <button
            class="modal-size-btn ${sz === state.modalSize ? 'is-selected' : ''}"
            type="button"
            data-modal-size="${sz}"
          >${sz}</button>
        `).join('')}
      </div>
    </div>

    <div class="modal-spec-box">${specsHtml}</div>

    <div class="modal-cta-stack">
      <button class="btn btn-primary" type="button" id="modalAddToBagBtn">加入购物袋</button>
      <button class="btn btn-secondary" type="button" id="modalWishToggleBtn">
        ${isWished ? '已收藏' : '加入收藏'}
      </button>
    </div>

    ${linkedLook ? `
      <div class="modal-look-jump">
        <span>此单品入选「${linkedLook.title}」整套穿搭</span>
        <button class="text-link-btn" type="button" data-jump-look="${linkedLook.id}" data-jump-product="${product.id}">查看穿搭热区</button>
      </div>
    ` : ''}

    <div class="modal-details-group">
      <div><strong>面料构成：</strong>${product.fabricSummary}</div>
      <div style="margin-top: 6px;"><strong>洗护建议：</strong>${product.careNotes}</div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   6. Shopping Bag, Bundle Discount Detection, Promo & Mock Checkout
   -------------------------------------------------------------------------- */
function addToBag(productId, size, colorIdx = 0, silent = false) {
  const product = productsById[productId];
  if (!product) return;
  const color = product.colors[colorIdx] || product.colors[0];
  const chosenSize = size || getDefaultSize(product);
  const key = `${productId}__${color.name}__${chosenSize}`;

  const existing = state.bag.find((item) => item.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    state.bag.push({
      key,
      productId,
      colorName: color.name,
      colorHex: color.hex,
      size: chosenSize,
      qty: 1
    });
  }

  state.checkoutStep = 'bag';
  saveStorage(STORAGE_KEYS.BAG, state.bag);
  updateHeaderBadges();
  if (state.activeOverlay === 'bag') renderBagDrawer();
  if (!silent) {
    showToast(`已加入购物袋：${product.name}（${chosenSize}）`);
  }
}

function addLookBundleToBag(lookId) {
  const look = lookbooksById[lookId];
  if (!look) return;

  look.hotspots.forEach((spot) => {
    const product = productsById[spot.productId];
    if (!product) return;
    const sz = getLookItemSize(look.id, product);
    addToBag(product.id, sz, 0, true);
  });

  showToast(`已将「${look.title}」整套 ${look.hotspots.length} 件加入购物袋`);
  openBagDrawer();
}

function calculateBagTotals() {
  let subtotal = 0;
  const productQtyMap = {};

  state.bag.forEach((item) => {
    const product = productsById[item.productId];
    if (!product) return;
    subtotal += product.price * item.qty;
    productQtyMap[item.productId] = (productQtyMap[item.productId] || 0) + item.qty;
  });

  // Detect complete Lookbook bundles eligible for bundle courtesy discount
  let bundleDiscount = 0;
  let matchedLookTitle = '';
  LOOKBOOKS.forEach((look) => {
    const minComplete = Math.min(
      ...look.hotspots.map((spot) => productQtyMap[spot.productId] || 0)
    );
    if (minComplete > 0 && bundleDiscount === 0) {
      bundleDiscount = look.bundleDiscount;
      matchedLookTitle = look.title;
    }
  });

  const afterBundle = Math.max(0, subtotal - bundleDiscount);
  const promoDiscount = state.promoApplied ? Math.round(afterBundle * 0.1) : 0;
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 18;
  const finalTotal = Math.max(0, afterBundle - promoDiscount) + shippingFee;

  return {
    subtotal,
    bundleDiscount,
    matchedLookTitle,
    promoDiscount,
    shippingFee,
    finalTotal
  };
}

function openBagDrawer() {
  if (state.bag.length > 0 && state.checkoutStep === 'done') {
    state.checkoutStep = 'bag';
  }
  renderBagDrawer();
  showOverlay('bag');
}

function renderBagDrawer() {
  const totals = calculateBagTotals();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  const progressPct = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  dom.shippingMeter.innerHTML = totals.subtotal === 0
    ? `<span>满 ${formatPrice(FREE_SHIPPING_THRESHOLD)} 享顺丰包邮与防尘衣罩包装</span>`
    : remaining === 0
      ? `<span>已享顺丰包邮与立体防尘衣罩包装礼遇</span>
         <div class="shipping-bar"><div class="shipping-fill" style="width: 100%;"></div></div>`
      : `<span>再选 ${formatPrice(remaining)} 即可享顺丰包邮礼遇</span>
         <div class="shipping-bar"><div class="shipping-fill" style="width: ${progressPct}%;"></div></div>`;

  // Order Confirmation State
  if (state.checkoutStep === 'done') {
    dom.bagDrawerBody.innerHTML = `
      <div class="order-confirm-box">
        <h3 class="order-confirm-title">订单已生成</h3>
        <div class="order-confirm-id tabular">订单编号：${state.lastOrderId}</div>
        <p style="font-size: var(--text-sm); color: var(--ink-graphite); line-height: 1.75;">
          感谢选购素廓 Sukuo。当前为前端设计展示环境的模拟订单确认，您的衣物清单与试穿礼遇均已记录。
        </p>
        <button class="btn btn-primary btn-sm" type="button" id="continueShoppingBtn" style="margin-top: 20px;">继续浏览本季系列</button>
      </div>
    `;
    dom.bagDrawerFooter.innerHTML = '';
    return;
  }

  // Empty Bag State
  if (state.bag.length === 0) {
    dom.bagDrawerBody.innerHTML = `
      <div class="drawer-empty">
        <p>购物袋目前空着。</p>
        <p style="margin-top: 6px; font-size: var(--text-xs); color: var(--ink-silver);">可以从「整套穿搭热区导购」一键挑选完整造型。</p>
        <button class="btn btn-primary btn-sm" type="button" id="emptyBagGoLookBtn" style="margin-top: 18px;">去看看穿搭型录</button>
      </div>
    `;
    dom.bagDrawerFooter.innerHTML = '';
    return;
  }

  // Mock Checkout Form State
  if (state.checkoutStep === 'form') {
    dom.bagDrawerBody.innerHTML = `
      <form class="checkout-form" id="mockCheckoutForm" novalidate>
        <div style="font-size: var(--text-xs); color: var(--ink-graphite); margin-bottom: 4px;">
          模拟收件信息（共 ${state.bag.reduce((s, i) => s + i.qty, 0)} 件 · 实付 <strong class="tabular">${formatPrice(totals.finalTotal)}</strong>）
        </div>
        <div class="field-group">
          <label class="field-label" for="coName">收件人姓名</label>
          <input class="field-input" id="coName" name="name" type="text" placeholder="例如：林知夏" required />
        </div>
        <div class="field-group">
          <label class="field-label" for="coPhone">联系电话</label>
          <input class="field-input" id="coPhone" name="phone" type="tel" placeholder="11 位手机号码" required />
        </div>
        <div class="field-group">
          <label class="field-label" for="coAddress">收货城市与地址</label>
          <input class="field-input" id="coAddress" name="address" type="text" placeholder="例如：上海市徐汇区安福路 188 号" required />
        </div>
        <div class="field-error" id="checkoutFormError" aria-live="polite"></div>
      </form>
    `;
    dom.bagDrawerFooter.innerHTML = `
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px;">
        <button class="btn btn-secondary" type="button" id="backToBagBtn">返回购物袋</button>
        <button class="btn btn-bordeaux" type="submit" form="mockCheckoutForm">确认提交模拟订单</button>
      </div>
    `;
    return;
  }

  // Default Bag Line Items View
  dom.bagDrawerBody.innerHTML = state.bag.map((item, idx) => {
    const product = productsById[item.productId];
    if (!product) return '';
    return `
      <div class="drawer-item">
        <div class="drawer-item-thumb">
          ${renderMiniThumb(product, item.colorHex, `bag_${idx}`)}
        </div>
        <div>
          <div class="drawer-item-top">
            <div>
              <div class="drawer-item-name">${product.name}</div>
              <div class="drawer-item-meta">${item.colorName} / ${item.size === '均码' ? '均码' : `${item.size} 码`}</div>
            </div>
            <button class="text-link-btn" type="button" data-bag-remove="${item.key}">移除</button>
          </div>
          <div class="drawer-item-bottom">
            <div class="qty-stepper" aria-label="调整数量">
              <button class="qty-btn" type="button" data-bag-delta="${item.key}" data-delta="-1" aria-label="减少数量">&minus;</button>
              <span class="qty-val tabular">${item.qty}</span>
              <button class="qty-btn" type="button" data-bag-delta="${item.key}" data-delta="1" aria-label="增加数量">+</button>
            </div>
            <span class="tabular" style="font-size: var(--text-sm); font-weight: 500;">${formatPrice(product.price * item.qty)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  dom.bagDrawerFooter.innerHTML = `
    <form class="promo-row" id="promoForm">
      <label class="sr-only" for="promoInput">输入优惠码</label>
      <input class="promo-input" id="promoInput" type="text" value="${escapeHtml(state.promoInput)}" placeholder="输入优惠码（体验码 SUKUO10）" />
      <button class="btn btn-secondary btn-sm" type="submit">${state.promoApplied ? '已启用' : '应用'}</button>
    </form>
    ${state.promoError ? `<div class="promo-feedback">${state.promoError}</div>` : ''}
    ${state.promoApplied ? `<div class="promo-feedback">已使用体验码 SUKUO10，享额外九折礼遇</div>` : ''}

    <div class="summary-row">
      <span>商品小计</span>
      <span class="tabular">${formatPrice(totals.subtotal)}</span>
    </div>
    ${totals.bundleDiscount > 0 ? `
      <div class="summary-row is-discount">
        <span>「${totals.matchedLookTitle}」整套立减</span>
        <span class="tabular">-${formatPrice(totals.bundleDiscount)}</span>
      </div>
    ` : ''}
    ${totals.promoDiscount > 0 ? `
      <div class="summary-row is-discount">
        <span>优惠码 SUKUO10 (九折)</span>
        <span class="tabular">-${formatPrice(totals.promoDiscount)}</span>
      </div>
    ` : ''}
    <div class="summary-row">
      <span>顺丰配送</span>
      <span class="tabular">${totals.shippingFee === 0 ? '免运费' : formatPrice(totals.shippingFee)}</span>
    </div>
    <div class="summary-row is-total">
      <span>预计实付</span>
      <span class="tabular">${formatPrice(totals.finalTotal)}</span>
    </div>
    <button class="btn btn-primary" type="button" id="proceedCheckoutBtn" style="width: 100%;">前往模拟结算</button>
  `;
}

/* --------------------------------------------------------------------------
   7. Wishlist Drawer
   -------------------------------------------------------------------------- */
function toggleWishlist(productId) {
  const product = productsById[productId];
  if (!product) return;

  const idx = state.wishlist.indexOf(productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast(`已从收藏夹移除：${product.name}`);
  } else {
    state.wishlist.push(productId);
    showToast(`已收藏：${product.name}`);
  }

  saveStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
  updateHeaderBadges();
  renderCatalogGrid();
  if (state.activeOverlay === 'wishlist') renderWishlistDrawer();
  if (state.activeOverlay === 'modal' && state.modalProductId === productId) renderProductModal();
}

function renderWishlistDrawer() {
  if (state.wishlist.length === 0) {
    dom.wishlistDrawerBody.innerHTML = `
      <div class="drawer-empty">
        <p>您还没有收藏任何单品。</p>
        <p style="margin-top: 6px; font-size: var(--text-xs); color: var(--ink-silver);">点击单品右上角心形图标即可收进灵感清单。</p>
      </div>
    `;
    return;
  }

  dom.wishlistDrawerBody.innerHTML = state.wishlist.map((pid, idx) => {
    const product = productsById[pid];
    if (!product) return '';
    return `
      <div class="drawer-item">
        <div class="drawer-item-thumb">
          ${renderMiniThumb(product, product.colors[0].hex, `wish_${idx}`)}
        </div>
        <div>
          <div class="drawer-item-top">
            <div>
              <div class="drawer-item-name">${product.name}</div>
              <div class="drawer-item-meta">${product.fabricSummary}</div>
            </div>
            <span class="tabular" style="font-size: var(--text-sm); font-weight: 500;">${formatPrice(product.price)}</span>
          </div>
          <div class="drawer-item-bottom">
            <button class="look-single-add" type="button" data-wish-to-bag="${product.id}">移入购物袋</button>
            <div style="display: flex; gap: 12px;">
              <button class="text-link-btn" type="button" data-open-modal="${product.id}">查看详情</button>
              <button class="text-link-btn" type="button" data-toggle-wish="${product.id}">移除</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateHeaderBadges() {
  const bagQty = state.bag.reduce((sum, item) => sum + item.qty, 0);
  const wishQty = state.wishlist.length;

  dom.bagCountBadge.textContent = String(bagQty);
  dom.bagCountBadge.classList.toggle('is-zero', bagQty === 0);
  dom.bagCountBadge.classList.toggle('is-accent', bagQty > 0);

  dom.wishlistCountBadge.textContent = String(wishQty);
  dom.wishlistCountBadge.classList.toggle('is-zero', wishQty === 0);
}

/* --------------------------------------------------------------------------
   8. Overlay Management (Modal & Drawers)
   -------------------------------------------------------------------------- */
function showOverlay(type) {
  closeAllOverlays(true);
  state.activeOverlay = type;

  dom.overlayBackdrop.hidden = false;
  requestAnimationFrame(() => dom.overlayBackdrop.classList.add('is-open'));
  document.body.style.overflow = 'hidden';

  if (type === 'modal') {
    dom.productModal.hidden = false;
  } else if (type === 'bag') {
    dom.bagDrawer.hidden = false;
    requestAnimationFrame(() => dom.bagDrawer.classList.add('is-open'));
  } else if (type === 'wishlist') {
    renderWishlistDrawer();
    dom.wishlistDrawer.hidden = false;
    requestAnimationFrame(() => dom.wishlistDrawer.classList.add('is-open'));
  }
}

function closeAllOverlays(immediate = false) {
  state.activeOverlay = null;
  document.body.style.overflow = '';

  dom.productModal.hidden = true;
  dom.bagDrawer.classList.remove('is-open');
  dom.wishlistDrawer.classList.remove('is-open');
  dom.overlayBackdrop.classList.remove('is-open');

  const hideAfter = () => {
    if (!state.activeOverlay) {
      dom.overlayBackdrop.hidden = true;
      dom.bagDrawer.hidden = true;
      dom.wishlistDrawer.hidden = true;
    }
  };

  if (immediate) {
    hideAfter();
  } else {
    setTimeout(hideAfter, 220);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/* --------------------------------------------------------------------------
   9. Global Event Wiring
   -------------------------------------------------------------------------- */
function bindEvents() {
  // Header Search Toggle & Mobile Menu
  dom.searchToggleBtn.addEventListener('click', () => {
    const isHidden = dom.searchBarPanel.hidden;
    dom.searchBarPanel.hidden = !isHidden;
    dom.searchToggleBtn.setAttribute('aria-expanded', String(isHidden));
    if (isHidden) dom.catalogSearchInput.focus();
  });

  dom.mobileMenuBtn.addEventListener('click', () => {
    const isHidden = dom.mobileNavPanel.hidden;
    dom.mobileNavPanel.hidden = !isHidden;
    dom.mobileMenuBtn.setAttribute('aria-expanded', String(isHidden));
  });

  dom.mobileNavPanel.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      dom.mobileNavPanel.hidden = true;
      dom.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  dom.catalogSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    dom.searchClearBtn.hidden = !state.searchQuery;
    renderCatalogControls();
    renderCatalogGrid();
  });

  dom.catalogSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  dom.searchClearBtn.addEventListener('click', () => {
    state.searchQuery = '';
    dom.catalogSearchInput.value = '';
    dom.searchClearBtn.hidden = true;
    renderCatalogControls();
    renderCatalogGrid();
  });

  dom.searchBarPanel.addEventListener('click', (e) => {
    const quick = e.target.closest('[data-quick-search]');
    if (!quick) return;
    const term = quick.dataset.quickSearch;
    state.searchQuery = term;
    dom.catalogSearchInput.value = term;
    dom.searchClearBtn.hidden = false;
    renderCatalogControls();
    renderCatalogGrid();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  });

  dom.bagOpenBtn.addEventListener('click', () => openBagDrawer());
  dom.wishlistOpenBtn.addEventListener('click', () => showOverlay('wishlist'));

  // Hero Switcher & Caption Jump
  dom.heroSwitcherList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hero-idx]');
    if (!btn) return;
    const idx = Number(btn.dataset.heroIdx);
    if (idx === state.heroIndex) return;
    state.heroIndex = idx;
    renderHero(true);
  });

  dom.heroCaptionBtn.addEventListener('click', () => {
    const slide = HERO_SLIDES[state.heroIndex];
    jumpToLook(slide.targetLookId);
  });

  // Lookbook Tabs
  dom.lookbookTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-look-tab]');
    if (!tab) return;
    const nextId = tab.dataset.lookTab;
    if (nextId === state.activeLookId) return;
    const look = lookbooksById[nextId];
    state.activeLookId = nextId;
    state.activeHotspotId = look.hotspots[0].productId;
    renderLookbook();
  });

  // Lookbook Hotspot Pin Interactions (Click + Hover + Focus)
  dom.lookbookCanvas.addEventListener('click', (e) => {
    const pin = e.target.closest('[data-hotspot-id]');
    if (!pin) return;
    syncHotspotHighlight(pin.dataset.hotspotId);
  });

  dom.lookbookCanvas.addEventListener('focusin', (e) => {
    const pin = e.target.closest('[data-hotspot-id]');
    if (pin) syncHotspotHighlight(pin.dataset.hotspotId);
  });

  // Lookbook Right Rail Interactions
  dom.lookItemsList.addEventListener('click', (e) => {
    const sizeBtn = e.target.closest('[data-look-size]');
    if (sizeBtn) {
      e.stopPropagation();
      const pid = sizeBtn.dataset.productId;
      state.lookSelectedSizes[`${state.activeLookId}:${pid}`] = sizeBtn.dataset.lookSize;
      renderLookbook();
      return;
    }

    const detailBtn = e.target.closest('[data-open-modal]');
    if (detailBtn) {
      e.stopPropagation();
      openProductModal(detailBtn.dataset.openModal);
      return;
    }

    const addSingleBtn = e.target.closest('[data-look-add-single]');
    if (addSingleBtn) {
      e.stopPropagation();
      const pid = addSingleBtn.dataset.lookAddSingle;
      const product = productsById[pid];
      addToBag(pid, getLookItemSize(state.activeLookId, product), 0);
      return;
    }

    const row = e.target.closest('[data-look-item]');
    if (row) {
      syncHotspotHighlight(row.dataset.lookItem);
    }
  });

  dom.lookItemsList.addEventListener('mouseover', (e) => {
    const row = e.target.closest('[data-look-item]');
    if (row) syncHotspotHighlight(row.dataset.lookItem);
  });

  dom.addBundleBtn.addEventListener('click', () => addLookBundleToBag(state.activeLookId));

  // Catalog Filters, Sort & Reset
  dom.categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderCatalogControls();
    renderCatalogGrid();
  });

  dom.moodPills.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mood]');
    if (!btn) return;
    state.mood = btn.dataset.mood;
    renderCatalogControls();
    renderCatalogGrid();
  });

  dom.activeFilterChips.addEventListener('click', (e) => {
    if (e.target.closest('[data-clear-silhouette]')) {
      state.silhouetteFilter = null;
      renderCatalogControls();
      renderCatalogGrid();
    } else if (e.target.closest('[data-clear-search]')) {
      state.searchQuery = '';
      dom.catalogSearchInput.value = '';
      dom.searchClearBtn.hidden = true;
      renderCatalogControls();
      renderCatalogGrid();
    }
  });

  dom.catalogSortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderCatalogGrid();
  });

  dom.resetFiltersBtn.addEventListener('click', () => {
    state.category = '全部';
    state.mood = '全部风格';
    state.silhouetteFilter = null;
    state.searchQuery = '';
    dom.catalogSearchInput.value = '';
    dom.searchClearBtn.hidden = true;
    renderCatalogControls();
    renderCatalogGrid();
  });

  // Catalog Grid Card Interactions
  dom.productGrid.addEventListener('click', (e) => {
    const toggleView = e.target.closest('[data-toggle-view]');
    if (toggleView) {
      const pid = toggleView.dataset.toggleView;
      state.cardViewMode[pid] = state.cardViewMode[pid] === 'flat' ? 'studio' : 'flat';
      renderCatalogGrid();
      return;
    }

    const wishBtn = e.target.closest('[data-toggle-wish]');
    if (wishBtn) {
      toggleWishlist(wishBtn.dataset.toggleWish);
      return;
    }

    const swatchBtn = e.target.closest('[data-swatch-product]');
    if (swatchBtn) {
      state.cardColorIdx[swatchBtn.dataset.swatchProduct] = Number(swatchBtn.dataset.swatchIdx);
      renderCatalogGrid();
      return;
    }

    const quickAdd = e.target.closest('[data-quick-add]');
    if (quickAdd) {
      const pid = quickAdd.dataset.quickAdd;
      addToBag(pid, quickAdd.dataset.size, state.cardColorIdx[pid] || 0);
      return;
    }

    const modalTrigger = e.target.closest('[data-open-modal]');
    if (modalTrigger) {
      const pid = modalTrigger.dataset.openModal;
      const view = state.cardViewMode[pid] || 'studio';
      openProductModal(pid, view);
    }
  });

  // Atelier Silhouette Archive
  dom.atelierTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-silhouette-tab]');
    if (!tab) return;
    state.activeSilhouetteId = tab.dataset.silhouetteTab;
    renderAtelier();
  });

  dom.atelierFilterBtn.addEventListener('click', () => {
    state.category = '全部';
    state.mood = '全部风格';
    state.silhouetteFilter = state.activeSilhouetteId;
    renderCatalogControls();
    renderCatalogGrid();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Product Detail Modal Interactions
  dom.modalPhotoViewBtn.addEventListener('click', () => {
    state.modalView = 'studio';
    renderProductModal();
  });

  dom.modalFlatViewBtn.addEventListener('click', () => {
    state.modalView = 'flat';
    renderProductModal();
  });

  dom.modalInfoCol.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-overlay]')) {
      closeAllOverlays();
      return;
    }

    const colorBtn = e.target.closest('[data-modal-color]');
    if (colorBtn) {
      state.modalColorIdx = Number(colorBtn.dataset.modalColor);
      renderProductModal();
      return;
    }

    const sizeBtn = e.target.closest('[data-modal-size]');
    if (sizeBtn) {
      state.modalSize = sizeBtn.dataset.modalSize;
      renderProductModal();
      return;
    }

    if (e.target.closest('#modalJumpFlatBtn')) {
      state.modalView = 'flat';
      renderProductModal();
      return;
    }

    if (e.target.closest('#modalAddToBagBtn')) {
      addToBag(state.modalProductId, state.modalSize, state.modalColorIdx);
      return;
    }

    if (e.target.closest('#modalWishToggleBtn')) {
      toggleWishlist(state.modalProductId);
      return;
    }

    const lookJump = e.target.closest('[data-jump-look]');
    if (lookJump) {
      closeAllOverlays();
      jumpToLook(lookJump.dataset.jumpLook, lookJump.dataset.jumpProduct);
    }
  });

  // Shopping Bag Drawer Interactions
  dom.bagDrawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-overlay]')) {
      closeAllOverlays();
      return;
    }

    const removeBtn = e.target.closest('[data-bag-remove]');
    if (removeBtn) {
      state.bag = state.bag.filter((i) => i.key !== removeBtn.dataset.bagRemove);
      saveStorage(STORAGE_KEYS.BAG, state.bag);
      updateHeaderBadges();
      renderBagDrawer();
      return;
    }

    const deltaBtn = e.target.closest('[data-bag-delta]');
    if (deltaBtn) {
      const item = state.bag.find((i) => i.key === deltaBtn.dataset.bagDelta);
      if (!item) return;
      item.qty += Number(deltaBtn.dataset.delta);
      if (item.qty <= 0) {
        state.bag = state.bag.filter((i) => i.key !== item.key);
      }
      saveStorage(STORAGE_KEYS.BAG, state.bag);
      updateHeaderBadges();
      renderBagDrawer();
      return;
    }

    if (e.target.closest('#proceedCheckoutBtn')) {
      state.checkoutStep = 'form';
      renderBagDrawer();
      return;
    }

    if (e.target.closest('#backToBagBtn')) {
      state.checkoutStep = 'bag';
      renderBagDrawer();
      return;
    }

    if (e.target.closest('#emptyBagGoLookBtn')) {
      closeAllOverlays();
      document.getElementById('lookbook')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (e.target.closest('#continueShoppingBtn')) {
      state.checkoutStep = 'bag';
      closeAllOverlays();
    }
  });

  dom.bagDrawer.addEventListener('submit', (e) => {
    if (e.target.id === 'promoForm') {
      e.preventDefault();
      const input = document.getElementById('promoInput');
      const code = (input?.value || '').trim().toUpperCase();
      state.promoInput = code;
      if (code === PROMO_CODE_VALID) {
        state.promoApplied = true;
        state.promoError = '';
        showToast('已应用体验优惠码 SUKUO10（九折）');
      } else {
        state.promoApplied = false;
        state.promoError = '优惠码无效，可尝试输入体验码 SUKUO10';
      }
      renderBagDrawer();
      return;
    }

    if (e.target.id === 'mockCheckoutForm') {
      e.preventDefault();
      const name = document.getElementById('coName')?.value.trim();
      const phone = document.getElementById('coPhone')?.value.trim();
      const address = document.getElementById('coAddress')?.value.trim();
      const errorBox = document.getElementById('checkoutFormError');

      if (!name || !phone || !address) {
        if (errorBox) errorBox.textContent = '请完整填写收件人姓名、联系电话与收货地址。';
        return;
      }
      if (!/^1\d{10}$/.test(phone)) {
        if (errorBox) errorBox.textContent = '请输入 11 位有效中国大陆手机号码。';
        return;
      }

      const now = new Date();
      const suffix = String(Math.floor(1000 + Math.random() * 9000));
      state.lastOrderId = `SK${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${suffix}`;
      state.bag = [];
      state.promoApplied = false;
      state.promoInput = '';
      state.checkoutStep = 'done';
      saveStorage(STORAGE_KEYS.BAG, state.bag);
      updateHeaderBadges();
      renderBagDrawer();
      showToast('模拟订单已提交成功');
    }
  });

  // Wishlist Drawer Interactions
  dom.wishlistDrawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-overlay]')) {
      closeAllOverlays();
      return;
    }

    const moveBtn = e.target.closest('[data-wish-to-bag]');
    if (moveBtn) {
      const pid = moveBtn.dataset.wishToBag;
      const product = productsById[pid];
      addToBag(pid, getDefaultSize(product), 0);
      openBagDrawer();
      return;
    }

    const detailBtn = e.target.closest('[data-open-modal]');
    if (detailBtn) {
      openProductModal(detailBtn.dataset.openModal);
      return;
    }

    const removeBtn = e.target.closest('[data-toggle-wish]');
    if (removeBtn) {
      toggleWishlist(removeBtn.dataset.toggleWish);
    }
  });

  // Backdrop & Escape Close
  dom.overlayBackdrop.addEventListener('click', () => closeAllOverlays());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.activeOverlay) {
        closeAllOverlays();
      } else if (!dom.searchBarPanel.hidden) {
        dom.searchBarPanel.hidden = true;
        dom.searchToggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Footer Quick Category Links
  document.querySelectorAll('[data-footer-cat]').forEach((link) => {
    link.addEventListener('click', () => {
      state.category = link.dataset.footerCat;
      state.silhouetteFilter = null;
      renderCatalogControls();
      renderCatalogGrid();
    });
  });

  // Newsletter Validation
  dom.newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = dom.newsletterEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dom.newsletterMsg.textContent = '请输入有效的电子邮箱地址。';
      return;
    }
    dom.newsletterMsg.textContent = `已订阅成功，首单可在购物袋输入 SUKUO10 享九折礼遇。`;
    dom.newsletterEmail.value = '';
  });

  // Active Navigation Highlight via IntersectionObserver
  const sections = ['hero', 'lookbook', 'catalog', 'atelier', 'story']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.primary-nav .nav-link'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-32% 0px -55% 0px' }
    );
    sections.forEach((sec) => observer.observe(sec));
  }
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */
function init() {
  renderHero(false);
  renderLookbook();
  renderCatalogControls();
  renderCatalogGrid();
  renderAtelier();
  updateHeaderBadges();
  bindEvents();
}

init();
