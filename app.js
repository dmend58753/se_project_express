const express = require('express');
const mongoose = require("mongoose")
const indexRouter = require("./routes/index");

const app = express();
const {PORT = 3001} = process.env;

// Add middleware to parse JSON request bodies
app.use(express.json());

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: '507f1f77bcf86cd799439011' // temporary hardcoded user ID
  };
  next();
});

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.error("connected to mongo");
})
.catch(console.error);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.error(`Listening on port ${PORT}`);
});