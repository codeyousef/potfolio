'use client';

import React, { useState } from 'react';

const TestComponent: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  
  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
    console.log('Button clicked!', clickCount + 1);
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl mb-8">Test Component</h1>
      <p className="mb-4">This is a simple test component without Framer Motion</p>
      <p className="mb-8">Click count: {clickCount}</p>
      <button 
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  );
};

export default TestComponent;
