const User = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
require('dotenv').config();

// User registration
const register = (req, res) => {
  // Check if user already exists in the database
  let userEmail = req.body.email;
  User.findOne({ email: userEmail }, (error, result) => {
    if (result === null) {
      let generateCode = randomstring.generate(10);
      bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
          res.json({ message: err });
        }

        // If there is no Error, Create User with encrypted Password

        let user = new User({
          email: req.body.email,
          password: hashedPass,
          code: generateCode,
        });

        user
          .save()
          .then((user) => {
            res.json({
              message: 'User Added Successfully',
            });
          })
          .catch((error) => {
            res.json({
              message: 'An error Occurred' + error,
            });
          });
      });
    } else {
      res.json({ message: 'User already registered, please login' });
    }
  });
};

const login = (req, res) => {
  var userName = req.body.username;
  var password = req.body.password;

  User.findOne({ email: userName }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // If there any Error in procedure
        if (err) {
          res.json({ message: err });
        }
        // If Compared passwords are same
        if (result) {
          let token = jwt.sign({ name: user.name }, 'verySecretValue', {
            expiresIn: '1h',
          });
          res.json({
            message: 'Login Successful!',
            token: token,
          });
        }

        // If the passwords are not matching
        else {
          res.json({
            message: 'You have entered a wrong password',
          });
        }
      });
    }
    // User not found in the database
    else {
      res.json({ message: 'User not found, please register and then Login' });
    }
  });
};

const sendMail = (req, res) => {
  let userEmail = req.body.email;
  User.findOne({ email: userEmail }, (err, data) => {
    if (data) {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      let mailOptions = {
        from: 'vsanku01@gmail.com',
        to: req.body.email,
        subject: 'Password Change Request from Node Application',
        text: `Enter the following reset Code in the reset form to change your password CODE: ${data.code}`,
      };

      // Step 3
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log('Error while sending Mail', err);
        } else {
          console.log('Email Sent !!');
          res.json({ message: 'Email send Successfully' });
        }
      });
    } else {
      res.json({ message: 'User not found in the database' });
    }
  });
};

const resetPassword = (req, res) => {
  let userEmail = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmpassword;
  let resetCode = req.body.code;

  User.findOne({ email: userEmail }, (err, data) => {
    if (data === null) {
      res.json({ message: 'User not found in the database' });
    } else {
      // Check if password and confirm Passwords match
      if (password === confirmPassword && resetCode === data.code) {
        // Hash the new Password
        bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
          if (err) {
            res.json({ message: err });
          }
          // Document Update
          User.updateOne(
            { email: userEmail },
            {
              $set: {
                password: hashedPass,
              },
            },
            (error, result) => {
              if (error) {
                res.json({ message: 'Failed to Update the password' });
              }
              res.json({ message: 'Updated the password Successfully' });
            }
          );
        });
      } else {
        res.json({
          message: 'Passwords not Matching or Code entered is wrong',
        });
      }
    }
  });
};

module.exports = { register, login, sendMail, resetPassword };
