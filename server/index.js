const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
// const authRoutes = require('./routes/authRoute');
const clientRoutes = require('./routes/clients');
const applicationRoutes = require('./routes/applications');
const appointmentRoutes = require('./routes/appointments');
const documentRoutes = require('./routes/documents');
const dbConnection = require('./config/dbConn');

//new route imported by sunil
const authRoute = require ('./routes/authRoute');
const clientRoute = require ('./routes/newRoutes/clientRoute');
const visaApplicationRoute = require ('./routes/newRoutes/applicationRoute');


dotenv.config();

const app = express();

// Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/documents', documentRoutes);


// ********NEW ROUTE********
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/client', clientRoute);
app.use('/api/v1/visaApplication', visaApplicationRoute)


//connecting with database
dbConnection();



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
// async function startServer() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established.');
    
//     // Sync database models
//     await sequelize.sync();
//     console.log('Database models synchronized.');

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Unable to start server:', error);
//     process.exit(1);
//   }
// }

// startServer();


app.listen(PORT,()=> {
  console.log(`Server is running on no port no : ${PORT}`)
})