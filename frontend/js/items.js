// ============================================
// 📦 ITEMS MANAGEMENT
// ============================================

function loadItems() {
    // Load items from localStorage for now (can be migrated to API later)
    const stored = localStorage.getItem('flowrite_items');
    items = stored ? JSON.parse(stored) : [
        { id: 'item_1', name: '10mm Crushed Concrete', unit: 'tonne' },
        { id: 'item_2', name: '20mm Crushed Concrete', unit: 'tonne' },
        { id: 'item_3', name: '40mm Crushed Concrete', unit: 'tonne' },
        { id: 'item_4', name: 'Road Base', unit: 'tonne' },
        { id: 'item_5', name: 'Fill Sand', unit: 'tonne' }
    ];
    
    renderItems();
    updateOrderDatalist();
}

function renderItems() {
    const container = document.getElementById('itemsList');
    
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No items yet. Click "Add New Item" to get started.</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="field-item">
            <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">
                    ${item.name}
                </div>
                <div style="color: var(--gray); margin-top: 0.3rem;">
                    Unit: ${item.unit}
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editItem('${item.id}')">
                    ✏️ Edit
                </button>
                <button class="btn-delete" onclick="deleteItem('${item.id}', '${item.name.replace(/'/g, "\\'")}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateOrderDatalist() {
    const datalist = document.getElementById('orderList');
    datalist.innerHTML = items.map(i => `<option value="${i.name}">`).join('');
}

function saveItems() {
    localStorage.setItem('flowrite_items', JSON.stringify(items));
}

// Add item button
document.getElementById('addItemBtn')?.addEventListener('click', () => {
    showItemModal();
});

function showItemModal(itemId = null) {
    const item = itemId ? items.find(i => i.id === itemId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px;">
            <div class="modal-header">
                <h3>${item ? 'Edit Item' : 'Add New Item'}</h3>
                <button class="close-btn" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="itemModalForm">
                    <div class="form-group">
                        <label>Item Name <span class="required">*</span></label>
                        <input type="text" id="modalItemName" required value="${item?.name || ''}" placeholder="e.g. 20mm Crushed Concrete">
                    </div>
                    <div class="form-group">
                        <label>Unit <span class="required">*</span></label>
                        <input type="text" id="modalItemUnit" required value="${item?.unit || 'tonne'}" placeholder="e.g. tonne, m³, kg">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="this.closest('.submission-modal').remove()">Cancel</button>
                <button class="btn-edit" onclick="saveItem('${itemId || ''}')">
                    ${item ? '💾 Save Changes' : '➕ Add Item'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveItem(itemId) {
    const name = document.getElementById('modalItemName').value.trim();
    const unit = document.getElementById('modalItemUnit').value.trim();
    
    if (!name || !unit) {
        alert('Please fill in all fields');
        return;
    }
    
    if (itemId) {
        const item = items.find(i => i.id === itemId);
        if (item) {
            item.name = name;
            item.unit = unit;
        }
    } else {
        items.push({
            id: 'item_' + Date.now(),
            name,
            unit
        });
    }
    
    saveItems();
    renderItems();
    updateOrderDatalist();
    document.querySelector('.submission-modal')?.remove();
    
    alert(`Item ${itemId ? 'updated' : 'added'} successfully!`);
}

function deleteItem(itemId, itemName) {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
        return;
    }
    
    items = items.filter(i => i.id !== itemId);
    saveItems();
    renderItems();
    updateOrderDatalist();
    alert('Item deleted successfully');
}

function editItem(itemId) {
    showItemModal(itemId);
}

// Export functions
window.loadItems = loadItems;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.saveItem = saveItem;
