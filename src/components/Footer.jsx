import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import ContactUsModal from './ContactUsModal';
import { Link } from 'react-router-dom';

// Footer component for the application
function Footer() {
  return (
    // The footer element styled with background and text color
    <footer className="bg-gray-900 text-white">
      {/* Container for the content with padding and max-width */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* Grid layout for main content sections */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Section containing links for Company and Support */}
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              
              {/* Company section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                {/* List of company-related links */}
                <ul className="mt-4 space-y-4">
                  <li><Link to="/about-us">About Us</Link> </li>
                  <li>Careers</li>
                  <li>Partners</li>
                </ul>
              </div>
              
              {/* Support section */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                {/* List of support-related links and Contact Us modal */}
                <ul className="mt-4 space-y-4">
                  <li>FAQ</li>
                  <li><ContactUsModal /></li>
                  <li>Site Map</li>
                </ul>
              </div>
            </div>
            
            {/* Legal and Social sections */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
              
              {/* Legal section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                {/* List of legal-related links */}
                <ul className="mt-4 space-y-4">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
              
              {/* Social section */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Social</h3>
                {/* List of social media links with icons */}
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white flex items-center">
                      <FaFacebookF className="mr-2" /> Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white flex items-center">
                      <FaTwitter className="mr-2" /> Twitter
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white flex items-center">
                      <FaInstagram className="mr-2" /> Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer bottom section */}
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          
          {/* Social media icons */}
          <div className="flex space-x-6 md:order-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Facebook</span>
              <FaFacebookF className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">LinkedIn</span>
              <FaLinkedinIn className="h-6 w-6" />
            </a>
          </div>
          
          {/* Copyright notice */}
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} Satyendra Narayan Saw. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
