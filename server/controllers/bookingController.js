import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// ✅ Helper: Check if car is available
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: new Date(returnDate) },
    returnDate: { $gte: new Date(pickupDate) },
  });

  return bookings.length === 0;
};

// ✅ API: Check car availability
export const checkCarAvailability = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "carId, pickupDate, and returnDate are required",
      });
    }

    const isAvailable = await checkAvailability(carId, pickupDate, returnDate);

    res.status(200).json({
      success: true,
      available: isAvailable,
    });
  } catch (error) {
    console.error("Error checking availability:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create Booking
export const createBooking = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "car, pickupDate, and returnDate are required",
      });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (isNaN(picked.getTime()) || isNaN(returned.getTime()) || returned <= picked) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup or return date",
      });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const isAvailable = await checkAvailability(car, picked, returned);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Car is not available for the selected dates",
      });
    }

    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const pricePerDay = Number(carData.pricePerDay);
    const price = pricePerDay * noOfDays;

    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: userId,
      pickupDate: picked,
      returnDate: returned,
      price,
      status: "pending", // default
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Change Booking Status (returns updated bookings for frontend live update)
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "bookingId and status are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // Fetch updated bookings for owner (live refresh)
    const updatedBookings = await Booking.find({ owner: booking.owner }).populate("car user");

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully ✅",
      booking,
      updatedBookings,
    });
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ✅ Get Bookings for the Logged-in User
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car");

    res.status(200).json({
      success: true,
      bookings, // ✅ Correct plural key
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// ✅ Get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id }).populate("car user");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching owner bookings:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
