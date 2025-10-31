// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  avatar: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }
  },
  github: String,
  linkedin: String,
  bio: String,
  resume: {
    url: String,
    public_id: String,
  },
  motivation: String,
  skills: [String],
  careerGoals: String,
  dreamCompany: String,
  favoriteProject: String,
  location: String,
});

module.exports = mongoose.model("User", userSchema);
