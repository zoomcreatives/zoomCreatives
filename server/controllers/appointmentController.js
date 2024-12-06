const applicationModel = require("../models/newModel/applicationModel");
const AppointmentModel = require("../models/newModel/appointmentModel");
const ClientModel = require("../models/newModel/clientModel");
const documentTranslationModel = require("../models/newModel/documentTranslationModel");
const ePassportModel = require("../models/newModel/ePassportModel");
const GraphicDesignModel = require("../models/newModel/graphicDesingModel");
const japanVisitAppplicaitonModel = require("../models/newModel/japanVisitModel");
const OtherServiceModel = require("../models/newModel/otherServicesModel");
const applicationStepModel = require("../models/newModel/steps/applicationStepModel");

// Create an appointment
exports.createAppointment = async (req, res) => {
    try {
      const appointment = new AppointmentModel(req.body);
      await appointment.save();
      res.status(201).json({success: true, message: 'Appointment created successfully',appointment});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Failed to create appointment',error});
    }
  };

  

  // Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
      const appointments = await AppointmentModel.find().populate('clientId', 'name phone');
      res.status(200).json({success: true, appointments});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Failed to retrieve appointments',error});
    }
  };

  


  // Get an appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
      const appointment = await AppointmentModel.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({success: false, message: 'Appointment not found'});
      }
      res.status(200).json({success: true, message: 'appointment fetched succssfully', appointment});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Failed to retrieve appointment', error});
    }
  };

  

  // Update an appointment by ID
exports.updateAppointment = async (req, res) => {
    try {
      const updatedAppointment = await AppointmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
      res.status(200).json({success: true, message: 'Appointment updated successfully',updatedAppointment});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Failed to update appointment', error});
    }
  };





  // Update appointment status (mark as completed or cancelled)
exports.updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;  // Status can be "Completed" or "Cancelled"
    const { id } = req.params;
  
    try {
      // Find the appointment by ID
      const appointment = await AppointmentModel.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
      // Check if the status is valid (Completed or Cancelled)
      if (status !== 'Completed' && status !== 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
  
      // Update the appointment status
      appointment.status = status;
  
      // Optionally, add timestamps for when the appointment is completed or cancelled
      if (status === 'Completed') {
        appointment.completedAt = new Date();
      } else if (status === 'Cancelled') {
        appointment.cancelledAt = new Date();
      }
  
      // Save the updated appointment
      await appointment.save();
  
      res.status(200).json({
        success: true,
        message: 'Appointment status updated successfully',
        appointment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to update appointment status', error });
    }
  };
  



  



  // Delete an appointment by ID
exports.deleteAppointment = async (req, res) => {
    try {
      const deletedAppointment = await AppointmentModel.findByIdAndDelete(req.params.id);
      if (!deletedAppointment) {
        return res.status(404).json({success: false, message: 'Appointment not found'});
      }
      res.status(200).json({success: true, message: 'Appointment deleted successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Failed to delete appointment', error});
    }
  };
  



  // *****************************************************GET ALL MODEL DATA AT ONCE FOR ACCOUNT AND TASK (FRONTEND)**************************************************

  exports.fetchAllModelData = async (req, res) => {
    try {
      // Fetch data from all models in parallel
      const [application, japanVisit, documentTranslation, epassports, otherServices, graphicDesigns, appointment, ] = await Promise.all([
        applicationModel.find().populate('clientId').populate('step').lean(),
        japanVisitAppplicaitonModel.find().populate('clientId').lean(),
        documentTranslationModel.find().populate('clientId').lean(),
        ePassportModel.find().populate('clientId').lean(),
        OtherServiceModel.find().populate('clientId').lean(),
        GraphicDesignModel.find().populate('clientId').lean(),
        AppointmentModel.find().populate('clientId').lean(),

      ]);
  
      // Combine the data into a single response object
      const allData = {application, japanVisit, documentTranslation, epassports, otherServices, graphicDesigns, appointment,};

      // Send the combined data as a JSON response
      res.status(200).json({success: true, message: 'all model data fetched successfully', allData});
    } catch (error) {
      console.error('Error fetching all data:', error);
      res.status(500).json({success: false, meessage: 'Failed to fetch data from models', error });
    }
  };

  exports.getAllModelDataById = async (req, res) => {
    try {
      const { id } = req.params;  // Assuming the client ID is passed as a route parameter
  
      // First, check if the clientId exists in the Client model
      const clientExists = await ClientModel.findById(id);
      if (!clientExists) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }
  
      // Fetch data for the given clientId from all models in parallel
      const [application, japanVisit, documentTranslation, epassports, otherServices, graphicDesigns, appointment] = await Promise.all([
        applicationModel.find({ 'clientId': id }).populate('clientId').populate('step').lean(),
        japanVisitAppplicaitonModel.find({ 'clientId': id }).populate('clientId').lean(),
        documentTranslationModel.find({ 'clientId': id }).populate('clientId').lean(),
        ePassportModel.find({ 'clientId': id }).populate('clientId').lean(),
        OtherServiceModel.find({ 'clientId': id }).populate('clientId').lean(),
        GraphicDesignModel.find({ 'clientId': id }).populate('clientId').lean(),
        AppointmentModel.find({ 'clientId': id }).populate('clientId').lean(),
      ]);
  
      // Combine the fetched data into a single response object
      const allData = {
        application,
        japanVisit,
        documentTranslation,
        epassports,
        otherServices,
        graphicDesigns,
        appointment,
      };
  
      // Send the combined data as a JSON response
      res.status(200).json({ success: true, message: 'Data fetched successfully', allData });
    } catch (error) {
      console.error('Error fetching data by clientId:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch data by client ID', error });
    }
  };








// Controller to handle creating a new application step with an object structure for stepNames
exports.createApplicationStep = async (req, res) => {
  try {
    const { stepNames } = req.body;

    // Validate stepNames object
    if (typeof stepNames !== 'object' || Object.keys(stepNames).length === 0) {
      return res.status(400).json({ message: 'stepNames must be a non-empty object' });
    }

    // Create a new ApplicationStep document
    const newStep = new applicationStepModel({
      stepNames,
    });

    // Save the step to the database
    const savedStep = await newStep.save();

    // Return the saved step as a response
    res.status(201).json(savedStep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to handle updating the status of a specific step
exports.updateStepStatus = async (req, res) => {
  try {
    const { stepName, status } = req.body;

    // Validate input
    if (!stepName || !status) {
      return res.status(400).json({ message: 'Step name and status are required' });
    }

    // Validate status
    if (!['pending', 'processing', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the status of the specific step in the database
    const updatedStep = await applicationStepModel.findOneAndUpdate(
      { 'stepNames.stepName': stepName },  // Match the stepName in the stepNames object
      { $set: { [`stepNames.${stepName}.status`]: status } }, // Update the status of the specific step
      { new: true }
    );

    if (!updatedStep) {
      return res.status(404).json({ message: 'Step not found' });
    }

    // Return the updated step as a response
    res.status(200).json(updatedStep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};