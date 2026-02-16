const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  roomId: String,
  content: String
});

module.exports = mongoose.model("Document", documentSchema);
