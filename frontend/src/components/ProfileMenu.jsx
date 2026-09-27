import { useEffect, useRef } from 'react'
import { ChevronDown, CircleUserRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'

export default function ProfileMenu() {
  const { user, authLoading, signOut } = useAppContext()
  const menuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    menuRef.current?.removeAttribute('open')
  }, [location.pathname])

  function handleSignOut() {
    void signOut()
    menuRef.current?.removeAttribute('open')
    navigate('/', { replace: true })
  }

  return (
    <details className="profile-menu" ref={menuRef}>
      <summary className="profile-menu__trigger" aria-label="Open account menu">
        <CircleUserRound size={20} aria-hidden="true" />
        <span className="profile-menu__label">
          {authLoading ? 'Loading...' : user?.username ?? 'Account'}
        </span>
        <ChevronDown className="profile-menu__chevron" size={14} aria-hidden="true" />
      </summary>
      <div className="profile-menu__panel">
        {authLoading ? (
          <span className="profile-menu__status" role="status">Checking account...</span>
        ) : user ? (
          <>
            <Link to="/profile">Your profile</Link>
            <Link to="/watchlist">Your watchlist</Link>
            <button type="button" onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Create account</Link>
          </>
        )}
      </div>
    </details>
  )
}