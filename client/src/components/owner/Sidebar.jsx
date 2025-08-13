import React, { useState } from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [Image, setImage] = useState('');

  // ✅ Make this async
  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', Image); // ✅ 'Image', not 'image'

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
      {/* Profile Image */}
      <div className='group relative'>
        <label htmlFor='image'>
          <img
            src={Image ? URL.createObjectURL(Image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"}
            alt="Profile"
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
          />
          <input
            type="file"
            id="image"
            accept='image/*'
            hidden
            onChange={e => setImage(e.target.files[0])}
          />
          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="edit icon" />
          </div>
        </label>
      </div>

      {/* Save button */}
      {Image && (
        <button
          className='absolute top-2 right-2 flex items-center gap-1 p-2 bg-primary text-white text-xs rounded'
          onClick={updateImage}
        >
          Save <img src={assets.check_icon} width={13} alt="check" />
        </button>
      )}

      {/* User name */}
      <p className='mt-4 text-base font-medium max-md:hidden'>{user?.name}</p>

      {/* Navigation Links */}
      <div className='w-full mt-8 flex flex-col items-center gap-2'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink 
            to={link.path}
            key={index}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'
            }`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="icon"
            />
            <span className='max-md:hidden'>{link.name}</span>
            {link.path === location.pathname && (
              <div className='bg-primary w-1.5 h-8 rounded-r-md right-0 absolute'></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
