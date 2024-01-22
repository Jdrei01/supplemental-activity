const express = require('express');
const session = require('express-session');
const logger = require('morgan');
// const helpers = require('./public');
const routes = require('./api');
const expresshbs = require('express-handlebars');
const path = require('path');
const env = require('dotenv');
const morgan = require('morgan');


const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;



//sets up session. used for cookies basically
const sess = {
    //used to sign the session ID cookie
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    //if empty, it uses the default settings
    cookie: {},
    //if true, it saves it in the session store
    resave: false,
    //if true, it's saves an uninitialized sess in the store. uninitialized sess are new but not modified
    //if false, complies with laws that require permission before settinf a cookie
    saveUninitialized: false,
    //this means that the session data will be stored in the same db as the Sequelize models
    store: new SequelizeStore({
        db: sequelize
    })
};

const handlebars = expresshbs.create({ helpers });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

//attaches req.session
app.use(session(sess));
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => { console.log(`Server listening on: http://localhost:${PORT}`) });
});




// const express = require('express');
// const session = require('express-session');
// const sequelize = require('./config/connection');
// const routes = require('./api/index');

// require('dotenv').config();


// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// });