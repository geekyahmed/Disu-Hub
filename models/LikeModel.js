const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },

  date: {
    type: Date,
    default: Date.now()
  },

  like: {
    type: Boolean,
    default: true
  }
});

module.exports = { Like: mongoose.model("like", LikeSchema) };
