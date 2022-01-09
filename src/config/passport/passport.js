// config/passport.js
// load các module
const passport = require('passport');
// load  user model
const User = require('../../app/models/User');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;



// passport session setup

// used to serialize the user for the session
passport.serializeUser(function(user, done){
    done(null, user.id);
    
})
 // used to deserialize the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})
// local sign-up
// passport.use('local.signup',new LocalStrategy({
//     usernameField:'email',
//     passwordField:'password',
//     passReqToCallback:true
// },function(req, email, password,done) {
   
//  User.findOne({ 'email': email }, function(err, user) {
//         if (err) { return done(err); }
//         if (user) {
//           return done(null, false, { message : 'Email is already in use.'})
//         }
//        var newUser= new User();
//        newUser.email= email;
//        newUser.password=newUser.encryptPassword(password);
//        newUser.save(function(err, result){
//          if(err){
//            return done(err)
//          }
//          return done(null, newUser);
//        })
//       });
//     }
//   ));

// local sign-in
passport.use('local.login',new LocalStrategy({
   usernameField:'email',
   passwordField:'password',
   passReqToCallback:true
},function(req, email, password,done) {
  
    User.findOne({ 'email': email }, function(err, user) {
       if (err) { return done(err); }
       if (!user) {
         return done(null, false, { message : 'Not user found'})
       }
       if(!user.validPassword(password)){
            return done(null,false,{message:'Wrong password'})
        }
        return done(null, user);
    
     });
   }
 ));

//google auth sign in
passport.use(new GoogleStrategy({
    clientID:     '26655799551-09apjiro3k6iv40op1uefa3lv4abhshc.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://localhost:3000/member/auth/google/callback",
    passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {

        User.findOne({
                'email': profile.emails[0].value, 
            }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                let regexEmail = "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(student.tdtu.edu)\.vn$";

                let email = profile.emails[0].value;
                if (email.match(regexEmail)) {
                    console.log(1)
                    user = new User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role: 0,
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });

                } else {
                    return done(null,false,{message:'Must use student email domain'})
                }
                
            } else {
                //found user. Return
                return done(err, user);
            }
        });
}
));
