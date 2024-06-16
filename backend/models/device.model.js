const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const deviceSchema = mongoose.Schema({
  serial: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  assigned_department: { type: String, required: true },
  deployment_timestamp: { type: Number, required: true },
  default_password: { type: String, required: true },
  version: { type: String, required: true },
  openIssues: { type: Number, required: true },
  movements: { type: [String], required: true },
  issues: { type: [String], required: true },
  notes: { type: [String], required: true }
});

deviceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Device", deviceSchema);
