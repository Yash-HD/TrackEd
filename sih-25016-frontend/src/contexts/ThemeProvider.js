import React, { createContext, useContext, useEffect, useState } from 'react';

// Context to share theme state and actions across the app
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

const THEME_STORAGE_KEY = 'theme';

// Determine initial theme: localStorage -> 'light'
function getInitialTheme() {
	try {
		const stored = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
		if (stored === 'light' || stored === 'dark') {
			return stored;
		}
	} catch (_) {
		// ignore and fall through to default
	}
	return 'light';
}

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(getInitialTheme);

	// Apply theme to <html> element and persist to localStorage when it changes
	useEffect(() => {
		try {
			const root = typeof document !== 'undefined' ? document.documentElement : null;
			if (root) {
				if (theme === 'dark') {
					root.classList.add('dark');
				} else {
					root.classList.remove('dark');
				}
			}
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(THEME_STORAGE_KEY, theme);
			}
		} catch (_) {
			// noop if access to DOM or storage fails
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
	};

	const value = { theme, toggleTheme };

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

// Custom hook to access theme context
export const useTheme = () => {
	const context = useContext(ThemeContext);
	return context;
};

export default ThemeContext; 