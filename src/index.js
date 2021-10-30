const path          = require('path');
const express       = require('express');
const handlebars    = require('express-handlebars');

const route = require('./routes');
const db    = require('./config/db');

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

//Template engine
app.engine('handlebars', handlebars({
    defaultLayout: 'main',

    helpers: {
        sum: (a, b) => a+b,
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

//Route
route(app);




app.listen(port, () => console.log(
    
    'Express started on http://localhost:${port}; ' +
    
    'press Ctrl-C to terminate. ')) 