"use client"

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(null);
    const [color, setColor] = useState(null)

    useEffect(() => {
        const hour = new Date().getHours();
        const isDark = hour >= 18 || hour < 6;

        setTheme(isDark ? 'dark' : 'light');
    }, []);

    if(!theme){
        <div>
            
        </div>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme,color,setColor }}>
            <div className={`${theme} transition-all duration-500 ${theme}-${color}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
