const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingitems");
const auth = require("./middlewares/auth");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

// Add middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("connected to mongo");
  })
  .catch(console.error);

// Public routes (no auth required)
app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

// Protected routes (auth required)
app.use(auth);
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.error(`Listening on port ${PORT}`);
});
