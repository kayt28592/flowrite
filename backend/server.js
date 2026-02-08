require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const submissionRoutes = require('./routes/submissions');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // For signature images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Flowrite API is running',
        database: 'MongoDB',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ================================');
    console.log('🚀  FLOWRITE SERVER STARTED');
    console.log('🚀 ================================');
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🗄️  Database: MongoDB`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ================================');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});
