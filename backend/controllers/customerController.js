const { validationResult } = require('express-validator');
const Customer = require('../models/Customer');

class CustomerController {
    // Get all customers for current user
    static async getAll(req, res, next) {
        try {
            const customers = await Customer.find({ userId: req.user.userId })
                .sort({ name: 1 })
                .lean();
            
            res.json({
                success: true,
                data: customers
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single customer
    static async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await Customer.findById(id);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            // Verify ownership
            if (customer.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: customer
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new customer
    static async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const customer = new Customer({
                userId: req.user.userId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            });

            await customer.save();

            res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                data: customer
            });
        } catch (error) {
            next(error);
        }
    }

    // Update customer
    static async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const customer = await Customer.findById(id);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            // Verify ownership
            if (customer.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            // Update fields
            customer.name = req.body.name;
            customer.email = req.body.email;
            customer.phone = req.body.phone;
            customer.address = req.body.address;
            
            await customer.save();

            res.json({
                success: true,
                message: 'Customer updated successfully',
                data: customer
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete customer
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await Customer.findById(id);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            // Verify ownership
            if (customer.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            await Customer.findByIdAndDelete(id);

            res.json({
                success: true,
                message: 'Customer deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Search customers
    static async search(req, res, next) {
        try {
            const { q } = req.query;

            if (!q || q.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const customers = await Customer.find({
                userId: req.user.userId,
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } },
                    { phone: { $regex: q, $options: 'i' } },
                    { address: { $regex: q, $options: 'i' } }
                ]
            }).sort({ name: 1 });

            res.json({
                success: true,
                data: customers
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CustomerController;
