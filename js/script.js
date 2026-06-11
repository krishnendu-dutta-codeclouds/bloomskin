/* ===========================
   BloomSkin — Interactive Logic
   =========================== */

'use strict';

/* ----- Base URL for images (works on GitHub Pages and local) ----- */
const BASE_URL = '.';
const IMG_PATH = `${BASE_URL}/images`;

/* ----- Product Data ----- */
const PRODUCTS = [
    { id: 1,  name: "Vitamin C Glow Serum",       brand: "BloomSkin",     cat: "skincare", price: 64,  mrp: 80,  rating: 4.8, reviews: 1284, badge: "bestseller", img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/skincare.png`, desc: "15% Vitamin C + Hyaluronic Acid for radiant skin." },
    { id: 2,  name: "Velvet Matte Lipstick",      brand: "ROUGE",      cat: "makeup",   price: 28,  mrp: 36,  rating: 4.7, reviews: 932,  badge: "new",        img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/makeup.png`, desc: "12-hour long-wear matte finish in 18 shades." },
    { id: 3,  name: "Hydra-Veil Moisturizer",     brand: "AQUA LUXE",  cat: "skincare", price: 48,  mrp: 60,  rating: 4.9, reviews: 2104, badge: "bestseller", img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/skincare-2.png`, desc: "72-hour deep hydration with ceramides." },
    { id: 4,  name: "Lash Drama Mascara",         brand: "ROUGE",      cat: "makeup",   price: 22,  mrp: 28,  rating: 4.6, reviews: 743,  badge: "",           img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/makeup-2.png`, desc: "Volumizing & lengthening, smudge-proof." },
    { id: 5,  name: "Silk Repair Hair Oil",       brand: "KAPOK",      cat: "hair",     price: 36,  mrp: 45,  rating: 4.7, reviews: 612,  badge: "new",        img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/hair.png`, desc: "Argan + rosehip oil for frizz-free shine." },
    { id: 6,  name: "Sunshield SPF 50 PA++++",    brand: "BloomSkin",     cat: "skincare", price: 38,  mrp: 48,  rating: 4.8, reviews: 1567, badge: "",           img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/skincare-3.png`, desc: "Lightweight, invisible, no white cast." },
    { id: 7,  name: "Glow Booster Drops",         brand: "AURA",       cat: "skincare", price: 42,  mrp: 52,  rating: 4.6, reviews: 489,  badge: "new",        img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/skincare-4.png`, desc: "Mix with foundation for instant luminosity." },
    { id: 8,  name: "Velvet Eye Shadow Palette",  brand: "ROUGE",      cat: "makeup",   price: 54,  mrp: 68,  rating: 4.9, reviews: 1102, badge: "bestseller", img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/makeup-3.png`, desc: "16 buttery shades from mattes to shimmers." },
    { id: 9,  name: "Detox Clay Mask",            brand: "PURE",       cat: "skincare", price: 32,  mrp: 40,  rating: 4.5, reviews: 678,  badge: "",           img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/skincare-4.png`, desc: "Kaolin & charcoal for pore-purifying detox." },
    { id: 10, name: "Satin Touch Blush",          brand: "ROUGE",      cat: "makeup",   price: 26,  mrp: 32,  rating: 4.7, reviews: 421,  badge: "",           img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/makeup-4.png`, desc: "Buildable natural flush, 6 shades." },
    { id: 11, name: "Keratin Smooth Shampoo",     brand: "KAPOK",      cat: "hair",     price: 28,  mrp: 35,  rating: 4.6, reviews: 892,  badge: "bestseller", img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/hair-2.png`, desc: "Sulfate-free, salon-grade smoothness." },
    { id: 12, name: "Oud Royale EDP 100ml",       brand: "MAISON N",   cat: "fragrance",price: 145, mrp: 180, rating: 4.9, reviews: 287,  badge: "new",        img: `https://krishnendu-dutta-codeclouds.github.io/bloomskin/images/fragrance.png` }
];
 
/* ----- State ----- */
const state = {
    cart: JSON.parse(localStorage.getItem('bloomskin_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('bloomskin_wishlist') || '[]'),
    currentFilter: 'all',
    currentSort: 'featured'
};

const save = () => {
    try {
        localStorage.setItem('bloomskin_cart', JSON.stringify(state.cart));
        localStorage.setItem('bloomskin_wishlist', JSON.stringify(state.wishlist));
    } catch (e) { console.warn('Storage error', e); }
};

/* ----- Helpers ----- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const fmt = n => `$${n.toFixed(2)}`;
const starStr = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const getProduct = id => PRODUCTS.find(p => p.id === +id);

const bumpBadge = (el) => {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
};

/* ----- Lenis Smooth Scroll ----- */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* Connect Lenis with GSAP ScrollTrigger */
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Global image fallback: replace broken images with a generic beauty image
document.addEventListener('error', (e) => {
    const el = e.target;
    if (el && el.tagName === 'IMG') {
        if (!el.dataset.fallbackApplied) {
            el.dataset.fallbackApplied = '1';
            el.src = 'https://source.unsplash.com/600x600/?beauty,product';
        }
    }
}, true);

/* =========================== Hero Carousel (deferred) =========================== */
let heroSwiperInstance = null;
function initHeroSwiper() {
    if (heroSwiperInstance) {
        try { heroSwiperInstance.destroy(true, true); } catch (e) {}
        heroSwiperInstance = null;
    }
    heroSwiperInstance = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        pagination: { el: '.hero-pagination', clickable: true },
        navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' }
    });
}

/* =========================== Brand Carousel =========================== */
let brandSwiperInstance = null;
function initBrandSwiper() {
    const slides = document.querySelectorAll('.brand-swiper .swiper-slide').length;
    const loop = slides > 1;
    if (brandSwiperInstance) {
        try { brandSwiperInstance.destroy(true, true); } catch (e) {}
        brandSwiperInstance = null;
    }
    brandSwiperInstance = new Swiper('.brand-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: loop,
        autoplay: loop ? { delay: 0, disableOnInteraction: false } : false,
        speed: 3000,
        breakpoints: {
            1100: { slidesPerView: 6 },
            900: { slidesPerView: 5 },
            600: { slidesPerView: 4 },
            380: { slidesPerView: 3 }
        }
    });
}
initBrandSwiper();

/* =========================== Testimonials Carousel =========================== */
let testimonialSwiperInstance = null;
function initTestimonialSwiper() {
    const container = document.querySelector('.testimonial-swiper');
    const slides = container ? container.querySelectorAll('.swiper-slide').length : 0;
    const targetSlidesPerView = window.innerWidth >= 900 ? 3 : 1;
    const loop = slides > targetSlidesPerView;
    if (testimonialSwiperInstance) {
        try { testimonialSwiperInstance.destroy(true, true); } catch (e) {}
        testimonialSwiperInstance = null;
    }
    testimonialSwiperInstance = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: loop,
        pagination: { el: '.testimonial-swiper ~ .swiper-pagination', clickable: true },
        breakpoints: {
            900: { slidesPerView: 3 }
        }
    });
}
initTestimonialSwiper();

// Debounced resize to re-init swipers when layout breakpoints change
let _resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
        initBrandSwiper();
        initTestimonialSwiper();
    }, 200);
});

/* =========================== Product Rendering =========================== */
function getSortedFiltered() {
    let list = state.currentFilter === 'all'
        ? [...PRODUCTS]
        : PRODUCTS.filter(p => p.cat === state.currentFilter);

    switch (state.currentSort) {
        case 'price-asc': list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'rating': list.sort((a, b) => b.rating - a.rating); break;
        case 'discount': list.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp); break;
        default: break;
    }
    return list;
}

/* =========================== QR Code Init =========================== */
function initAppQR() {
    const holder = document.getElementById('qrCode');
    if (!holder || typeof QRCode === 'undefined') return;
    // Clear any existing
    holder.innerHTML = '';
    // Generate QR for app landing (change to production link)
    const url = 'https://bloomskin.app';
    const q = new QRCode(holder, {
        text: url,
        width: 176,
        height: 176,
        colorDark: '#1a1a1a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    // After render, convert to canvas if image created
    setTimeout(() => {
        const canvas = holder.querySelector('canvas');
        if (canvas) {
            // apply subtle tint behind the QR using CSS background on parent
            holder.parentElement.style.background = 'linear-gradient(180deg,#fff 0%, #fff 60%)';
        }
        // place logo overlay (already present in DOM)
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    initAppQR();
});

function renderProducts() {
    const grid = $('#bestsellerGrid');
    if (!grid) return;
    const list = getSortedFiltered();
    $('#productCount').textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

    if (list.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-box-open"></i><p>No products in this category yet</p></div>`;
        return;
    }

    grid.innerHTML = list.map(p => {
        const inWish = state.wishlist.includes(p.id);
        const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
        const badgeText = p.badge === 'bestseller' ? '★ Bestseller' : p.badge === 'new' ? 'New In' : '';
        return `
        <article class="product-card" data-id="${p.id}" data-cat="${p.cat}">
            <div class="product-img-wrap">
                ${p.badge ? `<span class="product-badge ${p.badge}">${badgeText}</span>` : ''}
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="product-actions">
                    <button class="pa-btn wish-btn ${inWish ? 'active' : ''}" data-id="${p.id}" aria-label="Add to wishlist" title="Add to wishlist">
                        <i class="fa${inWish ? 's' : 'r'} fa-heart"></i>
                    </button>
                    <button class="pa-btn quick-view-trigger" data-id="${p.id}" aria-label="Quick view" title="Quick view">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </div>
                <button class="quick-view-btn quick-view-trigger" data-id="${p.id}">Quick View</button>
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-rating">
                    <span class="stars">${starStr(p.rating)}</span>
                    <span class="count">${p.rating} (${p.reviews})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">${fmt(p.price)}</span>
                    <span class="product-strike">${fmt(p.mrp)}</span>
                    <span class="product-off">${off}% off</span>
                </div>
                <button class="add-btn" data-id="${p.id}">
                    <i class="fa-solid fa-bag-shopping"></i> <span>Add to Bag</span>
                </button>
            </div>
        </article>`;
    }).join('');
    // Apply progressive image loading to newly rendered product images
    progressiveImages();
}

/* =========================== Tabs & Sort =========================== */
$$('#bestsellerTabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('#bestsellerTabs .tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        state.currentFilter = btn.dataset.tab;
        renderProducts();
    });
});

$('#sortSelect')?.addEventListener('change', e => {
    state.currentSort = e.target.value;
    renderProducts();
});

/* =========================== Product Grid Delegated Events =========================== */
$('#bestsellerGrid')?.addEventListener('click', e => {
    const wish = e.target.closest('.wish-btn');
    if (wish) { e.preventDefault(); toggleWishlist(+wish.dataset.id); return; }
    const qv = e.target.closest('.quick-view-trigger');
    if (qv) { e.preventDefault(); openQuickView(+qv.dataset.id); return; }
    const add = e.target.closest('.add-btn');
    if (add) { e.preventDefault(); addToCart(+add.dataset.id); return; }
});

/* =========================== Cart =========================== */
function addToCart(id, qty = 1) {
    id = +id;
    const item = state.cart.find(i => i.id === id);
    if (item) item.qty += qty;
    else state.cart.push({ id, qty });
    save();
    updateCartUI();
    openDrawer('cartDrawer');

    // brief "added" feedback on button
    const btn = document.querySelector(`.add-btn[data-id="${id}"]`);
    if (btn) {
        btn.classList.add('added');
        const span = btn.querySelector('span');
        const original = span?.textContent;
        if (span) span.textContent = 'Added ✓';
        setTimeout(() => {
            btn.classList.remove('added');
            if (span && original) span.textContent = original;
        }, 1200);
    }

    toast('Added to bag');
}

function changeQty(id, delta) {
    id = +id;
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
    save();
    updateCartUI();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(i => i.id !== +id);
    save();
    updateCartUI();
}

function updateCartUI() {
    const count = state.cart.reduce((a, b) => a + b.qty, 0);
    const subtotal = state.cart.reduce((a, b) => {
        const p = getProduct(b.id);
        return a + (p ? p.price * b.qty : 0);
    }, 0);

    setBadge('#cartCount', count);
    setBadge('#bnCartBadge', count);
    $('#cartDrawerCount').textContent = `(${count})`;
    $('#cartSubtotal').textContent = fmt(subtotal);
    $('#cartTotal').textContent = fmt(subtotal);
    renderCartItems();
}

function setBadge(sel, n) {
    const el = $(sel);
    if (!el) return;
    el.textContent = n;
    el.setAttribute('data-zero', n > 0 ? 'false' : 'true');
    if (n > 0) bumpBadge(el);
}

function renderCartItems() {
    const el = $('#cartItems');
    if (!el) return;
    if (state.cart.length === 0) {
        el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-bag-shopping"></i><p>Your bag is empty</p><a href="#shop" class="btn btn-solid" data-close-drawer="cartDrawer">Start Shopping</a></div>`;
        return;
    }
    el.innerHTML = state.cart.map(i => {
        const p = getProduct(i.id);
        if (!p) return '';
        return `
        <div class="cart-item">
            <img src="${p.img}" alt="${p.name}">
            <div class="cart-item-info">
                <b>${p.name}</b>
                <span>${p.brand}</span>
                <div class="qty">
                    <button data-qty="${p.id}" data-delta="-1" aria-label="Decrease">−</button>
                    <span>${i.qty}</span>
                    <button data-qty="${p.id}" data-delta="1" aria-label="Increase">+</button>
                </div>
            </div>
            <div class="cart-item-side">
                <b>${fmt(p.price * i.qty)}</b>
                <button data-remove="${p.id}" aria-label="Remove"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>`;
    }).join('');
}

$('#cartItems')?.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) { changeQty(q.dataset.qty, +q.dataset.delta); return; }
    const r = e.target.closest('[data-remove]');
    if (r) { removeFromCart(r.dataset.remove); return; }
    const c = e.target.closest('[data-close-drawer]');
    if (c) { e.preventDefault(); closeDrawer(c.dataset.closeDrawer); }
});

/* =========================== Wishlist =========================== */
function toggleWishlist(id) {
    id = +id;
    if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter(x => x !== id);
        toast('Removed from wishlist');
    } else {
        state.wishlist.push(id);
        toast('Added to wishlist ♥');
    }
    save();
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    setBadge('#wishlistCount', state.wishlist.length);
    $('#wishlistDrawerCount').textContent = `(${state.wishlist.length})`;
    const el = $('#wishlistItems');
    if (!el) return;
    if (state.wishlist.length === 0) {
        el.innerHTML = `<div class="empty-state"><i class="fa-regular fa-heart"></i><p>No items saved yet</p><a href="#shop" class="btn btn-solid" data-close-drawer="wishlistDrawer">Discover Products</a></div>`;
        return;
    }
    el.innerHTML = state.wishlist.map(id => {
        const p = getProduct(id);
        if (!p) return '';
        return `
        <div class="cart-item">
            <img src="${p.img}" alt="${p.name}">
            <div class="cart-item-info">
                <b>${p.name}</b>
                <span>${p.brand} · ${fmt(p.price)}</span>
            </div>
            <div class="cart-item-side">
                <button data-wish-remove="${p.id}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button>
                <button class="btn btn-solid" style="padding:6px 14px;font-size:12px" data-move-to-bag="${p.id}">Move to Bag</button>
            </div>
        </div>`;
    }).join('');
}

$('#wishlistItems')?.addEventListener('click', e => {
    const rm = e.target.closest('[data-wish-remove]');
    if (rm) { toggleWishlist(rm.dataset.wishRemove); return; }
    const mv = e.target.closest('[data-move-to-bag]');
    if (mv) { addToCart(mv.dataset.moveToBag); toggleWishlist(mv.dataset.moveToBag); return; }
    const c = e.target.closest('[data-close-drawer]');
    if (c) { e.preventDefault(); closeDrawer(c.dataset.closeDrawer); }
});

/* =========================== Drawers =========================== */
function openDrawer(id) {
    const drawer = $('#' + id);
    if (!drawer) return;
    $('#drawerBackdrop').classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeDrawer(id) {
    const drawer = $('#' + id);
    if (!drawer) return;
    $('#drawerBackdrop').classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
}
function closeAllDrawers() {
    $$('.drawer.active').forEach(d => d.classList.remove('active'));
    $('#drawerBackdrop')?.classList.remove('active');
    document.body.style.overflow = '';
}

$('#cartBtn')?.addEventListener('click', () => openDrawer('cartDrawer'));
$('#closeCart')?.addEventListener('click', () => closeDrawer('cartDrawer'));
$('#wishlistBtn')?.addEventListener('click', () => openDrawer('wishlistDrawer'));
$('#closeWishlist')?.addEventListener('click', () => closeDrawer('wishlistDrawer'));
$('#bnCart')?.addEventListener('click', () => openDrawer('cartDrawer'));
$('#drawerBackdrop')?.addEventListener('click', closeAllDrawers);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeAllDrawers();
        closeQuickView();
        closeSearchModal();
    }
});

/* =========================== Quick View Modal =========================== */
function openQuickView(id) {
    const p = getProduct(id);
    if (!p) return;
    const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const inWish = state.wishlist.includes(p.id);
    const shades = ['#e85a8a', '#c84777', '#1a1a1a', '#d4af7a', '#2dbe7c', '#6b4f3a'];
    $('#quickViewBody').innerHTML = `

    /* =========================== Progressive Image Loading =========================== */
    function progressiveImages() {
        const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="100%" height="100%" fill="%23f5f3f6"/></svg>';
        const imgs = Array.from(document.querySelectorAll('img:not([data-ignore-progressive])'));
        imgs.forEach(img => {
            // already handled
            if (img.dataset.progressive === 'done') return;
            // store original source
            if (!img.dataset.src) img.dataset.src = img.src || '';
            // skip if no real src
            if (!img.dataset.src) return;
            // set placeholder only if not already placeholder
            if (img.src && !img.dataset.placeholderApplied) {
                img.dataset.placeholderApplied = '1';
                img.src = placeholder;
                img.classList.add('progressive', 'img-placeholder');
            }
            // load high-res
            const hi = new Image();
            hi.src = img.dataset.src;
            hi.onload = () => {
                img.src = hi.src;
                img.classList.remove('img-placeholder');
                img.classList.add('loaded');
                // remove blur after small delay so transition is visible
                setTimeout(() => { img.classList.remove('progressive'); img.dataset.progressive = 'done'; }, 60);
            };
            hi.onerror = () => { img.dataset.progressive = 'error'; };
        });
    }

        <img src="${p.img}" alt="${p.name}">
        <div>
            <div class="product-brand">${p.brand}</div>
            <h2 class="product-name">${p.name}</h2>
            <div class="product-rating">
                <span class="stars">${starStr(p.rating)}</span>
                <span class="count">${p.rating} · ${p.reviews} reviews</span>
            </div>
            <div class="product-price-row" style="margin:12px 0 8px">
                <span class="product-price">${fmt(p.price)}</span>
                <span class="product-strike">${fmt(p.mrp)}</span>
                <span class="product-off">${off}% off</span>
            </div>
            <p class="product-desc">${p.desc} Crafted with clinically-tested ingredients and sustainably sourced botanicals. Free from parabens, sulfates and synthetic fragrance.</p>
            <div><b style="font-size:13px">Shade:</b></div>
            <div class="shade-row" id="shadeRow">
                ${shades.map((c, i) => `<div class="shade ${i === 0 ? 'active' : ''}" style="background:${c}" data-shade></div>`).join('')}
            </div>
            <div style="display:flex;gap:10px;margin-top:18px">
                <button class="btn btn-solid" style="flex:1" data-qv-add="${p.id}"><i class="fa-solid fa-bag-shopping"></i> Add to Bag</button>
                <button class="btn btn-ghost" data-qv-wish="${p.id}" aria-label="Wishlist"><i class="fa${inWish ? 's' : 'r'} fa-heart"></i></button>
            </div>
            <div style="margin-top:18px;font-size:12px;color:var(--text-muted);display:flex;gap:14px;flex-wrap:wrap">
                <span><i class="fa-solid fa-truck-fast"></i> Free shipping</span>
                <span><i class="fa-solid fa-rotate-left"></i> 30-day returns</span>
                <span><i class="fa-solid fa-shield-halved"></i> Authentic</span>
            </div>
        </div>`;
    $('#quickView').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeQuickView() {
    $('#quickView')?.classList.remove('active');
    if (!$$('.drawer.active, .modal.active, .search-modal.active').length) {
        document.body.style.overflow = '';
    }
}
$('#closeQuickView')?.addEventListener('click', closeQuickView);
$('#quickView')?.addEventListener('click', e => {
    if (e.target.id === 'quickView') closeQuickView();
    const shade = e.target.closest('[data-shade]');
    if (shade) {
        $$('#shadeRow [data-shade]').forEach(s => s.classList.remove('active'));
        shade.classList.add('active');
    }
    const add = e.target.closest('[data-qv-add]');
    if (add) { addToCart(add.dataset.qvAdd); closeQuickView(); }
    const wish = e.target.closest('[data-qv-wish]');
    if (wish) { toggleWishlist(wish.dataset.qvWish); openQuickView(wish.dataset.qvWish); }
});

/* =========================== Search (Desktop + Mobile) =========================== */
const searchInput = $('#searchInput');
const searchSugg = $('#searchSuggestions');
const searchModalInput = $('#searchModalInput');
const searchModalResults = $('#searchModalResults');

function searchProducts(q) {
    q = (q || '').toLowerCase().trim();
    if (!q) return [];
    return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q)
    ).slice(0, 6);
}

function renderDesktopSearch(q) {
    const matches = searchProducts(q);
    if (matches.length === 0) { searchSugg?.classList.remove('active'); return; }
    searchSugg.innerHTML = matches.map(p =>
        `<a href="#" data-search-open="${p.id}">
            <img src="${p.img}" alt=""><div><b>${p.name}</b><div style="font-size:12px;color:var(--text-muted)">${p.brand} · ${fmt(p.price)}</div></div>
        </a>`).join('');
    searchSugg.classList.add('active');
}

function renderModalSearch(q) {
    if (!searchModalResults) return;
    const matches = searchProducts(q);
    if (matches.length === 0) {
        searchModalResults.innerHTML = `<div class="empty-state" style="padding:30px 0"><i class="fa-solid fa-magnifying-glass"></i><p>No products found</p></div>`;
        return;
    }
    searchModalResults.innerHTML = matches.map(p =>
        `<a href="#" data-search-open="${p.id}">
            <img src="${p.img}" alt="">
            <div style="flex:1">
                <b>${p.name}</b>
                <div class="price">${fmt(p.price)}</div>
            </div>
        </a>`).join('');
}

searchInput?.addEventListener('input', e => renderDesktopSearch(e.target.value));
searchModalInput?.addEventListener('input', e => renderModalSearch(e.target.value));

document.addEventListener('click', e => {
    const open = e.target.closest('[data-search-open]');
    if (open) {
        e.preventDefault();
        openQuickView(open.dataset.searchOpen);
        searchSugg?.classList.remove('active');
        closeSearchModal();
        return;
    }
    if (!e.target.closest('.search-bar')) searchSugg?.classList.remove('active');
});

/* Mobile search modal */
function openSearchModal() {
    $('#searchModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchModalInput?.focus(), 100);
}
function closeSearchModal() {
    $('#searchModal')?.classList.remove('active');
    if (searchModalInput) searchModalInput.value = '';
    if (searchModalResults) {
        searchModalResults.innerHTML = `<div class="empty-state" style="padding:30px 0"><i class="fa-solid fa-magnifying-glass"></i><p>Start typing to find products</p></div>`;
    }
    if (!$$('.drawer.active, .modal.active').length) document.body.style.overflow = '';
}
$('#mobileSearchBtn')?.addEventListener('click', openSearchModal);
$('#closeSearchModal')?.addEventListener('click', closeSearchModal);
$('#searchModal')?.addEventListener('click', e => {
    if (e.target.id === 'searchModal') closeSearchModal();
});

/* =========================== Mobile Menu =========================== */
const navBackdrop = $('#navBackdrop');
function openMobileNav() {
    const nav = $('#mainNav');
    if (!nav) return;
    nav.classList.add('open');
    navBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('nav-open');
}
function closeMobileNav() {
    const nav = $('#mainNav');
    if (!nav) return;
    nav.classList.remove('open');
    navBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('nav-open');
}

$('#menuToggle')?.addEventListener('click', openMobileNav);
$('#menuClose')?.addEventListener('click', closeMobileNav);

// Backdrop click closes mobile nav
navBackdrop?.addEventListener('click', closeMobileNav);

// Click outside the panel to close mobile menu (keeps backdrop in sync)
document.addEventListener('click', e => {
    const nav = $('#mainNav');
    if (!nav || !nav.classList.contains('open')) return;
    if (window.innerWidth > 1100) return;
    if (e.target.closest('#mainNav') || e.target.closest('#menuToggle')) return;
    closeMobileNav();
});

$$('.nav-item > a').forEach(a => {
    a.addEventListener('click', e => {
        const menu = a.parentElement.querySelector('.mega-menu');
        if (window.innerWidth <= 1100 && menu) {
            e.preventDefault();
            a.parentElement.classList.toggle('open');
        }
    });
});

// Close mobile menu when a non-mega link is clicked
$$('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
        if (window.innerWidth > 1100) return;
        if (e.target.closest('.mega-menu')) return;
        const a = e.target.closest('a');
        if (a && !a.parentElement.querySelector('.mega-menu')) {
            $('#mainNav')?.classList.remove('open');
        }
    });
});

/* =========================== Countdown =========================== */
function startCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 2);
    target.setHours(target.getHours() + 14);
    const update = () => {
        const diff = target - new Date();
        if (diff < 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const el = $('#countdown');
        if (el) el.textContent = `${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    };
    update();
    setInterval(update, 1000);
}

/* =========================== Header scroll =========================== */
window.addEventListener('scroll', () => {
    $('#header')?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* =========================== Newsletter =========================== */
$('#newsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Subscribed! Check your inbox for 15% off 🎉');
    e.target.reset();
});

/* =========================== Toast =========================== */
let toastTimer;
function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* =========================== Consultation Slots =========================== */
$$('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
        $$('.slot').forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        toast(`Slot selected: ${slot.querySelector('b')?.textContent}`);
    });
});

/* =========================== Bottom Nav Active State =========================== */
$$('.bn-item, .bn-center').forEach(item => {
    item.addEventListener('click', () => {
        $$('.bn-item').forEach(b => b.classList.remove('active'));
        if (item.classList.contains('bn-item')) item.classList.add('active');
    });
});

/* =========================== GSAP Reveal Animations =========================== */
function reveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section-head, .service-item, .category-card, .product-card, .brand-card, .editorial-card, .testimonial, .consult-card').forEach((el, i) => {
        gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            delay: (i % 6) * 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%' }
        });
    });
}

/* =========================== Init =========================== */
document.addEventListener('DOMContentLoaded', () => {
    // Render initial content quickly so skeleton can be replaced
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    startCountdown();
    // keep reveal deferred until after full load for smoother entrance
    // show skeleton loader (already present in DOM)
});

// Orchestrate what happens once all resources are loaded
window.addEventListener('load', () => {
    const loader = document.getElementById('siteLoader');
    const body = document.body;
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    // Fade out spinner, then the loader overlay
    tl.to('.loader-spinner', { rotation: 360, duration: 0.6, repeat: 1 })
      .to(loader, { y: -40, opacity: 0, duration: 0.6, onComplete() {
          loader.setAttribute('aria-hidden', 'true');
      }}, '>-0.2')
      .add(() => {
          body.classList.add('site-ready');
      });

    // Initialize interactive pieces after the loader is hidden
    tl.add(() => {
        initAppQR();
        initBrandSwiper();
        initTestimonialSwiper();
        initHeroSwiper();
        reveal();
    }, '>-0.1');
});
