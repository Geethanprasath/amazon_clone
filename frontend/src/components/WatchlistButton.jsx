import { useState } from 'react'
import { BookmarkCheck, BookmarkPlus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'
import { addWatchlistItem, removeWatchlistItem } from '../services/watchlistService.js'

export default function WatchlistButton({ movie, className, iconOnly = false }) {
  const { user, watchlist, setWatchlist } = useAppContext()
  const location = useLocation()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const isSaved = watchlist.some((item) => String(item.id) === String(movie.id))
  const label = isSaved ? 'In watchlist' : 'Add to watchlist'

  if (!user) {
    const nextPath = `${location.pathname}${location.search}`
    const signInLabel = `Sign in to add ${movie.title} to watchlist`
    return (
      <Link
        className={className}
        to={`/login?next=${encodeURIComponent(nextPath)}`}
        aria-label={signInLabel}
        title={signInLabel}
      >
        <BookmarkPlus size={iconOnly ? 17 : 19} aria-hidden="true" />
        {!iconOnly && <span>Add to watchlist</span>}
      </Link>
    )
  }

  async function toggleWatchlist() {
    setError('')
    setIsSaving(true)

    try {
      if (isSaved) {
        await removeWatchlistItem(movie.id)
        setWatchlist((items) => items.filter((item) => String(item.id) !== String(movie.id)))
      } else {
        await addWatchlistItem(movie.id)
        setWatchlist((items) =>
          items.some((item) => String(item.id) === String(movie.id)) ? items : [...items, movie],
        )
      }
    } catch {
      setError('Could not update your watchlist. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <span className="watchlist-action">
      <button
        className={className}
        type="button"
        aria-label={isSaved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
        aria-pressed={isSaved}
        aria-busy={isSaving}
        disabled={isSaving}
        title={error || label}
        onClick={toggleWatchlist}
      >
        {isSaved ? (
          <BookmarkCheck size={iconOnly ? 17 : 19} aria-hidden="true" />
        ) : (
          <BookmarkPlus size={iconOnly ? 17 : 19} aria-hidden="true" />
        )}
        {!iconOnly && <span>{isSaving ? 'Saving...' : label}</span>}
      </button>
      {error && <span className="watchlist-action__error" role="status">{error}</span>}
    </span>
  )
}