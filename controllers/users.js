const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED, CONFLICT } = require("../utils/errors");

const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      // Remove password from response
      const userCopy = user.toObject();
      delete userCopy.password;
      res.status(CREATED).send(userCopy);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError("User with this email already exists"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Add validation for required fields
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
   .catch((err) => {
  if (err.name === "DocumentNotFoundError") {
    next(new NotFoundError("User not found"));
  } else {
    next(err);
  }
});
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(OK).send(user))
   .catch((err) => {
  if (err.name === "ValidationError") {
    next(new BadRequestError(err.message));
  } else {
    next(err);
  }
});
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
