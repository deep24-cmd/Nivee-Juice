// Admin Panel JavaScript

const API_BASE_URL = '/api';

// Admin Login
function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/admin/dashboard.html';
      } else {
        showAdminError(data.error || 'Login failed');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    } catch (error) {
      console.error('Login error:', error);
      showAdminError('Login failed. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
}

function showAdminError(message) {
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}

// Admin Logout
async function adminLogout() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logout`);
    if (response.ok) {
      window.location.href = '/admin/login.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/admin/login.html';
  }
}

// Dashboard Functions
async function loadDashboard() {
  try {
    // Load stats
    const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard`);
    const stats = await statsResponse.json();

    document.getElementById('total-orders').textContent = stats.totalOrders || 0;
    document.getElementById('total-revenue').textContent = `₹${parseFloat(stats.totalRevenue || 0).toFixed(2)}`;
    document.getElementById('pending-orders').textContent = stats.pendingOrders || 0;
    document.getElementById('recent-count').textContent = stats.recentOrders?.length || 0;

    // Load all orders
    await loadOrders();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    if (error.status === 401) {
      window.location.href = '/admin/login.html';
    }
  }
}

async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/admin/login.html';
        return;
      }
      throw new Error('Failed to fetch orders');
    }
    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error('Error loading orders:', error);
    if (error.status === 401) {
      window.location.href = '/admin/login.html';
    }
  }
}

function displayOrders(orders) {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const date = new Date(order.created_at).toLocaleDateString();
    const paymentBadge = getPaymentBadge(order.payment_status);
    const statusBadge = getStatusBadge(order.order_status);

    return `
      <tr>
        <td>${order.order_number}</td>
        <td>${order.customer_name}</td>
        <td>${order.customer_email}</td>
        <td>₹${parseFloat(order.total_amount).toFixed(2)}</td>
        <td>${paymentBadge}</td>
        <td><span class="badge bg-info text-dark">${(order.payment_method || 'razorpay').toUpperCase()}</span></td>
        <td>${statusBadge}</td>
        <td>${date}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="viewInvoice(${order.id})">Invoice</button>
          <button class="btn btn-sm btn-secondary" onclick="openStatusModal(${order.id}, '${order.order_status}', '${order.payment_status}')">Update</button>
        </td>
      </tr>
    `;
  }).join('');

  // Setup search
  const searchInput = document.getElementById('search-orders');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  }
}

function getPaymentBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-pending">Pending</span>',
    'completed': '<span class="badge badge-completed">Completed</span>',
    'failed': '<span class="badge bg-danger">Failed</span>'
  };
  return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

function getStatusBadge(status) {
  const badges = {
    'pending': '<span class="badge badge-pending">Pending</span>',
    'processing': '<span class="badge badge-processing">Processing</span>',
    'shipped': '<span class="badge bg-info">Shipped</span>',
    'delivered': '<span class="badge badge-completed">Delivered</span>',
    'cancelled': '<span class="badge bg-danger">Cancelled</span>'
  };
  return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

function viewInvoice(orderId) {
  window.location.href = `/admin/invoice.html?id=${orderId}`;
}

function openStatusModal(orderId, orderStatus, paymentStatus) {
  document.getElementById('modal-order-id').value = orderId;
  document.getElementById('modal-order-status').value = orderStatus;
  document.getElementById('modal-payment-status').value = paymentStatus;

  const modal = new bootstrap.Modal(document.getElementById('statusModal'));
  modal.show();
}

async function updateOrderStatus() {
  const orderId = document.getElementById('modal-order-id').value;
  const orderStatus = document.getElementById('modal-order-status').value;
  const paymentStatus = document.getElementById('modal-payment-status').value;

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_status: orderStatus, payment_status: paymentStatus })
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('statusModal'));
      modal.hide();
      await loadOrders();
      await loadDashboard();
      showNotification('Order status updated successfully', 'success');
    } else {
      showNotification('Failed to update order status', 'danger');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    showNotification('Error updating order status', 'danger');
  }
}

// Product Management Functions
async function loadAdminProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const products = await response.json();

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No products found</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.id}</td>
        <td><img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain;"></td>
        <td>${product.name}</td>
        <td>₹${parseFloat(product.price).toFixed(2)}</td>
        <td>${product.stock_quantity}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>';
  }
}

function openProductModal() {
  document.getElementById('product-id').value = '';
  document.getElementById('product-id-original').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('current-product-image').value = '';
  document.getElementById('image-preview').style.display = 'none';

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

function editProduct(product) {
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-id-original').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock_quantity;
  document.getElementById('product-display-order').value = product.display_order || 0;

  // Handle image preview
  const currentImage = product.image_url || '';
  document.getElementById('current-product-image').value = currentImage;
  document.getElementById('product-image').value = ''; // Reset file input

  const preview = document.getElementById('image-preview');
  if (currentImage) {
    preview.style.display = 'block';
    preview.querySelector('img').src = currentImage;
  } else {
    preview.style.display = 'none';
  }

  // Populate dynamic fields
  document.getElementById('product-benefits').value = product.benefits || '';
  document.getElementById('product-long-description').value = product.long_description || '';
  document.getElementById('product-usage-steps').value = product.usage_steps || '';

  document.getElementById('productModalTitle').textContent = 'Edit Product';
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

async function saveProduct() {
  const id = document.getElementById('product-id').value;
  const originalId = document.getElementById('product-id-original').value;
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value);

  if (!name || isNaN(price) || isNaN(stock)) {
    showNotification('Please fill all required fields', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('id', id); // The new ID
  formData.append('name', name);
  formData.append('description', document.getElementById('product-description').value);
  formData.append('price', price);
  formData.append('stock_quantity', stock);
  formData.append('display_order', parseInt(document.getElementById('product-display-order').value) || 0);
  formData.append('benefits', document.getElementById('product-benefits').value);
  formData.append('long_description', document.getElementById('product-long-description').value);
  formData.append('usage_steps', document.getElementById('product-usage-steps').value);

  const imageFile = document.getElementById('product-image').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  } else {
    // If no new file, send the current image URL
    formData.append('image_url', document.getElementById('current-product-image').value);
  }

  const url = originalId ? `${API_BASE_URL}/products/${originalId}` : `${API_BASE_URL}/products`;
  const method = originalId ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      body: formData // Fetch handles FormData boundaries automatically
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
      modal.hide();
      await loadAdminProducts();
      showNotification(`Product ${id ? 'updated' : 'added'} successfully`, 'success');
    } else {
      const data = await response.json();
      showNotification(data.error || 'Failed to save product', 'danger');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    showNotification('Error saving product', 'danger');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadAdminProducts();
      showNotification('Product deleted successfully', 'success');
    } else {
      showNotification('Failed to delete product', 'danger');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showNotification('Error deleting product', 'danger');
  }
}

// Invoice Functions
async function loadInvoice(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const order = await response.json();

    if (!order) {
      document.getElementById('invoice-container').innerHTML =
        '<div class="alert alert-danger">Order not found</div>';
      return;
    }

    // Fill invoice data
    document.getElementById('invoice-order-number').textContent = `Order #: ${order.order_number}`;
    document.getElementById('invoice-date').textContent = `Date: ${new Date(order.created_at).toLocaleDateString()}`;

    document.getElementById('customer-name').textContent = order.customer_name;
    document.getElementById('customer-email').textContent = order.customer_email;
    document.getElementById('customer-phone').textContent = order.customer_phone;
    document.getElementById('customer-address').textContent = order.customer_address;

    // Fill items
    const itemsTbody = document.getElementById('invoice-items');
    itemsTbody.innerHTML = order.items.map(item => `
      <tr>
        <td>${item.product_name}</td>
        <td>${item.quantity}</td>
        <td>₹${parseFloat(item.price).toFixed(2)}</td>
        <td>₹${parseFloat(item.subtotal).toFixed(2)}</td>
      </tr>
    `).join('');

    const total = parseFloat(order.total_amount);
    document.getElementById('invoice-total').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `₹${total.toFixed(2)}`;

    document.getElementById('payment-status').textContent = order.payment_status;
    document.getElementById('order-status').textContent = order.order_status;
  } catch (error) {
    console.error('Error loading invoice:', error);
    document.getElementById('invoice-container').innerHTML =
      '<div class="alert alert-danger">Failed to load invoice data</div>';
  }
}

// Notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Setup login form if on login page
  if (window.location.pathname.includes('login')) {
    setupAdminLogin();
  }

  // Load dashboard if on dashboard page
  if (window.location.pathname.includes('dashboard')) {
    loadDashboard();
    loadAdminProducts();

    // Setup image preview listener
    const imgInput = document.getElementById('product-image');
    if (imgInput) {
      imgInput.addEventListener('change', function () {
        const file = this.files[0];
        const preview = document.getElementById('image-preview');
        const previewImg = preview.querySelector('img');

        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.style.display = 'block';
            previewImg.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          // If no file but there was a current image, show that
          const currentImg = document.getElementById('current-product-image').value;
          if (currentImg) {
            preview.style.display = 'block';
            previewImg.src = currentImg;
          } else {
            preview.style.display = 'none';
          }
        }
      });
    }
  }
});

// Make functions globally available
window.adminLogout = adminLogout;
window.viewInvoice = viewInvoice;
window.openStatusModal = openStatusModal;
window.updateOrderStatus = updateOrderStatus;
window.loadInvoice = loadInvoice;
window.loadAdminProducts = loadAdminProducts;
window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;






