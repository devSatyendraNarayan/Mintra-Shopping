import React, { useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import { FaPhone, FaSquareInstagram } from "react-icons/fa6";

// The ContactUsModal component displays a modal for contact information and social media links.
function ContactUsModal() {
  // State to track whether the modal is open or closed.
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the modal and set the isOpen state to true.
  const openModal = () => {
    setIsOpen(true);
    document.getElementById("contact_modal").showModal();
  };

  // Function to close the modal and set the isOpen state to false.
  const closeModal = () => {
    setIsOpen(false);
    document.getElementById("contact_modal").close();
  };

  return (
    <div>
      {/* Button to trigger the opening of the modal */}
      <button className="" onClick={openModal}>
        Contact Us
      </button>

      {/* Dialog element representing the modal */}
      <dialog id="contact_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          {/* Button to close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Modal header */}
          <h3 className="font-bold text-2xl mb-6 text-center">
            Connect With Us
          </h3>

          {/* Contact information section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaPhone className="text-2xl text-white" />
              <a
                href="tel:+1234567890"
                className="hover:scale-110 transition-all"
              >
                +91 1234567890
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-2xl text-white" />
              <a
                href="mailto:contact@mintra.com"
                className="hover:scale-110 transition-all"
              >
                contact@mintra.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-2xl text-white" />
              <a
                href="https://www.google.co.in/maps/place/Jamshedpur,+Jharkhand"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-all"
              >
                Jamshedpur, Jharkhand
              </a>
            </div>
          </div>

          {/* Social media links section */}
          <div className="mt-8">
            <p className="font-semibold text-lg mb-4">
              Connect on Social Media
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-110 transition-all"
              >
                <FaSquareInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-110 transition-all"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-110 transition-all"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ContactUsModal;
