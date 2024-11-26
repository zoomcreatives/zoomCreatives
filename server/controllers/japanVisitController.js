const japanVisitModel = require('../models/newModel/japanVisitModel');

// Create a new visa application
exports.createJapanVisitApplication = async (req, res) => {
  try {
    const { clientId, type, country, payment, deadline } = req.body;

    // Calculate total payment
    const total = (payment.visaApplicationFee + payment.translationFee) - 
                  (payment.paidAmount + payment.discount);

    // Set payment total and status
    const paymentStatus = total <= 0 ? 'Paid' : 'Due';

    const newApplication = new japanVisitModel({
      clientId,
      type,
      country,
      payment: {
        ...payment,
        total,
        paymentStatus
      },
      paymentStatus,
      deadline,
      submissionDate: new Date()
    });

    const application = await newApplication.save();
    res.status(201).json({ message: 'Application created successfully', data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get all applications
exports.getAllJapanVisitApplications = async (req, res) => {
  try {
    const applications = await japanVisitModel.find();
    res.status(200).json({ data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get application by ID
exports.getJapanVisitApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await japanVisitModel.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update an existing visa application
exports.updateJapanVisitApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Fetch client details (make sure client exists)
    // const client = await japanVisitModel.findById(updateData.clientId);
    // if (!client) {
    //   return res.status(404).json({ message: 'Client not found' });
    // }

    // Calculate total payment
    const total = (updateData.payment.visaApplicationFee + updateData.payment.translationFee) - 
                  (updateData.payment.paidAmount + updateData.payment.discount);

    // Set total and payment status
    updateData.payment.total = total;
    updateData.paymentStatus = total <= 0 ? 'Paid' : 'Due';

    // Find and update the application
    const application = await japanVisitModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application updated successfully', data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete an application by ID
exports.deleteJapanVisitApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await japanVisitModel.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
