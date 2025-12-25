// Main JavaScript for Organic E-commerce

const API_BASE_URL = '/api';

// Cart Management
class Cart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartBadge();
  }

  loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartBadge();
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url,
        quantity: 1
      });
    }

    this.saveCart();
    this.showNotification('Product added to cart!', 'success');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.showNotification('Product removed from cart', 'info');
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart
const cart = new Cart();

// Product Functions
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    // Check if response is an error object
    if (products.error) {
      console.error('API Error:', products.error);
      // Show fallback products if database is not set up
      displayFallbackProducts();
      return;
    }

    if (products.length === 0) {
      displayFallbackProducts();
      return;
    }

    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    // Show fallback products if API fails
    displayFallbackProducts();
  }
}

// Fallback products when database is not available
function displayFallbackProducts() {
  const fallbackProducts = [
    {
      id: 1,
      name: 'Nivee Amla Juice',
      description: '100% Natural Amla Juice extracted from organic farm fresh amla. Rich in Vitamin C, boosts immunity, improves digestion, and promotes overall health. 1 Litre bottle.',
      price: 180.00,
      image_url: '/images/nivee-amla-juice.jpg',
      stock_quantity: 100
    },
    {
      id: 2,
      name: 'Nivee Amla & Turmeric Juice',
      description: 'Natural blend of amla and turmeric extract. Supports immune health, improves digestion, enhances skin and hair health, and provides an energy boost. 1 Litre bottle.',
      price: 260.00,
      image_url: '/images/nivee-amla-turmeric-juice.jpg',
      stock_quantity: 100
    }
  ];

  displayProducts(fallbackProducts);
}

// Product details data
const productDetails = {
  1: { // Nivee Amla Juice
    benefits: ['Rich in Vitamin C', 'Boosts Immunity', 'Improves Digestion', 'Promotes Hair Growth', 'Enhances Skin Health', 'Supports Heart Health', 'Helps Manage Weight', 'Regulates Blood Sugar'],
    longDescription: [
      { title: 'Boosts immunity', text: 'The high vitamin C content strengthens the immune system and helps the body fight off infections.' },
      { title: 'Improves digestion', text: 'It is rich in fiber, which aids in digestion, prevents constipation, and can help regulate bowel movements.' },
      { title: 'Supports heart health', text: 'Amla juice can help reduce bad cholesterol (LDL) and increase good cholesterol (HDL), while also improving blood circulation and blood pressure.' },
      { title: 'Promotes healthy skin', text: 'Antioxidants and vitamin C in amla juice can help reduce wrinkles and age spots, and boost collagen production for firmer, more youthful skin.' },
      { title: 'Enhances hair growth', text: 'It can strengthen hair roots, reduce dandruff, and prevent premature graying by nourishing hair follicles.' },
      { title: 'Helps manage weight', text: 'Amla juice can boost metabolism, reduce water retention, and curb appetite, which can assist with weight management.' },
      { title: 'Regulates blood sugar', text: 'Its chromium content helps in carbohydrate metabolism, potentially preventing drastic spikes and drops in blood sugar level.' }
    ],
    usageSteps: [
      'Shake the bottle well before use.',
      'Dilute 30ml of Amla Juice with 100ml of water.',
      'Consume on an empty stomach in the morning for best results.'
    ]
  },
  2: { // Nivee Amla & Turmeric Juice
    benefits: ['Natural Antibiotic', 'Purifies Blood', 'Joint Pain Relief'],
    longDescription: [
      { title: 'A blend of amla and turmeric', text: 'This combination is promoted for its antioxidant and anti-inflammatory properties.' },
      { title: 'Immune support', text: 'The juice is advertised as a way to support immune health.' },
      { title: 'Digestive health', text: 'It is said to help improve digestion, potentially aiding with issues like bloating, acidity, and constipation.' },
      { title: 'Skin and hair health', text: 'The product may help enhance skin vitality and support hair growth.' },
      { title: 'Energy boost', text: 'It is marketed for its potential to boost energy levels.' },
      { title: 'Nutritional value', text: 'Amla juice is a good source of Vitamin C, iron, calcium, and phosphorus.' }
    ],
    usageSteps: [
      'Drink in the early morning on an empty stomach.',
      'Take 30 ml of amla juice.',
      'Add 3 tablespoons of honey.',
      'Mix with warm water.',
      'Consume it 30 minutes before breakfast.'
    ]
  }
};

function displayProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="text-center">No products available.</p>';
    return;
  }

  container.innerHTML = products.map(product => {
    // Use a placeholder if image doesn't exist
    const imageUrl = product.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjlmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjlmM2EiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';

    return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="product-card">
          <img src="${imageUrl}" 
               alt="${product.name}" 
               class="product-image"
               onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjlmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjlmM2EiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
          <div class="product-card-body">
            <h5 class="product-card-title">${product.name}</h5>
            <p class="text-muted">${product.description || ''}</p>
            <div class="product-price">₹${parseFloat(product.price).toFixed(2)}</div>
            <div class="d-grid gap-2">
              <a href="/product/${product.id}" class="btn btn-outline-primary">
                View Details
              </a>
              <button class="btn btn-primary" onclick="addToCart(${product.id})">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showProductDetails(productId) {
  const product = productDetails[productId];
  if (!product) {
    cart.showNotification('Product details not available', 'info');
    return;
  }

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  const modalTitle = document.getElementById('productModalTitle');
  const modalBody = document.getElementById('productModalBody');

  // Get product name from displayed products
  fetch(`${API_BASE_URL}/products/${productId}`)
    .then(res => res.json())
    .then(productData => {
      modalTitle.textContent = productData.name;

      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-12">
            <h4 class="mb-4">✨ Key Benefits</h4>
            <div class="row mb-4">
              ${product.benefits.map(benefit => `
                <div class="col-md-6 mb-2">
                  <div class="d-flex align-items-start">
                    <span class="me-2 text-success" style="font-size: 1.2rem;">✓</span>
                    <span>${benefit}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <h4 class="mb-4">📋 Detailed Benefits</h4>
            <div class="mb-4">
              ${product.longDescription.map(item => `
                <div class="mb-3 p-3" style="background-color: #f5f9f0; border-radius: 5px; border-left: 3px solid var(--accent-color);">
                  <h6 class="mb-2" style="color: var(--primary-color);">${item.title}</h6>
                  <p class="mb-0 text-muted">${item.text}</p>
                </div>
              `).join('')}
            </div>

            <h4 class="mb-4">📖 How to Use</h4>
            <ol class="list-group list-group-numbered">
              ${product.usageSteps.map(step => `
                <li class="list-group-item d-flex align-items-start">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">${step}</div>
                  </div>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>
      `;

      modal.show();
    })
    .catch(error => {
      console.error('Error loading product:', error);
      cart.showNotification('Failed to load product details', 'danger');
    });
}

async function loadProductDetail(productId) {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const productData = await response.json();

    if (!productData || productData.error) {
      container.innerHTML = '<div class="alert alert-danger">Product not found</div>';
      return;
    }

    // Get details from productData (DB) or fallback to productDetails object
    let benefits = [];
    if (productData.benefits) {
      benefits = productData.benefits.split('\n').filter(b => b.trim());
    } else if (productDetails[productId]) {
      benefits = productDetails[productId].benefits;
    }

    let longDescription = [];
    if (productData.long_description) {
      longDescription = productData.long_description.split('\n').map(line => {
        const [title, ...textParts] = line.split(':');
        return {
          title: title ? title.trim() : '',
          text: textParts.length > 0 ? textParts.join(':').trim() : ''
        };
      }).filter(item => item.title && item.text);
    } else if (productDetails[productId]) {
      longDescription = productDetails[productId].longDescription;
    }

    let usageSteps = [];
    if (productData.usage_steps) {
      usageSteps = productData.usage_steps.split('\n').filter(s => s.trim());
    } else if (productDetails[productId]) {
      usageSteps = productDetails[productId].usageSteps;
    }

    // Update page title
    document.title = `${productData.name} - Nivee Juices`;

    const imageUrl = productData.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjlmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjlmM2EiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';

    container.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-4">
          <img src="${imageUrl}" alt="${productData.name}" class="product-detail-image img-fluid" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjlmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjlmM2EiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="col-md-6">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/products">Products</a></li>
              <li class="breadcrumb-item active" aria-current="page">${productData.name}</li>
            </ol>
          </nav>
          <h1 class="mb-3">${productData.name}</h1>
          <h3 class="text-primary mb-4">₹${parseFloat(productData.price).toFixed(2)}</h3>
          <p class="lead mb-4">${productData.description || ''}</p>
          
          <button class="btn btn-primary btn-lg px-5 mb-4" onclick="addToCart(${productData.id})">
            Add to Cart
          </button>

          <div class="mt-4">
            <h5>Quick Features:</h5>
            <ul class="list-unstyled">
              <li><span class="text-success">✓</span> 100% Natural & Organic</li>
              <li><span class="text-success">✓</span> No Preservatives</li>
              <li><span class="text-success">✓</span> Health Booster</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <ul class="nav nav-tabs" id="productTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="benefits-tab" data-bs-toggle="tab" data-bs-target="#benefits" type="button" role="tab">Benefits</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="usage-tab" data-bs-toggle="tab" data-bs-target="#usage" type="button" role="tab">How to Use</button>
            </li>
          </ul>
          <div class="tab-content p-4 border border-top-0 bg-white" id="productTabsContent">
            <div class="tab-pane fade show active" id="benefits" role="tabpanel">
              ${longDescription.length > 0 ? `
                <div class="row">
                  ${longDescription.map(item => `
                    <div class="col-md-6 mb-4">
                      <div class="benefit-card p-4 h-100">
                        <h5 class="text-primary mb-3">${item.title}</h5>
                        <p class="text-muted mb-0">${item.text}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : '<p>Detailed benefits coming soon.</p>'}
            </div>
            <div class="tab-pane fade" id="usage" role="tabpanel">
              ${usageSteps.length > 0 ? `
                <div class="usage-guide mt-3">
                  ${usageSteps.map((step, index) => `
                    <div class="usage-step d-flex align-items-center">
                      <div class="step-number me-4 h3 text-success mb-0">${index + 1}</div>
                      <div class="step-text fs-5">${step}</div>
                    </div>
                  `).join('')}
                </div>
              ` : '<p>Usage instructions coming soon.</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading product detail:', error);
    container.innerHTML = '<div class="alert alert-danger">Error loading product details</div>';
  }
}

async function addToCart(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const product = await response.json();
    cart.addItem(product);

    // Update cart display if on cart page
    if (window.location.pathname.includes('cart')) {
      displayCart();
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    cart.showNotification('Failed to add product to cart', 'danger');
  }
}

// Cart Display Functions
function displayCart() {
  const container = document.getElementById('cart-items');
  const totalContainer = document.getElementById('cart-total');

  if (!container) return;

  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h4>Your cart is empty</h4>
        <p class="text-muted">Add some products to get started!</p>
        <a href="/products" class="btn btn-primary mt-3">Browse Products</a>
      </div>
    `;
    if (totalContainer) {
      totalContainer.innerHTML = '<h4>Total: ₹0.00</h4>';
    }
    return;
  }

  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="row align-items-center">
        <div class="col-md-2">
          <img src="${item.image_url || '/images/placeholder.jpg'}" 
               alt="${item.name}" 
               class="img-fluid"
               onerror="this.src='/images/placeholder.jpg'">
        </div>
        <div class="col-md-4">
          <h5>${item.name}</h5>
          <p class="text-muted mb-0">₹${item.price.toFixed(2)} each</p>
        </div>
        <div class="col-md-3">
          <label class="form-label">Quantity:</label>
          <input type="number" 
                 class="form-control quantity-input" 
                 value="${item.quantity}" 
                 min="1"
                 onchange="updateCartQuantity(${item.id}, this.value)">
        </div>
        <div class="col-md-2">
          <p class="mb-0"><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></p>
        </div>
        <div class="col-md-1">
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
            <i class="bi bi-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (totalContainer) {
    const total = cart.getTotal();
    totalContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="mb-3">Order Summary</h4>
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>₹${total.toFixed(2)}</h5>
          </div>
          <a href="/checkout" class="btn btn-primary w-100 mt-3">Proceed to Checkout</a>
        </div>
      </div>
    `;
  }
}

function updateCartQuantity(productId, quantity) {
  cart.updateQuantity(productId, parseInt(quantity));
  displayCart();
}

function removeFromCart(productId) {
  cart.removeItem(productId);
  displayCart();
}

// Checkout Functions
function loadCheckout() {
  displayCheckoutCart();
  setupCheckoutForm();
}

function displayCheckoutCart() {
  const container = document.getElementById('checkout-cart');
  if (!container) return;

  if (cart.items.length === 0) {
    window.location.href = '/cart';
    return;
  }

  container.innerHTML = cart.items.map(item => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span>${item.name} x ${item.quantity}</span>
      <span>₹${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('') + `
    <hr>
    <div class="d-flex justify-content-between">
      <strong>Total:</strong>
      <strong>₹${cart.getTotal().toFixed(2)}</strong>
    </div>
  `;
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const customerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      payment_method: formData.get('payment_method')
    };

    // Validate form
    if (!validateCheckoutForm(customerData)) {
      return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      if (customerData.payment_method === 'cod') {
        await createDirectOrder(customerData);
      } else {
        await processPayment(customerData);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      cart.showNotification(error.message || 'Checkout failed. Please try again.', 'danger');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  });
}

async function createDirectOrder(customerData) {
  try {
    const orderItems = cart.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        items: orderItems,
        total_amount: cart.getTotal(),
        payment_method: 'cod'
      })
    });

    const data = await response.json();
    if (response.ok) {
      cart.clearCart();
      window.location.href = `/order-success.html?order=${data.order_number}`;
    } else {
      throw new Error(data.error || 'Failed to create order');
    }
  } catch (error) {
    console.error('Direct order error:', error);
    throw error;
  }
}

function validateCheckoutForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!data.name || data.name.trim().length < 2) {
    cart.showNotification('Please enter a valid name', 'danger');
    return false;
  }

  if (!emailRegex.test(data.email)) {
    cart.showNotification('Please enter a valid email address', 'danger');
    return false;
  }

  if (!phoneRegex.test(data.phone)) {
    cart.showNotification('Please enter a valid 10-digit phone number', 'danger');
    return false;
  }

  if (!data.address || data.address.trim().length < 10) {
    cart.showNotification('Please enter a complete address', 'danger');
    return false;
  }

  return true;
}

async function processPayment(customerData) {
  try {
    // Create Razorpay order
    const totalAmount = cart.getTotal();
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: totalAmount })
    });

    const razorpayData = await response.json();

    if (!response.ok || !razorpayData.order_id) {
      throw new Error(razorpayData.error || 'Razorpay configuration is currently unavailable. Please use Cash on Delivery.');
    }

    // Initialize Razorpay checkout
    const options = {
      key: razorpayData.key,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: 'Nivee Juices',
      description: 'Order Payment',
      order_id: razorpayData.order_id,
      handler: async function (response) {
        await verifyAndCreateOrder(customerData, razorpayData.order_id, response);
      },
      prefill: {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone
      },
      theme: {
        color: '#2d5016'
      },
      modal: {
        ondismiss: function () {
          const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
          }
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

async function verifyAndCreateOrder(customerData, razorpayOrderId, paymentResponse) {
  try {
    // Verify payment
    const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      })
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.verified) {
      throw new Error('Payment verification failed');
    }

    // Create order
    const orderItems = cart.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        items: orderItems,
        total_amount: cart.getTotal(),
        razorpay_order_id: razorpayOrderId
      })
    });

    const orderData = await orderResponse.json();

    // Update payment status
    await fetch(`${API_BASE_URL}/orders/update-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        payment_status: 'completed'
      })
    });

    // Clear cart and redirect
    cart.clearCart();
    window.location.href = `/order-success.html?order=${orderData.order_number}`;
  } catch (error) {
    console.error('Order creation error:', error);
    cart.showNotification('Order creation failed. Please contact support.', 'danger');
  }
}

// Contact Form
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    cart.showNotification('Thank you for your message! We will get back to you soon.', 'success');
    form.reset();
  });
}

// Utility Functions
function showError(message) {
  cart.showNotification(message, 'danger');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load products if on products page
  if (window.location.pathname === '/products' || window.location.pathname === '/') {
    loadProducts();
  }

  // Display cart if on cart page
  if (window.location.pathname === '/cart') {
    displayCart();
  }

  // Setup checkout if on checkout page
  if (window.location.pathname === '/checkout') {
    loadCheckout();
  }

  // Setup contact form
  setupContactForm();

  // Update cart badge on all pages
  cart.updateCartBadge();
});

// Make functions globally available
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.showProductDetails = showProductDetails;
window.loadProductDetail = loadProductDetail;

