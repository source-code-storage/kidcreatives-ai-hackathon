# React Micro-Interactions Guide

## 1. Ripple Effects on Button Clicks

### Using Framer Motion

```jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

const RippleButton = ({ children, onClick }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  return (
    <motion.button
      className="relative overflow-hidden px-6 py-3 bg-blue-500 text-white rounded-lg"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
};
```

### CSS-Only Ripple Alternative

```jsx
import { motion } from 'framer-motion';

const SimpleRippleButton = ({ children, onClick }) => (
  <motion.button
    className="ripple-button px-6 py-3 bg-blue-500 text-white rounded-lg relative overflow-hidden"
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {children}
    <style jsx>{`
      .ripple-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      .ripple-button:active::after {
        width: 300px;
        height: 300px;
      }
    `}</style>
  </motion.button>
);
```

## 2. Confetti Animations for Celebrations

### Using canvas-confetti

```bash
npm install canvas-confetti
```

```jsx
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const ConfettiButton = ({ children }) => {
  const handleConfetti = () => {
    // Basic confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFireworks = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="space-x-4">
      <motion.button
        className="px-6 py-3 bg-green-500 text-white rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConfetti}
      >
        🎉 Confetti
      </motion.button>
      
      <motion.button
        className="px-6 py-3 bg-purple-500 text-white rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFireworks}
      >
        🎆 Fireworks
      </motion.button>
    </div>
  );
};
```

### Custom Confetti Component

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CustomConfetti = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  const createParticles = () => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      rotation: Math.random() * 360,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
    }));
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  React.useEffect(() => {
    if (trigger) createParticles();
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: particle.color }}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: particle.rotation + 720,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeIn",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
```

## 3. Particle Effects

### Floating Particles Background

```jsx
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ParticleBackground = ({ count = 50 }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    })), [count]
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-200 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
```

### Interactive Particle Trail

```jsx
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';

const ParticleTrail = () => {
  const [particles, setParticles] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const newParticle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            delay: index * 0.05,
          }}
        />
      ))}
    </div>
  );
};
```

## 4. Hover Scale/Shadow Effects

### Advanced Hover Button

```jsx
import { motion } from 'framer-motion';

const HoverButton = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: {
      base: "bg-blue-500 text-white",
      hover: { scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)" }
    },
    secondary: {
      base: "bg-gray-200 text-gray-800",
      hover: { scale: 1.02, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }
    }
  };

  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${variants[variant].base}`}
      whileHover={variants[variant].hover}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
};
```

### Card Hover Effects

```jsx
import { motion } from 'framer-motion';

const HoverCard = ({ children, title }) => (
  <motion.div
    className="p-6 bg-white rounded-xl border border-gray-200 cursor-pointer"
    whileHover={{
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <motion.h3
      className="text-xl font-semibold mb-2"
      whileHover={{ color: "#3b82f6" }}
    >
      {title}
    </motion.h3>
    {children}
  </motion.div>
);
```

### Magnetic Hover Effect

```jsx
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
};
```

## Installation & Setup

```bash
# Core dependencies
npm install framer-motion canvas-confetti

# Optional for styling
npm install tailwindcss
```

## Usage Example

```jsx
import { useState } from 'react';
import { RippleButton, ConfettiButton, HoverButton, ParticleBackground } from './components';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ParticleBackground />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Micro-Interactions Demo</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <RippleButton onClick={() => console.log('Ripple clicked!')}>
            Ripple Effect
          </RippleButton>
          
          <ConfettiButton />
          
          <HoverButton variant="primary">
            Hover Scale
          </HoverButton>
          
          <MagneticButton>
            Magnetic Effect
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
```

## Key Libraries Summary

- **Framer Motion**: Core animation library for React
- **canvas-confetti**: Lightweight confetti animations
- **react-spring**: Alternative physics-based animations
- **lottie-react**: For complex After Effects animations
- **react-transition-group**: For component transitions

Each effect can be customized with different colors, timing, and physics properties to match your design system.