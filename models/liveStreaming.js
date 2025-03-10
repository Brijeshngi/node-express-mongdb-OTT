import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
  },
  //  "World Cup Final 2025"
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  stream_url: {
    url: {
      type: String,
    },
  },
  viewers: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

export const liveStreaming = mongoose.model("liveStreaming", schema);
