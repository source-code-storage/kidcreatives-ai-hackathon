import { Component, ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onClose?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GalleryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Gallery error boundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't load your gallery. This might be due to corrupted data.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Clear corrupted data and retry
                  try {
                    localStorage.removeItem('kidcreatives_gallery')
                    this.setState({ hasError: false, error: null })
                    window.location.reload()
                  } catch (err) {
                    console.error('Failed to clear gallery:', err)
                  }
                }}
                className="w-full px-6 py-3 bg-action-green text-white rounded-lg hover:bg-action-green/90 transition-colors"
              >
                Clear Gallery & Retry
              </button>
              
              {this.props.onClose && (
                <button
                  onClick={this.props.onClose}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Close Gallery
                </button>
              )}
            </div>
            
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
