import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { WordRotate } from './WordRotateComp';
import axios from 'axios';

// 🔴 Emergency Button as a separate component to avoid useContext inside another function
const EmergencyButton = () => {
  const { backendUrl, token } = useContext(AppContext);

  const handleEmergency = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/emergency`,
        {
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        toast.success('🚨 Emergency alert sent to doctor.');
      } else {
        toast.error(response.data?.message || 'Failed to send emergency alert.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send emergency alert.');
    }
  };

  return (
    <button
      onClick={handleEmergency}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
    >
      🚨 Emergency
    </button>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    toast.info('Logged Out.');
  };

  // Close profile menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.profile-menu-container') === null) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // Close mobile menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.menu-container') === null) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleAuthNavigation = (type) => {
    const currentPath = window.location.pathname;

    if (currentPath === '/login') {
      navigate(`/login?type=${type}`, { replace: true });
      window.location.reload();
    } else {
      navigate(`/login?type=${type}`);
    }
  };

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300'>
      <img
        onClick={() => navigate('/')}
        className='w-36 md:w-44 cursor-pointer'
        draggable='false'
        src={assets.logo}
        alt='Logo'
      />

      <ul className='hidden md:flex items-center gap-5 font-medium'>
        <NavLink to={'/'}><li className='py-1'>HOME</li></NavLink>
        <NavLink to={'/doctors'}><li className='py-1'>ALL DOCTORS</li></NavLink>
        <NavLink to={'/about'}><li className='py-1'>ABOUT</li></NavLink>
        <NavLink to={'/contact'}><li className='py-1'>CONTACT</li></NavLink>
        <a href="http://127.0.0.1:7860" target="_blank" rel="noopener noreferrer">
          <li className='py-1'>SMART AI CHATBOT</li>
        </a>
        {!token && (
          <NavLink to={'https://Prescripto-admin-ka03.onrender.com'} target='_blank'>
            <button className='px-3 py-2 border bg-gray-100 text-black rounded flex items-center gap-1'>
              <WordRotate words={['Admin', 'Doctor']} /> Login
            </button>
          </NavLink>
        )}
      </ul>

      <div className='flex items-center gap-3'>
        <EmergencyButton />

        {token && userData ? (
          <div
            className='flex items-center gap-2 cursor-pointer relative profile-menu-container'
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              className='size-8 sm:size-9 rounded-[5px] object-cover border'
              src={userData.image}
              alt='profile'
            />
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-300 ease-in-out ${
                showProfileMenu ? '-rotate-180' : 'rotate-0'
              }`}
            />
            <div
              className={`absolute top-0 right-0 pt-12 text-base font-medium z-20 ${
                showProfileMenu ? 'block' : 'hidden'
              }`}
            >
              <div className='min-w-48 bg-gray-100 border border-gray-200 rounded-[7px] text-[15px] font-normal flex flex-col gap-1 p-2'>
                <p onClick={() => navigate('my-profile')} className='px-2 py-1 hover:bg-black/5 cursor-pointer'>
                  My Profile
                </p>
                <p onClick={() => navigate('my-appointments')} className='px-2 py-1 hover:bg-black/5 cursor-pointer'>
                  My Appointments
                </p>
                <hr className='my-1 mx-2' />
                <p onClick={logout} className='px-2 py-1 hover:text-red-500 hover:bg-black/5 cursor-pointer flex items-center gap-1 group'>
                  Logout
                  <ArrowRight size={15} className='group-hover:translate-x-1 transition-transform' />
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-1.5'>
            <button
              onClick={() => handleAuthNavigation('login')}
              className='hidden sm:block border px-4 py-2 rounded'
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthNavigation('signup')}
              className='hidden sm:block bg-primary text-white px-4 py-2 rounded'
            >
              Sign Up
            </button>
          </div>
        )}

        {!token && (
          <button
            onClick={() => handleAuthNavigation('signup')}
            className='block sm:hidden bg-primary text-white px-2.5 py-1.5 rounded text-xs'
          >
            Sign Up
          </button>
        )}

        {/* Mobile menu */}
        <div>
          <Menu onClick={() => setShowMenu(true)} size={30} className='md:hidden text-primary' />
          {showMenu && <div className='fixed inset-0 bg-black/20 z-10' onClick={() => setShowMenu(false)} />}
          <div
            className={`menu-container ${
              showMenu ? 'fixed inset-0 top-0 z-20 flex flex-col items-center bg-white/90 backdrop-blur-xl py-10 px-2 shadow-xl' : 'hidden'
            }`}
          >
            <div className='w-full flex justify-end'>
              <X size={30} onClick={() => setShowMenu(false)} className='text-primary' />
            </div>
            <ul className='mt-10 uppercase flex flex-col items-center gap-6 text-base font-medium'>
              <NavLink onClick={() => setShowMenu(false)} to={'/'}><p>Home</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={'/doctors'}><p>All Doctors</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={'/about'}><p>About</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={'/contact'}><p>Contact</p></NavLink>
              {!token && (
                <NavLink to={'https://Prescripto-admin-ka03.onrender.com'} target='_blank'>
                  <button className='mb-6 w-32 h-10 bg-primary text-white rounded'>
                    <span><WordRotate words={['Admin', 'Doctor']} /></span> Login
                  </button>
                </NavLink>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
