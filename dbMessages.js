import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

// messageContent here is a collection
export default mongoose.model("messagecontents", whatsappSchema);
