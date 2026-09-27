import { useState } from 'react'
import { ArrowLeft, Play, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import MovieRow from '../components/MovieRow.jsx'
import WatchlistButton from '../components/WatchlistButton.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { tvShowCatalog } from '../data/tvShowCatalog.js'

const relatedGenres = {
  Action: ['Adventure', 'Thriller', 'Science Fiction'],
  Adventure: ['Action', 'Science Fiction'],
  Animation: ['Adventure', 'Science Fiction'],
  Comedy: ['Romance', 'Drama'],
  Documentary: ['Drama', 'Adventure'],
  Drama: ['Romance', 'Mystery'],
  Horror: ['Thriller', 'Mystery'],
  Mystery: ['Thriller', 'Drama'],
  Romance: ['Drama', 'Comedy'],
  'Science Fiction': ['Adventure', 'Mystery'],
  Thriller: ['Mystery', 'Action'],
}

export default function MovieDetailsPage() {
  const { id } = useParams()
  const { movies } = useAppContext()
  const contentCatalog = [...movies, ...tvShowCatalog]
  const movie = contentCatalog.find((item) => String(item.id) === id)
  const [backdropFailed, setBackdropFailed] = useState(false)

  if (!movie) {
    return (
      <main className="movie-not-found">
        <p className="movie-detail__eyebrow">STREAMX / TITLE NOT FOUND</p>
        <h1>We could not find that title.</h1>
        <Link className="hero-button hero-button--play" to="/movies">Browse movies</Link>
      </main>
    )
  }

  const similarMovies = contentCatalog
    .filter(
      (item) =>
        item.id !== movie.id &&
        (item.genre === movie.genre || relatedGenres[movie.genre]?.includes(item.genre)),
    )
    .slice(0, 8)

  return (
    <main className="movie-detail-page">
      <section className="movie-detail-hero" aria-labelledby="movie-detail-title">
        {!backdropFailed && (
          <img
            className="movie-detail-hero__backdrop"
            src={movie.backdrop}
            alt=""
            onError={() => setBackdropFailed(true)}
          />
        )}
        <div className="movie-detail-hero__shade" aria-hidden="true" />
        <div className="movie-detail-hero__inner">
          <Link className="movie-detail__back" to="/movies">
            <ArrowLeft size={16} aria-hidden="true" />
            All movies
          </Link>
          <div className="movie-detail__content">
            <div className="movie-detail__poster-wrap">
              <img className="movie-detail__poster" src={movie.poster} alt={movie.posterAlt} />
            </div>
            <div className="movie-detail__copy">
              <p className="movie-detail__eyebrow">{movie.genre} / STREAMX STORY</p>
              <h1 id="movie-detail-title">{movie.title}</h1>
              <div className="movie-detail__metadata">
                <span className="movie-detail__rating">
                  <Star size={16} fill="currentColor" aria-hidden="true" />
                  {movie.rating}
                </span>
                <span>{movie.releaseYear}</span>
                <span>{movie.duration}</span>
                {movie.certification && (
                  <span className="movie-detail__certification">{movie.certification}</span>
                )}
              </div>
              <p className="movie-detail__description">{movie.description}</p>
              <div className="movie-detail__credits">
                <p><strong>Starring</strong><span>{movie.cast.join(', ')}</span></p>
                <p><strong>Director</strong><span>{movie.director}</span></p>
              </div>
              <div className="movie-detail__actions">
                <Link className="hero-button hero-button--play" to={`/watch/${movie.id}`}>
                  <Play size={18} fill="currentColor" aria-hidden="true" />
                  Watch now
                </Link>
                {movie.mediaType !== 'series' && (
                  <WatchlistButton movie={movie} className="hero-button hero-button--watchlist" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {similarMovies.length > 0 && (
        <section className="movie-detail__similar" aria-label="Similar movies">
          <MovieRow title="Similar stories" movies={similarMovies} />
        </section>
      )}
    </main>
  )
}