import { Schema, model } from "mongoose";

const texture = new Schema({
  seq: Number,
  name: String,
  base64: String
});

const Texture = model("Texture", texture)
export default Texture