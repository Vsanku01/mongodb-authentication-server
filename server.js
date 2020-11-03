const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const coolFaces = require('cool-ascii-faces');

// Routes
const AuthRoute = require('./routes/auth');

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors());

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', AuthRoute);

//Index page (static HTML)
//Index page at default entry route
// app.route('/').get(function (req, res) {
//   res.sendFile(path.join(__dirname, '/index.html'));
// });

app.get('/', (req, res) => {
  res.send(coolFaces());
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
// app.listen(process.env.port || 3000);

app.listen(process.env.PORT || 5000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
