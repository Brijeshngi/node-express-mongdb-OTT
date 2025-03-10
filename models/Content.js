import mongoose from "mongoose";

const schema = new mongoose.Schema({
  contentTitle: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    enum: ["5+", "13+", "18+"],
  },
  description: {
    type: String,
  },
  rating: {
    type: String,
    enum: ["G", "PG", "PG-13", "R", "NC-17"],
    required: true,
  },
  releaseDateAndYear: { type: Date },
  thumbnailURL: {
    url: {
      type: String,
    },
  },
  cast: [{ type: String }],
  Director: {
    type: String,
  },
  genres: {
    type: String,
    enum: ["comedy", "horrer", "fiction"],
    default: "comedy",
  },
  contentType: {
    type: String,
    enum: ["movie", "series", "documentary", "shows"],
  },
  keyWords: {
    type: String,
    enum: ["Sci-Fi", "Action", "Thriller"],
  },
  trailer: {
    url: {
      type: String,
    },
  },
  subtitleLanguages: {
    type: String,
    enum: ["English", "Hindi", "Spanish", "French"],
  },
  audioLanguages: {
    type: String,
    enum: ["English", "Hindi"],
  },
  resolution: { type: String, enum: ["SD", "HD", "Full HD", "4K"] },
  drmProtected: { type: Boolean, default: false },
  // If the content is DRM-protected.
  streamingProtocol: { type: String, enum: ["HLS", "DASH", "RTMP"] },
  // Used for streaming optimization.
  downloadable: { type: Boolean, default: false },
  // If the user can download it for offline use
  expiryDate: { type: Date },
  // If content is available for a limited time.

  fileSize: { type: Number },
  // Store content size in MB/ GB.
  bitrate: { type: Number },
  // Store video bitrate for streaming quality.
  frameRate: { type: Number },
  // Store FPS(frames per second) for playback quality.
  contentFile: {
    url: {
      type: String,
      required: true,
    },
  },
  duration: {
    type: Number,
  },

  IMDbRating: { type: Number, min: 0, max: 10 },
  RottenTomatoesScore: { type: Number, min: 0, max: 100 },
  // Store critic scores from review aggregators.
  availability: {
    regions: ["US", "India"],
    // expiry_date: ISODate,
  },
  views: {
    type: Number,
  },
  Likes: {
    type: Number,
  },
  cloudFrontUrl: { type: String, required: true },
  subscriptionPlan: [
    {
      type: String,
      enum: ["Free", "Basic", "super", "Premium"],
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Content = mongoose.model("Content", schema);
