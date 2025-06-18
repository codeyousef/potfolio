import { useState, useEffect } from 'react';

/**
 * Hook to generate client-side random values that don't cause hydration errors
 * Returns 0 on server/first render, then the actual random value after hydration
 */
export function useClientRandom(min: number = 0, max: number = 1) {
  const [isClient, setIsClient] = useState(false);
  const [randomValue, setRandomValue] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setRandomValue(Math.random() * (max - min) + min);
  }, [min, max]);

  return isClient ? randomValue : 0;
}

/**
 * Hook to get a random array element safely
 */
export function useClientRandomChoice<T>(array: T[], fallback: T) {
  const [isClient, setIsClient] = useState(false);
  const [choice, setChoice] = useState(fallback);

  useEffect(() => {
    setIsClient(true);
    setChoice(array[Math.floor(Math.random() * array.length)]);
  }, [array, fallback]);

  return isClient ? choice : fallback;
}

/**
 * Hook to conditionally show elements based on random chance
 */
export function useClientRandomShow(probability: number = 0.5) {
  const [isClient, setIsClient] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setShouldShow(Math.random() < probability);
  }, [probability]);

  return isClient ? shouldShow : false;
}