import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { fetchWatchlist } from '../services/watchlistService.js'

export default function WatchlistPage() {
  const { user, watchlist, setWatchlist } = useAppContext()
  const [loadState, setLoadState] = useState({ userId: null, status: 'idle', error: '' })
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!user) return undefined

    let active = true
    fetchWatchlist()
      .then((movies) => {
        if (!active) return
        setWatchlist(movies)
        setLoadState({ userId: user.id, status: 'loaded', error: '' })
      })
      .catch(() => {
        if (active) {
          setLoadState({
            userId: user.id,
            status: 'error',
            error: 'Your watchlist could not be loaded. Check your connection and try again.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [retryCount, setWatchlist, user])

  if (!user) {
    return (
      <main className="collection-page watchlist-page">
        <p className="collection-page__eyebrow">YOUR PERSONAL LIBRARY</p>
        <h1 className="collection-page__title">Watchlist</h1>
        <section className="watchlist-gate">
          <h2>Sign in to save your picks.</h2>
          <p>Your saved movies will be waiting here when you come back.</p>
          <Link className="hero-button hero-button--play" to="/login?next=%2Fwatchlist">
            Sign in
          </Link>
        </section>
      </main>
    )
  }

  const hasLoadedForUser = loadState.userId === user.id

  return (
    <main className="collection-page watchlist-page">
      <header className="collection-page__header">
        <div>
          <p className="collection-page__eyebrow">YOUR PERSONAL LIBRARY</p>
          <h1 className="collection-page__title">Watchlist</h1>
          <p className="collection-page__description">Your saved stories, all in one place.</p>
        </div>
      </header>

      {!hasLoadedForUser || loadState.status === 'idle' ? (
        <LoadingSpinner label="Loading your watchlist..." />
      ) : loadState.status === 'error' ? (
        <ErrorMessage
          message={loadState.error}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      ) : watchlist.length === 0 ? (
        <section className="watchlist-empty">
          <div className="watchlist-empty__mark" aria-hidden="true">+</div>
          <h2>Your watchlist is clear.</h2>
          <p>Save a title and it will show up here.</p>
          <Link className="hero-button hero-button--play" to="/movies">Explore movies</Link>
        </section>
      ) : (
        <>
          <p className="collection-page__count" aria-live="polite">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved
          </p>
          <MovieGrid movies={watchlist} />
        </>
      )}
    </main>
  )
}