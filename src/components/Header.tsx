import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={ROUTES.HomePage} className={`text-2xl font-bold ${
              isScrolled ? 'text-blue-600' : 'text-white'
            }`}>
              EduConnect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <Link
              to={ROUTES.Login}
              className={`${
                isScrolled 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              } text-white px-5 py-2 rounded-full transition-all duration-300`}
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden ${
              isScrolled ? 'text-gray-500' : 'text-white'
            } hover:text-gray-700 focus:outline-none`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
            <nav className="flex flex-col space-y-3 px-4">
              <Link
                to={ROUTES.Login}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;