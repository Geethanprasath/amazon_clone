import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ movies, emptyMessage = 'No titles in this collection yet.' }) {
  if (movies.length === 0) {
    return <p className="collection-empty" role="status">{emptyMessage}</p>
  }

  return (
    <div className="movie-grid" role="list" aria-label="Movies">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}