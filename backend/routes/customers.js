const express = require('express');
const { body } = require('express-validator');
const CustomerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const customerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ max: 200 })
        .withMessage('Name must not exceed 200 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Phone must not exceed 50 characters'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
];

// Routes
router.get('/', CustomerController.getAll);
router.get('/search', CustomerController.search);
router.get('/:id', CustomerController.getOne);
router.post('/', customerValidation, CustomerController.create);
router.put('/:id', customerValidation, CustomerController.update);
router.delete('/:id', CustomerController.delete);

module.exports = router;
