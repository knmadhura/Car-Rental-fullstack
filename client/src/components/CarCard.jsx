import React from 'react';
import { assets } from '../assets/assets'; // ✅ Import assets
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY 
  const navigate=useNavigate()

  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`);scrollTo(0,0)}}
    className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
      <div className='relative h-48 overflow-hidden'>
        <img
          src={car.image}
          alt="Car"
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />

        {car.isAvaliable && (
          <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>
            Available Now
          </p>
        )}

        {/* ✅ Make sure price container is inside .relative */}
        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
          <span className='font-semibold'>{currency}{car.pricePerDay}</span>
          <span className='text-sm text-white/80'> /day</span>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600 px-4 pb-4'>
        <div className='flex items-center text-sm'>
          <img src={assets.users_icon} alt="seats" className='h-4 mr-2' />
          <span>{car.seating_capacity} seats</span>
        </div>
        <div className='flex items-center text-sm'>
          <img src={assets.fuel_icon} alt="fuel" className='h-4 mr-2' />
          <span>{car.fuel_type}</span>
        </div>
        <div className='flex items-center text-sm'>
          <img src={assets.car_icon} alt="transmission" className='h-4 mr-2' />
          <span>{car.transmission}</span>
        </div>
        <div className='flex items-center text-sm'>
          <img src={assets.location_icon} alt="location" className='h-4 mr-2' />
          <span>{car.location}</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
