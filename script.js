// Data: Menu of L’olivo
const menu = [
  {
    id: 'sandwiches-signature',
    title: '🥪 سندويتشات مميزة',
    description: 'اختيار من أفضل السندويتشات بطابع لوليفو',
    items: [
      { id: 'special-sandwich', name: "L’olivo Special Sandwich", desc: 'جبنة إمنتال & شيدر، خرشوف، أوريغانو، صوص خاص', price: 27.6 },
      { id: 'cheese-club', name: 'Cheese Club Sandwich', desc: 'بارميزان & إمنتال، طماطم، أوريغانو + صوص', price: 33.35 },
      { id: 'roast-beef', name: 'Roast Beef Sandwich', desc: 'روست بيف مدخن، إمنتال، خردل، أوريغانو + صوص', price: 32.2 },
      { id: 'italian-tuna', name: 'Italian Tuna Sandwich', desc: 'تونة إيطالية، إمنتال، طماطم، أوريغانو + صوص', price: 39.1 },
      { id: 'mozzarella-bufala', name: 'Mozzarella Bufala Sandwich', desc: 'موزاريلا بوفالا، طماطم، أوريغانو، بيستو، خبز شاباتا زيتون', price: 33.35 },
      { id: 'turkey-royal', name: 'Turkey Royal', desc: 'ديك رومي مدخن، إمنتال، طماطم، أوريغانو + صوص', price: 51.75 },
    ],
  },
  {
    id: 'gathering-boxes',
    title: '🎁 بوكسات الجمعات',
    description: 'خيارات متنوعة للحفلات والجمعات',
    items: [
      { id: 'make-your-box', name: 'اصنع بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95 },
      { id: 'mini-bites', name: 'لوليفو ميني بايت بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95 },
      { id: 'small-focaccia', name: 'بوكس فوكاشيا صغير', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95 },
      { id: 'pretzel-box', name: 'بوكس البريتزل', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95 },
      { id: 'croissant-box', name: 'كرواسون بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95 },
    ],
  },
  {
    id: 'grilled-meat',
    title: '🥩 سندويتشات مشوية وأطباق اللحوم',
    description: 'مشويات لذيذة وطرية',
    items: [
      { id: 'grilled-chicken-pesto', name: 'دجاج مشوي بيستو', price: 36 },
      { id: 'grilled-halloumi-pesto', name: 'حلومي بيستو مشوي', price: 34 },
      { id: 'manzo-tenderloin', name: 'لحم مانزو تندرلوين متبّل', price: 49.45 },
      { id: 'truffle-steak', name: 'ترفل ستيك', price: 49.45 },
      { id: 'steak-frites', name: 'ستيك فريتس', price: 49.45 },
    ],
  },
  {
    id: 'salads',
    title: '🥗 سلطات (Salads)',
    description: 'سلطات طازجة ومتوازنة',
    items: [
      { id: 'lolivo-salad', name: 'سلطة لوليفو', desc: 'خس عضوي، جرجير، طماطم كرزية، بارميزان، أوريغانو، خل بلسميك', price: 32 },
      { id: 'caesar-chicken', name: 'سلطة دجاج سيزر', desc: 'دجاج متبل، خس، خبز محمّص، بارميزان، صوص سيزر', price: 32 },
      { id: 'chicken-feta', name: 'سلطة دجاج و فيتا', desc: 'دجاج متبل، خس، فيتا، طماطم كرزية، زيت زيتون بالليمون', price: 29 },
    ],
  },
  {
    id: 'sides',
    title: '🧀 أطباق جانبية مشهورة',
    description: 'مشاركات وللقعدة',
    items: [
      { id: 'big-cheese-platter', name: 'طبق جبن كبير', price: 259 },
    ],
  },
  {
    id: 'fries',
    title: '🍟 شرائح البطاطس',
    description: 'مقرمشة وساخنة',
    items: [
      { id: 'truffle-fries', name: 'شرائح البطاطس مع الترافل', price: 18 },
      { id: 'salt-pepper-fries', name: 'شرائح البطاطس مع الفلفل والملح', price: 17 },
    ],
  },
  {
    id: 'drinks',
    title: '🥤 المشروبات',
    description: 'منعشة وطبيعية',
    items: [
      { id: 'soda', name: 'مشروب غازي', desc: 'كوكا كولا، سبرايت، وغيرها', price: 5 },
      { id: 'mango-strawberry-juice', name: 'عصير مانجو طازج / فراولة', price: 12 },
      { id: 'orange-juice', name: 'عصير برتقال طبيعي', price: 12 },
    ],
  },
];

// State: cart
const cart = new Map(); // key: itemId, value: { item, qty }

// Elements
const menuContainer = document.getElementById('menuContainer');
const categoryNav = document.getElementById('categoryNav');
const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const backdrop = document.getElementById('backdrop');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const cancelCheckout = document.getElementById('cancelCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const yearEl = document.getElementById('year');

// Utils
const formatPrice = (num) => `${num.toFixed(2)} ر.س`;

// Render category chips
function renderCategoryNav() {
  categoryNav.innerHTML = menu
    .map(
      (cat, idx) => `<button class="chip${idx === 0 ? ' active' : ''}" data-target="${cat.id}">${cat.title}</button>`
    )
    .join('');

  categoryNav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-target]');
    if (!btn) return;
    const id = btn.getAttribute('data-target');
    document.querySelectorAll('.category-nav .chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Render menu
function renderMenu() {
  menuContainer.innerHTML = menu
    .map((cat) => {
      const items = cat.items
        .map((it) => {
          return `
          <div class="card" data-id="${it.id}">
            <h4>${it.name}</h4>
            ${it.desc ? `<p>${it.desc}</p>` : '<p></p>'}
            <div class="actions">
              <span class="price">${formatPrice(it.price)}</span>
              <button class="primary-btn add-to-cart" data-id="${it.id}">أضف</button>
            </div>
          </div>`;
        })
        .join('');
      return `
      <section class="category-section" id="${cat.id}">
        <div class="category-header">
          <h3 class="category-title">${cat.title}</h3>
          ${cat.description ? `<p class="category-desc">${cat.description}</p>` : ''}
        </div>
        <div class="items-grid">${items}</div>
      </section>`;
    })
    .join('');

  // Bind add-to-cart
  menuContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const item = menu.flatMap(c => c.items).find((x) => x.id === id);
    if (!item) return;
    addToCart(item);
  });
}

function addToCart(item) {
  const existing = cart.get(item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(item.id, { item, qty: 1 });
  }
  updateCartUI();
}

function removeFromCart(itemId) {
  cart.delete(itemId);
  updateCartUI();
}

function changeQty(itemId, delta) {
  const entry = cart.get(itemId);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) cart.delete(itemId);
  updateCartUI();
}

function calcTotals() {
  let count = 0;
  let total = 0;
  for (const { item, qty } of cart.values()) {
    count += qty;
    total += item.price * qty;
  }
  return { count, total };
}

function updateCartUI() {
  const { count, total } = calcTotals();
  cartCountEl.textContent = String(count);
  cartTotalEl.textContent = formatPrice(total);
  checkoutBtn.disabled = count === 0;

  if (count === 0) {
    cartItemsEl.innerHTML = '<p class="muted" style="text-align:center; margin: 14px 0;">السلة فارغة</p>';
    return;
  }

  cartItemsEl.innerHTML = Array.from(cart.values())
    .map(({ item, qty }) => {
      return `
      <div class="cart-item">
        <div class="meta">
          <div class="name">${item.name}</div>
          <div class="muted">${formatPrice(item.price)} × ${qty}</div>
        </div>
        <div class="qty">
          <button aria-label="إنقاص" data-action="dec" data-id="${item.id}">−</button>
          <span>${qty}</span>
          <button aria-label="زيادة" data-action="inc" data-id="${item.id}">+</button>
          <button class="icon-btn" aria-label="حذف" data-action="remove" data-id="${item.id}">🗑️</button>
        </div>
      </div>`;
    })
    .join('');
}

// Drawer and modal controls
function openCart() {
  cartDrawer.classList.add('open');
  backdrop.hidden = false;
  cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  backdrop.hidden = true;
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openCheckout() {
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}
function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}

// Events
openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
backdrop.addEventListener('click', () => { closeCart(); closeCheckout(); });

cartItemsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const action = btn.getAttribute('data-action');
  if (!id || !action) return;
  if (action === 'inc') changeQty(id, 1);
  if (action === 'dec') changeQty(id, -1);
  if (action === 'remove') removeFromCart(id);
});

checkoutBtn.addEventListener('click', () => {
  closeCart();
  openCheckout();
});

closeCheckoutBtn.addEventListener('click', closeCheckout);
cancelCheckout.addEventListener('click', closeCheckout);

checkoutForm.addEventListener('change', (e) => {
  if (e.target.name === 'fulfillment') {
    const addressField = checkoutForm.querySelector('.address-field');
    if (e.target.value === 'delivery') {
      addressField.hidden = false;
      addressField.querySelector('input').required = true;
    } else {
      addressField.hidden = true;
      addressField.querySelector('input').required = false;
    }
  }
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const order = {
    customer: {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      fulfillment: formData.get('fulfillment'),
      address: formData.get('address') || undefined,
      notes: formData.get('notes') || undefined,
    },
    items: Array.from(cart.values()).map(({ item, qty }) => ({ id: item.id, name: item.name, price: item.price, qty })),
    totals: calcTotals(),
    createdAt: new Date().toISOString(),
  };

  // For now, just show a confirmation and reset
  alert(`تم استلام طلبك بنجاح!\nالإجمالي: ${formatPrice(order.totals.total)}\nسنقوم بالتواصل معك قريبًا.`);
  cart.clear();
  updateCartUI();
  closeCheckout();
  checkoutForm.reset();
});

// Init
renderCategoryNav();
renderMenu();
updateCartUI();
yearEl.textContent = new Date().getFullYear();


