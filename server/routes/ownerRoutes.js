import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  getOwnerCars,
  toggleCarAvailability,
  deleteCar,
  getDashboardData,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// Change user role to owner
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// Add a new car with image upload
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);

// Get all cars owned by the logged-in user
ownerRouter.get("/cars", protect, getOwnerCars);

// Toggle availability of a car
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);

// Delete a car
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.get('/dashboard',protect,getDashboardData);
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage);

export default ownerRouter;
