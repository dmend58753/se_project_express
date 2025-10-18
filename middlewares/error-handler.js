const { errorLogger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  errorLogger.log({
    level: 'error',
    message: err.message,
    meta: err,
  });

  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .send({ message: "User with this email already exists" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).send({ message: "invalid token" });
  }

  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  return res
    .status(500)
  .send({ message: "An error has occurred on the server" });
};

module.exports = errorHandler;
