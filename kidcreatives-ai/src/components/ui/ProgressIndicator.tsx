import { motion } from 'framer-motion'
import { Phase } from '@/types/PhaseTypes'

interface ProgressIndicatorProps {
  currentPhase: Phase
  className?: string
}

export function ProgressIndicator({ currentPhase, className = '' }: ProgressIndicatorProps) {
  const phases = [
    { phase: Phase.Handshake, label: 'Meet' },
    { phase: Phase.PromptBuilder, label: 'Build' },
    { phase: Phase.Generation, label: 'Create' },
    { phase: Phase.Refinement, label: 'Refine' },
    { phase: Phase.Trophy, label: 'Trophy' },
  ]

  const currentPhaseIndex = phases.findIndex(p => p.phase === currentPhase)

  return (
    <div 
      className={`flex items-center gap-3 ${className}`}
      role="progressbar"
      aria-label="Creation progress"
      aria-valuenow={currentPhaseIndex}
      aria-valuemin={0}
      aria-valuemax={phases.length - 1}
      aria-valuetext={`${phases[currentPhaseIndex]?.label || 'Unknown'} phase`}
    >
      {phases.map((item, index) => {
        const isActive = currentPhase === item.phase
        const isCompleted = currentPhase > item.phase
        
        return (
          <div key={item.phase} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isActive ? 1.2 : 1, 
                opacity: isCompleted || isActive ? 1 : 0.4 
              }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="relative"
              aria-label={`${item.label} phase${isCompleted ? ' completed' : isActive ? ' active' : ''}`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-action-green'
                    : isActive
                    ? 'bg-subject-blue'
                    : 'bg-gray-300'
                }`}
              />
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-subject-blue"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                />
              )}
            </motion.div>
            
            {/* Label (hidden on mobile) */}
            <span
              className={`hidden md:inline text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-subject-blue' : 'text-gray-500'
              }`}
              aria-hidden="true"
            >
              {item.label}
            </span>
            
            {/* Connector line (except after last dot) */}
            {index < phases.length - 1 && (
              <div
                className={`hidden md:block w-8 h-0.5 transition-colors duration-300 ${
                  isCompleted ? 'bg-action-green' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
