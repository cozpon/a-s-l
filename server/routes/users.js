const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 12;

const db = require('../models');
const User = db.user;



//api/users gets you JUST the users

router.get('/', (req, res) => {
  return User.findAll({
    attributes: {
      exclude: ['password']
    }})
  .then(users => {
    return res.json(users);
  })
  .catch((err) => {
    console.log(err);
  })
});

//api/users/all gets you all users + their related tables

router.get('/all', (req, res) => {
  return User.findAll({
    attributes: {
      exclude: ['password']
    }
  })
  .then((users) => {
    return res.json(users);
  })
  .catch((err) => {
    console.log(err);
  });
});

router.get('/:id', (req, res) => {
  let id = req.params.id;
  return User.findById(id, {
    attributes: {
      exclude: ['password']
    }
  })
  .then((user) => {
    return res.json(user);
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;