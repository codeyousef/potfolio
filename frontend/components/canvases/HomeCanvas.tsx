import React from 'react';
// import { motion } from 'framer-motion'; // Using plain div for this test

const HomeCanvas: React.FC = () => {
  return (
    // <motion.div 
    <div
      // id="homeCanvasTestDiv" // ID is still here but not used by any active CSS
      className="flex justify-center items-center bg-red-500 min-h-screen"
    >
      <h1 className="text-white text-4xl font-heading">
        TESTING HOMECANVAS
      </h1>
    </div>
    // </motion.div>
  );
};

export default HomeCanvas;