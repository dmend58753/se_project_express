const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { UNAUTHORIZED, CONFLICT } = require('../utils/errors');


const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require('../utils/errors');

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

if (!email || !password) {
  return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
}

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      // Remove password from response
      const userCopy = user.toObject();
      delete userCopy.password;
      res.status(CREATED).send(userCopy);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else if (err.code === 11000) {
        res.status(CONFLICT).send({ message: 'User with this email already exists' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Add validation for required fields
  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: 'Incorrect email or password' });
    });
};


const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
createUser,
login,
getCurrentUser,
updateCurrentUser,
};
