import MovieGrid from '../components/MovieGrid.jsx'
import { tvShowCatalog } from '../data/tvShowCatalog.js'

export default function TvShowsPage() {
  return (
    <main className="collection-page">
      <header className="collection-page__header">
        <div>
          <p className="collection-page__eyebrow">SERIAL STORIES</p>
          <h1 className="collection-page__title">TV Shows</h1>
          <p className="collection-page__description">
            Fictional series to settle into, one episode at a time.
          </p>
        </div>
      </header>
      <p className="collection-page__count" aria-live="polite">
        {tvShowCatalog.length} {tvShowCatalog.length === 1 ? 'series' : 'series'}
      </p>
      <MovieGrid movies={tvShowCatalog} emptyMessage="No series are available yet." />
    </main>
  )
}