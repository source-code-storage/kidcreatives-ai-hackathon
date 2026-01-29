import { motion } from 'framer-motion'
import { Trash2, Eye } from 'lucide-react'
import type { GalleryItem } from '@/types/GalleryTypes'

interface GalleryCardProps {
  item: GalleryItem
  onDelete: (id: string) => void
  onViewDetails: (item: GalleryItem) => void
}

export function GalleryCard({ item, onDelete, onViewDetails }: GalleryCardProps) {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this creation?')) {
      onDelete(item.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 border-system-grey/20 hover:border-action-green transition-colors"
      onClick={() => onViewDetails(item)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-system-grey/10">
        <img
          src={item.thumbnail}
          alt={item.intentStatement}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Intent Statement - React auto-escapes, do not use dangerouslySetInnerHTML */}
        <h3 className="font-bold text-lg text-subject-blue mb-2 line-clamp-2">
          {item.intentStatement}
        </h3>

        {/* Creation Date */}
        <p className="text-sm text-system-grey mb-3">
          {formatDate(item.createdAt)}
        </p>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm mb-4">
          <div>
            <span className="text-variable-purple font-semibold">
              {item.stats.totalEdits}
            </span>
            <span className="text-system-grey ml-1">edits</span>
          </div>
          <div>
            <span className="text-context-orange font-semibold">
              {item.stats.variablesUsed.length}
            </span>
            <span className="text-system-grey ml-1">variables</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(item)
            }}
            aria-label={`View details for ${item.intentStatement}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-action-green text-white rounded-lg hover:bg-action-green/90 transition-colors"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Delete ${item.intentStatement}`}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
