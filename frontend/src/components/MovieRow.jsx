import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import MovieCard from './MovieCard.jsx'

export default function MovieRow({ title, movies }) {
  const trackRef = useRef(null)

  function scrollRow(direction) {
    const track = trackRef.current
    if (track) {
      track.scrollBy({
        left: direction * track.clientWidth * 0.8,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="movie-row" aria-label={title}>
      <div className="movie-row__header">
        <h2 className="movie-row__title">{title}</h2>
        <div className="movie-row__controls">
          <button
            className="movie-row__control"
            type="button"
            aria-label={`Scroll ${title} left`}
            title="Scroll left"
            onClick={() => scrollRow(-1)}
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <button
            className="movie-row__control"
            type="button"
            aria-label={`Scroll ${title} right`}
            title="Scroll right"
            onClick={() => scrollRow(1)}
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="movie-row__track" ref={trackRef} role="list" tabIndex={0}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}