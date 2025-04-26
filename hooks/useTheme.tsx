"use client";
import { useState, useEffect } from 'react';

export const useTheme = () => {
     const [theme, setTheme] = useState<'dark' | 'light'>('light');

     useEffect(() => {
         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
         setTheme(prefersDark ? 'dark' : 'light');

         // Apply theme class
         document.documentElement.classList.toggle('dark', prefersDark);

         // Smooth transition
         document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
     }, []);

     useEffect(() => {
         document.documentElement.classList.toggle('dark', theme === 'dark');
     }, [theme]);

     const toggleTheme = () => {
         setTheme(prev => prev === 'light' ? 'dark' : 'light');
     };

     return { theme, toggleTheme };
};
