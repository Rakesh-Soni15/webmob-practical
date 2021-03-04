const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');

const dbConfig = require('./config/database.config.js');

app.use('/upload/images', express.static('upload/images'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

require('./app/route/route.js')(app);
mongoose.Promise = global.Promise;

//connecting to database
mongoose.connect(dbConfig.url, {
	useNewUrlParser : true,
	useUnifiedTopology : true,
	useCreateIndex : true
}).then(()=>{
	console.log("Database connected");
}).catch(err=>{
	console.log("Could not connect to database");
	process.exit();
});

//define route
app.get('/', (req, res)=>{
	res.json({"message": "Hello"})
});

app.listen(7000, ()=>{
	console.log("server is running on port 7000");
});
