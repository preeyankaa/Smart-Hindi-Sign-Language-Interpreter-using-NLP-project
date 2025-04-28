import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaLanguage, FaInfoCircle, FaChevronDown, FaHandPeace, FaSignLanguage, FaRobot, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// Animated Stars Component
function AnimatedStars() {
  const starsRef = useRef();
  const { darkMode } = useTheme();

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += delta * 0.03;
      starsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={100}
        depth={100}
        count={8000}
        factor={6}
        saturation={0}
        fade
        speed={1}
        color={darkMode ? "#ffffff" : "#000000"}
      />
    </group>
  );
}

// Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedStars />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

// Background Scene Component
function BackgroundScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Scene />
    </Canvas>
  );
}

// Floating Particles Component
function FloatingParticles({ count = 20 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -100],
            opacity: [null, 0],
            scale: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to redirect to Flask app
  const redirectToAlphabetDetection = () => {
    window.location.href = 'http://localhost:5000/alphabet-detection';
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100 text-gray-900'}`}>
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundScene />
      </div>
      
      {/* Light Mode Background Pattern */}
      {!darkMode && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-purple-100 to-violet-200"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCA4LjA1OSAxOCAxOCAxOC0xOCAxOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OC0xNC0xNCAxNHoiIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-violet-400/40 to-transparent transform rotate-45"></div>
            <div className="absolute top-0 left-1/2 w-1 h-96 bg-gradient-to-b from-violet-400/40 to-transparent transform rotate-45"></div>
            <div className="absolute top-0 left-3/4 w-1 h-96 bg-gradient-to-b from-violet-400/40 to-transparent transform rotate-45"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-10"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-violet-300/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-float-slow"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-violet-400/30 rounded-full animate-float-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-3/4 left-2/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-violet-400/30 rounded-full animate-float-slow" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float-slow" style={{ animationDelay: '4s' }}></div>
            <div className="absolute top-0 left-1/5 w-1 h-screen bg-gradient-to-b from-violet-300/20 to-transparent transform rotate-12"></div>
            <div className="absolute top-0 right-1/3 w-1 h-screen bg-gradient-to-b from-purple-300/20 to-transparent transform -rotate-12"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjNjM2NmYxIiBmaWxsLW9wYWNpdHk9Ii4wMyIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-5"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-0 left-1/2 w-1 h-1/2 bg-gradient-to-b from-white/30 to-transparent transform rotate-45"></div>
            <div className="absolute top-0 right-1/2 w-1 h-1/2 bg-gradient-to-b from-white/30 to-transparent transform -rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* Floating Particles */}
      <FloatingParticles count={30} />

      {/* Content Overlay */}
      <div className="relative z-10 w-full flex-grow">
        <nav className={`p-4 ${darkMode ? 'glass-effect' : 'bg-white/90 shadow-md backdrop-blur-sm'}`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className={`text-2xl font-bold ${darkMode ? 'gradient-text' : 'text-blue-600'}`}>SignWave</h1>
              <div className="hidden md:flex space-x-6">
                <Link to="/" className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors`}>Home</Link>
                <Link to="/dashboard" className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors`}>Dashboard</Link>
                <Link to="/about" className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors`}>About</Link>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className={`p-2 rounded-lg ${darkMode ? 'glass-effect' : 'bg-white shadow-md'} flex items-center gap-2`}
              >
                {darkMode ? <FaMoon className="text-yellow-400" /> : <FaSun className="text-yellow-500" />}
                <span className="text-sm">Theme</span>
                <FaChevronDown className={`transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showThemeDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'glass-effect' : 'bg-white shadow-md'} ring-1 ring-black ring-opacity-5`}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        if (darkMode) toggleTheme();
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-100'} flex items-center gap-2`}
                    >
                      <FaSun className="text-yellow-500" />
                      Light Mode
                    </button>
                    <button
                      onClick={() => {
                        if (!darkMode) toggleTheme();
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-100'} flex items-center gap-2`}
                    >
                      <FaMoon className="text-yellow-400" />
                      Dark Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <h2 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'gradient-text' : 'text-blue-600'}`}>Sign Language Interpreter</h2>
          <p className="text-center mb-8 opacity-80">Explore our comprehensive suite of sign language tools</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={redirectToAlphabetDetection} // Updated to redirect to Flask app
              className={`p-6 rounded-lg ${
                darkMode ? 'glass-effect hover:bg-gray-800/50' : 'bg-white/95 shadow-md backdrop-blur-sm hover:bg-white'
              } shadow-lg transition-all cursor-pointer transform hover:scale-105 hover:shadow-xl group`}
            >
              <div className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mb-4 transform group-hover:scale-110 transition-transform`}>
                <FaSignLanguage className="text-3xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'gradient-text' : 'text-blue-600'} group-hover:${darkMode ? 'gradient-text' : 'text-blue-700'} transition-colors`}>Alphabet Detection</h3>
              <p className={`${darkMode ? 'opacity-80' : 'text-gray-700'} group-hover:${darkMode ? 'opacity-100' : 'text-blue-800'} transition-colors mb-4`}>Alphabet sign language detection English & Hindi</p>
              <button 
                className={`w-full ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white py-2 rounded-lg hover:${darkMode ? 'from-blue-500 to-indigo-500' : 'from-blue-600 to-indigo-600'} transition-colors`}
              >
                Start Detection
              </button>
            </div>
            <div
              onClick={() => navigate('/learn')}
              className={`p-6 rounded-lg ${
                darkMode ? 'glass-effect hover:bg-gray-800/50' : 'bg-white/95 shadow-md backdrop-blur-sm hover:bg-white'
              } shadow-lg transition-all cursor-pointer transform hover:scale-105 hover:shadow-xl group`}
            >
              <div className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mb-4 transform group-hover:scale-110 transition-transform`}>
                <FaHandPeace className="text-3xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'gradient-text' : 'text-blue-600'} group-hover:${darkMode ? 'gradient-text' : 'text-blue-700'} transition-colors`}>Words Detection</h3>
              <p className={`${darkMode ? 'opacity-80' : 'text-gray-700'} group-hover:${darkMode ? 'opacity-100' : 'text-blue-800'} transition-colors mb-4`}>Words sign language detection English & Hindi</p>
              <button 
                className={`w-full ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white py-2 rounded-lg hover:${darkMode ? 'from-blue-500 to-indigo-500' : 'from-blue-600 to-indigo-600'} transition-colors`}
              >
                Start Detection
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className={`py-8 ${darkMode ? 'glass-effect' : 'bg-white/90 shadow-md backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className={`text-xl font-bold ${darkMode ? 'gradient-text' : 'text-blue-600'}`}>SignWave</h3>
              <p className="text-sm opacity-75">Breaking communication barriers with 3D sign language technology.</p>
            </div>
            <div className="flex space-x-4">
              <select 
                className={`px-2 py-1 rounded ${darkMode ? 'glass-effect' : 'bg-white shadow-sm'}`}
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-center text-sm opacity-75">
            © 2024 SignWave. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;