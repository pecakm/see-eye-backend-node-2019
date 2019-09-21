const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

module.exports = mongoose.model("Room", roomSchema);
