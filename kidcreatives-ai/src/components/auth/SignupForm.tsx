import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface SignupFormProps {
  onSwitchToLogin: () => void
  onSuccess: () => void
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const { signUp, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [ageRange, setAgeRange] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  }

  const sanitizeDisplayName = (name: string): string => {
    return name
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"]/g, '') // Remove special chars
      .trim()
      .slice(0, 50) // Limit length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Validate email
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address (e.g., user@example.com)')
      return
    }

    // Validate password
    if (!validatePassword(password)) {
      setValidationError('Password must be at least 6 characters with both letters and numbers')
      return
    }

    // Validate display name
    if (displayName.trim().length < 2) {
      setValidationError('Display name must be at least 2 characters')
      return
    }

    setLoading(true)

    try {
      const sanitizedName = sanitizeDisplayName(displayName)
      await signUp(email, password, sanitizedName, ageRange || undefined)
      onSuccess()
    } catch (err) {
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
          Display Name <span className="text-red-500">*</span>
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-subject-blue"
          placeholder="Your creative name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
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
        <p className="text-xs text-gray-500 mt-1">
          Parents: Use your email for account verification
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-subject-blue"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-500 mt-1">
          At least 6 characters
        </p>
      </div>

      <div>
        <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
          Age Range (Optional)
        </label>
        <select
          id="ageRange"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-subject-blue"
        >
          <option value="">Prefer not to say</option>
          <option value="7-8">7-8 years old</option>
          <option value="9-10">9-10 years old</option>
          <option value="11+">11+ years old</option>
        </select>
      </div>

      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {validationError || error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        For demo/judging: Account is created instantly, no email confirmation needed.
      </div>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-subject-blue hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}
