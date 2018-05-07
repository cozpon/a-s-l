const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const User = db.user;


passport.serializeUser((user, done) => {
  console.log('serializing USER', user);
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log(user, 'DESERIAL USER');
  User.findById(user.id)
    .then(user => {
      if (!user) return done(null, false);
      return done(null, {
        id: user.id,
        username: user.username
      });
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
  console.log('passport use ==>', username, password);
  User.findOne({ where: {username: username} })
  .then(user => {
    if(user === null){
      return done(null, false, {
        message: 'bad username or password'
      });
    }else{
      bcrypt.compare(password, user.password)
      .then(res => {
        if (res) {
          return done(null, user);
        }else{
          return done(null, false, {
            message: 'bad username or password'
          });
        }
      });
    }
  })
    .catch((error) => {
      console.log('ERROR:', error);
    });
}));

module.exports = passport;