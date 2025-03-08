const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  firstName: String,
  phone: String,
  notes: String,
  agentId: String
});

module.exports = mongoose.model("Upload", uploadSchema);
