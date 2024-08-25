const mongoose = require("mongoose");

// Create User Schema using mongoose
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 5,
    max: 6,
  },
  token: {
    type: String,
  },
  code: {
    type: Number,
    require: true,
    unique: true,
    min: 6,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User; // export user schema
