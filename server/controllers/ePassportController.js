const ePassportModel = require("../models/newModel/ePassportModel");


// Create a new ePassport application
exports.createEpassport = async (req, res) => {
  try {
    const epassport = new ePassportModel(req.body);
    await epassport.save();
    res.status(201).json({success: true, message: 'epassport data created', data: epassport,});
  } catch (error) {
    res.status(400).json({success: false, message: error.message,});
  }
};

// Get all ePassport applications
exports.getAllEpassports = async (req, res) => {
  try {
    const epassports = await ePassportModel.find().populate('clientId');
    if (epassports.length === 0) {
      return res.status(404).json({success: false, message: 'No ePassport applications found',});
    }
    res.status(200).json({success: true, message: 'ePassport application data fected', data: epassports,});
  } catch (error) {
    res.status(500).json({success: false, message: error.message,});
  }
};

// Get a single ePassport application by ID
exports.getEpassportById = async (req, res) => {
  try {
    const epassport = await ePassportModel.findById(req.params.id);
    if (!epassport) {
      return res.status(404).json({success: false, message: 'ePassport not found',});
    }
    res.status(200).json({success: true, data: epassport,});
  } catch (error) {res.status(500).json({success: false, message: error.message,});
  }
};

// Update an ePassport application
exports.updateEpassport = async (req, res) => {
  try {
    const epassport = await ePassportModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!epassport) {
      return res.status(404).json({success: false, message: 'ePassport not found',});
    }
    res.status(200).json({success: true, message: 'epassport data updated successfully', data: epassport,});
  } catch (error) {
    res.status(400).json({success: false, message: error.message,});
  }
};

// Delete an ePassport application
exports.deleteEpassport = async (req, res) => {
  try {
    const epassport = await ePassportModel.findByIdAndDelete(req.params.id);
    if (!epassport) {
      return res.status(404).json({success: false, message: 'ePassport not found',});
    }
    res.status(200).json({success: true, message: 'ePassport deleted successfully',});
  } catch (error) {
    res.status(500).json({success: false, message: error.message,});
  }
};
