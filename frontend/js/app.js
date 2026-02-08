// ============================================
// 📱 FLOWRITE - MAIN APPLICATION
// ============================================

// Global state
let customers = [];
let submissions = [];
let items = [];
let signaturePad = null;
let signatureHistory = [];

// ============================================
// 🔄 TAB SWITCHING
// ============================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active states
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ============================================
// 🎨 SIGNATURE PAD
// ============================================
function initSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        lastX = (clientX - rect.left) * scaleX;
        lastY = (clientY - rect.top) * scaleY;
        
        // Save state for undo
        signatureHistory.push(canvas.toDataURL());
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    signaturePad = { canvas, ctx };
}

// Clear signature
document.getElementById('clearSignature')?.addEventListener('click', () => {
    if (!signaturePad) return;
    const { ctx, canvas } = signaturePad;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    signatureHistory = [];
});

// Undo signature
document.getElementById('undoSignature')?.addEventListener('click', () => {
    if (!signaturePad || signatureHistory.length === 0) return;
    
    signatureHistory.pop(); // Remove current state
    const previousState = signatureHistory[signatureHistory.length - 1];
    
    if (previousState) {
        const { ctx, canvas } = signaturePad;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
    } else {
        document.getElementById('clearSignature').click();
    }
});

// ============================================
// ⏰ TIME PICKER
// ============================================
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Set default date to today
document.getElementById('formDate').valueAsDate = new Date();

// Initialize on load
setTimeout(() => {
    initSignaturePad();
}, 100);
