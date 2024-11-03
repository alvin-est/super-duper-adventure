// Import required modules
const express = require('express'); // For our server
const session = require('express-session'); // For our session
const sequelize = require('./config/connection.js'); // To interact with our database
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars'); // To use as the view engine
const routes = require('./controllers/index.js'); // For routing server requests
require('dotenv').config();
const path = require('path');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Create our session with below config
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    // Expires after 30 minutes of inactivity
    maxAge: 30 * 60 * 1000, // 30 minutes
    secure: true, // Set to true if using HTTPS in production
    sameSite: 'strict' // Prevent CSRF attacks
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Use our session with above config
app.use(session(sess));

// Middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Configure our view engine
const helpers = require('./utils/helpers'); // Load custom helper functions
const hbs = exphbs.create({ helpers }); // Instantiate with custom configuration
app.engine('handlebars', hbs.engine); // Set engine to custom Handlebars instance
app.set('view engine', 'handlebars'); // Set Express.JS view engine to Handlebars

// Use our routes
app.use(routes);


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});