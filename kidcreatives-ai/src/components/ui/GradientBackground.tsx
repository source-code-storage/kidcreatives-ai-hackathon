import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientBackgroundProps {
  children: ReactNode
  variant?: 'mesh-1' | 'mesh-2'
  className?: string
}

export function GradientBackground({
  children,
  variant = 'mesh-1',
  className = '',
}: GradientBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const gradientClasses = {
    'mesh-1': 'bg-gradient-mesh-1',
    'mesh-2': 'bg-gradient-mesh-2',
  } as const

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className={`fixed inset-0 -z-10 ${gradientClasses[variant]}`}
        animate={prefersReducedMotion ? {} : {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={prefersReducedMotion ? {} : {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Overlay for better text contrast */}
      <div className="fixed inset-0 -z-10 bg-white/80" />
      
      {/* Content */}
      {children}
    </div>
  )
}
