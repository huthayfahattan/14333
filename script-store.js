// ---------- Store Version - L'olivo Restaurant ----------

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

// Audio Service
class AudioService {
  constructor() {
    this.isMuted = false;
    this.audioContext = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  playNotification() {
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
      muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
      muteBtn.title = this.isMuted ? 'Unmute Notifications' : 'Mute Notifications';
    }
  }
}

const audioService = new AudioService();

// Order Service
class OrderService {
  constructor() {
    this.orders = [];
    this.lastOrderCount = 0;
  }

  setOrders(orders) {
    const previousCount = this.orders.length;
    this.orders = orders;
    
    // Play notification for new orders
    if (orders.length > previousCount && previousCount > 0) {
      audioService.playNotification();
    }
    
    this.renderOrders();
    this.updateStats();
  }

  renderOrders() {
    const pendingOrders = document.getElementById('pendingOrders');
    const preparingOrders = document.getElementById('preparingOrders');
    const readyOrders = document.getElementById('readyOrders');

    if (!pendingOrders || !preparingOrders || !readyOrders) return;

    // Clear existing orders
    pendingOrders.innerHTML = '';
    preparingOrders.innerHTML = '';
    readyOrders.innerHTML = '';

    // Group orders by status
    const ordersByStatus = {
      pending: this.orders.filter(order => order.status === 'pending'),
      preparing: this.orders.filter(order => order.status === 'preparing'),
      ready: this.orders.filter(order => order.status === 'ready')
    };

    // Render each status group
    Object.keys(ordersByStatus).forEach(status => {
      const container = document.getElementById(`${status}Orders`);
      const orders = ordersByStatus[status];

      if (orders.length === 0) {
        container.innerHTML = '<div class="no-orders">No orders</div>';
        return;
      }

      orders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'order-card';
        orderEl.innerHTML = `
          <div class="order-header">
            <h4>Order #${order.id}</h4>
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
            <button class="action-btn" onclick="orderService.viewOrderDetails('${order.id}')">
              View Details
            </button>
          </div>
        `;
        container.appendChild(orderEl);
      });
    });
  }

  updateStats() {
    const pendingCount = document.getElementById('pendingCount');
    const preparingCount = document.getElementById('preparingCount');
    const readyCount = document.getElementById('readyCount');

    if (pendingCount) pendingCount.textContent = this.orders.filter(o => o.status === 'pending').length;
    if (preparingCount) preparingCount.textContent = this.orders.filter(o => o.status === 'preparing').length;
    if (readyCount) readyCount.textContent = this.orders.filter(o => o.status === 'ready').length;
  }

  async updateOrderStatus(orderId, status) {
    try {
      await firebaseService.updateOrderStatus(orderId, status);
    } catch (error) {
      alert('Error updating order status. Please try again.');
      console.error('Update error:', error);
    }
  }

  viewOrderDetails(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    // Populate order details modal
    document.getElementById('orderId').textContent = `Order #${order.id}`;
    document.getElementById('orderStatus').textContent = order.status;
    document.getElementById('customerName').textContent = order.customer.fullName;
    document.getElementById('customerPhone').textContent = order.customer.phone;
    document.getElementById('orderType').textContent = order.customer.fulfillment === 'delivery' ? 'Delivery' : 'Pickup';
    
    const addressInfo = document.getElementById('addressInfo');
    const customerAddress = document.getElementById('customerAddress');
    if (order.customer.fulfillment === 'delivery' && order.customer.address) {
      addressInfo.style.display = 'block';
      customerAddress.textContent = order.customer.address;
    } else {
      addressInfo.style.display = 'none';
    }
    
    document.getElementById('orderNotes').textContent = order.customer.notes || 'No special notes';
    
    // Populate order items
    const orderItemsList = document.getElementById('orderItemsList');
    orderItemsList.innerHTML = '';
    order.items.forEach(item => {
      const price = item.customization?.finalPrice || item.price;
      const customizationText = item.customization ? 
        `<div class="customization-details">
          ${item.customization.breadType ? `<div>Bread: ${item.customization.breadType}</div>` : ''}
          ${item.customization.extraIngredients?.length ? `<div>Extra: ${item.customization.extraIngredients.join(', ')}</div>` : ''}
          ${item.customization.specialNotes ? `<div>Notes: ${item.customization.specialNotes}</div>` : ''}
        </div>` : '';
      
      orderItemsList.innerHTML += `
        <div class="order-item">
          <div class="item-info">
            <span>${item.name} x${item.qty}</span>
            ${customizationText}
          </div>
          <span class="item-price">${this.formatPrice(price * item.qty)}</span>
        </div>
      `;
    });
    
    // Populate totals
    document.getElementById('orderSubtotal').textContent = this.formatPrice(order.totals.subtotal);
    document.getElementById('orderDeliveryFee').textContent = this.formatPrice(order.totals.deliveryFee);
    document.getElementById('orderTotal').textContent = this.formatPrice(order.totals.total);
    
    // Show modal
    document.getElementById('orderDetailsModal').classList.add('open');
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

// Language Support
const currentLang = 'en';

const t = {
  en: {
    orderManagement: 'Order Management',
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    noOrders: 'No orders',
    markPreparing: 'Mark Preparing',
    markReady: 'Mark Ready',
    complete: 'Complete',
    viewDetails: 'View Details',
    orderDetails: 'Order Details',
    customerInformation: 'Customer Information',
    name: 'Name',
    phone: 'Phone',
    orderType: 'Order Type',
    address: 'Address',
    notes: 'Notes',
    orderItems: 'Order Items',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    printInvoice: 'Print Invoice',
    muteNotifications: 'Mute Notifications',
    unmuteNotifications: 'Unmute Notifications'
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

// Print Invoice
function printInvoice() {
  const orderId = document.getElementById('orderId').textContent;
  const customerName = document.getElementById('customerName').textContent;
  const customerPhone = document.getElementById('customerPhone').textContent;
  const orderType = document.getElementById('orderType').textContent;
  const orderTotal = document.getElementById('orderTotal').textContent;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #dc3545; }
        .invoice-details { margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; font-size: 18px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🍃 L'olivo</div>
        <h1>Restaurant Invoice</h1>
      </div>
      
      <div class="invoice-details">
        <h2>${orderId}</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
      
      <div class="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Order Type:</strong> ${orderType}</p>
      </div>
      
      <div class="total">
        <p><strong>Total Amount: ${orderTotal}</strong></p>
      </div>
      
      <div class="footer">
        <p>L'olivo Food Services LLC</p>
        <p>123 King Fahd Road, Riyadh, Saudi Arabia</p>
        <p>Phone: +966 11 234 5678 | Email: info@lolivo.com</p>
        <p>Thank you for your order!</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language
  applyLanguage(currentLang);
  
  // Initialize Firebase and start listening for orders
  firebaseService.onOrdersChange((snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    orderService.setOrders(orders);
  });
  
  // Event listeners
  document.getElementById('muteBtn').addEventListener('click', () => {
    audioService.toggleMute();
  });
  
  document.getElementById('closeOrderDetailsBtn').addEventListener('click', () => {
    document.getElementById('orderDetailsModal').classList.remove('open');
  });
  
  document.getElementById('printInvoiceBtn').addEventListener('click', printInvoice);
  
  // Order action buttons
  document.getElementById('markPreparingBtn').addEventListener('click', () => {
    const orderId = document.getElementById('orderId').textContent.replace('Order #', '');
    orderService.updateOrderStatus(orderId, 'preparing');
    document.getElementById('orderDetailsModal').classList.remove('open');
  });
  
  document.getElementById('markReadyBtn').addEventListener('click', () => {
    const orderId = document.getElementById('orderId').textContent.replace('Order #', '');
    orderService.updateOrderStatus(orderId, 'ready');
    document.getElementById('orderDetailsModal').classList.remove('open');
  });
  
  document.getElementById('markCompletedBtn').addEventListener('click', () => {
    const orderId = document.getElementById('orderId').textContent.replace('Order #', '');
    orderService.updateOrderStatus(orderId, 'completed');
    document.getElementById('orderDetailsModal').classList.remove('open');
  });
  
  // Language switcher
  document.getElementById('langSelect').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
});

// Make functions globally available
window.orderService = orderService;
window.audioService = audioService;
window.firebaseService = firebaseService;
window.printInvoice = printInvoice;
