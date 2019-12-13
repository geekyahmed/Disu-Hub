const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  postlimit: {
    type: String
  },
  categorylimit: {
    type: String
  },
  userlimit: {
    type: String
  }
});

module.exports = { Setting: mongoose.model("setting", SettingSchema) };
