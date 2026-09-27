import { useState } from 'react'
import { Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import WatchlistButton from './WatchlistButton.jsx'

export default function MovieCard({ movie }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="movie-card" role="listitem">
      <div className="movie-card__visual">
        <Link
          className="movie-card__poster-link"
          to={`/movie/${movie.id}`}
          aria-label={`View ${movie.title} details`}
        >
          {!imageFailed ? (
            <img
              className="movie-card__image"
              src={movie.poster}
              alt={movie.posterAlt}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="movie-card__image-fallback" aria-hidden="true">
              {movie.title}
            </span>
          )}
          <span className="movie-card__scrim" aria-hidden="true" />
          <span className="movie-card__hover-info" aria-hidden="true">
            <span>{movie.title}</span>
            <span>{movie.genre}</span>
          </span>
        </Link>
        {movie.mediaType === 'series' && (
          <span className="movie-card__media-type">Series</span>
        )}
        <div className="movie-card__actions">
          <Link
            className="movie-card__action"
            to={`/watch/${movie.id}`}
            aria-label={`Watch ${movie.title}`}
            title={`Watch ${movie.title}`}
          >
            <Play size={17} fill="currentColor" aria-hidden="true" />
          </Link>
          {movie.mediaType !== 'series' && (
            <WatchlistButton movie={movie} className="movie-card__action" iconOnly />
          )}
        </div>
      </div>
      <div className="movie-card__details">
        <Link className="movie-card__title" to={`/movie/${movie.id}`} title={movie.title}>
          {movie.title}
        </Link>
        <div className="movie-card__metadata">
          <span className="movie-card__genre" title={movie.genre}>{movie.genre}</span>
          <span className="movie-card__year">{movie.releaseYear}</span>
          <span className="movie-card__rating" aria-label={`Rating ${movie.rating} out of 10`}>
            <Star size={13} fill="currentColor" aria-hidden="true" />
            {movie.rating}
          </span>
        </div>
      </div>
    </article>
  )
}