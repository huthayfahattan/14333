// ---------- PWA Service Worker Registration ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// ---------- PWA Install Prompt ----------
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button or banner
  showInstallButton();
});

function showInstallButton() {
  // Create install button
  const installBtn = document.createElement('button');
  installBtn.textContent = 'تثبيت التطبيق';
  installBtn.className = 'install-btn';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--brand);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installBtn.remove();
    }
  });
  
  document.body.appendChild(installBtn);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (installBtn.parentNode) {
      installBtn.remove();
    }
  }, 10000);
}

// ---------- Delivery Fee Calculation ----------
class DeliveryService {
  constructor() {
    this.baseFee = 15; // رسوم التوصيل الأساسية
    this.freeDeliveryThreshold = 100; // الحد الأدنى للطلب المجاني
    this.distanceRates = {
      'near': { multiplier: 1, maxDistance: 5 }, // قريب (0-5 كم)
      'medium': { multiplier: 1.5, maxDistance: 10 }, // متوسط (5-10 كم)
      'far': { multiplier: 2, maxDistance: 20 } // بعيد (10-20 كم)
    };
    this.timeRates = {
      'normal': 1, // وقت عادي
      'rush': 1.3, // وقت الذروة (6-9 مساءً)
      'late': 1.5 // وقت متأخر (بعد 10 مساءً)
    };
  }

  // حساب رسوم التوصيل
  calculateDeliveryFee(orderTotal, distance, deliveryTime = 'normal') {
    let fee = this.baseFee;
    
    // تطبيق مضاعف المسافة
    const distanceCategory = this.getDistanceCategory(distance);
    fee *= this.distanceRates[distanceCategory].multiplier;
    
    // تطبيق مضاعف الوقت
    fee *= this.timeRates[deliveryTime] || 1;
    
    // خصم للطلبات الكبيرة
    if (orderTotal >= this.freeDeliveryThreshold) {
      fee = 0; // توصيل مجاني
    }
    
    return Math.round(fee * 100) / 100; // تقريب لرقمين عشريين
  }

  // تحديد فئة المسافة
  getDistanceCategory(distance) {
    if (distance <= 5) return 'near';
    if (distance <= 10) return 'medium';
    return 'far';
  }

  // حساب وقت التوصيل المتوقع
  calculateDeliveryTime(distance, orderComplexity = 'normal') {
    const baseTime = 30; // 30 دقيقة أساسية
    const distanceTime = distance * 3; // 3 دقائق لكل كم
    const complexityMultiplier = {
      'simple': 1,
      'normal': 1.2,
      'complex': 1.5
    };
    
    const totalMinutes = (baseTime + distanceTime) * complexityMultiplier[orderComplexity];
    return Math.round(totalMinutes);
  }

  // الحصول على معلومات التوصيل الكاملة
  getDeliveryInfo(orderTotal, distance, deliveryTime = 'normal', orderComplexity = 'normal') {
    const fee = this.calculateDeliveryFee(orderTotal, distance, deliveryTime);
    const estimatedTime = this.calculateDeliveryTime(distance, orderComplexity);
    
    return {
      fee: fee,
      estimatedTime: estimatedTime,
      isFree: fee === 0,
      distanceCategory: this.getDistanceCategory(distance),
      breakdown: {
        baseFee: this.baseFee,
        distanceMultiplier: this.distanceRates[this.getDistanceCategory(distance)].multiplier,
        timeMultiplier: this.timeRates[deliveryTime] || 1,
        freeDeliveryThreshold: this.freeDeliveryThreshold
      }
    };
  }
}

// إنشاء مثيل من خدمة التوصيل
const deliveryService = new DeliveryService();

// ---------- Firebase Database Services ----------
class FirebaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    // انتظار تحميل Firebase
    while (!window.firebase) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.db = window.firebase.db;
    this.isInitialized = true;
    console.log('Firebase initialized successfully');
  }

  // حفظ الطلبات في قاعدة البيانات
  async saveOrder(order) {
    await this.init();
    try {
      const docRef = await window.firebase.addDoc(window.firebase.collection(this.db, 'orders'), {
        ...order,
        createdAt: new Date(),
        status: 'pending'
      });
      console.log('Order saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }

  // جلب جميع الطلبات
  async getOrders() {
    await this.init();
    try {
      const querySnapshot = await window.firebase.getDocs(window.firebase.collection(this.db, 'orders'));
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  // تحديث حالة الطلب
  async updateOrderStatus(orderId, status) {
    await this.init();
    try {
      const orderRef = window.firebase.doc(this.db, 'orders', orderId);
      await window.firebase.updateDoc(orderRef, {
        status: status,
        updatedAt: new Date()
      });
      console.log('Order status updated:', orderId, status);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // حفظ القائمة في قاعدة البيانات
  async saveMenu(menu) {
    await this.init();
    try {
      const menuRef = window.firebase.doc(this.db, 'restaurant', 'menu');
      await window.firebase.updateDoc(menuRef, {
        categories: menu,
        updatedAt: new Date()
      });
      console.log('Menu saved successfully');
    } catch (error) {
      console.error('Error saving menu:', error);
      throw error;
    }
  }

  // جلب القائمة من قاعدة البيانات
  async getMenu() {
    await this.init();
    try {
      const menuRef = window.firebase.doc(this.db, 'restaurant', 'menu');
      const menuSnap = await window.firebase.getDocs(window.firebase.collection(this.db, 'restaurant'));
      
      if (menuSnap.exists()) {
        return menuSnap.data().categories || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting menu:', error);
      return [];
    }
  }

  // الاستماع للتغييرات في الطلبات (للمطعم)
  onOrdersChange(callback) {
    this.init().then(() => {
      const ordersRef = window.firebase.collection(this.db, 'orders');
      window.firebase.onSnapshot(ordersRef, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        callback(orders);
      });
    });
  }
}

// إنشاء مثيل من خدمة Firebase
const firebaseService = new FirebaseService();

// Data: Menu of L'olivo
const defaultMenu = [
  {
    id: 'sandwiches-signature',
    title: '🥪 Signature Sandwiches',
    description: 'Selection of the finest L\'olivo signature sandwiches',
    items: [
      { id: 'special-sandwich', name: "L'olivo Special Sandwich", desc: 'Emmental & Cheddar cheese, artichoke, oregano, special sauce', price: 27.6, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.8, deliveryTime: '15-20 min' },
      { id: 'cheese-club', name: 'Cheese Club Sandwich', desc: 'Parmesan & Emmental, tomatoes, oregano + sauce', price: 33.35, image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '12-18 min' },
      { id: 'roast-beef', name: 'Roast Beef Sandwich', desc: 'Smoked roast beef, emmental, mustard, oregano + sauce', price: 32.2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center', rating: 4.7, deliveryTime: '15-20 min' },
      { id: 'italian-tuna', name: 'Italian Tuna Sandwich', desc: 'Italian tuna, emmental, tomatoes, oregano + sauce', price: 39.1, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '10-15 min' },
      { id: 'mozzarella-bufala', name: 'Mozzarella Bufala Sandwich', desc: 'Mozzarella bufala, tomatoes, oregano, pesto, olive ciabatta bread', price: 33.35, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.9, deliveryTime: '18-25 min' },
      { id: 'turkey-royal', name: 'Turkey Royal', desc: 'Smoked turkey, emmental, tomatoes, oregano + sauce', price: 51.75, image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&crop=center', rating: 4.8, deliveryTime: '20-25 min' },
    ],
  },
  {
    id: 'gathering-boxes',
    title: '🎁 Party Boxes',
    description: 'Variety of options for parties and gatherings',
    items: [
      { id: 'make-your-box', name: 'Make Your Box', desc: 'All six signature sandwich varieties', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'mini-bites', name: 'L\'olivo Mini Bites Box', desc: 'All six signature sandwich varieties', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'small-focaccia', name: 'Small Focaccia Box', desc: 'All six signature sandwich varieties', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'pretzel-box', name: 'Pretzel Box', desc: 'All six signature sandwich varieties', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
      { id: 'croissant-box', name: 'Croissant Box', desc: 'All six signature sandwich varieties', price: 198.95, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'grilled-meat',
    title: '🥩 Grilled Sandwiches & Meat Dishes',
    description: 'Delicious and tender grilled specialties',
    items: [
      { id: 'grilled-chicken-pesto', name: 'Grilled Chicken Pesto', price: 36, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop&crop=center', rating: 4.7, deliveryTime: '20-25 min' },
      { id: 'grilled-halloumi-pesto', name: 'Grilled Halloumi Pesto', price: 34, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '15-20 min' },
      { id: 'manzo-tenderloin', name: 'Marinated Manzo Tenderloin', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.9, deliveryTime: '25-30 min' },
      { id: 'truffle-steak', name: 'Truffle Steak', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', featured: true, rating: 4.8, deliveryTime: '25-30 min' },
      { id: 'steak-frites', name: 'Steak Frites', price: 49.45, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '25-30 min' },
    ],
  },
  {
    id: 'salads',
    title: '🥗 Salads',
    description: 'Fresh and balanced salads',
    items: [
      { id: 'lolivo-salad', name: 'L\'olivo Salad', desc: 'Organic lettuce, arugula, cherry tomatoes, parmesan, oregano, balsamic vinegar', price: 32, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.6, deliveryTime: '8-12 min' },
      { id: 'caesar-chicken', name: 'Chicken Caesar Salad', desc: 'Marinated chicken, lettuce, croutons, parmesan, caesar dressing', price: 32, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.5, deliveryTime: '10-15 min' },
      { id: 'chicken-feta', name: 'Chicken & Feta Salad', desc: 'Marinated chicken, lettuce, feta cheese, cherry tomatoes, lemon olive oil', price: 29, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', rating: 4.4, deliveryTime: '8-12 min' },
    ],
  },
  {
    id: 'sides',
    title: '🧀 Popular Side Dishes',
    description: 'Sharing plates and appetizers',
    items: [
      { id: 'big-cheese-platter', name: 'Big Cheese Platter', price: 259, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'fries',
    title: '🍟 French Fries',
    description: 'Crispy and hot',
    items: [
      { id: 'truffle-fries', name: 'Truffle Fries', price: 18, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center' },
      { id: 'salt-pepper-fries', name: 'Salt & Pepper Fries', price: 17, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center' },
    ],
  },
  {
    id: 'drinks',
    title: '🥤 Beverages',
    description: 'Refreshing and natural',
    items: [
      { id: 'soda', name: 'Soft Drinks', desc: 'Coca Cola, Sprite, and more', price: 5, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop&crop=center' },
      { id: 'mango-strawberry-juice', name: 'Fresh Mango / Strawberry Juice', price: 12, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center' },
      { id: 'orange-juice', name: 'Fresh Orange Juice', price: 12, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center' },
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
const muteToggle = document.getElementById('muteToggle');
const testRingtoneBtn = document.getElementById('testRingtone');
const sandwichCustomizeModal = document.getElementById('sandwichCustomizeModal');
const closeSandwichCustomizeBtn = document.getElementById('closeSandwichCustomizeBtn');
const cancelSandwichCustomize = document.getElementById('cancelSandwichCustomize');
const addSandwichToCart = document.getElementById('addSandwichToCart');
const sandwichItemImage = document.getElementById('sandwichItemImage');
const sandwichItemName = document.getElementById('sandwichItemName');
const sandwichItemDesc = document.getElementById('sandwichItemDesc');
const sandwichBasePrice = document.getElementById('sandwichBasePrice');
const sandwichBasePriceDisplay = document.getElementById('sandwichBasePriceDisplay');
const sandwichTotalPrice = document.getElementById('sandwichTotalPrice');
const sandwichPriceModifiers = document.getElementById('sandwichPriceModifiers');
const sandwichSpecialNotes = document.getElementById('sandwichSpecialNotes');
let currentCustomizingSandwich = null;
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
const supportBtn = document.getElementById('supportBtn');
const supportModal = document.getElementById('supportModal');
const closeSupportBtn = document.getElementById('closeSupportBtn');
const chatForm = document.getElementById('chatForm');
const contactInfo = document.getElementById('contactInfo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
let modsBuilderTargetTextarea = null;
let currentCustomizingItem = null;

// Utils
let currentLang = 'en';
const t = {
  en: {
    noCart: 'Cart is empty', invoice: 'Show invoice',
    total: 'Total', orderNum: 'Order #', print: 'Print / Save PDF',
    addedItem: 'Item added successfully', needNamePrice: 'Please enter valid name and price'
  }
};
const formatPrice = (num) => `$${num.toFixed(2)}`;
const saLocaleDateTime = (iso) => new Date(iso).toLocaleString('en-US');

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
  let filteredCats = menu;

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
    // Check if it's a sandwich (contains "sandwich" in name or category)
    const isSandwich = item.name.toLowerCase().includes('sandwich') || 
                      (item.category && item.category.toLowerCase().includes('sandwich'));
    
    if (isSandwich) {
      openSandwichCustomize(item);
    } else {
      openCustomerCustomize(item);
    }
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

// تحديث دالة حساب الإجماليات لتشمل رسوم التوصيل
function calcTotals() {
  let count = 0;
  let subtotal = 0;
  for (const { item, qty } of cart.values()) {
    count += qty;
    const itemPrice = item.customization ? item.customization.finalPrice : item.price;
    subtotal += itemPrice * qty;
  }
  
  // حساب رسوم التوصيل
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  
  return { count, subtotal, deliveryFee, total };
}

// حساب رسوم التوصيل
function calculateDeliveryFee(orderTotal) {
  const fulfillment = document.querySelector('select[name="fulfillment"]')?.value;
  const distance = parseFloat(document.querySelector('input[name="distance"]')?.value) || 0;
  
  if (fulfillment === 'pickup') {
    return 0; // لا توجد رسوم للاستلام
  }
  
  if (fulfillment === 'delivery' && distance > 0) {
    // تحديد وقت التوصيل بناءً على الوقت الحالي
    const now = new Date();
    const hour = now.getHours();
    let deliveryTime = 'normal';
    
    if (hour >= 18 && hour <= 21) {
      deliveryTime = 'rush'; // وقت الذروة
    } else if (hour >= 22 || hour <= 6) {
      deliveryTime = 'late'; // وقت متأخر
    }
    
    // حساب تعقيد الطلب بناءً على عدد الأصناف
    const itemCount = Array.from(cart.values()).reduce((sum, { qty }) => sum + qty, 0);
    let orderComplexity = 'normal';
    if (itemCount <= 2) orderComplexity = 'simple';
    else if (itemCount >= 6) orderComplexity = 'complex';
    
    const deliveryInfo = deliveryService.getDeliveryInfo(orderTotal, distance, deliveryTime, orderComplexity);
    return deliveryInfo.fee;
  }
  
  return 0;
}

// تحديث عرض الإجماليات في السلة
function updateCartTotals() {
  const totals = calcTotals();
  const cartSubtotal = document.getElementById('cartSubtotal');
  const deliveryFeeLine = document.getElementById('deliveryFeeLine');
  const deliveryFeeAmount = document.getElementById('deliveryFeeAmount');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cartSubtotal) cartSubtotal.textContent = formatPrice(totals.subtotal);
  if (cartTotal) cartTotal.textContent = formatPrice(totals.total);
  
  // عرض/إخفاء رسوم التوصيل
  if (deliveryFeeLine && deliveryFeeAmount) {
    if (totals.deliveryFee > 0) {
      deliveryFeeLine.style.display = 'flex';
      deliveryFeeAmount.textContent = formatPrice(totals.deliveryFee);
    } else {
      deliveryFeeLine.style.display = 'none';
    }
  }
}

function updateCartUI() {
  const totals = calcTotals();
  cartCountEl.textContent = String(totals.count);
  cartTotalEl.textContent = formatPrice(totals.total);
  
  // تحديث عرض الإجماليات في السلة
  updateCartTotals();
  
  checkoutBtn.disabled = totals.count === 0;

  if (totals.count === 0) {
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

// Support functions
function openSupport() {
  supportModal.classList.add('open');
  supportModal.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
}

function closeSupport() {
  supportModal.classList.remove('open');
  supportModal.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
  // Reset support views
  chatForm.style.display = 'none';
  contactInfo.style.display = 'none';
}

function handleSupportOption(type) {
  // Hide all support views
  chatForm.style.display = 'none';
  contactInfo.style.display = 'none';
  
  switch(type) {
    case 'chat':
      chatForm.style.display = 'block';
      chatInput.focus();
      break;
    case 'phone':
      window.location.href = 'tel:+966501234567';
      break;
    case 'whatsapp':
      window.open('https://wa.me/966501234567', '_blank');
      break;
    case 'email':
      window.location.href = 'mailto:support@lolivo.com';
      break;
  }
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Simulate bot response
  setTimeout(() => {
    const responses = [
      'شكراً لك على رسالتك. سأقوم بالرد عليك في أقرب وقت ممكن.',
      'تم استلام رسالتك. فريق الدعم سيتواصل معك قريباً.',
      'نقدر تواصلك معنا. هل تحتاج مساعدة في شيء محدد؟',
      'مرحباً! كيف يمكنني مساعدتك اليوم؟'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'bot');
  }, 1000);
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const now = new Date();
  const time = now.toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${text}</p>
    </div>
    <div class="message-time">${time}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
backdrop.addEventListener('click', () => { closeCart(); closeCheckout(); closeEditItem(); closeCustomize(); closeCustomerCustomize(); closeSupport(); });

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
    const distanceField = checkoutForm.querySelector('.distance-field');
    if (e.target.value === 'delivery') {
      addressField.hidden = false;
      distanceField.hidden = false;
      addressField.querySelector('input').required = true;
      distanceField.querySelector('input').required = true;
    } else {
      addressField.hidden = true;
      distanceField.hidden = true;
      addressField.querySelector('input').required = false;
      distanceField.querySelector('input').required = false;
    }
    // تحديث رسوم التوصيل عند تغيير طريقة الاستلام
    updateCartTotals();
  }
  
  // تحديث رسوم التوصيل عند تغيير المسافة
  if (e.target.name === 'distance') {
    updateCartTotals();
  }
});

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const order = {
    customer: {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      fulfillment: formData.get('fulfillment'),
      address: formData.get('address') || undefined,
      distance: parseFloat(formData.get('distance')) || undefined,
      notes: formData.get('notes') || undefined,
    },
    items: Array.from(cart.values()).map(({ item, qty }) => ({ 
      id: item.id, 
      name: item.name, 
      price: item.customization ? item.customization.finalPrice : item.price, 
      qty,
      customization: item.customization || undefined
    })),
    totals: calcTotals(),
    createdAt: new Date().toISOString(),
  };

  try {
    // حفظ الطلب في Firebase
    const orderId = await firebaseService.saveOrder(order);
    
    // عرض رسالة النجاح
    alert(currentLang === 'ar' ? 
      `تم استلام طلبك بنجاح!\nالإجمالي: ${formatPrice(order.totals.total)}\nرقم الطلب: ${orderId}` : 
      `Order received!\nTotal: ${formatPrice(order.totals.total)}\nOrder ID: ${orderId}`);
    
    // حفظ محلياً أيضاً للنسخ الاحتياطي
    const created = OrdersService.create(order);
    addRecentOrder(created.id);
    
    // عرض الفاتورة
    openInvoice(created);
    
    // تنظيف السلة
    cart.clear();
    updateCartUI();
    closeCheckout();
    checkoutForm.reset();
    
  } catch (error) {
    console.error('Error saving order:', error);
    alert(currentLang === 'ar' ? 
      'حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.' : 
      'Error saving order. Please try again.');
  }
});

// Init
renderCategoryNav();
renderMenu();
updateCartUI();
yearEl.textContent = new Date().getFullYear();

// ---------- Filter state in URL ----------
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
storeOrdersEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="status"]');
  if (!btn) return;
  
  const orderId = btn.getAttribute('data-id');
  const newStatus = btn.getAttribute('data-status');
  
  try {
    // تحديث في Firebase
    await firebaseService.updateOrderStatus(orderId, newStatus);
    
    // تحديث محلياً أيضاً
    OrdersService.updateStatus(orderId, newStatus);
    
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('حدث خطأ في تحديث حالة الطلب');
  }
});
OrdersService.subscribe(() => {
  if (!storeView.hidden) renderStore();
  if (!adminView.hidden) renderAdmin();
});

// الاستماع للتغييرات في الطلبات من Firebase (للمطعم)
firebaseService.onOrdersChange((orders) => {
  if (!storeView.hidden) {
    renderStoreOrders(orders);
  }
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

// ---------- Sandwich customization functions ----------
function openSandwichCustomize(item) {
  currentCustomizingSandwich = item;
  
  // Populate item info
  sandwichItemImage.src = item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg2MFY2MEgyMFYyMFoiIHN0cm9rZT0iI0NDQyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0zMCAzMEg1MFY1MEgzMFYzMFoiIHN0cm9rZT0iI0NDQyIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=';
  sandwichItemImage.alt = item.name;
  sandwichItemName.textContent = item.name;
  sandwichItemDesc.textContent = item.desc || '';
  sandwichBasePrice.textContent = formatPrice(item.price);
  sandwichBasePriceDisplay.textContent = formatPrice(item.price);
  
  // Reset form
  document.querySelector('input[name="breadType"][value="white"]').checked = true;
  document.querySelectorAll('input[name="extraIngredients"]').forEach(cb => cb.checked = false);
  sandwichSpecialNotes.value = '';
  
  // Update price
  updateSandwichPrice();
  
  // Show modal
  sandwichCustomizeModal.hidden = false;
  sandwichCustomizeModal.setAttribute('aria-hidden', 'false');
}

function closeSandwichCustomize() {
  sandwichCustomizeModal.hidden = true;
  sandwichCustomizeModal.setAttribute('aria-hidden', 'true');
  currentCustomizingSandwich = null;
}

function updateSandwichPrice() {
  if (!currentCustomizingSandwich) return;
  
  let totalPrice = currentCustomizingSandwich.price;
  let modifiers = [];
  
  // Bread type price
  const breadType = document.querySelector('input[name="breadType"]:checked').value;
  const breadPrices = {
    'white': 0,
    'wholewheat': 0,
    'ciabatta': 2,
    'baguette': 1.5
  };
  const breadPrice = breadPrices[breadType] || 0;
  if (breadPrice > 0) {
    totalPrice += breadPrice;
    modifiers.push({ name: `${breadType.charAt(0).toUpperCase() + breadType.slice(1)} Bread`, price: breadPrice });
  }
  
  // Extra ingredients
  const extraIngredients = document.querySelectorAll('input[name="extraIngredients"]:checked');
  const ingredientPrices = {
    'extra-cheese': 3,
    'extra-meat': 5,
    'bacon': 4,
    'avocado': 3.5,
    'mushrooms': 2.5,
    'onions': 1.5,
    'pickles': 1,
    'jalapenos': 2
  };
  
  extraIngredients.forEach(ingredient => {
    const price = ingredientPrices[ingredient.value] || 0;
    if (price > 0) {
      totalPrice += price;
      const name = ingredient.nextElementSibling.textContent;
      modifiers.push({ name, price });
    }
  });
  
  // Update display
  sandwichTotalPrice.textContent = formatPrice(totalPrice);
  
  // Update modifiers list
  sandwichPriceModifiers.innerHTML = modifiers
    .map(mod => `<div class="price-modifier-line"><span>${mod.name}</span><span>+${formatPrice(mod.price)}</span></div>`)
    .join('');
}

function addCustomizedSandwichToCart() {
  if (!currentCustomizingSandwich) return;
  
  // Collect customization data
  const breadType = document.querySelector('input[name="breadType"]:checked').value;
  const extraIngredients = Array.from(document.querySelectorAll('input[name="extraIngredients"]:checked'))
    .map(cb => cb.nextElementSibling.textContent);
  const specialNotes = sandwichSpecialNotes.value.trim();
  
  // Calculate final price
  let finalPrice = currentCustomizingSandwich.price;
  const breadPrices = { 'white': 0, 'wholewheat': 0, 'ciabatta': 2, 'baguette': 1.5 };
  const ingredientPrices = { 'extra-cheese': 3, 'extra-meat': 5, 'bacon': 4, 'avocado': 3.5, 'mushrooms': 2.5, 'onions': 1.5, 'pickles': 1, 'jalapenos': 2 };
  
  finalPrice += breadPrices[breadType] || 0;
  document.querySelectorAll('input[name="extraIngredients"]:checked').forEach(cb => {
    finalPrice += ingredientPrices[cb.value] || 0;
  });
  
  // Create customized item
  const customizedItem = {
    ...currentCustomizingSandwich,
    customization: {
      breadType,
      extraIngredients,
      specialNotes,
      finalPrice
    }
  };
  
  // Add to cart
  addToCart(customizedItem);
  
  // Close modal
  closeSandwichCustomize();
}

// ---------- Store settings events ----------
if (muteToggle) {
  muteToggle.addEventListener('change', () => {
    isMuted = muteToggle.checked;
    localStorage.setItem('lolivo_mute', JSON.stringify(isMuted));
  });
}
if (testRingtoneBtn) {
  testRingtoneBtn.addEventListener('click', () => playNewOrderSound());
}

// ---------- Sandwich customization events ----------
if (closeSandwichCustomizeBtn) {
  closeSandwichCustomizeBtn.addEventListener('click', closeSandwichCustomize);
}
if (cancelSandwichCustomize) {
  cancelSandwichCustomize.addEventListener('click', closeSandwichCustomize);
}
if (addSandwichToCart) {
  addSandwichToCart.addEventListener('click', addCustomizedSandwichToCart);
}

// Listen for changes in customization options
document.addEventListener('change', (e) => {
  if (e.target.name === 'breadType' || e.target.name === 'extraIngredients') {
    updateSandwichPrice();
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

// Support events
if (supportBtn) supportBtn.addEventListener('click', openSupport);
if (closeSupportBtn) closeSupportBtn.addEventListener('click', closeSupport);

// Support options
document.addEventListener('click', (e) => {
  const supportOption = e.target.closest('.support-option');
  if (supportOption) {
    const type = supportOption.dataset.type;
    handleSupportOption(type);
  }
});

// Chat events
if (sendMessageBtn) sendMessageBtn.addEventListener('click', sendMessage);
if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
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


