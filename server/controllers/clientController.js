
const ClientModel = require('../models/newModel/clientModel');

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await ClientModel.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new client
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

exports.addClient = async (req, res) => {
  const { name, email, password, phone, nationality, category, status } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

  const newClient = new ClientModel({
    name,
    email,
    password: hashedPassword,  // Store the hashed password
    phone,
    nationality,
    category,
    status,
    // profilePhoto,
  });

  try {
    // Save the new client with hashed password
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  

// Update an existing client
exports.updateClient = async (req, res) => {
    try {
      const client = await ClientModel.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      // Update fields if provided in the request body
      const { name, email, phone, nationality, category, status } = req.body;
      client.name = name || client.name;
      client.email = email || client.email;
      client.phone = phone || client.phone;
      client.nationality = nationality || client.nationality;
      client.category = category || client.category;
      client.status = status || client.status;
  
      // Save the updated document
      const updatedClient = await client.save();
      // const updatedClient = await client.save();
      res.status(200).json(updatedClient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

 
  
  


//delete client
exports.deleteClient = async (req, res) => {
    const clientId = req.params.id; 
    try {
      const client = await ClientModel.findByIdAndDelete(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found.' });
      }
      res.status(200).json({ success: true, message: 'Client deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
  };





