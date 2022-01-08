const path          = require('path');
const express       = require('express');
const handlebars    = require('express-handlebars');

const route = require('./routes');
// const indexRouter = require('./routes/index');
const db    = require('./config/db');
const passport = require('passport');
const flash = require('connect-flash');

const { disconnect } = require('process');
//connect DB
db.connect();

// const cors = require('cors');
const socket = require("socket.io");

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
    partialsDir : 'partials/check',

    helpers: {
        sum: (a, b) => a+b,
        check_role: (role) => {
            let role_name = 'Student';
            if(role == 1) {
                role_name = 'Teacher';
                // console.log('yes');
            }
            return role_name
        },
        getYoutubeId: (youtube) => {
            var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return (youtube.match(p)) ? RegExp.$1 : false;
        },
        formatDate: (dates) => {
            var date = new Date(dates);
            var dateStr =
              ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
              ("00" + date.getDate()).slice(-2) + "/" +
              date.getFullYear() + " " +
              ("00" + date.getHours()).slice(-2) + ":" +
              ("00" + date.getMinutes()).slice(-2) + ":" +
              ("00" + date.getSeconds()).slice(-2);
            
            return dateStr
        },
        if_eq: (a, b, opts) => {
            
            if (String(a) === String(b)) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        },
        liked: (a,b) => {

            // return user_id;
            var like_arr = a;
            var user_id = b;
            var liked = '';
            
            like_arr.forEach(function (element){
                
                if (String(element.user._id) === String(user_id)) {
                    
                    liked = 'liked';
                    
                }
            })
            
            return liked;
        },
        style_liked: (a, b) => {
            var like_arr = a;
            var user_id = b;
            var style_liked = '';
            
            like_arr.forEach(function (element){
                
                if (String(element.user._id) === String(user_id)) {
                    
                    style_liked = 'style="font-weight: 900;"';
                    
                }
            })

            return style_liked;
        },
        data_like: (a, b) => {

            var like_arr = a;
            var user_id = b;
            var data_like = '';
            like_arr.forEach(function (element){
                
                if (String(element.user._id) === String(user_id)) {
                    

                    data_like = element._id;
                    
                }
            })
            
            return data_like;
        },
        checked_option: (a,b) => {
            var option_arr = a;
            var option_user = b;
            var checked = '';
            
            if (typeof option_arr !== "undefined") {
                
                option_arr.forEach(function (element){

                    if (String(element) === String(option_user)) {
                        
                        checked = 'selected';
                    }
                })
            }

            return checked;
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

//Route
route(app);
// app.use('/', indexRouter);
// app.use('/', )

// custom 404 page

app.use((req, res) => {

    res.status(404)

    res.render('error/404',{
        layout: '404_layout'
    });

})

// custom 500 page

app.use((err, req, res, next) => {

console.error(err.message)

    res.status(500)

    res.render('error/500',{
        layout: '500_layout'
    });
})

const server = app.listen(port, () => console.log(
    
    'Express started on http://localhost:${port}; ' +
    
    'press Ctrl-C to terminate. '))
  
// app.use(cors())
const io = socket(server);
io.on("connection", function (socket){
    console.log("Made socket connection");
    
    socket.on("disconnect", function(){
        console.log("Made socket disconnected");
    })

    socket.on("sendNotification", function(data){
        io.emit("newNotification", data);
        console.log("sent from server");
    })
});