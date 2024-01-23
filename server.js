const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const routes = require('./api');
const exphbs = require('express-handlebars');
const path = require('path');
const env = require('dotenv');
const morgan = require('morgan');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// sets up session for cookies
const sess = {
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
};

// Create an instance of express-handlebars
const hbs = exphbs.create();

// Use the instance's engine property when setting up the engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(session(sess));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.get('/', (req, res) => {
    res.render('homepage', { logged_in: req.session.logged_in, username: req.session.username});
});

                    
// Authentication routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => { console.log(`Server listening on: http://localhost:${PORT}`) });
});
