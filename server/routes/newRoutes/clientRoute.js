const express = require('express');
const router = express.Router();
// const {getClients,getClientById,addClient, updateClient,deleteClient,} = require('../controllers/clientController');
const controller = require ('../../controllers/clientController');


// // Get all clients
// router.get('/', getClients);

// // Get client by ID
// router.get('/:id', getClientById);

// // Add a new client
// router.post('/', addClient);

// // Update an existing client
// router.put('/:id', updateClient);

// // Delete a client
// router.delete('/:id', deleteClient);



// Get all clients
router.get('/getClient', controller.getClients);
router.get('/getClient/:id', controller.getClientById);
router.post('/createClient', controller.addClient);
router.put('/updateClient/:id', controller.updateClient);
router.delete('/deleteClient/:id', controller.deleteClient);


module.exports = router;







