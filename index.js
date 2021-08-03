require('dotenv').config();
const express = require('express');
const app = express();
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Database
dbConnection();

// CORS
cors();

// Public Folder
app.use(express.static('public'));

// Body Parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Server start
app.listen(process.env.PORT, () =>
  console.log(`Server on port ${process.env.PORT}`)
);
