import HeroBanner from '../components/HeroBanner.jsx'
import MovieRow from '../components/MovieRow.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { featuredMovie } from '../data/featuredMovie.js'
import { buildHomeMovieRows } from '../data/movieCatalog.js'

export default function HomePage() {
  const { movies, catalogError, catalogStatus, refreshCatalog } = useAppContext()
  const featured = movies.find((movie) => movie.title === featuredMovie.title) ?? movies[0] ?? featuredMovie
  const rows = buildHomeMovieRows(movies)

  return (
    <main className="home-page">
      <HeroBanner movie={featured} />
      {catalogError && (
        <p className="catalog-notice" role="status">
          {catalogError}{' '}
          <button type="button" onClick={refreshCatalog}>Retry</button>
        </p>
      )}
      {catalogStatus === 'api' && movies.length === 0 && (
        <p className="catalog-notice" role="status">The catalog is empty. Add titles through the backend admin or API.</p>
      )}
      <div className="home-rows">
        {rows.map((row) => (
          <MovieRow key={row.id} title={row.title} movies={row.movies} />
        ))}
      </div>
    </main>
  )
}