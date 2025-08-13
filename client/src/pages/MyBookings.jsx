import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from '../context/AppContext.jsx';
import toast from "react-hot-toast";
import {motion} from 'motion/react'

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.post('/api/bookings/user');
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message || "Failed to load bookings.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  return (
    <motion.div  
    initial={{opacity:0,y:30}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.6}}
   
    
    
    className="px-6 md:px-16 lg:px-24 xl:px-48 mt-16 text-sm max-w-7xl">
      <Title
        title="My Bookings"
        subtitle="View and manage all your car bookings"
        align="left"
      />

      {bookings.length === 0 ? (
        <p className="text-gray-500 mt-12">You have no bookings yet.</p>
      ) : (
        bookings.map((booking, index) => (
          <motion.div
           initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{delay:index*0.1,duration:0.4}}
   



            key={booking._id || index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car image + info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                {booking?.car?.image ? (
                  <img
                    src={booking.car.image}
                    alt="Car"
                    className="w-full h-auto aspect-video object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 text-gray-500 text-center py-6">
                    No image available
                  </div>
                )}
              </div>
              <p className="text-lg font-medium mt-2">
                {booking?.car?.brand || "Unknown Brand"}{" "}
                {booking?.car?.model || ""}
              </p>
              <p className="text-gray-500">
                {booking?.car?.year || "N/A"} &bull;{" "}
                {booking?.car?.category || "N/A"} &bull;{" "}
                {booking?.car?.location || "N/A"}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-600 text-white"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate?.split("T")[0] || "N/A"} to{" "}
                    {booking.returnDate?.split("T")[0] || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.car?.location || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}
                  {booking.price}
                </h1>
                <p>
                  Booked on {booking.createdAt?.split("T")[0] || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default MyBookings;
