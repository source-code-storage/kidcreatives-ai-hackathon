import { motion } from 'framer-motion'
import type { EditHistoryEntry } from '@/types/GeminiTypes'

interface EditHistoryProps {
  history: EditHistoryEntry[]
  className?: string
}

export function EditHistory({ history, className = '' }: EditHistoryProps) {
  if (history.length === 0) {
    return null
  }

  // Show most recent first
  const reversedHistory = [...history].reverse()

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Your Refinement Journey ({history.length} {history.length === 1 ? 'edit' : 'edits'})
      </h3>
      
      <div className="space-y-2">
        {reversedHistory.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-variable-purple"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-variable-purple text-white rounded-full flex items-center justify-center font-bold">
                {history.length - index}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  "{entry.editPrompt}"
                </p>
                <p className="text-xs text-gray-600 italic">
                  {entry.sparkyResponse}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
