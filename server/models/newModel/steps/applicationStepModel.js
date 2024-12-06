// const mongoose = require('mongoose');

// const applicationStepSchema = new mongoose.Schema({
//   stepName: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
// });



// const applicationStepModel = mongoose.model('ApplicationStepModel', applicationStepSchema);

// module.exports = applicationStepModel;








// models/ApplicationStepModel.js

const mongoose = require('mongoose');

const applicationStepSchema = new mongoose.Schema({
  stepNames: {
    type: Map,
    of: {
      status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
      // You can add more fields if necessary, e.g., color or description
    },
    required: true,
  },
});

const applicationStepModel = mongoose.model('ApplicationStepModel', applicationStepSchema);

module.exports = applicationStepModel;
