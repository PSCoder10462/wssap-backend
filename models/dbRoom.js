import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  messages: [Object],
  // username, timestamp, string
  lastMessage: Object,
  image: String,
});

roomSchema.plugin(findOrCreate);

export default mongoose.model("rooms", roomSchema);
