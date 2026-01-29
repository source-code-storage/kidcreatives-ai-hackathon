import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  onReset: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class PhaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Phase error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                Don't worry, your progress is safe. Let's get you back on track!
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleReset}
                className="w-full gap-2"
                size="lg"
              >
                <Home className="w-5 h-5" />
                Go Back to Start
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </Button>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              If this problem persists, please try refreshing the page or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
