import './App.css';
import React from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
