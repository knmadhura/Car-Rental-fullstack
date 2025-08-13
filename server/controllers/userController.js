import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Car.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// --------------------- REGISTER ---------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(200).json({
        success: false,
        message: 'Fill all the fields correctly (password min length 8)',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user', // optional
      },
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(200).json({
      success: false,
      message: 'Server error',
    });
  }
};

// --------------------- LOGIN ---------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(200).json({
      success: false,
      message: 'Server error',
    });
  }
};

// --------------------- GET USER DATA ---------------------
export const getUserData = async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    delete user.__v;

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get User Data Error:", error.message);
    res.status(200).json({
      success: false,
      message: 'Server error',
    });
  }
};

// --------------------- GET AVAILABLE CARS ---------------------
export const getcars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    console.log("Fetched cars from DB:", cars);  // <=== ADDED LOG
    res.status(200).json({
      success: true,
      cars,
    });

  } catch (error) {
    console.log("Get Cars Error:", error.message);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
