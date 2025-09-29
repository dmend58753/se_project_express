const mongoose = require("mongoose")
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema ({
name:{
  type:String,
  required: true,
  minLength: 2,
  maxLength: 30,
},
avatar: {
type: String,
required: [true, "The avatar field is required."],
validate: {
  validator(value){
    return validator.isURL(value);
  },
  message: "The avatar field must be a valid URL."
 },
},
email: {
  type: String,
  required: true,
  unique: true,
  validate: {
    validator(value) {
      return validator.isEmail(value);
    },
    message: "The email field must be a valid email."
  }
},
password: {
  type: String,
  required: true,
  select: false
},
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);