import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaHandPeace, FaSignLanguage, FaRobot, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
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

function LandingPage() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
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

  const features = [
    {
      icon: <FaHandPeace className="text-4xl mb-4" />,
      title: "Real-time Alphabet Detection",
      description: "Sign Language Recognition in English and Hindi"
    },
    {
      icon: <FaSignLanguage className="text-4xl mb-4" />,
      title: "Real-time Words Detection",
      description: "Sign Language Recognition in English and Hindi"
    },
    {
      icon: <FaRobot className="text-4xl mb-4" />,
      title: "Words Suggestion",
      description: "Forms a sentence Using LLM based sugesstion"
    }
  ];

  // Mouse parallax effect
  const mouseX = (mousePosition.x - window.innerWidth / 2) / 50;
  const mouseY = (mousePosition.y - window.innerHeight / 2) / 50;

  // Add this to your CSS or at the end of the file
  const styles = `
    @keyframes float-slow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    
    .animate-float-slow {
      animation: float-slow 8s ease-in-out infinite;
    }
  `;

  // Add this to your component
  useEffect(() => {
    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100 text-gray-900'}`}>
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundScene />
      </div>
      
      {/* Light Mode Background Pattern */}
      {!darkMode && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-purple-100 to-violet-200"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-10"></div>
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
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjNjM2NmYxIiBmaWxsLW9wYWNpdHk9Ii4wMyIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-5"></div>
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
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className={`relative p-4 flex justify-between items-center w-full max-w-7xl ${darkMode ? 'glass-effect' : 'bg-white/90 shadow-md backdrop-blur-sm'}`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <FaSignLanguage className={`text-3xl ${darkMode ? 'text-blue-600' : 'text-blue-500'} ${darkMode ? 'animate-pulse-slow' : ''}`} />
            <span className={`text-xl font-bold ${darkMode ? 'gradient-text' : 'text-blue-600'}`}>SignWave</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${darkMode ? 'glass-effect' : 'bg-white shadow-md'} shadow-lg hover:shadow-xl transition-all`}
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </motion.button>
        </nav>
        
        {/* Main Content */}
        <main className="relative w-full max-w-7xl px-4 pt-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block py-4 animate-float"
              style={{ 
                transform: `translate(${mouseX}px, ${mouseY}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-400 to-indigo-400'} rounded-full blur-2xl opacity-40 transform scale-110 ${darkMode ? '' : 'hidden'}`}></div>
              <h1 className={`text-7xl font-bold ${darkMode ? 'gradient-text' : 'text-blue-600'} relative leading-tight`}>
                SignWave
              </h1>
            </motion.div>
            <div className="text-3xl font-bold mb-6 h-16">
              <Typewriter
                options={{
                  strings: ['Hindi Sign Language Interpreter', 'Breaking Communication Barriers', 'Learn. Practice. Communicate.'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
            <p className={`text-xl mb-8 ${darkMode ? 'opacity-80' : 'text-gray-700'}`}>
              Experience the future of sign language learning with our cutting-edge 3D interpreter.
              Join thousands of users in their journey to master Hindi sign language.
            </p>
            <div className="flex justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: darkMode ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className={`group ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${darkMode ? 'glass-effect' : ''}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </span>
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-blue-400 to-indigo-400'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              </motion.button>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-5xl"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className={`p-6 rounded-xl ${darkMode ? 'glass-effect' : 'bg-white/95 shadow-md backdrop-blur-sm'} shadow-lg hover:shadow-xl transition-all relative overflow-hidden group hover-lift`}
                style={{ 
                  transform: darkMode ? `translate(${mouseX * 0.05}px, ${mouseY * 0.05}px)` : 'none',
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10' : 'bg-gradient-to-r from-blue-700/30 to-indigo-700/30'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`${darkMode ? 'text-blue-600' : 'text-blue-500'} transform group-hover:scale-110 transition-transform group-hover:${darkMode ? 'text-blue-600' : 'text-blue-700'}`}>{feature.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'gradient-text' : 'text-blue-600'} group-hover:${darkMode ? 'gradient-text' : 'text-blue-700'} transition-colors text-center`}>{feature.title}</h3>
                  <p className={`${darkMode ? 'opacity-80' : 'text-gray-700'} group-hover:${darkMode ? 'opacity-100' : 'text-blue-800'} transition-colors text-center`}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Decorative Elements */}
          <div className={`absolute top-1/4 left-10 w-20 h-20 ${darkMode ? 'bg-blue-500/10' : 'bg-purple-400/20'} rounded-full blur-xl ${darkMode ? 'animate-pulse-slow' : ''}`}></div>
          <div className={`absolute bottom-1/4 right-10 w-32 h-32 ${darkMode ? 'bg-indigo-500/10' : 'bg-violet-400/20'} rounded-full blur-xl ${darkMode ? 'animate-pulse-slow' : ''}`}></div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;