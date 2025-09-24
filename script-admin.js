// ---------- Admin Version - L'olivo Restaurant ----------

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

  addCategory(category) {
    this.categories.push(category);
    this.saveCategories();
    this.renderCategories();
  }

  removeCategory(categoryId) {
    this.categories = this.categories.filter(cat => cat.id !== categoryId);
    this.menu = this.menu.filter(item => item.category !== categoryId);
    this.saveCategories();
    this.saveMenu();
    this.renderCategories();
    this.renderItems();
  }

  addItem(item) {
    this.menu.push(item);
    this.saveMenu();
    this.renderItems();
  }

  updateItem(itemId, updatedItem) {
    const index = this.menu.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.menu[index] = { ...this.menu[index], ...updatedItem };
      this.saveMenu();
      this.renderItems();
    }
  }

  removeItem(itemId) {
    this.menu = this.menu.filter(item => item.id !== itemId);
    this.saveMenu();
    this.renderItems();
  }
}

const menuService = new MenuService();

// Order Service
class OrderService {
  constructor() {
    this.orders = [];
  }

  setOrders(orders) {
    this.orders = orders;
    this.renderOrders();
    this.updateStats();
  }

  renderOrders() {
    const adminOrdersList = document.getElementById('adminOrdersList');
    if (!adminOrdersList) return;

    if (this.orders.length === 0) {
      adminOrdersList.innerHTML = '<div class="no-orders">No orders yet</div>';
      return;
    }

    adminOrdersList.innerHTML = '';
    this.orders.forEach(order => {
      const orderEl = document.createElement('div');
      orderEl.className = 'order-card';
      orderEl.innerHTML = `
        <div class="order-header">
          <h4>Order #${order.id}</h4>
          <span class="order-status ${order.status}">${order.status}</span>
          <span class="order-time">${this.formatTime(order.createdAt)}</span>
        </div>
        <div class="order-info">
          <div class="customer-info">
            <strong>${order.customer.fullName}</strong>
            <span>${order.customer.phone}</span>
          </div>
          <div class="order-type">
            ${order.customer.fulfillment === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
          </div>
          <div class="order-total">
            ${this.formatPrice(order.totals.total)}
          </div>
        </div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <span>${item.name} x${item.qty}</span>
              ${item.customization ? `
                <div class="customization-details">
                  ${item.customization.breadType ? `<div>Bread: ${item.customization.breadType}</div>` : ''}
                  ${item.customization.extraIngredients?.length ? `<div>Extra: ${item.customization.extraIngredients.join(', ')}</div>` : ''}
                  ${item.customization.specialNotes ? `<div>Notes: ${item.customization.specialNotes}</div>` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <div class="order-actions">
          <button class="action-btn" onclick="orderService.updateOrderStatus('${order.id}', 'preparing')">
            Mark Preparing
          </button>
          <button class="action-btn" onclick="orderService.updateOrderStatus('${order.id}', 'ready')">
            Mark Ready
          </button>
          <button class="action-btn" onclick="orderService.updateOrderStatus('${order.id}', 'completed')">
            Complete
          </button>
        </div>
      `;
      adminOrdersList.appendChild(orderEl);
    });
  }

  updateStats() {
    const totalOrdersCount = document.getElementById('totalOrdersCount');
    const menuItemsCount = document.getElementById('menuItemsCount');
    const categoriesCount = document.getElementById('categoriesCount');

    if (totalOrdersCount) totalOrdersCount.textContent = this.orders.length;
    if (menuItemsCount) menuItemsCount.textContent = menuService.getMenu().length;
    if (categoriesCount) categoriesCount.textContent = menuService.getCategories().length;
  }

  async updateOrderStatus(orderId, status) {
    try {
      await firebaseService.updateOrderStatus(orderId, status);
    } catch (error) {
      alert('Error updating order status. Please try again.');
      console.error('Update error:', error);
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price) {
    return `$${price.toFixed(2)}`;
  }
}

const orderService = new OrderService();

// Utility Functions
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Language Support
const currentLang = 'en';

const t = {
  en: {
    restaurantManagement: 'Restaurant Management',
    totalOrders: 'Total Orders',
    menuItems: 'Menu Items',
    categories: 'Categories',
    menuManagement: 'Menu Management',
    orders: 'Orders',
    settings: 'Settings',
    categories: 'Categories',
    addCategory: 'Add Category',
    menuItems: 'Menu Items',
    addItem: 'Add Item',
    allOrders: 'All Orders',
    restaurantSettings: 'Restaurant Settings',
    restaurantName: 'Restaurant Name',
    phoneNumber: 'Phone Number',
    address: 'Address',
    baseDeliveryFee: 'Base Delivery Fee',
    saveSettings: 'Save Settings',
    addCategory: 'Add Category',
    categoryTitle: 'Category Title',
    description: 'Description',
    addCategory: 'Add Category',
    addMenuItem: 'Add Menu Item',
    itemName: 'Item Name',
    itemDescription: 'Description',
    price: 'Price',
    category: 'Category',
    image: 'Image',
    modifiers: 'Modifiers (JSON)',
    featuredItem: 'Featured Item',
    rating: 'Rating (1-5)',
    deliveryTime: 'Delivery Time (minutes)',
    addItem: 'Add Item',
    editMenuItem: 'Edit Menu Item',
    updateItem: 'Update Item',
    removeCurrentImage: 'Remove Current Image',
    editImage: 'Edit Image',
    delete: 'Delete',
    edit: 'Edit',
    noOrders: 'No orders yet',
    markPreparing: 'Mark Preparing',
    markReady: 'Mark Ready',
    complete: 'Complete'
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

// Admin Functions
function renderCategories() {
  const adminCategoriesList = document.getElementById('adminCategoriesList');
  if (!adminCategoriesList) return;

  const categories = menuService.getCategories();
  
  adminCategoriesList.innerHTML = '';
  categories.forEach(category => {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'category-card';
    categoryEl.innerHTML = `
      <div class="category-info">
        <h4>${category.title}</h4>
        <p>${category.description}</p>
        <span class="item-count">${menuService.getItemsByCategory(category.id).length} items</span>
      </div>
      <div class="category-actions">
        <button class="action-btn delete" onclick="deleteCategory('${category.id}')">Delete</button>
      </div>
    `;
    adminCategoriesList.appendChild(categoryEl);
  });
}

function renderItems() {
  const adminItemsList = document.getElementById('adminItemsList');
  if (!adminItemsList) return;

  const menu = menuService.getMenu();
  
  adminItemsList.innerHTML = '';
  menu.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'item-card';
    itemEl.innerHTML = `
      <div class="item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : '<div class="placeholder-image">🍽️</div>'}
      </div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="item-details">
          <span class="price">${formatPrice(item.price)}</span>
          <span class="category">${menuService.getCategories().find(cat => cat.id === item.category)?.title || item.category}</span>
          ${item.featured ? '<span class="featured">Featured</span>' : ''}
        </div>
      </div>
      <div class="item-actions">
        <button class="action-btn edit" onclick="editItem('${item.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteItem('${item.id}')">Delete</button>
        ${item.image ? `<button class="action-btn edit-image" onclick="editItemImage('${item.id}')">Edit Image</button>` : ''}
      </div>
    `;
    adminItemsList.appendChild(itemEl);
  });
}

function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) {
    menuService.removeCategory(categoryId);
  }
}

function deleteItem(itemId) {
  if (confirm('Are you sure you want to delete this item?')) {
    menuService.removeItem(itemId);
  }
}

function editItem(itemId) {
  const item = menuService.getItemById(itemId);
  if (!item) return;

  // Populate edit form
  document.getElementById('editItemName').value = item.name;
  document.getElementById('editItemDescription').value = item.desc;
  document.getElementById('editItemPrice').value = item.price;
  document.getElementById('editItemCategory').value = item.category;
  document.getElementById('editItemModifiers').value = JSON.stringify(item.modifiers, null, 2);
  document.getElementById('editItemFeatured').checked = item.featured;
  document.getElementById('editItemRating').value = item.rating;
  document.getElementById('editItemDeliveryTime').value = parseInt(item.deliveryTime);

  // Show current image if exists
  const currentImagePreview = document.getElementById('currentImagePreview');
  const currentImage = document.getElementById('currentImage');
  if (item.image) {
    currentImage.src = item.image;
    currentImagePreview.style.display = 'block';
  } else {
    currentImagePreview.style.display = 'none';
  }

  // Store current item ID
  document.getElementById('editItemForm').dataset.itemId = itemId;

  // Show modal
  document.getElementById('editItemModal').classList.add('open');
}

function editItemImage(itemId) {
  editItem(itemId);
  document.getElementById('editItemImage').focus();
}

// Tab Management
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab content
  document.getElementById(`${tabName}Tab`).classList.add('active');

  // Add active class to clicked tab button
  event.target.classList.add('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language
  applyLanguage(currentLang);
  
  // Render initial data
  renderCategories();
  renderItems();
  
  // Initialize Firebase and start listening for orders
  firebaseService.onOrdersChange((snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    orderService.setOrders(orders);
  });
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });
  
  // Add category
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    document.getElementById('addCategoryModal').classList.add('open');
  });
  
  document.getElementById('closeAddCategoryBtn').addEventListener('click', () => {
    document.getElementById('addCategoryModal').classList.remove('open');
  });
  
  document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const category = {
      id: `category-${Date.now()}`,
      title: formData.get('categoryTitle'),
      description: formData.get('categoryDescription')
    };
    
    menuService.addCategory(category);
    document.getElementById('addCategoryModal').classList.remove('open');
    e.target.reset();
  });
  
  // Add item
  document.getElementById('addItemBtn').addEventListener('click', () => {
    // Populate category select
    const categorySelect = document.getElementById('itemCategory');
    categorySelect.innerHTML = '';
    menuService.getCategories().forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.title;
      categorySelect.appendChild(option);
    });
    
    document.getElementById('addItemModal').classList.add('open');
  });
  
  document.getElementById('closeAddItemBtn').addEventListener('click', () => {
    document.getElementById('addItemModal').classList.remove('open');
  });
  
  document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    let imageData = '';
    
    if (formData.get('itemImage').size > 0) {
      try {
        imageData = await readFileAsDataURL(formData.get('itemImage'));
      } catch (error) {
        console.error('Error reading image:', error);
      }
    }
    
    const item = {
      id: `item-${Date.now()}`,
      name: formData.get('itemName'),
      desc: formData.get('itemDescription'),
      price: parseFloat(formData.get('itemPrice')),
      category: formData.get('itemCategory'),
      image: imageData,
      modifiers: JSON.parse(formData.get('itemModifiers') || '[]'),
      featured: formData.get('itemFeatured') === 'on',
      rating: parseFloat(formData.get('itemRating')),
      deliveryTime: `${formData.get('itemDeliveryTime')} minutes`
    };
    
    menuService.addItem(item);
    document.getElementById('addItemModal').classList.remove('open');
    e.target.reset();
  });
  
  // Edit item
  document.getElementById('closeEditItemBtn').addEventListener('click', () => {
    document.getElementById('editItemModal').classList.remove('open');
  });
  
  document.getElementById('editItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = e.target.dataset.itemId;
    const formData = new FormData(e.target);
    let imageData = '';
    
    if (formData.get('editItemImage').size > 0) {
      try {
        imageData = await readFileAsDataURL(formData.get('editItemImage'));
      } catch (error) {
        console.error('Error reading image:', error);
      }
    }
    
    const updatedItem = {
      name: formData.get('editItemName'),
      desc: formData.get('editItemDescription'),
      price: parseFloat(formData.get('editItemPrice')),
      category: formData.get('editItemCategory'),
      image: imageData || menuService.getItemById(itemId).image,
      modifiers: JSON.parse(formData.get('editItemModifiers') || '[]'),
      featured: formData.get('editItemFeatured') === 'on',
      rating: parseFloat(formData.get('editItemRating')),
      deliveryTime: `${formData.get('editItemDeliveryTime')} minutes`
    };
    
    menuService.updateItem(itemId, updatedItem);
    document.getElementById('editItemModal').classList.remove('open');
  });
  
  // Remove current image
  document.getElementById('removeCurrentImage').addEventListener('click', () => {
    document.getElementById('currentImagePreview').style.display = 'none';
    document.getElementById('editItemForm').dataset.removeImage = 'true';
  });
  
  // Language switcher
  document.getElementById('langSelect').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
  
  // Settings
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const settings = {
      restaurantName: document.getElementById('restaurantName').value,
      restaurantPhone: document.getElementById('restaurantPhone').value,
      restaurantAddress: document.getElementById('restaurantAddress').value,
      deliveryFee: parseFloat(document.getElementById('deliveryFee').value)
    };
    
    localStorage.setItem('lolivo_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  });
  
  // Load settings
  const savedSettings = localStorage.getItem('lolivo_settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('restaurantName').value = settings.restaurantName || 'L\'olivo';
    document.getElementById('restaurantPhone').value = settings.restaurantPhone || '+966 11 234 5678';
    document.getElementById('restaurantAddress').value = settings.restaurantAddress || '123 King Fahd Road, Riyadh, Saudi Arabia';
    document.getElementById('deliveryFee').value = settings.deliveryFee || 15;
  }
});

// Make functions globally available
window.menuService = menuService;
window.orderService = orderService;
window.firebaseService = firebaseService;
window.deleteCategory = deleteCategory;
window.deleteItem = deleteItem;
window.editItem = editItem;
window.editItemImage = editItemImage;
window.switchTab = switchTab;
