"use client";
import { createContext } from 'react';

// Separate from component modules so Fast Refresh preserves context identity.
export const SurfaceContext = createContext(null);
