import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'

export default function ProfilePage() {
  const { user, watchlist, signOut } = useAppContext()
  const navigate = useNavigate()
  const initials = user.username
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  function handleSignOut() {
    void signOut()
    navigate('/', { replace: true })
  }

  return (
    <main className="collection-page profile-page">
      <p className="collection-page__eyebrow">YOUR STREAMX ACCOUNT</p>
      <h1 className="collection-page__title">Profile</h1>
      <section className="profile-summary" aria-label="Account details">
        <div className="profile-summary__avatar" aria-hidden="true">{initials}</div>
        <div className="profile-summary__identity">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-summary__stat">
          <span>{watchlist.length || user.watchlist_count || 0}</span>
          <span>Saved titles</span>
        </div>
      </section>
      <button className="profile-signout" type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </main>
  )
}