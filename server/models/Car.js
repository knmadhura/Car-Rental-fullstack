import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: "User", required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },          // Changed to String
  seating_capacity: { type: Number, required: true },  // Changed to lowercase 's'
  fuel_capacity: { type: Number, required: true },     // Changed to Number
  transmission: { type: String, required: true },
  pricePerDay: { type: Number, required: true },       // Changed to Number
  location: { type: String, required: true },
  description: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },       // Fixed typo
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);
export default Car;
