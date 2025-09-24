// ---------- Customer Version - L'olivo Restaurant ----------

// Business Information
const BUSINESS_INFO = {
  companyName: 'L\'olivo Food Services LLC',
  legalName: 'L\'olivo Food Services LLC',
  dunsNumber: '123456789',
  registrationNumber: '1010123456',
  taxId: '300123456789003',
  commercialLicense: '4030123456789',
  address: {
    street: 'King Fahd Road',
    city: 'Riyadh',
    state: 'Riyadh Province',
    postalCode: '12345',
    country: 'Saudi Arabia'
  },
  contact: {
    phone: '+966 11 234 5678',
    email: 'info@lolivo.com',
    website: 'https://lolivo.com'
  }
};

// PWA Service Worker Registration
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

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  const installBtn = document.createElement('button');
  installBtn.textContent = 'Install App';
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
  
  setTimeout(() => {
    if (installBtn.parentNode) {
      installBtn.remove();
    }
  }, 10000);
}

// Delivery Fee Calculation
class DeliveryService {
  constructor() {
    this.baseFee = 15;
    this.freeDeliveryThreshold = 100;
    this.distanceRates = {
      'near': { multiplier: 1, maxDistance: 5 },
      'medium': { multiplier: 1.5, maxDistance: 10 },
      'far': { multiplier: 2, maxDistance: 20 }
    };
    this.timeRates = {
      'normal': 1,
      'rush': 1.3,
      'late': 1.5
    };
  }

  calculateDeliveryFee(orderTotal, distance, deliveryTime = 'normal') {
    let fee = this.baseFee;
    
    const distanceCategory = this.getDistanceCategory(distance);
    fee *= this.distanceRates[distanceCategory].multiplier;
    
    fee *= this.timeRates[deliveryTime] || 1;
    
    if (orderTotal >= this.freeDeliveryThreshold) {
      fee = 0;
    }
    
    return Math.round(fee * 100) / 100;
  }

  getDistanceCategory(distance) {
    if (distance <= 5) return 'near';
    if (distance <= 10) return 'medium';
    return 'far';
  }

  calculateDeliveryTime(distance, orderComplexity = 'normal') {
    const baseTime = 30;
    const distanceTime = distance * 3;
    const complexityMultiplier = {
      'simple': 1,
      'normal': 1.2,
      'complex': 1.5
    };
    
    const totalMinutes = (baseTime + distanceTime) * complexityMultiplier[orderComplexity];
    return Math.round(totalMinutes);
  }
}

const deliveryService = new DeliveryService();

// Firebase Service
class FirebaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    while (!window.firebase) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.db = window.firebase.db;
    this.isInitialized = true;
    console.log('Firebase initialized successfully');
  }

  async saveOrder(order) {
    await this.init();
    try {
      const docRef = await window.firebase.addDoc(window.firebase.collection(this.db, 'orders'), {
        ...order,
        createdAt: new Date(),
        status: 'pending'
      });
      console.log('Order saved with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving order: ', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    await this.init();
    try {
      const orderRef = window.firebase.doc(this.db, 'orders', orderId);
      await window.firebase.updateDoc(orderRef, {
        status: status,
        updatedAt: new Date()
      });
      console.log('Order status updated to: ', status);
    } catch (error) {
      console.error('Error updating order status: ', error);
      throw error;
    }
  }

  onOrdersChange(callback) {
    this.init().then(() => {
      const ordersRef = window.firebase.collection(this.db, 'orders');
      return window.firebase.onSnapshot(ordersRef, callback);
    });
  }
}

const firebaseService = new FirebaseService();

// Menu Service
class MenuService {
  constructor() {
    this.menu = this.loadMenu();
    this.categories = this.loadCategories();
  }

  loadMenu() {
    const saved = localStorage.getItem('lolivo_menu');
    return saved ? JSON.parse(saved) : this.getDefaultMenu();
  }

  loadCategories() {
    const saved = localStorage.getItem('lolivo_categories');
    return saved ? JSON.parse(saved) : this.getDefaultCategories();
  }

  getDefaultMenu() {
    return [
      {
        id: 'special-sandwich',
        name: 'L\'olivo Special Sandwich',
        desc: 'Grilled chicken breast with mozzarella cheese, fresh vegetables, and our signature sauce',
        price: 27.6,
        category: 'sandwiches-signature',
        image: '',
        modifiers: [],
        featured: true,
        rating: 4.8,
        deliveryTime: '25-30 minutes'
      },
      {
        id: 'chicken-grilled',
        name: 'Grilled Chicken Sandwich',
        desc: 'Tender grilled chicken with lettuce, tomato, and garlic sauce',
        price: 24.0,
        category: 'sandwiches-signature',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.5,
        deliveryTime: '20-25 minutes'
      },
      {
        id: 'beef-sandwich',
        name: 'Beef Sandwich',
        desc: 'Premium beef with grilled vegetables and special sauce',
        price: 32.0,
        category: 'sandwiches-signature',
        image: '',
        modifiers: [],
        featured: true,
        rating: 4.7,
        deliveryTime: '25-30 minutes'
      },
      {
        id: 'caesar-salad',
        name: 'Caesar Salad',
        desc: 'Fresh lettuce with Caesar dressing, croutons, and parmesan cheese',
        price: 18.0,
        category: 'salads',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.3,
        deliveryTime: '15-20 minutes'
      },
      {
        id: 'mixed-salad',
        name: 'Mixed Salad',
        desc: 'Fresh mixed vegetables with olive oil and lemon dressing',
        price: 15.0,
        category: 'salads',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.2,
        deliveryTime: '15-20 minutes'
      },
      {
        id: 'chicken-box',
        name: 'Chicken Box',
        desc: 'Grilled chicken pieces with rice and vegetables',
        price: 35.0,
        category: 'boxes',
        image: '',
        modifiers: [],
        featured: true,
        rating: 4.6,
        deliveryTime: '30-35 minutes'
      },
      {
        id: 'beef-box',
        name: 'Beef Box',
        desc: 'Grilled beef with rice and mixed vegetables',
        price: 42.0,
        category: 'boxes',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.5,
        deliveryTime: '30-35 minutes'
      },
      {
        id: 'fresh-juice',
        name: 'Fresh Juice',
        desc: 'Freshly squeezed orange juice',
        price: 8.0,
        category: 'beverages',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.4,
        deliveryTime: '10-15 minutes'
      },
      {
        id: 'soft-drink',
        name: 'Soft Drink',
        desc: 'Coca Cola, Pepsi, or Sprite',
        price: 6.0,
        category: 'beverages',
        image: '',
        modifiers: [],
        featured: false,
        rating: 4.0,
        deliveryTime: '5-10 minutes'
      }
    ];
  }

  getDefaultCategories() {
    return [
      {
        id: 'sandwiches-signature',
        title: '🥪 Signature Sandwiches',
        description: 'Selection of the finest L\'olivo signature sandwiches'
      },
      {
        id: 'salads',
        title: '🥗 Fresh Salads',
        description: 'Fresh and healthy salad options'
      },
      {
        id: 'boxes',
        title: '📦 Meal Boxes',
        description: 'Complete meals with rice and grilled meat'
      },
      {
        id: 'beverages',
        title: '🥤 Beverages',
        description: 'Fresh juices and soft drinks'
      }
    ];
  }

  saveMenu() {
    localStorage.setItem('lolivo_menu', JSON.stringify(this.menu));
  }

  saveCategories() {
    localStorage.setItem('lolivo_categories', JSON.stringify(this.categories));
  }

  getMenu() {
    return this.menu;
  }

  getCategories() {
    return this.categories;
  }

  getItemsByCategory(categoryId) {
    return this.menu.filter(item => item.category === categoryId);
  }

  getItemById(id) {
    return this.menu.find(item => item.id === id);
  }
}

const menuService = new MenuService();

// Cart Service
class CartService {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('lolivo_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('lolivo_cart', JSON.stringify(this.items));
  }

  addItem(item, customization = null) {
    const existingItem = this.items.find(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.customization) === JSON.stringify(customization)
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      this.items.push({
        ...item,
        qty: 1,
        customization: customization
      });
    }

    this.saveCart();
    this.updateCartUI();
  }

  removeItem(itemId, customization = null) {
    this.items = this.items.filter(cartItem => 
      !(cartItem.id === itemId && 
        JSON.stringify(cartItem.customization) === JSON.stringify(customization))
    );
    this.saveCart();
    this.updateCartUI();
  }

  changeQty(itemId, qty, customization = null) {
    const item = this.items.find(cartItem => 
      cartItem.id === itemId && 
      JSON.stringify(cartItem.customization) === JSON.stringify(customization)
    );

    if (item) {
      if (qty <= 0) {
        this.removeItem(itemId, customization);
      } else {
        item.qty = qty;
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
  }

  getCart() {
    return this.items;
  }

  getCartCount() {
    return this.items.reduce((total, item) => total + item.qty, 0);
  }

  getCartTotal() {
    return this.items.reduce((total, item) => {
      const price = item.customization?.finalPrice || item.price;
      return total + (price * item.qty);
    }, 0);
  }

  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const deliveryFeeAmount = document.getElementById('deliveryFeeAmount');
    const totalAmount = document.getElementById('totalAmount');

    if (cartCount) cartCount.textContent = this.getCartCount();

    if (cartItems) {
      cartItems.innerHTML = '';
      this.items.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        
        const price = item.customization?.finalPrice || item.price;
        const customizationText = item.customization ? 
          `<div class="customization-details">
            ${item.customization.breadType ? `<div>Bread: ${item.customization.breadType}</div>` : ''}
            ${item.customization.extraIngredients?.length ? `<div>Extra: ${item.customization.extraIngredients.join(', ')}</div>` : ''}
            ${item.customization.specialNotes ? `<div>Notes: ${item.customization.specialNotes}</div>` : ''}
          </div>` : '';

        cartItemEl.innerHTML = `
          <div class="item-info">
            <h4>${item.name}</h4>
            ${customizationText}
          </div>
          <div class="item-controls">
            <button onclick="cartService.changeQty('${item.id}', ${item.qty - 1}, ${JSON.stringify(item.customization).replace(/"/g, '&quot;')})">-</button>
            <span>${item.qty}</span>
            <button onclick="cartService.changeQty('${item.id}', ${item.qty + 1}, ${JSON.stringify(item.customization).replace(/"/g, '&quot;')})">+</button>
          </div>
          <div class="item-price">$${price.toFixed(2)}</div>
        `;
        cartItems.appendChild(cartItemEl);
      });
    }

    const subtotal = this.getCartTotal();
    const deliveryFee = calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;

    if (subtotalAmount) subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryFeeAmount) deliveryFeeAmount.textContent = `$${deliveryFee.toFixed(2)}`;
    if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
  }
}

const cartService = new CartService();

// Utility Functions
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function saLocaleDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateDeliveryFee(subtotal) {
  const distance = parseFloat(document.getElementById('distance')?.value || 5);
  return deliveryService.calculateDeliveryFee(subtotal, distance);
}

// Language Support
const currentLang = 'en';

const t = {
  en: {
    // Customer interface translations
    addToCart: 'Add to Cart',
    customize: 'Customize',
    placeOrder: 'Place Order',
    yourOrder: 'Your Order',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    completeOrder: 'Complete Your Order',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    orderType: 'Order Type',
    pickup: 'Pickup',
    delivery: 'Delivery',
    deliveryAddress: 'Delivery Address',
    distance: 'Distance (km)',
    specialInstructions: 'Special Instructions',
    orderSummary: 'Order Summary',
    submitOrder: 'Place Order',
    customizeOrder: 'Customize Your Order',
    breadType: 'Bread Type',
    additionalOptions: 'Additional Options',
    specialNotes: 'Special Notes',
    basePrice: 'Base Price',
    cancel: 'Cancel',
    addToCartCustomized: 'Add to Cart',
    customizeSandwich: 'Customize Your Sandwich',
    extraIngredients: 'Extra Ingredients',
    specialInstructions: 'Special Instructions',
    customerSupport: 'Customer Support',
    liveChat: 'Live Chat',
    phoneSupport: 'Phone Support',
    whatsapp: 'WhatsApp',
    emailSupport: 'Email Support',
    contactInformation: 'Contact Information',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    whatAreYourDeliveryHours: 'What are your delivery hours?',
    weDeliverDailyFrom10AMTo12AM: 'We deliver daily from 10 AM to 12 AM.',
    howLongDoesDeliveryTake: 'How long does delivery take?',
    deliveryTypicallyTakes30To45Minutes: 'Delivery typically takes 30-45 minutes depending on your location.',
    doYouAcceptCashOnDelivery: 'Do you accept cash on delivery?',
    yesWeAcceptBothCashAndCardPayments: 'Yes, we accept both cash and card payments.',
    canICustomizeMyOrder: 'Can I customize my order?',
    yesYouCanCustomizeBreadType: 'Yes, you can customize bread type, add extra ingredients, and add special notes.'
  }
};

function applyLanguage(lang) {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  
  // Update UI text based on language
  Object.keys(t[lang]).forEach(key => {
    const elements = document.querySelectorAll(`[data-translate="${key}"]`);
    elements.forEach(el => {
      el.textContent = t[lang][key];
    });
  });
}

// Menu Rendering
function renderMenu() {
  const menuGrid = document.getElementById('menuGrid');
  const categoryNav = document.getElementById('categoryNav');
  
  if (!menuGrid || !categoryNav) return;

  const categories = menuService.getCategories();
  const menu = menuService.getMenu();

  // Render category navigation
  categoryNav.innerHTML = '';
  categories.forEach(category => {
    const categoryBtn = document.createElement('button');
    categoryBtn.className = 'category-btn';
    categoryBtn.textContent = category.title;
    categoryBtn.onclick = () => filterByCategory(category.id);
    categoryNav.appendChild(categoryBtn);
  });

  // Render menu items
  menuGrid.innerHTML = '';
  menu.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'menu-item';
    
    const featuredBadge = item.featured ? '<div class="featured-badge">Featured</div>' : '';
    const ratingStars = '★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating));
    const deliveryBadge = `<div class="delivery-badge">${item.deliveryTime}</div>`;
    
    itemCard.innerHTML = `
      ${featuredBadge}
      <div class="item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : '<div class="placeholder-image">🍽️</div>'}
      </div>
      <div class="item-content">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="item-rating">
          <span class="rating-stars">${ratingStars}</span>
          <span class="rating-value">${item.rating}</span>
        </div>
        <div class="item-footer">
          <div class="item-price">${formatPrice(item.price)}</div>
          <button class="add-btn" onclick="addToCart('${item.id}')">+</button>
        </div>
      </div>
      ${deliveryBadge}
    `;
    
    menuGrid.appendChild(itemCard);
  });
}

function filterByCategory(categoryId) {
  const menuGrid = document.getElementById('menuGrid');
  const categories = menuService.getCategories();
  const menu = menuService.getMenu();
  
  if (!menuGrid) return;

  // Update active category button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Filter and render items
  const filteredItems = categoryId === 'all' ? menu : menu.filter(item => item.category === categoryId);
  
  menuGrid.innerHTML = '';
  filteredItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'menu-item';
    
    const featuredBadge = item.featured ? '<div class="featured-badge">Featured</div>' : '';
    const ratingStars = '★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating));
    const deliveryBadge = `<div class="delivery-badge">${item.deliveryTime}</div>`;
    
    itemCard.innerHTML = `
      ${featuredBadge}
      <div class="item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : '<div class="placeholder-image">🍽️</div>'}
      </div>
      <div class="item-content">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="item-rating">
          <span class="rating-stars">${ratingStars}</span>
          <span class="rating-value">${item.rating}</span>
        </div>
        <div class="item-footer">
          <div class="item-price">${formatPrice(item.price)}</div>
          <button class="add-btn" onclick="addToCart('${item.id}')">+</button>
        </div>
      </div>
      ${deliveryBadge}
    `;
    
    menuGrid.appendChild(itemCard);
  });
}

// Cart Functions
function addToCart(itemId) {
  const item = menuService.getItemById(itemId);
  if (!item) return;

  // Check if it's a sandwich for customization
  if (item.category === 'sandwiches-signature') {
    openSandwichCustomize(item);
  } else {
    cartService.addItem(item);
  }
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
}

// Sandwich Customization
let currentCustomizingSandwich = null;

function openSandwichCustomize(item) {
  currentCustomizingSandwich = item;
  
  document.getElementById('sandwichItemImage').src = item.image || '';
  document.getElementById('sandwichItemName').textContent = item.name;
  document.getElementById('sandwichItemDesc').textContent = item.desc;
  document.getElementById('sandwichBasePrice').textContent = formatPrice(item.price);
  document.getElementById('sandwichBasePriceDisplay').textContent = formatPrice(item.price);
  
  updateSandwichPrice();
  document.getElementById('sandwichCustomizeModal').classList.add('open');
}

function closeSandwichCustomize() {
  document.getElementById('sandwichCustomizeModal').classList.remove('open');
  currentCustomizingSandwich = null;
}

function updateSandwichPrice() {
  if (!currentCustomizingSandwich) return;
  
  let totalPrice = currentCustomizingSandwich.price;
  const modifiers = [];
  
  // Calculate extra ingredients
  const extraIngredients = document.querySelectorAll('input[name="extraIngredients"]:checked');
  extraIngredients.forEach(ingredient => {
    const price = parseFloat(ingredient.nextElementSibling.textContent.match(/\$(\d+\.?\d*)/)[1]);
    totalPrice += price;
    modifiers.push(ingredient.value);
  });
  
  // Update price display
  document.getElementById('sandwichTotalPrice').textContent = formatPrice(totalPrice);
  
  // Update modifiers display
  const modifiersEl = document.getElementById('sandwichPriceModifiers');
  modifiersEl.innerHTML = '';
  extraIngredients.forEach(ingredient => {
    const price = parseFloat(ingredient.nextElementSibling.textContent.match(/\$(\d+\.?\d*)/)[1]);
    modifiersEl.innerHTML += `
      <div class="price-modifier">
        <span>${ingredient.value}:</span>
        <span>+${formatPrice(price)}</span>
      </div>
    `;
  });
}

function addCustomizedSandwichToCart() {
  if (!currentCustomizingSandwich) return;
  
  const breadType = document.querySelector('input[name="breadType"]:checked').value;
  const extraIngredients = Array.from(document.querySelectorAll('input[name="extraIngredients"]:checked')).map(el => el.value);
  const specialNotes = document.getElementById('sandwichSpecialNotes').value;
  
  let finalPrice = currentCustomizingSandwich.price;
  
  // Calculate extra ingredients price
  const extraIngredientsEl = document.querySelectorAll('input[name="extraIngredients"]:checked');
  extraIngredientsEl.forEach(ingredient => {
    const price = parseFloat(ingredient.nextElementSibling.textContent.match(/\$(\d+\.?\d*)/)[1]);
    finalPrice += price;
  });
  
  const customization = {
    breadType: breadType,
    extraIngredients: extraIngredients,
    specialNotes: specialNotes,
    finalPrice: finalPrice
  };
  
  cartService.addItem(currentCustomizingSandwich, customization);
  closeSandwichCustomize();
}

// Checkout Functions
function openCheckout() {
  const cartItems = cartService.getCart();
  if (cartItems.length === 0) return;
  
  // Update order summary
  const orderSummaryItems = document.getElementById('orderSummaryItems');
  orderSummaryItems.innerHTML = '';
  
  cartItems.forEach(item => {
    const price = item.customization?.finalPrice || item.price;
    const customizationText = item.customization ? 
      `<div class="customization-details">
        ${item.customization.breadType ? `<div>Bread: ${item.customization.breadType}</div>` : ''}
        ${item.customization.extraIngredients?.length ? `<div>Extra: ${item.customization.extraIngredients.join(', ')}</div>` : ''}
        ${item.customization.specialNotes ? `<div>Notes: ${item.customization.specialNotes}</div>` : ''}
      </div>` : '';
    
    orderSummaryItems.innerHTML += `
      <div class="order-item">
        <div class="item-info">
          <span>${item.name} x${item.qty}</span>
          ${customizationText}
        </div>
        <span class="item-price">${formatPrice(price * item.qty)}</span>
      </div>
    `;
  });
  
  // Update totals
  const subtotal = cartService.getCartTotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  
  document.getElementById('orderSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('orderDeliveryFee').textContent = formatPrice(deliveryFee);
  document.getElementById('orderTotal').textContent = formatPrice(total);
  
  document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

// Support Functions
function openSupport() {
  document.getElementById('supportModal').classList.add('open');
}

function closeSupport() {
  document.getElementById('supportModal').classList.remove('open');
}

function handleSupportOption(option) {
  const chatForm = document.getElementById('chatForm');
  const contactInfo = document.getElementById('contactInfo');
  
  // Hide all sections
  chatForm.style.display = 'none';
  contactInfo.style.display = 'none';
  
  // Show selected section
  switch(option) {
    case 'chat':
      chatForm.style.display = 'block';
      break;
    case 'phone':
    case 'whatsapp':
    case 'email':
      contactInfo.style.display = 'block';
      break;
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Simulate bot response
  setTimeout(() => {
    const responses = [
      'Thank you for your message! How can I help you?',
      'I\'m here to assist you. What would you like to know?',
      'Is there anything specific about your order I can help with?',
      'I\'ll be happy to help you with any questions!'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'bot');
  }, 1000);
}

function addMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}-message`;
  
  messageEl.innerHTML = `
    <div class="message-content">${text}</div>
    <div class="message-time">${new Date().toLocaleTimeString()}</div>
  `;
  
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language
  applyLanguage(currentLang);
  
  // Render menu
  renderMenu();
  
  // Update cart UI
  cartService.updateCartUI();
  
  // Event listeners
  document.getElementById('openCartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
  
  // Sandwich customization
  document.getElementById('closeSandwichCustomizeBtn').addEventListener('click', closeSandwichCustomize);
  document.getElementById('cancelSandwichCustomize').addEventListener('click', closeSandwichCustomize);
  document.getElementById('addSandwichToCart').addEventListener('click', addCustomizedSandwichToCart);
  
  // Support
  document.getElementById('supportBtn').addEventListener('click', openSupport);
  document.getElementById('closeSupportBtn').addEventListener('click', closeSupport);
  
  // Support options
  document.querySelectorAll('.support-option').forEach(option => {
    option.addEventListener('click', () => {
      const optionType = option.dataset.option;
      handleSupportOption(optionType);
    });
  });
  
  // Chat
  document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
  document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Language switcher
  document.getElementById('langSelect').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
  
  // Checkout form
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const order = {
      customer: {
        fullName: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        fulfillment: formData.get('fulfillment'),
        address: formData.get('customerAddress'),
        distance: parseFloat(formData.get('distance') || 5),
        notes: formData.get('orderNotes')
      },
      items: cartService.getCart(),
      totals: {
        count: cartService.getCartCount(),
        subtotal: cartService.getCartTotal(),
        deliveryFee: calculateDeliveryFee(cartService.getCartTotal()),
        total: cartService.getCartTotal() + calculateDeliveryFee(cartService.getCartTotal())
      }
    };
    
    try {
      const orderId = await firebaseService.saveOrder(order);
      alert(`Order placed successfully! Order ID: ${orderId}`);
      cartService.clearCart();
      closeCheckout();
    } catch (error) {
      alert('Error placing order. Please try again.');
      console.error('Order error:', error);
    }
  });
  
  // Fulfillment type change
  document.getElementById('fulfillment').addEventListener('change', (e) => {
    const addressGroup = document.getElementById('addressGroup');
    const distanceGroup = document.getElementById('distanceGroup');
    
    if (e.target.value === 'delivery') {
      addressGroup.style.display = 'block';
      distanceGroup.style.display = 'block';
    } else {
      addressGroup.style.display = 'none';
      distanceGroup.style.display = 'none';
    }
  });
  
  // Extra ingredients change
  document.querySelectorAll('input[name="extraIngredients"]').forEach(input => {
    input.addEventListener('change', updateSandwichPrice);
  });
});

// Make functions globally available
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.openSupport = openSupport;
window.closeSupport = closeSupport;
window.handleSupportOption = handleSupportOption;
window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.openSandwichCustomize = openSandwichCustomize;
window.closeSandwichCustomize = closeSandwichCustomize;
window.addCustomizedSandwichToCart = addCustomizedSandwichToCart;
window.updateSandwichPrice = updateSandwichPrice;
window.cartService = cartService;
window.menuService = menuService;
window.firebaseService = firebaseService;
window.deliveryService = deliveryService;
