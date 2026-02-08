const { validationResult } = require('express-validator');
const Submission = require('../models/Submission');

class SubmissionController {
    // Get all submissions for current user
    static async getAll(req, res, next) {
        try {
            const { limit = 100, offset = 0 } = req.query;
            
            const submissions = await Submission.find({ userId: req.user.userId })
                .sort({ date: -1, time: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(offset))
                .lean();

            res.json({
                success: true,
                data: submissions
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single submission
    static async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await Submission.findById(id);

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }

            // Verify ownership
            if (submission.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: submission
            });
        } catch (error) {
            next(error);
        }
    }

    // Get submissions by customer name
    static async getByCustomer(req, res, next) {
        try {
            const { customerName } = req.params;
            const submissions = await Submission.find({
                userId: req.user.userId,
                customerName
            }).sort({ date: -1, time: -1 });

            res.json({
                success: true,
                data: submissions
            });
        } catch (error) {
            next(error);
        }
    }

    // Get submissions by date range
    static async getByDateRange(req, res, next) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'startDate and endDate are required'
                });
            }

            const submissions = await Submission.find({
                userId: req.user.userId,
                date: { $gte: startDate, $lte: endDate }
            }).sort({ date: -1, time: -1 });

            res.json({
                success: true,
                data: submissions
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new submission
    static async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const submission = new Submission({
                userId: req.user.userId,
                customerName: req.body.customerName,
                date: req.body.date,
                time: req.body.time,
                address: req.body.address,
                orderDetails: req.body.order,
                amount: req.body.amount,
                rego: req.body.rego,
                signatureImage: req.body.signatureImage
            });

            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Submission created successfully',
                data: submission
            });
        } catch (error) {
            next(error);
        }
    }

    // Update submission
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
            const submission = await Submission.findById(id);

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }

            // Verify ownership
            if (submission.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            // Update fields
            submission.customerName = req.body.customerName;
            submission.date = req.body.date;
            submission.time = req.body.time;
            submission.address = req.body.address;
            submission.orderDetails = req.body.order;
            submission.amount = req.body.amount;
            submission.rego = req.body.rego;
            submission.signatureImage = req.body.signatureImage;

            await submission.save();

            res.json({
                success: true,
                message: 'Submission updated successfully',
                data: submission
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete submission
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await Submission.findById(id);

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }

            // Verify ownership
            if (submission.userId.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            await Submission.findByIdAndDelete(id);

            res.json({
                success: true,
                message: 'Submission deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete submissions by customer
    static async deleteByCustomer(req, res, next) {
        try {
            const { customerName } = req.params;
            const result = await Submission.deleteMany({
                userId: req.user.userId,
                customerName
            });

            res.json({
                success: true,
                message: `${result.deletedCount} submission(s) deleted successfully`
            });
        } catch (error) {
            next(error);
        }
    }

    // Get statistics
    static async getStats(req, res, next) {
        try {
            const stats = await Submission.aggregate([
                { $match: { userId: req.user.userId } },
                {
                    $group: {
                        _id: null,
                        total_submissions: { $sum: 1 },
                        total_amount: { $sum: '$amount' },
                        unique_customers: { $addToSet: '$customerName' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total_submissions: 1,
                        total_amount: 1,
                        unique_customers: { $size: '$unique_customers' }
                    }
                }
            ]);

            const result = stats[0] || {
                total_submissions: 0,
                total_amount: 0,
                unique_customers: 0
            };

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SubmissionController;
