import { useState } from 'react'

import MovieGrid from '../components/MovieGrid.jsx'
import { useAppContext } from '../context/useAppContext.js'

export default function MoviesPage() {
  const { movies, catalogError, refreshCatalog } = useAppContext()
  const [selectedGenre, setSelectedGenre] = useState('all')
  const genres = [...new Set(movies.map((movie) => movie.genre))].sort()
  const filteredMovies =
    selectedGenre === 'all'
      ? movies
      : movies.filter((movie) => movie.genre === selectedGenre)

  return (
    <main className="collection-page">
      <header className="collection-page__header">
        <div>
          <p className="collection-page__eyebrow">THE STREAMX COLLECTION</p>
          <h1 className="collection-page__title">Movies</h1>
          <p className="collection-page__description">
            Find a new favorite from our growing collection of original stories.
          </p>
        </div>
        <label className="genre-filter">
          <span>Genre</span>
          <select
            aria-label="Filter movies by genre"
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            <option value="all">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </label>
      </header>
      {catalogError && (
        <p className="catalog-notice" role="status">
          {catalogError}{' '}
          <button type="button" onClick={refreshCatalog}>Retry</button>
        </p>
      )}
      <p className="collection-page__count" aria-live="polite">
        {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
      </p>
      <MovieGrid movies={filteredMovies} />
    </main>
  )
}