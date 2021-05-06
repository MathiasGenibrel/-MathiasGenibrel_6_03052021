const mongoose = require("mongoose");

const likesThingSchema = mongoose.Schema({
  like: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("likeThing", likesThingSchema);