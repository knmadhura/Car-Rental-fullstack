// server/routes/bookingRoutes.js

import express from "express";
import { protect } from "../middleware/auth.js";
import {
  changeBookingStatus,
  checkCarAvailability, // ✅ renamed
  createBooking,
  getOwnerBookings,
  getUserBookings
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// ✅ Check availability of cars for a date range and location
bookingRouter.post('/check-availability', checkCarAvailability);

// ✅ Create a new booking (requires login)
bookingRouter.post('/create', protect, createBooking);

// ✅ Get bookings made by the logged-in user
bookingRouter.post('/user', protect, getUserBookings);

// ✅ Get bookings for cars owned by the logged-in owner
bookingRouter.post('/owner', protect, getOwnerBookings);

// ✅ Change booking status (e.g., to "confirmed", "cancelled")
bookingRouter.post('/change-status', protect, changeBookingStatus);

export default bookingRouter;

