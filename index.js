// Import required modules
const express = require('express'); // For our server
const session = require('express-session'); // For our session
const sequelize = require('./config/connection'); // To interact with our database
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars'); // To use as the view engine

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Create our session
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure our view engine
const helpers = require('./utils/helpers'); // Load custom helper functions
const hbs = exphbs.create({ helpers }); // Instantiate with custom configuration
app.engine('handlebars', hbs.engine); // Set engine to custom Handlebars instance
app.set('view engine', 'handlebars'); // Set Express.JS view engine to Handlebars


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});