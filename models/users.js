const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: Boolean,
    },
    email: {
      type: String,
      required: true,
      unique: Boolean,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    followers:{
      type:Array,
    },
    followings:{
      type:Array,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
