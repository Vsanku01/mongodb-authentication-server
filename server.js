const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Routes
const AuthRoute = require('./routes/auth');

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors());

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', AuthRoute);
// Static path
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});

// Establish the connection to the database
mongoose.connect(
  process.env.MONGODB_URI,
  {
    keepAlive: 300000,
    socketTimeoutMS: 300000,
    connectTimeoutMS: 300000,
    serverSelectionTimeoutMS: 300000,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  function (err) {
    if (err) return console.log('Error: ', err);
    console.log(
      'MongoDB Connection -- Ready state is:',
      mongoose.connection.readyState
    );
  }
);

// Server Listening
app.listen(process.env.port || 3000);
