import { motion } from 'framer-motion'
import { Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type SparkyState = 'waiting' | 'thinking' | 'success'

interface SparkyProps {
  state: SparkyState
  message?: string
  className?: string
}

export function Sparky({ state, message, className }: SparkyProps) {
  const getIcon = () => {
    switch (state) {
      case 'thinking':
        return <Loader2 className="w-8 h-8 text-subject-blue animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-action-green" />
      case 'waiting':
      default:
        return <Sparkles className="w-8 h-8 text-subject-blue" />
    }
  }

  const getBackgroundColor = () => {
    switch (state) {
      case 'thinking':
        return 'bg-blue-50'
      case 'success':
        return 'bg-green-50'
      case 'waiting':
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg',
        getBackgroundColor(),
        className
      )}
    >
      <motion.div
        animate={state === 'thinking' ? { rotate: 360 } : { rotate: 0 }}
        transition={
          state === 'thinking'
            ? { duration: 2, repeat: Infinity, ease: 'linear' }
            : { duration: 0.3 }
        }
      >
        {getIcon()}
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1"
        >
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            {message}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
