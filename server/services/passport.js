const keys = require('../config/keys')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const mongoose = require('mongoose')
const User = mongoose.model('users')

passport.serializeUser((user, done)=>{
 done(null,user.id)
})


passport.deserializeUser((id,done)=>{
 User.findById(id)
 .then(user =>{
  done(null, user)
 })
})
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then(user => {
//       done(null, user);
//     })
//     .catch(err => {
//       done(err, null);
//     });
// });

passport.use(
 new GoogleStrategy({
 
 clientID:keys.googleClientID,
 clientSecret:keys.googleClientSecret,
 callbackURL:'/auth/google/callback'
}
,(accessToken,refreshToken,profile,done)=>{
 
// console.log('accessToken',accessToken)
// console.log('refreshToken',refreshToken)
// console.log('profile',profile)
User.findOne({googleId:profile.id})
.then((existingUser)=>{
  if(existingUser){
   // we already have a record in the database
   done(null, existingUser)
  }else{
   // we dont have a new user create one
   new User({ googleId: profile.id}).save()
   .then(user=> done(null,user))
  }
})

})
)