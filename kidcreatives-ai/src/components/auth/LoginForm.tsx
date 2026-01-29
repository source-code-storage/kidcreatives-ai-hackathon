import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onSuccess: () => void
}

export function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const { signIn, signInWithMagicLink, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Validate email
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      if (useMagicLink) {
        await signInWithMagicLink(email)
        setMagicLinkSent(true)
      } else {
        await signIn(email, password)
        onSuccess()
      }
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h3 className="text-xl font-bold text-subject-blue">Check your email!</h3>
        <p className="text-gray-600">
          We sent a magic link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Click the link in the email to sign in.
        </p>
        <Button onClick={() => setMagicLinkSent(false)} variant="outline">
          Back to login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-subject-blue"
          placeholder="your@email.com"
        />
      </div>

      {!useMagicLink && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-subject-blue"
            placeholder="••••••••"
          />
        </div>
      )}

      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {validationError || error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Loading...' : useMagicLink ? 'Send Magic Link' : 'Sign In'}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setUseMagicLink(!useMagicLink)}
          className="text-sm text-subject-blue hover:underline"
        >
          {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
        </button>

        <div className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-subject-blue hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </form>
  )
}
