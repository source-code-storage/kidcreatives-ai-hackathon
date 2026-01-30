import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, type User, type Session } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, displayName: string, ageRange?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signInAnonymously: (username: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName: string, ageRange?: string) => {
    try {
      setError(null)
      setLoading(true)

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            age_range: ageRange
          },
          emailRedirectTo: window.location.origin
        }
      })

      if (signUpError) throw signUpError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      setError(null)
      setLoading(true)

      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (magicLinkError) throw magicLinkError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInAnonymously = async (username: string) => {
    try {
      setError(null)
      setLoading(true)

      // Sign in anonymously with Supabase
      const { error: anonError } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            username: username,
            display_name: username
          }
        }
      })

      if (anonError) throw anonError

      // Store username in localStorage for persistence
      localStorage.setItem('kidcreatives_username', username)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      // Clear localStorage
      localStorage.removeItem('kidcreatives_username')
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signInWithMagicLink, signInAnonymously, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
