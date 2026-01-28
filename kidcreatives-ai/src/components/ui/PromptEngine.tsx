import { motion } from 'framer-motion'
import { CodeBlock } from './CodeBlock'
import type { PromptVariableEntry } from '@/types/PromptState'

interface PromptEngineProps {
  variables: PromptVariableEntry[]
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
}

export function PromptEngine({ variables, className }: PromptEngineProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🏭 Prompt Engine
        </h3>
        <p className="text-sm text-gray-600">
          Watch your answers turn into AI instructions!
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[200px]"
      >
        {variables.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">Your code blocks will appear here...</p>
          </div>
        ) : (
          <motion.div className="flex flex-wrap gap-3">
            {variables.map((entry) => (
              <motion.div key={`${entry.variable}-${entry.timestamp}`} variants={itemVariants}>
                <CodeBlock
                  variant={entry.colorCategory}
                  variable={entry.variable}
                  value={entry.answer}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {variables.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-gray-500">
            {variables.length} instruction{variables.length !== 1 ? 's' : ''} added to your prompt
          </p>
        </motion.div>
      )}
    </div>
  )
}
