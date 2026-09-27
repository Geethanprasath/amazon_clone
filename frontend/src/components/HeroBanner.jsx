import { useState } from 'react'
import { Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import WatchlistButton from './WatchlistButton.jsx'

export default function HeroBanner({ movie }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className="hero-banner" aria-labelledby="featured-title">
      {!imageFailed && (
        <img
          className="hero-banner__image"
          src={movie.backdrop}
          alt={movie.backdropAlt}
          fetchPriority="high"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="hero-banner__content">
        <p className="hero-banner__kicker">
          <span className="hero-banner__kicker-mark" aria-hidden="true" />
          {movie.label} <span className="hero-banner__kicker-divider">/</span> Featured story
        </p>
        <h1 className="hero-banner__title" id="featured-title">{movie.title}</h1>
        <div className="hero-banner__metadata" aria-label="Movie details">
          <span>{movie.releaseYear}</span>
          <span className="hero-banner__rating">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {movie.rating}
          </span>
          <span>{movie.duration}</span>
          <span className="hero-banner__certification">{movie.certification}</span>
        </div>
        <p className="hero-banner__description">{movie.description}</p>
        <p className="hero-banner__genre">{movie.genre}</p>
        <div className="hero-banner__actions">
          <Link className="hero-button hero-button--play" to={`/watch/${movie.id}`}>
            <Play size={18} fill="currentColor" aria-hidden="true" />
            <span>Watch now</span>
          </Link>
          <WatchlistButton movie={movie} className="hero-button hero-button--watchlist" />
        </div>
      </div>
      <div className="hero-banner__index" aria-hidden="true">
        <span>01</span>
        <span className="hero-banner__index-line" />
        <span>01</span>
      </div>
    </section>
  )
}