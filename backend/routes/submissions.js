const express = require('express');
const { body } = require('express-validator');
const SubmissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const submissionValidation = [
    body('customerName')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required'),
    body('date')
        .notEmpty()
        .withMessage('Date is required'),
    body('time')
        .notEmpty()
        .withMessage('Time is required'),
    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    body('order')
        .trim()
        .notEmpty()
        .withMessage('Order details are required'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('rego')
        .trim()
        .notEmpty()
        .withMessage('Rego is required'),
    body('signatureImage')
        .optional()
];

// Routes
router.get('/', SubmissionController.getAll);
router.get('/stats', SubmissionController.getStats);
router.get('/date-range', SubmissionController.getByDateRange);
router.get('/customer/:customerName', SubmissionController.getByCustomer);
router.get('/:id', SubmissionController.getOne);
router.post('/', submissionValidation, SubmissionController.create);
router.put('/:id', submissionValidation, SubmissionController.update);
router.delete('/:id', SubmissionController.delete);
router.delete('/customer/:customerName', SubmissionController.deleteByCustomer);

module.exports = router;
