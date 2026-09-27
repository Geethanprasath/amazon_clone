import { useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'

function getErrorMessage(error) {
  const data = error.response?.data
  if (typeof data?.detail === 'string') return data.detail
  if (typeof data === 'object' && data) {
    const firstMessage = Object.values(data).flat().find((message) => typeof message === 'string')
    if (firstMessage) return firstMessage
  }
  return 'We could not complete your request. Check your connection and try again.'
}

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const { signIn, signUp } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isSignup) {
        await signUp({ username: form.username.trim(), email: form.email.trim(), password: form.password })
      } else {
        await signIn({ username: form.username.trim(), password: form.password })
      }

      const requestedPath = location.state?.from?.pathname ?? searchParams.get('next')
      const nextPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
        ? requestedPath
        : '/profile'
      navigate(nextPath, { replace: true })
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel__mark" aria-hidden="true">
          <LockKeyhole size={20} />
        </div>
        <p className="collection-page__eyebrow">STREAMX ACCOUNT</p>
        <h1 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-panel__description">
          {isSignup ? 'Save your favorites and pick up where you left off.' : 'Sign in to continue to your library.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Username</span>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={150}
              value={form.username}
              onChange={updateField}
            />
          </label>
          {isSignup && (
            <label className="auth-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={updateField}
              />
            </label>
          )}
          <label className="auth-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              minLength={8}
              value={form.password}
              onChange={updateField}
            />
          </label>
          {isSignup && (
            <label className="auth-field">
              <span>Confirm password</span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={updateField}
              />
            </label>
          )}
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</span>
            {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
          </button>
        </form>

        <p className="auth-panel__switch">
          {isSignup ? 'Already have an account?' : 'New to StreamX?'}{' '}
          <Link to={isSignup ? '/login' : '/signup'}>
            {isSignup ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </section>
    </main>
  )
}