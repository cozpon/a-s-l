const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
//const LocalStrategy = require('passport-local').Strategy;
const app = express();
const saltRounds = 12;
const router = express.Router();

//const sendmail = require('../config/mailer.js');
//const nodemailer = require('nodemailer');
//const crypto = require('crypto');

const db = require('../models');
const User = db.user;
//const Status = db.status;


router.post('/login',
  passport.authenticate('local'), (req, res) => {
  console.log(req.user, 'req.user');
  return res.json({
    id: req.user.id,
    username: req.user.username,
    success: true
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  console.log('user logged out');
  res.sendStatus(200);
});

router.post('/register', (req, res) => {
  console.log(req.body);
  const { email, username } = req.body;
  console.log(req.body, 'Req body');
  return User.findOne({
    where: { $or : [{ username: username }, { email: username }] }, // lets client login with username or email
    attributes: { exclude: ['password'] }
  })
  .then(response => {
    // if user does not exist, findOne will return null
    // if user does exist, user details will be returned
    if(response){
      res.json({
        error: 'sorry, that username/email is already in use!'
      });

    } else {
        bcrypt.genSalt(saltRounds, function(err, salt){
          bcrypt.hash(req.body.password, salt, function(err, hash){
            console.log(hash);
            User.create({
              username: username,
              password: hash,
              email: email
            })
            .then((user) => {
              console.log(user, 'user reg data');
              return res.json({
                username: user.username,
                password: user.password,
                email: user.email,
                success: true
              });
            });
          });
        });
      }
    })
  .catch((err) => {
    console.log("error", err);
    return res.json({
      error : 'Oh no! Something went wrong!'
    });
  });
});

//FORGOT password
// router.post('/forgot', (req, res) => {
//   return User.findOne({ where : { email: req.body.email } })
//   .then(user => {
//     crypto.randomBytes(20, function(err, buf) { //creates random TOKEN
//       let token = buf.toString('hex');
//       let client = nodemailer.createTransport({ //sets up nodemailer
//           service: 'SendGrid',
//           auth: {
//             user: sendmail.user, // username & password stored in config/mailer.js
//             pass: sendmail.pass  // hidden with .gitignore so as not to push up sensitive details
//           }
//         });
//       let email = {
//         to: req.body.email, // sends email to data input
//         from: 'passwordreset@shadetheapp.com', //from us
//         subject: 'Shade. Mobile App Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           "It's no big deal, you forgot your password. Happens all the time, really.\n\n" +
//           'Please click on the following link, or paste this into your browser:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' + // this link be from server side, req.headers.host can be our website html
//           'If you did not request this, someone forgot a lot more than their password! \n\n' +
//           'Simply ignore this email and your password will remain unchanged.\n'
//         }; // ^^ rewrite the "text" and make it more specific // customized
//       client.sendMail(email, function(err, info){ //
//         if(err){
//           console.log(err);
//         }
//         else {
//         console.log('Message sent: ' + info.response);
//         req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
//         } // req.flash meant for express-flash
//       })
//       return user.update({ // sends the token + expiration date to the user DB
//         resetPasswordToken: token,
//         resetPasswordExpires: Date.now() + 3600000 // 1 hour
//       })
//     })
//   })
//   .catch(err => {
//     console.log(err);
//     res.json(err);
//   });
// });

// router.put('/reset/:token', (req, res) => {
//   return User.findOne({
//     where : { resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }
//   })
//   .then(user => { // find the user who has the resetPasswordToken attached to them & whose token hasn't expired.
//     if (!user) { // if there is no user, return error and redirect to /forgot
//       //req.flash('error', 'Password reset token is invalid or has expired.');
//     return console.log("error");
//     }
//     else {
//       bcrypt.genSalt(saltRounds, (err, salt) => {
//         bcrypt.hash(req.body.password, salt, (err, hash) => {
//           user.update({
//             resetPasswordToken: null,
//             resetPasswordExpires: null,
//             password: hash
//           })
//           .then(newPassword => {
//             console.log('Password updated');
//             return res.json({
//               success : true
//             });
//           });
//         });
//       });
//     }
//   })
//   .catch((err) => {
//     console.log("error", err);
//     return res.json({
//       error : 'Oh no! Something went wrong!'
//     });
//   });
// });




module.exports = router;




//edit username and password

// app.put('/users/:id/edit', (req,res) => {
//   console.log(req.body, 'edit username route');
//   bcrypt.genSalt(saltRounds, function(err, salt){
//     bcrypt.hash(req.body.password, salt, function(err, hash){
//       console.log(hash);
//       return db.User.findOne({
//         where: {
//           id: req.user.id
//           }
//         })
//         .then(user => {
//           return db.User.update({
//             username: req.body.username || user.username,
//             password: hash || user.password,
//             email: req.body.email || user.email
//           },
//           {where: {
//             id: req.user.id
//             }
//           })
//           .then(response => {
//             return db.User.findOne({
//               where : {
//                 id: req.user.id
//               }
//             })
//             .then(updatedUser => {
//             return res.json(updatedUser);
//           });
//         });
//       });
//     });
//   });
// });
