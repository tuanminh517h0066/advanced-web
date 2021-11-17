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
       if( user.password != password){
            return done(null,false,{message:'Wrong password'})
        }
        return done(null, user);
    
     });
   }
 ));

//google auth sign in
passport.use(new GoogleStrategy({
  clientID:     '1030080015854-snr9og0v8cpjvc25ab5ngtapm9p3jgag.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback",
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
          user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              role: 1,
          });
          user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
          });
      } else {
          //found user. Return
          return done(err, user);
      }
    });
}
));
