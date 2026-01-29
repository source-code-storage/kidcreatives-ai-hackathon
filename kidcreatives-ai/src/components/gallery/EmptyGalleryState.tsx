import { Sparkles } from 'lucide-react'

interface EmptyGalleryStateProps {
  onCreateNow: () => void
}

export function EmptyGalleryState({ onCreateNow }: EmptyGalleryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* Icon */}
      <div className="mb-6 text-system-grey">
        <Sparkles size={80} strokeWidth={1.5} />
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-subject-blue mb-3">
        Your gallery is empty!
      </h2>
      <p className="text-lg text-system-grey mb-8 max-w-md">
        Create your first masterpiece to get started. Your AI art collection awaits!
      </p>

      {/* CTA Button */}
      <button
        onClick={onCreateNow}
        className="px-8 py-3 bg-action-green text-white text-lg font-semibold rounded-lg hover:bg-action-green/90 transition-colors shadow-lg"
      >
        Create Now
      </button>
    </div>
  )
}
