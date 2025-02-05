import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PhotoAlbum from './pages/PhotoAlbum';
import ParticlesBackground from './components/ParticlesBackground';

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      localStorage.clear();
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-900/50 to-purple-600/50 backdrop-blur-sm">
      <ParticlesBackground />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/album" element={<PhotoAlbum />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}