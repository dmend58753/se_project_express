require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const indexRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingitems");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// Add middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use(helmet());

// enable request logger
app.use(requestLogger);

const { MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.error("connected to mongo");
  })
  .catch(console.error);

// Public routes (no auth required)
app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserBody, createUser);
app.get("/items", getItems);

// Protected routes (auth required)
app.use(auth);
app.use("/", indexRouter);

// enable error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.error(`Listening on port ${PORT}`);
});
