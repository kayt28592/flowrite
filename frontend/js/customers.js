// ============================================
// 👥 CUSTOMER MANAGEMENT
// ============================================

async function loadCustomers() {
    try {
        const response = await api.get(API_CONFIG.ENDPOINTS.CUSTOMERS);
        customers = response.data;
        renderCustomers();
        updateCustomerDatalist();
    } catch (error) {
        console.error('Failed to load customers:', error);
    }
}

function renderCustomers() {
    const container = document.getElementById('customersList');
    
    if (customers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No customers yet. Click "Add New Customer" to get started.</p>';
        return;
    }
    
    container.innerHTML = customers.map(customer => `
        <div class="field-item">
            <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem;">
                    ${customer.name}
                </div>
                ${customer.email ? `<div style="color: var(--gray); margin: 0.2rem 0;">
                    📧 ${customer.email}
                </div>` : ''}
                ${customer.phone ? `<div style="color: var(--gray); margin: 0.2rem 0;">
                    📱 ${customer.phone}
                </div>` : ''}
                ${customer.address ? `<div style="color: var(--gray); margin: 0.2rem 0;">
                    📍 ${customer.address}
                </div>` : ''}
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editCustomer('${customer._id}')">
                    ✏️ Edit
                </button>
                <button class="btn-delete" onclick="deleteCustomer('${customer._id}', '${customer.name.replace(/'/g, "\\'")}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateCustomerDatalist() {
    const datalist = document.getElementById('customerList');
    datalist.innerHTML = customers.map(c => `<option value="${c.name}">`).join('');
}

// Add customer button
document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
    showCustomerModal();
});

// Create customer from form
document.getElementById('createCustomerFromForm')?.addEventListener('click', () => {
    showCustomerModal();
});

function showCustomerModal(customerId = null) {
    const customer = customerId ? customers.find(c => c._id === customerId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px;">
            <div class="modal-header">
                <h3>${customer ? 'Edit Customer' : 'Add New Customer'}</h3>
                <button class="close-btn" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="customerModalForm">
                    <div class="form-group">
                        <label>Customer Name <span class="required">*</span></label>
                        <input type="text" id="modalCustomerName" required value="${customer?.name || ''}" placeholder="Enter customer name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="modalCustomerEmail" value="${customer?.email || ''}" placeholder="customer@example.com">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="text" id="modalCustomerPhone" value="${customer?.phone || ''}" placeholder="+61 XXX XXX XXX">
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea id="modalCustomerAddress" rows="3" placeholder="Enter full address">${customer?.address || ''}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="this.closest('.submission-modal').remove()">Cancel</button>
                <button class="btn-edit" onclick="saveCustomer('${customerId || ''}')">
                    ${customer ? '💾 Save Changes' : '➕ Add Customer'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function saveCustomer(customerId) {
    const name = document.getElementById('modalCustomerName').value.trim();
    const email = document.getElementById('modalCustomerEmail').value.trim();
    const phone = document.getElementById('modalCustomerPhone').value.trim();
    const address = document.getElementById('modalCustomerAddress').value.trim();
    
    if (!name) {
        alert('Customer name is required');
        return;
    }
    
    const customerData = {
        name,
        email,
        phone,
        address
    };
    
    try {
        if (customerId) {
            await api.put(API_CONFIG.ENDPOINTS.CUSTOMER_BY_ID(customerId), customerData);
        } else {
            await api.post(API_CONFIG.ENDPOINTS.CUSTOMERS, customerData);
        }
        
        await loadCustomers();
        document.querySelector('.submission-modal')?.remove();
        
        alert(`Customer ${customerId ? 'updated' : 'added'} successfully!`);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteCustomer(customerId, customerName) {
    if (!confirm(`Are you sure you want to delete "${customerName}"?\n\nThis will also delete all submissions for this customer.`)) {
        return;
    }
    
    try {
        await api.delete(API_CONFIG.ENDPOINTS.CUSTOMER_BY_ID(customerId));
        await loadCustomers();
        await loadSubmissions(); // Refresh submissions as they might be deleted
        alert('Customer deleted successfully');
    } catch (error) {
        alert('Error deleting customer: ' + error.message);
    }
}

function editCustomer(customerId) {
    showCustomerModal(customerId);
}

// Customer input change handler
document.getElementById('customer')?.addEventListener('input', function() {
    const customerName = this.value;
    const customer = customers.find(c => c.name === customerName);
    const infoDiv = document.getElementById('customerInfo');
    
    if (customer) {
        document.getElementById('customerInfoEmail').textContent = customer.email || 'N/A';
        document.getElementById('customerInfoPhone').textContent = customer.phone || 'N/A';
        document.getElementById('customerInfoAddress').textContent = customer.address || 'N/A';
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
});

// Export functions
window.loadCustomers = loadCustomers;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.saveCustomer = saveCustomer;
