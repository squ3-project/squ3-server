import { Schema, model } from "mongoose";

const map = new Schema({
  backgroundBlockId: Number,
  mapString: String,
  collisionString: String,
  interactions: Array
});

const Map = model("Map", map)
export default Map