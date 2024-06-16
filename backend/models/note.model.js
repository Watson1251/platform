const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const noteSchema = mongoose.Schema({
  note: { type: String, required: true },
  noted_by: { type: String, required: true },
  note_timestamp: { type: Number, required: true },
});

noteSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Note", noteSchema);
