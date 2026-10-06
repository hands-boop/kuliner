/**
 * MIDORI — Artisan Matcha & Boba Atelier
 * Frontend Interactive System: Products, Cart, Currency, Customization & WhatsApp Order
 */

// 1. Menu Items Data
const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Matcha Latte with Boba',
    category: 'matcha',
    badge: '#1 TOP PICK',
    priceIdr: 48000,
    priceUsd: 5.75,
    image: 'assets/images/matcha-latte.jpg',
    desc: 'Ceremonial grade Uji matcha dipadukan dengan susu segar lembut dan boba mutiara hangat dimasak dengan gula aren murni.',
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'Fresh Dairy'
  },
  {
    id: 'm2',
    name: 'Brown Sugar Tiger Milk Tea',
    category: 'boba',
    badge: 'FAVORITE',
    priceIdr: 45000,
    priceUsd: 5.50,
    image: 'assets/images/brown-sugar.jpg',
    desc: 'Slow-cooked chewy tapioca pearls diselimuti karamel gula aren pekat bermotif tiger stripe dengan susu creamy dingin.',
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'Fresh Dairy'
  },
  {
    id: 'm3',
    name: 'Strawberry Matcha Latte',
    category: 'matcha',
    badge: 'NEW',
    priceIdr: 52000,
    priceUsd: 5.95,
    image: 'assets/images/strawberry-matcha.jpg',
    desc: 'Tiga lapisan cantik: puree stroberi asli di dasar, susu segar gurih, dan lapisan pekat ceremonial Uji matcha dengan boba kenyal.',
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'Fresh Dairy'
  },
  {
    id: 'm4',
    name: 'Iced Coffee with Boba',
    category: 'coffee',
    badge: 'BARISTA SPEC',
    priceIdr: 42000,
    priceUsd: 5.25,
    image: 'assets/images/iced-coffee.jpg',
    desc: 'Double shot espresso blend Nusantara dengan boba gula aren hangat dan sea salt caramel cream foam di puncaknya.',
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'Fresh Dairy'
  },
  {
    id: 'm5',
    name: 'Mango Passion Jasmine Tea',
    category: 'fruit',
    badge: 'REFRESHING',
    priceIdr: 39000,
    priceUsd: 4.85,
    image: 'assets/images/mango-passion.jpg',
    desc: 'Seduhan teh hijau melati pegunungan dengan bulir mangga ranum, markisa segar, dan crystal jelly boba yang renyah.',
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'None'
  },
  {
    id: 'm6',
    name: 'Uji Matcha Pure Tea',
    category: 'matcha',
    badge: 'CEREMONIAL',
    priceIdr: 40000,
    priceUsd: 4.90,
    image: 'assets/images/hero-drinks.jpg',
    desc: 'Matcha murni khas tradisi chanoyu Jepang tanpa pemanis, dikocok chasen hingga menghasilkan buih sutra mikro yang lembut.',
    sugar: '0%',
    ice: 'No Ice',
    milk: 'None'
  }
];

// App State
const state = {
  currency: 'IDR', // 'IDR' or 'USD'
  rateIdrToUsd: 0.000062,
  cart: [],
  discountPercent: 0, // from coupon
  couponApplied: '',
  selectedProductForModal: null,
  activeFilter: 'all'
};

// DOM References
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartCountBadge = document.getElementById('cartCountBadge');
const mobileCartBadge = document.getElementById('mobileCartBadge');
const drawerItemCount = document.getElementById('drawerItemCount');
const cartEmptyState = document.getElementById('cartEmptyState');
const cartItemsList = document.getElementById('cartItemsList');
const cartDrawerFooter = document.getElementById('cartDrawerFooter');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartDiscountEl = document.getElementById('cartDiscount');
const discountLineEl = document.getElementById('discountLine');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const couponCodeInput = document.getElementById('couponCodeInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const toastContainer = document.getElementById('toastContainer');

// Currency Toggles
const currIdrBtn = document.getElementById('currIdrBtn');
const currUsdBtn = document.getElementById('currUsdBtn');

// Mobile Nav
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const mobileCartOpenBtn = document.getElementById('mobileCartOpenBtn');

// Customization Modal
const customModal = document.getElementById('customModal');
const customModalBackdrop = document.getElementById('customModalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalDrinkImg = document.getElementById('modalDrinkImg');
const modalPillBadge = document.getElementById('modalPillBadge');
const modalDrinkTitle = document.getElementById('modalDrinkTitle');
const modalDrinkDesc = document.getElementById('modalDrinkDesc');
const modalDrinkPrice = document.getElementById('modalDrinkPrice');
const modalQtyNum = document.getElementById('modalQtyNum');
const modalMinusQtyBtn = document.getElementById('modalMinusQtyBtn');
const modalPlusQtyBtn = document.getElementById('modalPlusQtyBtn');
const modalAddCartBtn = document.getElementById('modalAddCartBtn');
const modalAddPriceText = document.getElementById('modalAddPriceText');

// Locations Modal
const locationsModal = document.getElementById('locationsModal');
const locationsModalBackdrop = document.getElementById('locationsModalBackdrop');
const closeLocationsModalBtn = document.getElementById('closeLocationsModalBtn');
const locationsValItem = document.getElementById('locationsValItem');
const findStoreBtn = document.getElementById('findStoreBtn');
const viewAllLocationsFooter = document.getElementById('viewAllLocationsFooter');

// Helper: Format Price
function formatCurrency(amountIdr, amountUsd) {
  if (state.currency === 'USD') {
    const val = amountUsd !== undefined ? amountUsd : (amountIdr * state.rateIdrToUsd);
    return `$${val.toFixed(2)}`;
  }
  return `Rp ${Number(amountIdr).toLocaleString('id-ID')}`;
}

// 2. Render Products
function renderProducts() {
  const filtered = state.activeFilter === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === state.activeFilter);

  productsGrid.innerHTML = filtered.map(item => {
    const priceStr = formatCurrency(item.priceIdr, item.priceUsd);
    const badgeClass = item.badge === 'NEW' ? 'new' : '';
    
    return `
      <article class="product-card" data-id="${item.id}">
        <div class="product-thumb-wrap" onclick="openCustomizeModal('${item.id}')">
          <img src="${item.image}" alt="${item.name}" class="product-thumb" loading="lazy">
          <span class="product-badge ${badgeClass}">${item.badge}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title" onclick="openCustomizeModal('${item.id}')" style="cursor: pointer;">${item.name}</h3>
          <p class="product-desc">${item.desc}</p>
          <div class="product-footer">
            <span class="product-price">${priceStr}</span>
            <button type="button" class="btn-add-circle" onclick="quickAddToCart('${item.id}')" title="Tambah ke Pesanan" aria-label="Tambah ${item.name}">
              +
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// 3. Category Filter
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.activeFilter = tab.getAttribute('data-category');
    renderProducts();
  });
});

// Footer category filter link support
document.querySelectorAll('.filter-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = link.getAttribute('data-cat');
    state.activeFilter = cat;
    filterTabs.forEach(t => {
      if (t.getAttribute('data-category') === cat) t.classList.add('active');
      else t.classList.remove('active');
    });
    renderProducts();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  });
});

// 4. Currency Switcher
function setCurrency(curr) {
  state.currency = curr;
  if (curr === 'IDR') {
    currIdrBtn.classList.add('active');
    currUsdBtn.classList.remove('active');
  } else {
    currUsdBtn.classList.add('active');
    currIdrBtn.classList.remove('active');
  }
  renderProducts();
  updateCartDrawer();
  if (state.selectedProductForModal) {
    updateModalPriceCalc();
  }
  showToast(`Mata uang diubah ke ${curr === 'IDR' ? 'Rupiah (Rp)' : 'US Dollar ($)'}`);
}

currIdrBtn.addEventListener('click', () => setCurrency('IDR'));
currUsdBtn.addEventListener('click', () => setCurrency('USD'));

// 5. Toast Notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🍵</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 6. Cart Drawer Operations
function openCart() {
  cartDrawer.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);
if (mobileCartOpenBtn) {
  mobileCartOpenBtn.addEventListener('click', () => {
    closeMobileDrawer();
    openCart();
  });
}

function quickAddToCart(productId) {
  const product = MENU_ITEMS.find(p => p.id === productId);
  if (!product) return;

  const cartItem = {
    cartId: Date.now() + Math.random().toString(36).substring(2, 6),
    id: product.id,
    name: product.name,
    image: product.image,
    priceIdr: product.priceIdr,
    priceUsd: product.priceUsd,
    sugar: '75%',
    ice: 'Normal Ice',
    milk: 'Fresh Dairy',
    toppings: ['Golden Boba'],
    qty: 1
  };

  state.cart.push(cartItem);
  updateCartDrawer();
  showToast(`Ditambahkan: ${product.name}`);
}

function updateCartDrawer() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountBadge.textContent = totalCount;
  if (mobileCartBadge) mobileCartBadge.textContent = totalCount;
  drawerItemCount.textContent = `${totalCount} Item`;

  if (state.cart.length === 0) {
    cartEmptyState.style.display = 'flex';
    cartItemsList.style.display = 'none';
    cartDrawerFooter.style.display = 'none';
    return;
  }

  cartEmptyState.style.display = 'none';
  cartItemsList.style.display = 'flex';
  cartDrawerFooter.style.display = 'block';

  // Render items
  cartItemsList.innerHTML = state.cart.map(item => {
    const unitPrice = state.currency === 'USD' ? item.priceUsd : item.priceIdr;
    const itemTotalFormatted = formatCurrency(item.priceIdr * item.qty, item.priceUsd * item.qty);
    const toppingsStr = item.toppings && item.toppings.length ? ` • ${item.toppings.join(', ')}` : '';
    const specsStr = `${item.sugar} gula • ${item.ice} • ${item.milk}${toppingsStr}`;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-specs">${specsStr}</p>
          <span class="cart-item-price">${itemTotalFormatted}</span>
          <div class="cart-item-ctrls">
            <button type="button" class="cart-qty-btn" onclick="changeQty('${item.cartId}', -1)">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button type="button" class="cart-qty-btn" onclick="changeQty('${item.cartId}', 1)">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" onclick="removeCartItem('${item.cartId}')" aria-label="Hapus">&times;</button>
      </div>
    `;
  }).join('');

  // Calculate totals
  const subtotalIdr = state.cart.reduce((sum, item) => sum + (item.priceIdr * item.qty), 0);
  const subtotalUsd = state.cart.reduce((sum, item) => sum + (item.priceUsd * item.qty), 0);

  const discountIdr = Math.round(subtotalIdr * (state.discountPercent / 100));
  const discountUsd = Number((subtotalUsd * (state.discountPercent / 100)).toFixed(2));

  const totalIdr = subtotalIdr - discountIdr;
  const totalUsd = Math.max(0, subtotalUsd - discountUsd);

  cartSubtotalEl.textContent = formatCurrency(subtotalIdr, subtotalUsd);

  if (state.discountPercent > 0) {
    discountLineEl.style.display = 'flex';
    cartDiscountEl.textContent = `-${formatCurrency(discountIdr, discountUsd)}`;
  } else {
    discountLineEl.style.display = 'none';
  }

  cartTotalEl.textContent = formatCurrency(totalIdr, totalUsd);
}

function changeQty(cartId, delta) {
  const index = state.cart.findIndex(i => i.cartId === cartId);
  if (index > -1) {
    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
    }
    updateCartDrawer();
  }
}

function removeCartItem(cartId) {
  state.cart = state.cart.filter(i => i.cartId !== cartId);
  updateCartDrawer();
  showToast('Item dihapus dari pesanan');
}

// 7. Coupon Discount
applyCouponBtn.addEventListener('click', () => {
  const code = couponCodeInput.value.trim().toUpperCase();
  if (code === 'MIDORI20') {
    state.discountPercent = 20;
    state.couponApplied = 'MIDORI20';
    showToast('Promo MIDORI20 aktif! Diskon 20% diterapkan.');
  } else {
    state.discountPercent = 0;
    state.couponApplied = '';
    showToast('Kode promo tidak valid atau sudah kedaluwarsa.');
  }
  updateCartDrawer();
});

// 8. Customization Modal Logic
let modalState = {
  product: null,
  qty: 1,
  sugar: '75%',
  ice: 'Normal Ice',
  milk: 'Fresh Dairy',
  toppings: ['Brown Sugar Boba'],
  extraCostIdr: 5000,
  extraCostUsd: 0.50
};

function openCustomizeModal(productId) {
  const product = MENU_ITEMS.find(p => p.id === productId);
  if (!product) return;

  modalState.product = product;
  modalState.qty = 1;
  modalState.sugar = '75%';
  modalState.ice = 'Normal Ice';
  modalState.milk = 'Fresh Dairy';
  modalState.toppings = ['Brown Sugar Boba'];

  modalDrinkImg.src = product.image;
  modalDrinkTitle.textContent = product.name;
  modalDrinkDesc.textContent = product.desc;
  modalPillBadge.textContent = product.badge;
  modalQtyNum.textContent = '1';

  // Reset UI selectors
  setupPillGroup('#sugarSelectors', val => { modalState.sugar = val; });
  setupPillGroup('#iceSelectors', val => { modalState.ice = val; });
  setupPillGroup('#milkSelectors', val => {
    modalState.milk = val;
    updateModalPriceCalc();
  });

  // Reset checkboxes
  document.querySelectorAll('#toppingSelectors input').forEach(cb => {
    cb.checked = cb.value === 'Brown Sugar Boba';
    cb.onchange = () => updateModalPriceCalc();
  });

  updateModalPriceCalc();

  customModal.classList.add('open');
  customModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setupPillGroup(selector, onSelect) {
  const container = document.querySelector(selector);
  const pills = container.querySelectorAll('.pill-opt');
  pills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.getAttribute('data-val') === '75%' ||
        pill.getAttribute('data-val') === 'Normal Ice' ||
        pill.getAttribute('data-val') === 'Fresh Dairy') {
      pill.classList.add('active');
    }

    pill.onclick = () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      onSelect(pill.getAttribute('data-val'));
    };
  });
}

function updateModalPriceCalc() {
  if (!modalState.product) return;

  let extraIdr = 0;
  let extraUsd = 0;

  // Milk surcharge
  if (modalState.milk.includes('Oat Milk')) {
    extraIdr += 6000;
    extraUsd += 0.60;
  } else if (modalState.milk.includes('Almond Milk')) {
    extraIdr += 7000;
    extraUsd += 0.70;
  }

  // Topping surcharges
  const selectedToppings = [];
  document.querySelectorAll('#toppingSelectors input:checked').forEach(cb => {
    selectedToppings.push(cb.value);
    if (cb.value === 'Brown Sugar Boba') {
      extraIdr += 5000;
      extraUsd += 0.50;
    } else if (cb.value === 'Cheese Sea Salt Foam') {
      extraIdr += 7000;
      extraUsd += 0.70;
    } else if (cb.value === 'Matcha Jelly') {
      extraIdr += 5000;
      extraUsd += 0.50;
    }
  });

  modalState.toppings = selectedToppings;
  modalState.extraCostIdr = extraIdr;
  modalState.extraCostUsd = extraUsd;

  const singleIdr = modalState.product.priceIdr + extraIdr;
  const singleUsd = modalState.product.priceUsd + extraUsd;
  const totalItemCostIdr = singleIdr * modalState.qty;
  const totalItemCostUsd = singleUsd * modalState.qty;

  modalDrinkPrice.textContent = formatCurrency(singleIdr, singleUsd);
  modalAddPriceText.textContent = formatCurrency(totalItemCostIdr, totalItemCostUsd);
}

function closeCustomModal() {
  customModal.classList.remove('open');
  customModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeCustomModal);
customModalBackdrop.addEventListener('click', closeCustomModal);

modalMinusQtyBtn.addEventListener('click', () => {
  if (modalState.qty > 1) {
    modalState.qty--;
    modalQtyNum.textContent = modalState.qty;
    updateModalPriceCalc();
  }
});

modalPlusQtyBtn.addEventListener('click', () => {
  modalState.qty++;
  modalQtyNum.textContent = modalState.qty;
  updateModalPriceCalc();
});

modalAddCartBtn.addEventListener('click', () => {
  if (!modalState.product) return;

  const itemPriceIdr = modalState.product.priceIdr + modalState.extraCostIdr;
  const itemPriceUsd = modalState.product.priceUsd + modalState.extraCostUsd;

  state.cart.push({
    cartId: Date.now() + Math.random().toString(36).substring(2, 6),
    id: modalState.product.id,
    name: modalState.product.name,
    image: modalState.product.image,
    priceIdr: itemPriceIdr,
    priceUsd: itemPriceUsd,
    sugar: modalState.sugar,
    ice: modalState.ice,
    milk: modalState.milk,
    toppings: [...modalState.toppings],
    qty: modalState.qty
  });

  updateCartDrawer();
  closeCustomModal();
  openCart();
  showToast(`${modalState.qty}x ${modalState.product.name} ditambahkan`);
});

// 9. WhatsApp Checkout Generation
checkoutBtn.addEventListener('click', () => {
  if (state.cart.length === 0) return;

  let message = `Halo Barista MIDORI Atelier! 🍵%0A%0ASaya ingin memesan minuman:%0A`;
  
  state.cart.forEach((item, idx) => {
    const formattedPrice = state.currency === 'USD'
      ? `$${(item.priceUsd * item.qty).toFixed(2)}`
      : `Rp ${(item.priceIdr * item.qty).toLocaleString('id-ID')}`;
    
    const toppingsStr = item.toppings.length ? `Topping: ${item.toppings.join(', ')}` : 'No Toppings';
    message += `%0A${idx + 1}. *${item.name}* (${item.qty}x)%0A   - Gula: ${item.sugar}, Es: ${item.ice}%0A   - Susu: ${item.milk}%0A   - ${toppingsStr}%0A   - Subtotal: ${formattedPrice}%0A`;
  });

  const subtotalIdr = state.cart.reduce((s, i) => s + (i.priceIdr * i.qty), 0);
  const discountIdr = Math.round(subtotalIdr * (state.discountPercent / 100));
  const finalIdr = subtotalIdr - discountIdr;

  if (state.discountPercent > 0) {
    message += `%0A*Diskon Promo (${state.couponApplied}):* Rp ${discountIdr.toLocaleString('id-ID')}`;
  }
  message += `%0A*TOTAL ESTIMASI:* Rp ${finalIdr.toLocaleString('id-ID')}%0A%0AMohon info ketersediaan dan metode pengantaran. Terima kasih! 🌿`;

  // Pre-configured WhatsApp number
  const waUrl = `https://wa.me/6281234567890?text=${message}`;
  window.open(waUrl, '_blank');
});

// 10. Locations Modal
function openLocationsModal() {
  locationsModal.classList.add('open');
  locationsModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLocationsModal() {
  locationsModal.classList.remove('open');
  locationsModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

[locationsValItem, findStoreBtn, viewAllLocationsFooter].forEach(el => {
  if (el) el.addEventListener('click', openLocationsModal);
});
closeLocationsModalBtn.addEventListener('click', closeLocationsModal);
locationsModalBackdrop.addEventListener('click', closeLocationsModal);

// Rewards club click
const rewardsValItem = document.getElementById('rewardsValItem');
if (rewardsValItem) {
  rewardsValItem.addEventListener('click', () => {
    showToast('🎁 Program Hadiah: Dapatkan 1 Stamp tiap pembelian boba!');
  });
}

// 11. Mobile Drawer Navigation
function openMobileDrawer() {
  mobileDrawer.classList.add('open');
  mobileBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  mobileDrawer.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

mobileMenuToggle.addEventListener('click', openMobileDrawer);
closeDrawerBtn.addEventListener('click', closeMobileDrawer);
mobileBackdrop.addEventListener('click', closeMobileDrawer);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileDrawer();
  });
});

// 12. Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
const newsletterInput = document.getElementById('newsletterInput');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterInput.value.trim();
  if (email) {
    showToast(`Terima kasih! Voucher diskon 25% telah dikirim ke ${email}`);
    newsletterInput.value = '';
  }
});

// Start Shopping button in empty cart
const startShoppingBtn = document.getElementById('startShoppingBtn');
if (startShoppingBtn) {
  startShoppingBtn.addEventListener('click', () => {
    closeCart();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  });
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartDrawer();
});
