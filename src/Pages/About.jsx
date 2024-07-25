import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHandshake, FaHeart, FaRecycle } from 'react-icons/fa';

function About() {
  // Animation configuration for fade-in effect
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Animated heading for the section */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#eb2540]"
          {...fadeIn}
        >
          About Our Store
        </motion.h1>
        
        {/* Section describing the store's story */}
        <motion.section 
          className="mb-16 bg-white rounded-lg shadow-lg p-8"
          {...fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Our Story</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Founded in 2023, our e-commerce store began with a simple mission: to provide high-quality clothing at affordable prices. What started as a small online boutique has grown into a thriving marketplace, serving customers across the country.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We believe that everyone deserves to look and feel their best, without breaking the bank. That's why we work tirelessly to bring you the latest fashion trends and timeless classics, all at prices that won't leave your wallet empty.
          </p>
        </motion.section>

        {/* Section highlighting the store's commitments */}
        <motion.section 
          className="mb-16"
          {...fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Iterate over commitment items to display each with an icon */}
            {[
              { icon: FaLeaf, title: "Quality", description: "We source only the best materials and partner with reputable manufacturers." },
              { icon: FaHandshake, title: "Affordability", description: "Our direct-to-consumer model allows us to offer premium products at competitive prices." },
              { icon: FaHeart, title: "Customer Satisfaction", description: "Your happiness is our top priority. We offer hassle-free returns and dedicated customer support." },
              { icon: FaRecycle, title: "Sustainability", description: "We're committed to reducing our environmental impact through eco-friendly practices and packaging." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex items-start"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <item.icon className="text-[#eb2540] text-4xl mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section with contact information */}
        <motion.section 
          className="bg-white rounded-lg shadow-lg p-8"
          {...fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Contact Us</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              We'd love to hear from you! Reach out to us at:
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> support@mintra.com
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Phone:</span> +91 1234567890
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> Jamshedpur, Jharkhand
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default About;
