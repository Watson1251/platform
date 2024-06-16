const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const movementSchema = mongoose.Schema({
  movement_timestamp: { type: Number, required: true },
  movement_from: { type: String, required: true },
  movement_to: { type: String, required: true },
  moved_by: { type: String, required: true },
  notes: { type: [String], required: true },
});

movementSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Movement", movementSchema);
