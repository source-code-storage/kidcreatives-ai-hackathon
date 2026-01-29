import { X } from 'lucide-react'

interface GalleryHeaderProps {
  itemCount: number
  onClose: () => void
}

export function GalleryHeader({ itemCount, onClose }: GalleryHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b-2 border-system-grey/20 bg-white">
      <div>
        <h1 className="text-3xl font-bold text-subject-blue">My Gallery</h1>
        <p className="text-system-grey mt-1">
          {itemCount} {itemCount === 1 ? 'Creation' : 'Creations'}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-system-grey/10 transition-colors"
        aria-label="Close gallery"
      >
        <X size={32} className="text-system-grey" />
      </button>
    </div>
  )
}
