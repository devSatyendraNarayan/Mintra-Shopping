import React from 'react';
import { FaTimes } from 'react-icons/fa';

// A functional component for rendering a modal dialog for placing an order
const PlaceOrderModal = ({ isOpen, onClose, children }) => {
  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  return (
    // Modal background overlay with center alignment and fixed positioning
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal container with a white background, padding, rounded corners, and a max width */}
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {/* Container for the close button, aligned to the right */}
        <div className="flex justify-end">
          {/* Close button that triggers the onClose function when clicked */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            {/* Close icon from react-icons */}
            <FaTimes />
          </button>
        </div>
        {/* Content passed as children to the modal */}
        {children}
      </div>
    </div>
  );
};

export default PlaceOrderModal;
