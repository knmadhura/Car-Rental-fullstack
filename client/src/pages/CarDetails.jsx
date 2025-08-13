import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import {motion} from 'motion/react'

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext();

  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;

  // Convert date string to full ISO string or null if invalid
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select both pickup and return dates.");
      return;
    }

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (pickup >= returnD) {
      toast.error("Return date must be after pickup date.");
      return;
    }

    if (!car || !car.pricePerDay) {
      toast.error("Car data not loaded.");
      return;
    }

    const formattedPickup = formatDate(pickupDate);
    const formattedReturn = formatDate(returnDate);

    if (!formattedPickup || !formattedReturn) {
      toast.error("Invalid date format.");
      return;
    }

    // Debug logs - Remove in production
    console.log("Sending booking request:", {
      car: id,
      pickupDate: formattedPickup,
      returnDate: formattedReturn,
    });

    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate: formattedPickup,
        returnDate: formattedReturn,
        // price NOT sent - backend calculates it!
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred.");
    }
  };

  useEffect(() => {
    const foundCar = cars.find((car) => car._id === id);
    setCar(foundCar);
  }, [cars, id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer">
        <img src={assets.arrow_icon} alt="Back" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <motion.div 
         initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
            transition={{duration:0.6}}
   
    
        
        className="lg:col-span-2 flex flex-col lg:flex-row gap-8">
          <motion.img
           initial={{opacity:0.98,y:0}}
          animate={{scale:1,opacity:1}}
            transition={{duration:0.5}}
   
    
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full lg:w-[45%] max-w-[600px] max-h-[350px] object-cover rounded-xl shadow-md"
          />
          <motion.div
           initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{delay:0.2,duration:0.5}}
   
    
          
          
          className="space-y-6 lg:w-[55%]">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} · {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                 initial={{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.4}}
   
    
                
                
                key={text} className="flex flex-col items-center bg-light p-4 rounded-lg">
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </motion.div>
              ))}
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['360 Camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Booking Form */}
        <motion.form 
         initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
            transition={{delay:0.3,duration:0.6}}
   
    
        
        onSubmit={handleSubmit} className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500">
          <p>
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal"> per day</span>
          </p>
          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="pickup-date"
              min={new Date().toISOString().split('T')[0]}
              value={pickupDate || ''}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="return-date"
              min={pickupDate || new Date().toISOString().split('T')[0]}
              value={returnDate || ''}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
          >
            Book now
          </button>

          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
