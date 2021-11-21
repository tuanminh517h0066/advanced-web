const path          = require('path');
const express       = require('express');
const handlebars    = require('express-handlebars');

const route = require('./routes');
// const indexRouter = require('./routes/index');
const db    = require('./config/db');
const passport = require('passport');
const flash = require('connect-flash');

//connect DB
db.connect();

const app   = express();
const port  = 3000;

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// parse application/json
app.use(express.json())

app.use(require("cookie-parser")("abc-secr"));

app.use(require("express-session")({key:'sessionId'}))

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport/passport');

app.use(flash());
//passport

app.use(passport.initialize())
app.use(passport.session());


//Template engine
app.engine('handlebars', handlebars({
    // layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    

    helpers: {
        sum: (a, b) => a+b,
        check_role: (role) => {
            let role_name = 'Student';
            if(role == 1) {
                role_name = 'Teacher';
                // console.log('yes');
            }
            return role_name
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

//Route
route(app);
// app.use('/', indexRouter);
// app.use('/', )



app.listen(port, () => console.log(
    
    'Express started on http://localhost:${port}; ' +
    
    'press Ctrl-C to terminate. ')) 