// Data: Menu of L’olivo
const defaultMenu = [
  {
    id: 'sandwiches-signature',
    title: '🥪 سندويتشات مميزة',
    description: 'اختيار من أفضل السندويتشات بطابع لوليفو',
    items: [
      { id: 'special-sandwich', name: "L'olivo Special Sandwich", desc: 'جبنة إمنتال & شيدر، خرشوف، أوريغانو، صوص خاص', price: 27.6, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.8, deliveryTime: '15-20 دقيقة' },
      { id: 'cheese-club', name: 'Cheese Club Sandwich', desc: 'بارميزان & إمنتال، طماطم، أوريغانو + صوص', price: 33.35, image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '12-18 دقيقة' },
      { id: 'roast-beef', name: 'Roast Beef Sandwich', desc: 'روست بيف مدخن، إمنتال، خردل، أوريغانو + صوص', price: 32.2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center', rating: 4.7, deliveryTime: '15-20 دقيقة' },
      { id: 'italian-tuna', name: 'Italian Tuna Sandwich', desc: 'تونة إيطالية، إمنتال، طماطم، أوريغانو + صوص', price: 39.1, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '10-15 دقيقة' },
      { id: 'mozzarella-bufala', name: 'Mozzarella Bufala Sandwich', desc: 'موزاريلا بوفالا، طماطم، أوريغانو، بيستو، خبز شاباتا زيتون', price: 33.35, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.9, deliveryTime: '18-25 دقيقة' },
      { id: 'turkey-royal', name: 'Turkey Royal', desc: 'ديك رومي مدخن، إمنتال، طماطم، أوريغانو + صوص', price: 51.75, image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&crop=center', rating: 4.8, deliveryTime: '20-25 دقيقة' },
    ],
  },
  {
    id: 'gathering-boxes',
    title: '🎁 بوكسات الجمعات',
    description: 'خيارات متنوعة للحفلات والجمعات',
    items: [
      { id: 'make-your-box', name: 'اصنع بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'mini-bites', name: 'لوليفو ميني بايت بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'small-focaccia', name: 'بوكس فوكاشيا صغير', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'pretzel-box', name: 'بوكس البريتزل', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'croissant-box', name: 'كرواسون بوكس', desc: 'جميع أنواع السندويتشات المميزة الستة', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'grilled-meat',
    title: '🥩 سندويتشات مشوية وأطباق اللحوم',
    description: 'مشويات لذيذة وطرية',
    items: [
      { id: 'grilled-chicken-pesto', name: 'دجاج مشوي بيستو', price: 36, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop&crop=center', rating: 4.7, deliveryTime: '20-25 دقيقة' },
      { id: 'grilled-halloumi-pesto', name: 'حلومي بيستو مشوي', price: 34, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '15-20 دقيقة' },
      { id: 'manzo-tenderloin', name: 'لحم مانزو تندرلوين متبّل', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.9, deliveryTime: '25-30 دقيقة' },
      { id: 'truffle-steak', name: 'ترفل ستيك', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.8, deliveryTime: '25-30 دقيقة' },
      { id: 'steak-frites', name: 'ستيك فريتس', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '25-30 دقيقة' },
    ],
  },
  {
    id: 'salads',
    title: '🥗 سلطات (Salads)',
    description: 'سلطات طازجة ومتوازنة',
    items: [
      { id: 'lolivo-salad', name: 'سلطة لوليفو', desc: 'خس عضوي، جرجير، طماطم كرزية، بارميزان، أوريغانو، خل بلسميك', price: 32, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '8-12 دقيقة' },
      { id: 'caesar-chicken', name: 'سلطة دجاج سيزر', desc: 'دجاج متبل، خس، خبز محمّص، بارميزان، صوص سيزر', price: 32, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '10-15 دقيقة' },
      { id: 'chicken-feta', name: 'سلطة دجاج و فيتا', desc: 'دجاج متبل، خس، فيتا، طماطم كرزية، زيت زيتون بالليمون', price: 29, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.4, deliveryTime: '8-12 دقيقة' },
    ],
  },
  {
    id: 'sides',
    title: '🧀 أطباق جانبية مشهورة',
    description: 'مشاركات وللقعدة',
    items: [
      { id: 'big-cheese-platter', name: 'طبق جبن كبير', price: 259, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'fries',
    title: '🍟 شرائح البطاطس',
    description: 'مقرمشة وساخنة',
    items: [
      { id: 'truffle-fries', name: 'شرائح البطاطس مع الترافل', price: 18, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center' },
      { id: 'salt-pepper-fries', name: 'شرائح البطاطس مع الفلفل والملح', price: 17, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'drinks',
    title: '🥤 المشروبات',
    description: 'منعشة وطبيعية',
    items: [
      { id: 'soda', name: 'مشروب غازي', desc: 'كوكا كولا، سبرايت، وغيرها', price: 5, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop&crop=center' },
      { id: 'mango-strawberry-juice', name: 'عصير مانجو طازج / فراولة', price: 12, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center' },
      { id: 'orange-juice', name: 'عصير برتقال طبيعي', price: 12, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center' },
    ],
  },
];

// MenuService: persist overrides (new items with optional image) in localStorage
const MenuService = (() => {
  const KEY_ITEMS = 'lolivo_menu_overrides_v1';
  const KEY_CATS = 'lolivo_menu_categories_v1';
  function getItemOverrides() {
    try { return JSON.parse(localStorage.getItem(KEY_ITEMS) || '[]'); } catch { return []; }
  }
  function saveItemOverrides(list) { localStorage.setItem(KEY_ITEMS, JSON.stringify(list)); }
  function getCategoryOverrides() {
    try { return JSON.parse(localStorage.getItem(KEY_CATS) || '[]'); } catch { return []; }
  }
  function saveCategoryOverrides(list) { localStorage.setItem(KEY_CATS, JSON.stringify(list)); }
  function addItem(categoryId, item) {
    const list = getItemOverrides();
    list.push({ categoryId, item });
    saveItemOverrides(list);
  }
  function updateItem(itemId, updater) {
    const list = getItemOverrides();
    const idx = list.findIndex(x => x.item.id === itemId);
    if (idx === -1) return;
    list[idx].item = { ...list[idx].item, ...updater };
    saveItemOverrides(list);
  }
  function removeItem(itemId) {
    const list = getItemOverrides().filter(x => x.item.id !== itemId);
    saveItemOverrides(list);
  }
  function addCategory(title, description, title_en, description_en) {
    const cats = getCategoryOverrides();
    const id = 'cat_' + Math.random().toString(36).slice(2, 8);
    cats.unshift({ id, title, title_en, description, description_en, items: [] });
    saveCategoryOverrides(cats);
    return id;
  }
  function removeCategory(id) {
    const cats = getCategoryOverrides().filter(c => c.id !== id);
    saveCategoryOverrides(cats);
    // also remove items added to this category
    const items = getItemOverrides().filter(o => o.categoryId !== id);
    saveItemOverrides(items);
  }
  function getMenu() {
    const base = JSON.parse(JSON.stringify(defaultMenu));
    const cats = getCategoryOverrides();
    const items = getItemOverrides();
    const merged = [...cats, ...base];
    for (const { categoryId, item } of items) {
      const cat = merged.find(c => c.id === categoryId);
      if (cat) (cat.items || (cat.items = [])).unshift(item);
    }
    return merged;
  }
  return { getMenu, addItem, updateItem, removeItem, addCategory, removeCategory, getCategoryOverrides };
})();

let menu = MenuService.getMenu();

// State: cart
const cart = new Map(); // key: itemId, value: { item, qty }

// Elements
const menuContainer = document.getElementById('menuContainer');
const categoryNav = document.getElementById('categoryNav');
const customerView = document.getElementById('customerView');
const storeView = document.getElementById('storeView');
const adminView = document.getElementById('adminView');
const roleSelect = document.getElementById('roleSelect');
const langSelect = document.getElementById('langSelect');
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
const trackInput = document.getElementById('trackInput');
const trackBtn = document.getElementById('trackBtn');
const muteToggle = document.getElementById('muteToggle');
const testRingtoneBtn = document.getElementById('testRingtone');
const recentOrdersEl = document.getElementById('recentOrders');
const filterCategory = document.getElementById('filterCategory');
const filterSearch = document.getElementById('filterSearch');
const filterSort = document.getElementById('filterSort');
const clearFiltersBtn = document.getElementById('clearFilters');
const copyFilterLinkBtn = document.getElementById('copyFilterLink');
const editItemModal = document.getElementById('editItemModal');
const editItemForm = document.getElementById('editItemForm');
const closeEditItemBtn = document.getElementById('closeEditItemBtn');
const cancelEditItem = document.getElementById('cancelEditItem');
const editImagePreview = document.getElementById('editImagePreview');
const removeImageCheckbox = document.getElementById('removeImageCheckbox');
const customizeModal = document.getElementById('customizeModal');
const customizeForm = document.getElementById('customizeForm');
const customizeGroupsEl = document.getElementById('customizeGroups');
const closeCustomizeBtn = document.getElementById('closeCustomizeBtn');
const cancelCustomize = document.getElementById('cancelCustomize');
const modsBuilderModal = document.getElementById('modsBuilderModal');
const closeModsBuilderBtn = document.getElementById('closeModsBuilderBtn');
const cancelModsBuilder = document.getElementById('cancelModsBuilder');
const saveModsBuilder = document.getElementById('saveModsBuilder');
const customerCustomizeModal = document.getElementById('customerCustomizeModal');
const closeCustomerCustomizeBtn = document.getElementById('closeCustomerCustomizeBtn');
const cancelCustomerCustomize = document.getElementById('cancelCustomerCustomize');
const addToCartCustomized = document.getElementById('addToCartCustomized');
const customerItemName = document.getElementById('customerItemName');
const customerItemDesc = document.getElementById('customerItemDesc');
const customerBasePrice = document.getElementById('customerBasePrice');
const customerModsGroups = document.getElementById('customerModsGroups');
const customerSpecialNotes = document.getElementById('customerSpecialNotes');
const summaryBasePrice = document.getElementById('summaryBasePrice');
const priceModifiers = document.getElementById('priceModifiers');
const summaryTotalPrice = document.getElementById('summaryTotalPrice');
const addGroupBtn = document.getElementById('addGroupBtn');
const modsGroupsList = document.getElementById('modsGroupsList');
const adminModsBuilderBtn = document.getElementById('adminModsBuilderBtn');
const storeModsBuilderBtn = document.getElementById('storeModsBuilderBtn');
let modsBuilderTargetTextarea = null;
let currentCustomizingItem = null;

// Utils
let currentLang = localStorage.getItem('lolivo_lang') || (document.documentElement.lang || 'ar');
const t = {
  ar: {
    allCategories: 'كل الفئات', searchPlaceholder: 'ابحث عن صنف...', sort: 'ترتيب',
    noCart: 'السلة فارغة', invoice: 'عرض الفاتورة', trackTitle: 'تتبّع طلبك / إعادة طباعة الفاتورة',
    trackSubtitle: 'أدخل رقم الطلب لعرض الفاتورة', recentTitle: 'آخر الطلبات', filterTitle: 'تصفية القائمة',
    filterSubtitle: 'اختيار فئة أو البحث بالاسم', copyLink: 'نسخ رابط التصفية', clearFilters: 'مسح الفلاتر',
    priceAsc: 'السعر: من الأقل للأعلى', priceDesc: 'السعر: من الأعلى للأقل', nameAsc: 'الاسم: أ → ي', nameDesc: 'الاسم: ي → أ',
    total: 'الإجمالي', orderNum: 'رقم الطلب', print: 'طباعة / حفظ PDF', notFound: 'لم يتم العثور على الطلب', enterId: 'الرجاء إدخال رقم الطلب',
    addedItem: 'تمت إضافة الصنف بنجاح', needNamePrice: 'يرجى إدخال اسم وسعر صحيح'
  },
  en: {
    allCategories: 'All categories', searchPlaceholder: 'Search item...', sort: 'Sort',
    noCart: 'Cart is empty', invoice: 'Show invoice', trackTitle: 'Track your order / Reprint invoice',
    trackSubtitle: 'Enter order ID to view invoice', recentTitle: 'Recent orders', filterTitle: 'Filter menu',
    filterSubtitle: 'Pick a category or search by name', copyLink: 'Copy filter link', clearFilters: 'Clear filters',
    priceAsc: 'Price: Low to High', priceDesc: 'Price: High to Low', nameAsc: 'Name: A → Z', nameDesc: 'Name: Z → A',
    total: 'Total', orderNum: 'Order #', print: 'Print / Save PDF', notFound: 'Order not found', enterId: 'Please enter order ID',
    addedItem: 'Item added successfully', needNamePrice: 'Please enter valid name and price'
  }
};
const formatPrice = (num) => currentLang === 'ar' ? `${num.toFixed(2)} ر.س` : `${num.toFixed(2)} SAR`;
const saLocaleDateTime = (iso) => new Date(iso).toLocaleString(currentLang === 'ar' ? 'ar-SA' : 'en-US');

// Orders service using localStorage for cross-tab sync
const OrdersService = (() => {
  const STORAGE_KEY = 'lolivo_orders_v1';
  const listeners = new Set();
  function read() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function write(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    emit();
  }
  function emit() { listeners.forEach((cb) => cb(getAll())); }
  function getAll() { return read(); }
  function create(orderDraft) {
    const list = read();
    const id = 'ord_' + Math.random().toString(36).slice(2, 8);
    const now = new Date().toISOString();
    const order = { id, status: 'pending', createdAt: now, updatedAt: now, ...orderDraft };
    list.push(order);
    write(list);
    return order;
  }
  function updateStatus(id, status) {
    const list = read();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) return;
    list[idx].status = status;
    list[idx].updatedAt = new Date().toISOString();
    write(list);
  }
  function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
  window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) emit(); });
  return { getAll, create, updateStatus, subscribe };
})();

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
  menu = MenuService.getMenu();
  // populate filter categories if present
  if (filterCategory) {
    const current = filterCategory.value || 'all';
    const options = [`<option value="all">${t[currentLang].allCategories}</option>`]
      .concat(menu.map(c => `<option value="${c.id}">${currentLang === 'ar' ? (c.title || c.title_en || '') : (c.title_en || c.title || '')}</option>`))
      .join('');
    if (filterCategory.innerHTML !== options) filterCategory.innerHTML = options;
    filterCategory.value = current;
  }
  // apply filtering
  const query = (filterSearch?.value || '').toLowerCase().trim();
  const cat = filterCategory?.value || 'all';
  let filteredCats = menu
    .filter(c => cat === 'all' || c.id === cat)
    .map(c => ({
      ...c,
      items: (c.items || []).filter(i => {
        if (!query) return true;
        const hay = `${i.name} ${i.desc || ''}`.toLowerCase();
        return hay.includes(query);
      })
    }))
    .filter(c => (c.items || []).length > 0);

  // sorting by price
  const sort = filterSort?.value || 'none';
  if (sort !== 'none') {
    let compare;
    if (sort === 'price-asc') compare = (a, b) => a.price - b.price;
    else if (sort === 'price-desc') compare = (a, b) => b.price - a.price;
    else if (sort === 'name-asc') compare = (a, b) => a.name.localeCompare(b.name, 'ar');
    else if (sort === 'name-desc') compare = (a, b) => b.name.localeCompare(a.name, 'ar');
    if (compare) {
      filteredCats = filteredCats.map(c => ({
        ...c,
        items: [...c.items].sort(compare)
      }));
    }
  }

  menuContainer.innerHTML = filteredCats
    .map((cat) => {
      const items = cat.items
        .map((it) => {
          const cardClass = it.featured ? 'card featured-item' : 'card';
          const ratingStars = it.rating ? `
            <div class="rating-stars">
              ${Array.from({length: 5}, (_, i) => 
                `<span class="star">${i < Math.floor(it.rating) ? '★' : '☆'}</span>`
              ).join('')}
              <span style="margin-left: 4px; font-size: 12px; color: var(--muted);">${it.rating}</span>
            </div>
          ` : '';
          
          const deliveryTime = it.deliveryTime ? `
            <div class="delivery-time">${it.deliveryTime}</div>
          ` : '';
          
          return `
           <div class="${cardClass}" data-id="${it.id}">
            ${it.image ? `<img class="item-img" src="${it.image}" alt="${it.name}"/>` : ''}
            ${it.featured ? '<div class="delivery-badge">مميز</div>' : ''}
             <h4>${currentLang === 'ar' ? (it.name || it.name_en) : (it.name_en || it.name)}</h4>
             ${it.desc || it.desc_en ? `<p>${currentLang === 'ar' ? (it.desc || it.desc_en || '') : (it.desc_en || it.desc || '')}</p>` : '<p></p>'}
             ${ratingStars}
             ${deliveryTime}
            <div class="actions">
              <span class="price-badge">${formatPrice(it.price)}</span>
              <button class="primary-btn add-to-cart" data-id="${it.id}" aria-label="add">+</button>
            </div>
          </div>`;
        })
        .join('');
      return `
      <section class="category-section" id="${cat.id}">
        <div class="category-header">
          <h3 class="category-title">${currentLang === 'ar' ? (cat.title || cat.title_en) : (cat.title_en || cat.title)}</h3>
          ${cat.description || cat.description_en ? `<p class="category-desc">${currentLang === 'ar' ? (cat.description || cat.description_en || '') : (cat.description_en || cat.description || '')}</p>` : ''}
        </div>
        <div class="items-grid">${items}</div>
      </section>`;
    })
    .join('');

  // Bind add-to-cart (with customize if modifiers exist)
  menuContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const item = menu.flatMap(c => c.items).find((x) => x.id === id);
    if (!item) return;
    if (item.mods && Array.isArray(item.mods) && item.mods.length) {
      buildCustomizeForm(item);
      openCustomize();
    } else {
      addToCart(item);
    }
  });
}

function addToCart(item) {
  // Open customization modal for customer role
  if (currentRole === 'customer') {
    openCustomerCustomize(item);
    return;
  }
  
  // Direct add for admin/store roles
  const existing = cart.get(item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(item.id, { item, qty: 1 });
  }
  updateCartUI();
}

let currentCustomizeItem = null;
function buildCustomizeForm(item) {
  currentCustomizeItem = item;
  customizeGroupsEl.innerHTML = (item.mods || []).map(group => {
    const required = group.required ? ' *' : '';
    const name = currentLang === 'ar' ? (group.name || group.name_en || '') : (group.name_en || group.name || '');
    const options = (group.options || []).map(opt => {
      const optName = currentLang === 'ar' ? (opt.name || opt.name_en || '') : (opt.name_en || opt.name || '');
      const price = opt.priceDelta ? `<small>+ ${formatPrice(opt.priceDelta)}</small>` : '';
      const inputType = group.type === 'multi' ? 'checkbox' : 'radio';
      const nameAttr = `mod_${group.id}${inputType==='checkbox'?'[]':''}`;
      const value = opt.id;
      return `<label class="option"><span>${optName}</span>${price}<input type="${inputType}" name="${nameAttr}" value="${value}"></label>`;
    }).join('');
    return `<div class="option-group"><h5>${name}${required}</h5>${options}</div>`;
  }).join('');
}

customizeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentCustomizeItem) return;
  const fd = new FormData(customizeForm);
  let extra = 0;
  const selections = {};
  for (const group of currentCustomizeItem.mods || []) {
    if (group.type === 'multi') {
      const vals = fd.getAll(`mod_${group.id}[]`);
      selections[group.id] = vals;
      for (const id of vals) {
        const opt = (group.options || []).find(o => o.id === id);
        if (opt && opt.priceDelta) extra += Number(opt.priceDelta) || 0;
      }
      if (group.required && (!vals || vals.length===0)) return alert('يرجى اختيار على الأقل خيار واحد');
    } else {
      const val = fd.get(`mod_${group.id}`);
      selections[group.id] = val || null;
      if (group.required && !val) return alert('يرجى اختيار خيار');
      const opt = (group.options || []).find(o => o.id === val);
      if (opt && opt.priceDelta) extra += Number(opt.priceDelta) || 0;
    }
  }
  const cartKey = `${currentCustomizeItem.id}:${btoa(JSON.stringify(selections))}`;
  const existing = cart.get(cartKey);
  const itemEntry = { ...currentCustomizeItem, price: currentCustomizeItem.price + extra, selections };
  if (existing) existing.qty += 1; else cart.set(cartKey, { item: itemEntry, qty: 1 });
  updateCartUI();
  closeCustomize();
  customizeForm.reset();
});

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
    const itemPrice = item.customization ? item.customization.finalPrice : item.price;
    total += itemPrice * qty;
  }
  return { count, total };
}

function updateCartUI() {
  const { count, total } = calcTotals();
  cartCountEl.textContent = String(count);
  cartTotalEl.textContent = formatPrice(total);
  checkoutBtn.disabled = count === 0;

  if (count === 0) {
    cartItemsEl.innerHTML = `<p class="muted" style="text-align:center; margin: 14px 0;">${t[currentLang].noCart}</p>`;
    return;
  }

  cartItemsEl.innerHTML = Array.from(cart.values())
    .map(({ item, qty }) => {
      const itemName = currentLang === 'ar' ? (item.name || item.name_en) : (item.name_en || item.name);
      const displayPrice = item.customization ? item.customization.finalPrice : item.price;
      
      let customizationDetails = '';
      if (item.customization) {
        const breadNames = {
          white: 'خبز أبيض',
          brown: 'خبز بني', 
          ciabatta: 'شاباتا',
          focaccia: 'فوكاشيا'
        };
        
        customizationDetails = `
          <div class="customization-details" style="font-size: 12px; color: var(--muted); margin-top: 4px;">
            <div>نوع الخبز: ${breadNames[item.customization.bread] || item.customization.bread}</div>
            ${item.customization.specialNotes ? `<div>ملاحظات: ${item.customization.specialNotes}</div>` : ''}
          </div>
        `;
      }
      
      return `
      <div class="cart-item">
        <div class="meta">
          <div class="name">${itemName}</div>
          <div class="muted">${formatPrice(displayPrice)} × ${qty}</div>
          ${customizationDetails}
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

function openEditItem() {
  editItemModal.classList.add('open');
  editItemModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}
function openCustomize() {
  customizeModal.classList.add('open');
  customizeModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}
function closeCustomize() {
  customizeModal.classList.remove('open');
  customizeModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}

function openCustomerCustomize(item) {
  currentCustomizingItem = item;
  customerCustomizeModal.classList.add('open');
  customerCustomizeModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
  
  // Fill item info
  customerItemName.textContent = currentLang === 'ar' ? (item.name || item.name_en) : (item.name_en || item.name);
  customerItemDesc.textContent = currentLang === 'ar' ? (item.desc || item.desc_en || '') : (item.desc_en || item.desc || '');
  customerBasePrice.textContent = formatPrice(item.price);
  summaryBasePrice.textContent = formatPrice(item.price);
  
  // Reset form
  customerSpecialNotes.value = '';
  document.querySelector('input[name="bread"][value="white"]').checked = true;
  
  // Build modifiers UI
  buildCustomerModifiersUI(item.mods || []);
  
  // Update price
  updateCustomerPrice();
}

function closeCustomerCustomize() {
  customerCustomizeModal.classList.remove('open');
  customerCustomizeModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
  currentCustomizingItem = null;
}

function buildCustomerModifiersUI(mods) {
  if (!mods || !mods.length) {
    customerModsGroups.innerHTML = '<p class="muted">لا توجد خيارات إضافية متاحة</p>';
    return;
  }
  
  customerModsGroups.innerHTML = mods.map(group => `
    <div class="modifier-group">
      <h5>${group.name} ${group.required ? '<span style="color: var(--danger);">*</span>' : ''}</h5>
      <div class="options-grid">
        ${group.options.map(option => `
          <label class="option-item">
            <input type="${group.type === 'single' ? 'radio' : 'checkbox'}" 
                   name="mod_${group.id}" 
                   value="${option.id}" 
                   data-price="${option.priceDelta || 0}"
                   ${group.required && group.type === 'single' ? 'required' : ''}>
            <span>${option.name} ${option.priceDelta ? `(+${formatPrice(option.priceDelta)})` : ''}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function updateCustomerPrice() {
  if (!currentCustomizingItem) return;
  
  let totalPrice = currentCustomizingItem.price;
  let modifiers = [];
  
  // Calculate modifiers
  const checkedInputs = customerModsGroups.querySelectorAll('input:checked');
  checkedInputs.forEach(input => {
    const priceDelta = parseFloat(input.dataset.price) || 0;
    if (priceDelta !== 0) {
      totalPrice += priceDelta;
      const label = input.closest('label').querySelector('span').textContent;
      modifiers.push({
        name: label,
        price: priceDelta
      });
    }
  });
  
  // Update price modifiers display
  priceModifiers.innerHTML = modifiers.map(mod => `
    <div class="price-modifier">
      <span>${mod.name}</span>
      <span>${mod.price > 0 ? '+' : ''}${formatPrice(mod.price)}</span>
    </div>
  `).join('');
  
  // Update total
  summaryTotalPrice.textContent = formatPrice(totalPrice);
}

function addCustomizedToCart() {
  if (!currentCustomizingItem) return;
  
  // Collect customization data
  const bread = document.querySelector('input[name="bread"]:checked')?.value || 'white';
  const specialNotes = customerSpecialNotes.value.trim();
  
  // Collect modifiers
  const modifiers = [];
  const checkedInputs = customerModsGroups.querySelectorAll('input:checked');
  checkedInputs.forEach(input => {
    const groupId = input.name.replace('mod_', '');
    const optionId = input.value;
    const priceDelta = parseFloat(input.dataset.price) || 0;
    
    modifiers.push({
      groupId,
      optionId,
      priceDelta
    });
  });
  
  // Calculate final price
  let finalPrice = currentCustomizingItem.price;
  modifiers.forEach(mod => finalPrice += mod.priceDelta);
  
  // Create customized item
  const customizedItem = {
    ...currentCustomizingItem,
    customization: {
      bread,
      modifiers,
      specialNotes,
      finalPrice
    }
  };
  
  // Add to cart
  const existing = cart.get(currentCustomizingItem.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(currentCustomizingItem.id, { item: customizedItem, qty: 1 });
  }
  
  updateCartUI();
  closeCustomerCustomize();
}

function openModsBuilder(targetTextarea) {
  modsBuilderTargetTextarea = targetTextarea;
  modsGroupsList.innerHTML = '';
  try {
    const existing = JSON.parse((targetTextarea.value||'').toString()||'null') || [];
    existing.forEach(g => addGroupUI(g));
  } catch { /* ignore */ }
  modsBuilderModal.classList.add('open');
  modsBuilderModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}
function closeModsBuilder() {
  modsBuilderModal.classList.remove('open');
  modsBuilderModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}
function addGroupUI(group = {}) {
  const groupId = group.id || ('g_' + Math.random().toString(36).slice(2,6));
  const div = document.createElement('div');
  div.className = 'option-group';
  div.dataset.groupId = groupId;
  div.innerHTML = `
    <div class="mods-row">
      <input placeholder="معرّف المجموعة" value="${group.id||''}" data-field="id"/>
      <input placeholder="الاسم (ar)" value="${group.name||''}" data-field="name"/>
      <button type="button" data-action="remove-group" class="icon-btn">🗑️</button>
    </div>
    <div class="mods-row">
      <input placeholder="Name (en)" value="${group.name_en||''}" data-field="name_en"/>
      <select data-field="type">
        <option value="single" ${group.type==='single'?'selected':''}>single</option>
        <option value="multi" ${group.type==='multi'?'selected':''}>multi</option>
      </select>
      <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" data-field="required" ${group.required?'checked':''}/> إجباري</label>
    </div>
    <div class="mods-row">
      <input placeholder="إضافة خيار: الاسم (ar)" data-new="name"/>
      <input placeholder="name (en) / +السعر" data-new="name_en_price"/>
      <button type="button" data-action="add-option" class="secondary-btn">إضافة خيار</button>
    </div>
    <div data-list="options"></div>
  `;
  const list = div.querySelector('[data-list="options"]');
  (group.options||[]).forEach(opt => addOptionChip(list, opt));
  div.addEventListener('click', (e) => {
    if (e.target.matches('[data-action="remove-group"]')) {
      div.remove();
    }
    if (e.target.matches('[data-action="add-option"]')) {
      const name = div.querySelector('[data-new="name"]').value.trim();
      const ne = div.querySelector('[data-new="name_en_price"]').value.trim();
      if (!name) return;
      let name_en=''; let priceDelta=0;
      if (ne) {
        const parts = ne.split('/');
        name_en = (parts[0]||'').trim();
        const priceStr = (parts[1]||'').replace(/[^0-9.\-]/g,'').trim();
        if (priceStr) priceDelta = Number(priceStr)||0;
      }
      addOptionChip(list, { id: 'o_'+Math.random().toString(36).slice(2,6), name, name_en, priceDelta });
      div.querySelector('[data-new="name"]').value = '';
      div.querySelector('[data-new="name_en_price"]').value = '';
    }
  });
  modsGroupsList.appendChild(div);
}
function addOptionChip(listEl, opt) {
  const span = document.createElement('span');
  span.className = 'mods-chip';
  span.dataset.id = opt.id;
  span.dataset.name = opt.name||'';
  span.dataset.name_en = opt.name_en||'';
  span.dataset.price = String(opt.priceDelta||0);
  span.innerHTML = `<span>${opt.name || opt.name_en || 'Option'}${opt.priceDelta?` (+${opt.priceDelta})`:''}</span><button type="button" class="icon-btn" aria-label="حذف">✕</button>`;
  span.querySelector('button').addEventListener('click', () => span.remove());
  listEl.appendChild(span);
}
function collectModsFromUI() {
  const groups = [];
  modsGroupsList.querySelectorAll('.option-group').forEach(g => {
    const obj = {
      id: g.querySelector('[data-field="id"]').value.trim(),
      name: g.querySelector('[data-field="name"]').value.trim(),
      name_en: g.querySelector('[data-field="name_en"]').value.trim(),
      type: g.querySelector('[data-field="type"]').value,
      required: g.querySelector('[data-field="required"]').checked,
      options: []
    };
    g.querySelectorAll('[data-list="options"] .mods-chip').forEach(chip => {
      obj.options.push({
        id: chip.dataset.id,
        name: chip.dataset.name,
        name_en: chip.dataset.name_en,
        priceDelta: Number(chip.dataset.price)||0
      });
    });
    groups.push(obj);
  });
  return groups;
}
if (adminModsBuilderBtn) adminModsBuilderBtn.addEventListener('click', () => {
  const ta = document.querySelector('#adminAddItemForm textarea[name="mods"]');
  openModsBuilder(ta);
});
if (storeModsBuilderBtn) storeModsBuilderBtn.addEventListener('click', () => {
  const ta = document.querySelector('#storeAddItemForm textarea[name="mods"]');
  openModsBuilder(ta);
});
if (closeModsBuilderBtn) closeModsBuilderBtn.addEventListener('click', closeModsBuilder);
if (cancelModsBuilder) cancelModsBuilder.addEventListener('click', closeModsBuilder);
if (addGroupBtn) addGroupBtn.addEventListener('click', () => addGroupUI());
if (saveModsBuilder) saveModsBuilder.addEventListener('click', () => {
  const data = collectModsFromUI();
  if (modsBuilderTargetTextarea) modsBuilderTargetTextarea.value = data.length ? JSON.stringify(data) : '';
  closeModsBuilder();
});
function closeEditItem() {
  editItemModal.classList.remove('open');
  editItemModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
}

// Events
openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
backdrop.addEventListener('click', () => { closeCart(); closeCheckout(); closeEditItem(); closeCustomize(); closeCustomerCustomize(); });

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
if (closeEditItemBtn) closeEditItemBtn.addEventListener('click', closeEditItem);
if (cancelEditItem) cancelEditItem.addEventListener('click', closeEditItem);
if (closeCustomizeBtn) closeCustomizeBtn.addEventListener('click', closeCustomize);
if (cancelCustomize) cancelCustomize.addEventListener('click', closeCustomize);

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
  alert(currentLang === 'ar' ? `تم استلام طلبك بنجاح!\nالإجمالي: ${formatPrice(order.totals.total)}\nسنقوم بالتواصل معك قريبًا.` : `Order received!\nTotal: ${formatPrice(order.totals.total)}\nWe will contact you soon.`);
  // persist order to OrdersService
  const created = OrdersService.create(order);
  // expose tracking id to customer
  alert((currentLang === 'ar' ? 'رقم تتبع طلبك: ' : 'Your order ID: ') + created.id);
  // open printable invoice
  openInvoice(created);
  addRecentOrder(created.id);
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

// ---------- Filter state in URL ----------
function readFilterFromURL() {
  const url = new URL(window.location.href);
  const fc = url.searchParams.get('fc');
  const fq = url.searchParams.get('fq');
  const fs = url.searchParams.get('fs');
  if (filterCategory && fc) filterCategory.value = fc;
  if (filterSearch && fq) filterSearch.value = fq;
  if (filterSort && fs) filterSort.value = fs;
}
function writeFilterToURL() {
  const url = new URL(window.location.href);
  if (filterCategory) url.searchParams.set('fc', filterCategory.value || 'all');
  if (filterSearch) {
    const q = (filterSearch.value || '').trim();
    if (q) url.searchParams.set('fq', q); else url.searchParams.delete('fq');
  }
  if (filterSort) url.searchParams.set('fs', filterSort.value || 'none');
  history.replaceState({}, '', url);
}
readFilterFromURL();
renderMenu();

// ---------- Role routing ----------
function getRoleFromQuery() {
  const url = new URL(window.location.href);
  return url.searchParams.get('role') || 'customer';
}
function setRole(role) {
  customerView.hidden = role !== 'customer';
  storeView.hidden = role !== 'store';
  adminView.hidden = role !== 'admin';
  roleSelect.value = role;
  if (role === 'store') renderStore();
  if (role === 'admin') renderAdmin();
}
function navigateRole(role) {
  const url = new URL(window.location.href);
  url.searchParams.set('role', role);
  history.replaceState({}, '', url);
  setRole(role);
}
roleSelect.addEventListener('change', () => navigateRole(roleSelect.value));
setRole(getRoleFromQuery());

// ---------- Store UI ----------
const storeOrdersEl = document.getElementById('storeOrders');
let knownOrderIds = new Set();
let isMuted = JSON.parse(localStorage.getItem('lolivo_mute') || 'false');
if (muteToggle) muteToggle.checked = isMuted;
function playNewOrderSound() {
  if (isMuted) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.value = 659; // E5
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.04);
    // simple two-tone
    o.connect(g).connect(audioCtx.destination);
    o.start();
    setTimeout(() => { o.frequency.value = 880; }, 220); // A5
    setTimeout(() => { g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1); }, 650);
    o.stop(audioCtx.currentTime + 0.85);
  } catch {}
}
function renderStore() {
  const orders = OrdersService.getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // detect new orders
  const currentIds = new Set(orders.map(o => o.id));
  const hadUnknown = Array.from(currentIds).some(id => !knownOrderIds.has(id));
  if (!storeView.hidden && knownOrderIds.size && hadUnknown) {
    playNewOrderSound();
  }
  knownOrderIds = currentIds;
  if (orders.length === 0) {
    storeOrdersEl.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align:center">لا توجد طلبات بعد</p>';
    return;
  }
  storeOrdersEl.innerHTML = orders.map((o) => {
    const itemsText = o.items.map(i => `${i.name} × ${i.qty}`).join('، ');
    return `
      <div class="card">
        <h4>طلب ${o.id}</h4>
        <p class="muted">${saLocaleDateTime(o.createdAt)}</p>
        <p>${itemsText}</p>
        <div class="actions">
          <span class="price">${formatPrice(o.totals.total)}</span>
          <div class="qty">
            <button data-action="status" data-id="${o.id}" data-status="preparing">تحضير</button>
            <button data-action="status" data-id="${o.id}" data-status="ready">جاهز</button>
            <button data-action="status" data-id="${o.id}" data-status="completed">مُسلّم</button>
          </div>
        </div>
        <p class="muted">الحالة الحالية: ${o.status}</p>
      </div>`;
  }).join('');
}
storeOrdersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="status"]');
  if (!btn) return;
  OrdersService.updateStatus(btn.getAttribute('data-id'), btn.getAttribute('data-status'));
});
OrdersService.subscribe(() => {
  if (!storeView.hidden) renderStore();
  if (!adminView.hidden) renderAdmin();
});

// ---------- Admin UI ----------
const kpiOrders = document.getElementById('kpiOrders');
const kpiRevenue = document.getElementById('kpiRevenue');
const kpiInProgress = document.getElementById('kpiInProgress');
const kpiReady = document.getElementById('kpiReady');
function renderAdmin() {
  const orders = OrdersService.getAll();
  const totalOrders = orders.length;
  const revenue = orders.reduce((s, o) => s + (o.totals?.total || 0), 0);
  const inProgress = orders.filter(o => o.status === 'preparing').length;
  const ready = orders.filter(o => o.status === 'ready').length;
  kpiOrders.textContent = String(totalOrders);
  kpiRevenue.textContent = formatPrice(revenue);
  kpiInProgress.textContent = String(inProgress);
  kpiReady.textContent = String(ready);
}

// ---------- Invoice (printable) ----------
function openInvoice(order) {
  const win = window.open('', '_blank');
  if (!win) return;
  const rows = order.items
    .map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${formatPrice(i.price)}</td><td>${formatPrice(i.price * i.qty)}</td></tr>`) 
    .join('');
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فاتورة - ${order.id}</title>
  <style>
    body { font-family: Tajawal, Arial, sans-serif; color: #0b1f14; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .brand { font-weight: 800; color: #1dbf73; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f3f7f5; }
    .totals { text-align: left; margin-top: 10px; font-weight: 700; }
    .muted { color: #5c6f65; }
    @media print { .no-print { display: none; } }
  </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">لوليفو</div>
      <div>
        <div>رقم الطلب: ${order.id}</div>
        <div class="muted">${saLocaleDateTime(order.createdAt)}</div>
      </div>
    </div>
    <hr/>
    <div>
      <div>العميل: ${order.customer.fullName || ''}</div>
      <div>الجوال: ${order.customer.phone || ''}</div>
      <div>طريقة الاستلام: ${order.customer.fulfillment === 'delivery' ? 'توصيل' : 'استلام من المطعم'}</div>
      ${order.customer.address ? `<div>العنوان: ${order.customer.address}</div>` : ''}
    </div>
    <table>
      <thead>
        <tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div class="totals">الإجمالي: ${formatPrice(order.totals.total)}</div>
    <button class="no-print" onclick="window.print()">طباعة / حفظ PDF</button>
  </body>
  </html>`;
  win.document.write(html);
  win.document.close();
  // try auto print shortly
  setTimeout(() => { try { win.print(); } catch {} }, 400);
}

// ---------- Tracking & Store settings events ----------
if (trackBtn) {
  trackBtn.addEventListener('click', () => {
    const id = (trackInput?.value || '').trim();
    if (!id) return alert(t[currentLang].enterId);
    const order = OrdersService.getAll().find(o => o.id === id);
    if (!order) return alert(t[currentLang].notFound);
    openInvoice(order);
  });
}
if (muteToggle) {
  muteToggle.addEventListener('change', () => {
    isMuted = muteToggle.checked;
    localStorage.setItem('lolivo_mute', JSON.stringify(isMuted));
  });
}
if (testRingtoneBtn) {
  testRingtoneBtn.addEventListener('click', () => playNewOrderSound());
}

// Filter events
function onFilterChanged() { writeFilterToURL(); renderMenu(); }
if (filterCategory) filterCategory.addEventListener('change', onFilterChanged);
if (filterSearch) filterSearch.addEventListener('input', onFilterChanged);
if (filterSort) filterSort.addEventListener('change', onFilterChanged);
if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
  if (filterCategory) filterCategory.value = 'all';
  if (filterSearch) filterSearch.value = '';
  if (filterSort) filterSort.value = 'none';
  onFilterChanged();
});
if (copyFilterLinkBtn) copyFilterLinkBtn.addEventListener('click', async () => {
  writeFilterToURL();
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert('تم نسخ الرابط مع الفلاتر');
  } catch {
    alert('تعذر النسخ تلقائيًا، انسخ الرابط من شريط العنوان');
  }
});

// ---------- Recent orders ----------
function getRecent() {
  try { return JSON.parse(localStorage.getItem('lolivo_recent') || '[]'); } catch { return []; }
}
function saveRecent(list) {
  localStorage.setItem('lolivo_recent', JSON.stringify(list.slice(0, 5)));
}
function addRecentOrder(id) {
  const list = getRecent().filter(x => x !== id);
  list.unshift(id);
  saveRecent(list);
  renderRecent();
}
function renderRecent() {
  if (!recentOrdersEl) return;
  const list = getRecent();
  if (list.length === 0) {
    recentOrdersEl.innerHTML = `<span class="muted">${currentLang === 'ar' ? 'لا يوجد سجل بعد' : 'No history yet'}</span>`;
    return;
  }
  recentOrdersEl.innerHTML = list
    .map(id => `<button class="chip" data-order-id="${id}">${id}</button>`)
    .join('');
}
if (recentOrdersEl) {
  renderRecent();
  recentOrdersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-order-id]');
    if (!btn) return;
    const id = btn.getAttribute('data-order-id');
    const order = OrdersService.getAll().find(o => o.id === id);
    if (!order) return alert('الطلب غير موجود');
    openInvoice(order);
  });
}

// ---------- Admin/Store add item forms ----------
async function readFileAsDataURL(file) {
  if (!file) return undefined;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fillCategorySelects() {
  const selects = [
    document.querySelector('#adminAddItemForm select[name="categoryId"]'),
    document.querySelector('#storeAddItemForm select[name="categoryId"]'),
  ].filter(Boolean);
  const cats = MenuService.getMenu().map(c => ({ id: c.id, title: c.title }));
  for (const sel of selects) sel.innerHTML = cats.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
}
fillCategorySelects();

async function handleAddItem(form) {
  const fd = new FormData(form);
  const categoryId = fd.get('categoryId');
  const name = (fd.get('name') || '').toString().trim();
  const name_en = (fd.get('name_en') || '').toString().trim();
  const desc = (fd.get('desc') || '').toString().trim();
  const desc_en = (fd.get('desc_en') || '').toString().trim();
  const price = Number(fd.get('price')) || 0;
  const file = form.querySelector('input[name="image"]').files[0];
  const image = file ? await readFileAsDataURL(file) : undefined;
  if (!name || price <= 0) { alert(t[currentLang].needNamePrice); return; }
  const id = 'itm_' + Math.random().toString(36).slice(2, 8);
  let mods;
  try { mods = JSON.parse((fd.get('mods')||'').toString()||'null'); } catch { mods = undefined; }
  MenuService.addItem(categoryId, { id, name, name_en, desc, desc_en, price, image, mods });
  renderMenu();
  alert(t[currentLang].addedItem);
  form.reset();
}
// Language controls and UI text
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lolivo_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  // static texts
  const trackTitle = document.getElementById('trackTitle');
  const trackSubtitle = document.getElementById('trackSubtitle');
  const recentTitle = document.getElementById('recentTitle');
  const filterTitle = document.getElementById('filterTitle');
  const filterSubtitle = document.getElementById('filterSubtitle');
  const filterSearch = document.getElementById('filterSearch');
  const filterSort = document.getElementById('filterSort');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const copyFilterLinkBtn = document.getElementById('copyFilterLink');
  if (trackTitle) trackTitle.textContent = t[lang].trackTitle;
  if (trackSubtitle) trackSubtitle.textContent = t[lang].trackSubtitle;
  if (recentTitle) recentTitle.textContent = t[lang].recentTitle;
  if (filterTitle) filterTitle.textContent = t[lang].filterTitle;
  if (filterSubtitle) filterSubtitle.textContent = t[lang].filterSubtitle;
  if (filterSearch) filterSearch.placeholder = t[lang].searchPlaceholder;
  if (filterSort) {
    filterSort.options[0].textContent = lang === 'ar' ? 'بدون ترتيب' : 'No sorting';
    filterSort.options[1].textContent = t[lang].priceAsc;
    filterSort.options[2].textContent = t[lang].priceDesc;
    filterSort.options[3].textContent = t[lang].nameAsc;
    filterSort.options[4].textContent = t[lang].nameDesc;
  }
  if (clearFiltersBtn) clearFiltersBtn.textContent = t[lang].clearFilters;
  if (copyFilterLinkBtn) copyFilterLinkBtn.textContent = t[lang].copyLink;
  // re-render menu to refresh category dropdown text
  renderMenu();
}
if (langSelect) {
  langSelect.value = currentLang;
  langSelect.addEventListener('change', () => applyLanguage(langSelect.value));
}
applyLanguage(currentLang);

const adminAddItemForm = document.getElementById('adminAddItemForm');
if (adminAddItemForm) adminAddItemForm.addEventListener('submit', async (e) => { e.preventDefault(); await handleAddItem(adminAddItemForm); });
const storeAddItemForm = document.getElementById('storeAddItemForm');
const adminItemsEl = document.getElementById('adminItems');
const storeItemsEl = document.getElementById('storeItems');

function renderItemsList() {
  const overrides = (function(){ try { return JSON.parse(localStorage.getItem('lolivo_menu_overrides_v1')||'[]'); } catch { return []; }})();
  const render = (el) => {
    if (!el) return;
    if (!overrides.length) { el.innerHTML = '<span class="muted">لا توجد أصناف مضافة</span>'; return; }
    el.innerHTML = overrides.map(({ item }) => `
      <button class="chip" data-edit-id="${item.id}">تعديل «${item.name}»</button>
      <button class="chip" data-edit-image-id="${item.id}" style="background: var(--gold); color: white;">📷 تعديل الصورة</button>
      <button class="chip" data-del-id="${item.id}">حذف</button>
    `).join('');
  };
  render(adminItemsEl); render(storeItemsEl);
}

function bindItemsActions(container) {
  if (!container) return;
  container.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('button[data-edit-id]');
    const editImageBtn = e.target.closest('button[data-edit-image-id]');
    const delBtn = e.target.closest('button[data-del-id]');
    if (editBtn) {
      const id = editBtn.getAttribute('data-edit-id');
      const overrides = JSON.parse(localStorage.getItem('lolivo_menu_overrides_v1')||'[]');
      const entry = overrides.find(x => x.item.id === id);
      if (!entry) return;
      // fill form
      editItemForm.elements['id'].value = id;
      editItemForm.elements['name'].value = entry.item.name || '';
      editItemForm.elements['name_en'].value = entry.item.name_en || '';
      editItemForm.elements['desc'].value = entry.item.desc || '';
      editItemForm.elements['desc_en'].value = entry.item.desc_en || '';
      editItemForm.elements['price'].value = entry.item.price || 0;
      editItemForm.elements['image'].value = '';
      editItemForm.elements['mods'].value = entry.item.mods ? JSON.stringify(entry.item.mods) : '';
      
      // show current image preview
      const currentImagePreview = document.getElementById('currentImagePreview');
      const currentImage = document.getElementById('currentImage');
      if (entry.item.image) {
        currentImage.src = entry.item.image;
        currentImagePreview.style.display = 'block';
      } else {
        currentImagePreview.style.display = 'none';
      }
      
      // preview existing image
      if (editImagePreview) {
        if (entry.item.image) {
          editImagePreview.src = entry.item.image;
          editImagePreview.style.display = 'block';
        } else {
          editImagePreview.style.display = 'none';
        }
      }
      if (removeImageCheckbox) removeImageCheckbox.checked = false;
      openEditItem();
    }
    if (editImageBtn) {
      const id = editImageBtn.getAttribute('data-edit-image-id');
      const overrides = JSON.parse(localStorage.getItem('lolivo_menu_overrides_v1')||'[]');
      const entry = overrides.find(x => x.item.id === id);
      if (!entry) return;
      
      // Fill form with minimal data for image editing only
      editItemForm.elements['id'].value = id;
      editItemForm.elements['name'].value = entry.item.name || '';
      editItemForm.elements['name_en'].value = entry.item.name_en || '';
      editItemForm.elements['desc'].value = entry.item.desc || '';
      editItemForm.elements['desc_en'].value = entry.item.desc_en || '';
      editItemForm.elements['price'].value = entry.item.price || 0;
      editItemForm.elements['image'].value = '';
      editItemForm.elements['mods'].value = entry.item.mods ? JSON.stringify(entry.item.mods) : '';
      
      // Show current image preview
      const currentImagePreview = document.getElementById('currentImagePreview');
      const currentImage = document.getElementById('currentImage');
      if (entry.item.image) {
        currentImage.src = entry.item.image;
        currentImagePreview.style.display = 'block';
      } else {
        currentImagePreview.style.display = 'none';
      }
      
      // Hide edit image preview initially
      if (editImagePreview) {
        editImagePreview.style.display = 'none';
      }
      if (removeImageCheckbox) removeImageCheckbox.checked = false;
      
      // Focus on image section
      setTimeout(() => {
        const imageInput = editItemForm.querySelector('input[name="image"]');
        if (imageInput) imageInput.focus();
      }, 100);
      
      openEditItem();
    }
    if (delBtn) {
      const id = delBtn.getAttribute('data-del-id');
      if (!confirm('تأكيد حذف الصنف؟')) return;
      MenuService.removeItem(id);
      renderMenu();
      renderItemsList();
    }
  });
}

bindItemsActions(adminItemsEl);
bindItemsActions(storeItemsEl);
renderItemsList();

if (editItemForm) {
  editItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(editItemForm);
    const id = fd.get('id');
    const name = (fd.get('name')||'').toString().trim();
    const name_en = (fd.get('name_en')||'').toString().trim();
    const desc = (fd.get('desc')||'').toString().trim();
    const desc_en = (fd.get('desc_en')||'').toString().trim();
    const price = Number(fd.get('price')) || 0;
    let mods;
    try { mods = JSON.parse((fd.get('mods')||'').toString()||'null'); } catch { mods = undefined; }
    if (!name || !(price>0)) { alert(t[currentLang].needNamePrice); return; }
    const file = editItemForm.querySelector('input[name="image"]').files[0];
    let image;
    if (file) image = await readFileAsDataURL(file);
    const updater = { name, name_en, desc, desc_en, price, mods };
    if (image) updater.image = image;
    if (removeImageCheckbox && removeImageCheckbox.checked) updater.image = undefined;
    MenuService.updateItem(id, updater);
    closeEditItem();
    renderMenu();
    renderItemsList();
  });
}

// live preview when selecting new file
if (editItemForm) {
  const fileInput = editItemForm.querySelector('input[name="image"]');
  if (fileInput && editImagePreview) {
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files[0];
      if (!f) { editImagePreview.style.display = 'none'; return; }
      const url = URL.createObjectURL(f);
      editImagePreview.src = url;
      editImagePreview.style.display = 'block';
    });
  }
}

// remove current image button
const removeCurrentImageBtn = document.getElementById('removeCurrentImage');
if (removeCurrentImageBtn) {
  removeCurrentImageBtn.addEventListener('click', () => {
    const currentImagePreview = document.getElementById('currentImagePreview');
    const currentImage = document.getElementById('currentImage');
    const editImagePreview = document.getElementById('editImagePreview');
    
    // Hide current image preview
    currentImagePreview.style.display = 'none';
    currentImage.src = '';
    
    // Hide edit image preview
    if (editImagePreview) {
      editImagePreview.style.display = 'none';
    }
    
    // Clear file input
    const fileInput = editItemForm.querySelector('input[name="image"]');
    if (fileInput) fileInput.value = '';
    
    // Mark for removal
    if (removeImageCheckbox) removeImageCheckbox.checked = true;
  });
}
if (storeAddItemForm) storeAddItemForm.addEventListener('submit', async (e) => { e.preventDefault(); await handleAddItem(storeAddItemForm); });

// Customer customization events
if (closeCustomerCustomizeBtn) closeCustomerCustomizeBtn.addEventListener('click', closeCustomerCustomize);
if (cancelCustomerCustomize) cancelCustomerCustomize.addEventListener('click', closeCustomerCustomize);
if (addToCartCustomized) addToCartCustomized.addEventListener('click', addCustomizedToCart);

// Update price when modifiers change
if (customerModsGroups) {
  customerModsGroups.addEventListener('change', updateCustomerPrice);
}

// Category forms and lists
const adminAddCategoryForm = document.getElementById('adminAddCategoryForm');
const storeAddCategoryForm = document.getElementById('storeAddCategoryForm');
const adminCategoriesEl = document.getElementById('adminCategories');
const storeCategoriesEl = document.getElementById('storeCategories');

function renderCategoriesList() {
  const cats = MenuService.getCategoryOverrides();
  const render = (el) => {
    if (!el) return;
    if (!cats.length) { el.innerHTML = '<span class="muted">لا توجد فئات مضافة</span>'; return; }
    el.innerHTML = cats.map(c => `<button class="chip" data-cat-id="${c.id}">حذف «${c.title}»</button>`).join('');
  };
  render(adminCategoriesEl); render(storeCategoriesEl);
  fillCategorySelects();
  renderMenu();
}

if (adminAddCategoryForm) adminAddCategoryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(adminAddCategoryForm);
  const title = (fd.get('title') || '').toString().trim();
  const description = (fd.get('description') || '').toString().trim();
  if (!title) return alert('يرجى إدخال اسم الفئة');
  const title_en = (fd.get('title_en') || '').toString().trim();
  const description_en = (fd.get('description_en') || '').toString().trim();
  MenuService.addCategory(title, description, title_en, description_en);
  adminAddCategoryForm.reset();
  renderCategoriesList();
});
if (storeAddCategoryForm) storeAddCategoryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(storeAddCategoryForm);
  const title = (fd.get('title') || '').toString().trim();
  const description = (fd.get('description') || '').toString().trim();
  if (!title) return alert('يرجى إدخال اسم الفئة');
  const title_en = (fd.get('title_en') || '').toString().trim();
  const description_en = (fd.get('description_en') || '').toString().trim();
  MenuService.addCategory(title, description, title_en, description_en);
  storeAddCategoryForm.reset();
  renderCategoriesList();
});

function bindCategoryDeletion(container) {
  if (!container) return;
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat-id]');
    if (!btn) return;
    const id = btn.getAttribute('data-cat-id');
    if (!confirm('تأكيد حذف الفئة؟ سيتم حذف الأصناف المُضافة فيها.')) return;
    MenuService.removeCategory(id);
    renderCategoriesList();
  });
}
bindCategoryDeletion(adminCategoriesEl);
bindCategoryDeletion(storeCategoriesEl);

renderCategoriesList();


