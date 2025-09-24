const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId).orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'User not found' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid user ID' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
