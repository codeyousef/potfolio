'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types of canvases available
export type CanvasId = 'home' | 'portfolio' | 'services' | 'journal' | 'contact';

interface CanvasContextType {
  activeCanvas: CanvasId | null;
  setActiveCanvas: (canvasId: CanvasId | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  initialActiveCanvas?: CanvasId | null;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children, initialActiveCanvas }) => {
  const [activeCanvas, setActiveCanvas] = useState<CanvasId | null>(
    initialActiveCanvas === undefined ? 'home' : initialActiveCanvas
  );

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
