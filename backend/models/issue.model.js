const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const issueSchema = mongoose.Schema({
  issue_timestamp: { type: Number, required: true },
  issue: { type: String, required: true },
  issue_status: { type: String, required: true },
  issued_by: { type: String, required: true },
  assigned_to: { type: [String], required: true },
  notes: { type: [String], required: true },
});

issueSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Issue", issueSchema);
