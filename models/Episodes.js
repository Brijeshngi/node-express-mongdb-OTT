import mongoose from "mongoose";

const schema = new mongoose.Schema({
  content_id: ObjectId, // Reference to Content Collection
  season: 1,
  episode_number: 1,
  title: "Pilot",
  duration: 50,
  release_date: ISODate,
  views: 1000000,
  createdAt: ISODate,
});
