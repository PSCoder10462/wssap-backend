import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

// messageContent here is a collection
export default mongoose.model("messagecontents", whatsappSchema);
