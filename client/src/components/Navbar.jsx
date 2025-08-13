import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets, menuLinks } from '../assets/assets';
import { useAppContext } from "../context/AppContext.jsx"; // adjust path
import {motion} from 'motion/react'
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Switch to owner role or go to dashboard
  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        navigate('/owner');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
    initial={{y:-20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === '/' ? 'bg-light' : 'bg-white'
      }`}
    >
      {/* Logo */}
      <Link to="/">
        < motion.img  whileHover={{scale:1.05}}src={assets.logo} alt="logo" className="h-8" />
      </Link>

      {/* Nav Menu */}
      <div
        className={`max-sm:fixed max-sm:top-16 max-sm:right-0 max-sm:w-full max-sm:h-screen max-sm:p-4 max-sm:border-t border-borderColor flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center z-50 transition-all duration-300 transform ${
          open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'
        } ${location.pathname === '/' ? 'bg-light' : 'bg-white'}`}
      >
        {menuLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="text-blue-600 hover:underline"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Search Box (visible on large screens only) */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Right Side Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Owner Dashboard/List Button */}
          <button
            onClick={() => (isOwner ? navigate('/owner') : changeRole())}
            className="text-primary font-medium"
          >
            {isOwner ? 'Dashboard' : 'List Cars'}
          </button>

          {/* Login / Logout Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button className="sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.nav>
  );
};

export default Navbar;
