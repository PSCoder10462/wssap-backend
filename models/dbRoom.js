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
});

// const whatsappSchema = mongoose.Schema({
//   message: String,
//   name: String,
//   timestamp: String,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//   },
// });

roomSchema.plugin(findOrCreate);

export default mongoose.model("rooms", roomSchema);

// Room: {
//   messages: [
//     {
//       string,
//       timestamp,
//     },
//   ];
// }
