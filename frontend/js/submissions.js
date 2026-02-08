// ============================================
// 📋 SUBMISSION MANAGEMENT
// ============================================

async function loadSubmissions() {
    try {
        const response = await api.get(API_CONFIG.ENDPOINTS.SUBMISSIONS);
        submissions = response.data;
        renderSubmissions();
    } catch (error) {
        console.error('Failed to load submissions:', error);
    }
}

function renderSubmissions() {
    const container = document.getElementById('submissionsList');
    
    if (submissions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No submissions yet. Fill out the form to see submissions here.</p>';
        return;
    }
    
    container.innerHTML = submissions.map(sub => `
        <div class="field-item" onclick="viewSubmission('${sub._id}')" style="cursor: pointer;">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">
                        ${sub.customer_name}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--gray);">
                        ${sub.date} • ${sub.time}
                    </div>
                </div>
                <div style="color: var(--gray); margin: 0.3rem 0;">
                    📍 ${sub.address}
                </div>
                <div style="color: var(--gray); margin: 0.3rem 0;">
                    📦 ${sub.order_details} • <strong>${sub.amount}</strong>
                </div>
                <div style="color: var(--gray); margin: 0.3rem 0;">
                    🚗 ${sub.rego}
                </div>
            </div>
        </div>
    `).join('');
}

function viewSubmission(submissionId) {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>Submission Details</h3>
                <button class="close-btn" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="detail-row">
                    <div class="detail-label">Customer</div>
                    <div class="detail-value">${sub.customer_name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${sub.date}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${sub.time}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">${sub.address}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Order</div>
                    <div class="detail-value">${sub.order_details}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Amount</div>
                    <div class="detail-value">${sub.amount}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Rego</div>
                    <div class="detail-value">${sub.rego}</div>
                </div>
                ${sub.signature_image ? `
                <div class="detail-row" style="flex-direction: column; align-items: start;">
                    <div class="detail-label">Signature</div>
                    <div style="margin-top: 0.5rem; border: 2px solid var(--border); border-radius: 8px; padding: 0.5rem; background: white;">
                        <img src="${sub.signature_image}" alt="Signature" style="max-width: 100%; height: auto;">
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="this.closest('.submission-modal').remove()">Close</button>
                <button class="btn-delete" onclick="deleteSubmission('${sub._id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function deleteSubmission(submissionId) {
    if (!confirm('Are you sure you want to delete this submission?')) {
        return;
    }
    
    try {
        await api.delete(API_CONFIG.ENDPOINTS.SUBMISSION_BY_ID(submissionId));
        await loadSubmissions();
        document.querySelector('.submission-modal')?.remove();
        alert('Submission deleted successfully');
    } catch (error) {
        alert('Error deleting submission: ' + error.message);
    }
}

// Form submission
document.getElementById('mainForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const date = document.getElementById('formDate').value;
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const period = document.querySelector('.time-btn.active')?.dataset.period || 'AM';
    const customer = document.getElementById('customer').value.trim();
    const address = document.getElementById('address').value.trim();
    const order = document.getElementById('order').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const rego = document.getElementById('rego').value.trim();
    
    // Validate
    if (!customer || !address || !order || !amount || !rego) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get signature
    const canvas = document.getElementById('signaturePad');
    const signatureImage = canvas.toDataURL();
    
    // Check if signature is empty (compare with blank canvas)
    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;
    const blankCtx = blankCanvas.getContext('2d');
    blankCtx.fillStyle = 'white';
    blankCtx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);
    
    if (signatureImage === blankCanvas.toDataURL()) {
        alert('Please provide a signature');
        return;
    }
    
    // Format time
    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
    
    const submissionData = {
        customerName: customer,
        date,
        time,
        address,
        order,
        amount,
        rego,
        signatureImage
    };
    
    try {
        await api.post(API_CONFIG.ENDPOINTS.SUBMISSIONS, submissionData);
        
        // Reset form
        e.target.reset();
        document.getElementById('formDate').valueAsDate = new Date();
        document.getElementById('clearSignature').click();
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
        
        // Reload submissions
        await loadSubmissions();
        
        alert('✅ Submission saved successfully!');
        
        // Switch to submissions tab
        document.querySelector('[data-tab="submissions"]').click();
    } catch (error) {
        alert('Error saving submission: ' + error.message);
    }
});

// Create docket button
document.getElementById('createDocketBtn')?.addEventListener('click', () => {
    showDocketModal();
});

function showDocketModal() {
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Create Docket</h3>
                <button class="close-btn" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="docketForm">
                    <div class="form-group">
                        <label>Select Customer <span class="required">*</span></label>
                        <select id="docketCustomer" required>
                            <option value="">-- Choose Customer --</option>
                            ${Array.from(new Set(submissions.map(s => s.customer_name)))
                                .map(name => `<option value="${name}">${name}</option>`)
                                .join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Start Date <span class="required">*</span></label>
                        <input type="date" id="docketStartDate" required>
                    </div>
                    <div class="form-group">
                        <label>End Date <span class="required">*</span></label>
                        <input type="date" id="docketEndDate" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="this.closest('.submission-modal').remove()">Cancel</button>
                <button class="btn-edit" onclick="generateDocket()">📄 Generate Docket</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function generateDocket() {
    const customer = document.getElementById('docketCustomer').value;
    const startDate = document.getElementById('docketStartDate').value;
    const endDate = document.getElementById('docketEndDate').value;
    
    if (!customer || !startDate || !endDate) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await api.get(
            `${API_CONFIG.ENDPOINTS.SUBMISSIONS_BY_DATE}?startDate=${startDate}&endDate=${endDate}`
        );
        
        const docketSubmissions = response.data.filter(s => s.customer_name === customer);
        
        if (docketSubmissions.length === 0) {
            alert('No submissions found for this customer in the selected date range');
            return;
        }
        
        // Generate and display docket
        displayDocket(customer, startDate, endDate, docketSubmissions);
        document.querySelector('.submission-modal')?.remove();
    } catch (error) {
        alert('Error generating docket: ' + error.message);
    }
}

function displayDocket(customer, startDate, endDate, docketSubmissions) {
    const totalAmount = docketSubmissions.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    const docketNumber = 'D' + Date.now();
    
    const customerInfo = customers.find(c => c.name === customer);
    
    const html = `
        <div style="background: white; padding: 2rem; max-width: 900px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: #1a1a2e; margin: 0;">FLOWRITE</h1>
                <p style="color: #6c757d; margin: 0.5rem 0;">Concrete Recycling & Materials</p>
                <div style="background: #e94560; color: white; padding: 0.5rem 1rem; display: inline-block; margin-top: 1rem; border-radius: 8px;">
                    <h2 style="margin: 0;">DOCKET #${docketNumber}</h2>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h3 style="margin: 0 0 1rem 0;">Customer</h3>
                    <p><strong>Name:</strong> ${customer}</p>
                    ${customerInfo?.email ? `<p><strong>Email:</strong> ${customerInfo.email}</p>` : ''}
                    ${customerInfo?.phone ? `<p><strong>Phone:</strong> ${customerInfo.phone}</p>` : ''}
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h3 style="margin: 0 0 1rem 0;">Period</h3>
                    <p><strong>From:</strong> ${new Date(startDate).toLocaleDateString()}</p>
                    <p><strong>To:</strong> ${new Date(endDate).toLocaleDateString()}</p>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
                <thead>
                    <tr style="background: #1a1a2e; color: white;">
                        <th style="padding: 0.75rem; text-align: left;">#</th>
                        <th style="padding: 0.75rem; text-align: left;">Date</th>
                        <th style="padding: 0.75rem; text-align: left;">Time</th>
                        <th style="padding: 0.75rem; text-align: left;">Address</th>
                        <th style="padding: 0.75rem; text-align: left;">Order</th>
                        <th style="padding: 0.75rem; text-align: right;">Amount</th>
                        <th style="padding: 0.75rem; text-align: left;">Rego</th>
                    </tr>
                </thead>
                <tbody>
                    ${docketSubmissions.map((sub, i) => `
                        <tr style="background: ${i % 2 === 0 ? '#fff' : '#f8f9fa'};">
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${i + 1}</td>
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${sub.date}</td>
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${sub.time}</td>
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${sub.address}</td>
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${sub.order_details}</td>
                            <td style="padding: 0.6rem; text-align: right; border-bottom: 1px solid #dee2e6; font-weight: 600;">${sub.amount}</td>
                            <td style="padding: 0.6rem; border-bottom: 1px solid #dee2e6;">${sub.rego}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr style="background: #e94560; color: white;">
                        <td colspan="5" style="padding: 0.9rem; text-align: right; font-weight: 700;">TOTAL:</td>
                        <td style="padding: 0.9rem; text-align: right; font-weight: 700; font-size: 1.2rem;">${totalAmount.toFixed(1)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    // Create modal to show docket
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-box" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>Docket Preview</h3>
                <button class="close-btn" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body" id="docketContent">
                ${html}
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="this.closest('.submission-modal').remove()">Close</button>
                <button class="btn-edit" onclick="printDocket()">🖨️ Print</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function printDocket() {
    const content = document.getElementById('docketContent').innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert('Please allow pop-ups to print the docket');
        return;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Flowrite Docket</title>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Archivo', sans-serif; margin: 0; padding: 20px; }
                @media print { body { margin: 0; padding: 0; } @page { margin: 1cm; } }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
}

// Export functions
window.loadSubmissions = loadSubmissions;
window.viewSubmission = viewSubmission;
window.deleteSubmission = deleteSubmission;
window.generateDocket = generateDocket;
window.printDocket = printDocket;
