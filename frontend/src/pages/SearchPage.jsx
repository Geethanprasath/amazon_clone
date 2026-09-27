import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { useEffect, useState } from 'react'

import { useAppContext } from '../context/useAppContext.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { tvShowCatalog } from '../data/tvShowCatalog.js'
import { fetchMoviesSearch } from '../services/catalogService.js'

function matchesQuery(content, query) {
  const searchableText = [
    content.title,
    content.genre,
    content.description,
    content.mediaType === 'series' ? 'tv show series' : 'movie film',
    ...(content.genre === 'Science Fiction' ? ['sci-fi', 'scifi'] : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase()

  return searchableText.includes(query)
}

export default function SearchPage() {
  const { searchQuery, movies, catalogStatus, catalogError, refreshCatalog } = useAppContext()
  const debouncedQuery = useDebounce(searchQuery, 250)
  const query = debouncedQuery.trim().toLocaleLowerCase()
  const hasQuery = Boolean(searchQuery.trim())
  const isDebouncing = hasQuery && searchQuery.trim().toLocaleLowerCase() !== query
  const [apiSearch, setApiSearch] = useState({ query: '', results: [], error: false })
  const [searchRevision, setSearchRevision] = useState(0)
  const localCatalog = [...movies, ...tvShowCatalog]
  const localResults = query ? localCatalog.filter((content) => matchesQuery(content, query)) : []

  useEffect(() => {
    if (!query || catalogStatus !== 'api') return undefined

    let active = true
    const controller = new AbortController()
    fetchMoviesSearch(query, controller.signal)
      .then((results) => {
        if (active) setApiSearch({ query, results, error: false })
      })
      .catch(() => {
        if (active) setApiSearch({ query, results: [], error: true })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [catalogStatus, query, searchRevision])

  const searchIsCurrent = apiSearch.query === query
  const isApiSearchLoading = Boolean(query) && catalogStatus === 'api' && !searchIsCurrent
  const searchApiError = searchIsCurrent && apiSearch.error
  const results = catalogStatus === 'api' && searchIsCurrent && !apiSearch.error
    ? [...apiSearch.results, ...tvShowCatalog.filter((show) => matchesQuery(show, query))]
    : localResults

  return (
    <main className="collection-page search-page">
      <header className="collection-page__header search-page__header">
        <div>
          <p className="collection-page__eyebrow">STREAMX LIBRARY</p>
          <h1 className="collection-page__title">Search</h1>
          <p className="collection-page__description">
            Look across movies and series for your next story.
          </p>
        </div>
        <SearchBar autoFocus />
      </header>

      {hasQuery ? (
        <section className="search-results" aria-label="Search results">
          <p className="collection-page__count" aria-live="polite">
            {isDebouncing || isApiSearchLoading
              ? 'Searching the catalog...'
              : `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${debouncedQuery.trim()}"`}
          </p>
          {catalogError && <ErrorMessage message={catalogError} onRetry={refreshCatalog} />}
          {searchApiError && (
            <ErrorMessage
              message="Search is temporarily unavailable. Showing matching demo results instead."
              onRetry={() => setSearchRevision((revision) => revision + 1)}
            />
          )}
          {isDebouncing || isApiSearchLoading ? (
            <LoadingSpinner label="Searching the catalog..." />
          ) : (
            <MovieGrid
              movies={results}
              emptyMessage={`No titles found for "${debouncedQuery.trim()}".`}
            />
          )}
        </section>
      ) : (
        <section aria-label="Featured titles">
          <h2 className="search-page__section-title">A place to start</h2>
          <MovieGrid movies={movies.slice(0, 8)} />
        </section>
      )}
    </main>
  )
}