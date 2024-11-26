const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  visaApplicationFee: { type: Number, required: true },
  translationFee: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentStatus: { type: String, required: true, enum: ['Paid', 'Due'] },
});

const japanVisitSchema = new mongoose.Schema(
  {
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientModel',
        required: true
    },
    clientName: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        enum: ['Visitor Visa', 'Other'],
         required: true
        },
    country: {
        type: String,
         required: true
        },
    documentStatus: {
        type: String,
        default: 'Not Yet'
    },
    documentsToTranslate: {
        type: Number,
        default: 0
    },
    translationStatus: {
        type: String,
        default: 'Under Process'
    },
    visaStatus: {
        type: String,
        default: 'Under Review'
    },
    deadline: {
        type: Date
    },
    payment: paymentSchema,
    paymentStatus: {
        type: String, enum: ['Paid', 'Due'], required: true },
    submissionDate: {
        type: Date, default: Date.now },
    createdAt: {
        type: Date, default: Date.now },
    updatedAt: {
        type: Date, default: Date.now },
  },
  { timestamps: true }
);

// module.exports = mongoose.model('Application', applicationSchema);
const japanVisitModel = mongoose.model('japanVisitModel', japanVisitSchema);
module.exports = japanVisitModel;
