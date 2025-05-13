'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types of canvases available
export type CanvasId = 'home' | 'atelier' | 'services' | 'journal' | 'contact';

interface CanvasContextType {
  activeCanvas: CanvasId;
  setActiveCanvas: (canvasId: CanvasId) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCanvas, setActiveCanvas] = useState<CanvasId>('home'); // Default to home canvas

  return (
    <CanvasContext.Provider value={{ activeCanvas, setActiveCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
