const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    customerName: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    orderDetails: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    rego: {
        type: String,
        required: true
    },
    signatureImage: {
        type: String  // Base64 encoded image
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
submissionSchema.index({ customerName: 1, date: -1 });
submissionSchema.index({ date: -1, time: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
