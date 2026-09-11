"use client";
import { createContext, useContext } from 'react';
export const WorldContext = createContext(null);
export const useWorld = () => useContext(WorldContext);
