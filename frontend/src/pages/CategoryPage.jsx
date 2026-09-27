import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { fetchCategoryMovies } from '../services/catalogService.js'

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const { categories, movies, catalogStatus } = useAppContext()
  const category = categories.find((item) => item.slug === categorySlug)
  const [categoryResults, setCategoryResults] = useState({ categoryId: null, movies: [], error: false })
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!category?.id || catalogStatus !== 'api') return undefined

    let active = true
    const controller = new AbortController()
    fetchCategoryMovies(category.id, controller.signal)
      .then((categoryMovies) => {
        if (active) setCategoryResults({ categoryId: category.id, movies: categoryMovies, error: false })
      })
      .catch(() => {
        if (active) setCategoryResults({ categoryId: category.id, movies: [], error: true })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [catalogStatus, category?.id, retryCount])

  if (!category) {
    return (
      <main className="collection-page">
        <Link className="collection-page__back" to="/categories">All categories</Link>
        <h1 className="collection-page__title">Category not found</h1>
      </main>
    )
  }

  const fallbackMovies = movies.filter(
    (movie) => movie.genre === category.genre || movie.categories?.includes(category.id),
  )
  const waitingForCategory = catalogStatus === 'api' && category.id && categoryResults.categoryId !== category.id
  const categoryMovies = catalogStatus === 'api' && category.id
    ? categoryResults.categoryId === category.id && !categoryResults.error
      ? categoryResults.movies
      : fallbackMovies
    : fallbackMovies

  return (
    <main className="collection-page">
      <Link className="collection-page__back" to="/categories">All categories</Link>
      <header className="collection-page__header">
        <div>
          <p className="collection-page__eyebrow">EXPLORE BY GENRE</p>
          <h1 className="collection-page__title">{category.name}</h1>
          <p className="collection-page__description">{category.description}</p>
        </div>
      </header>
      {waitingForCategory && <LoadingSpinner label={`Loading ${category.name} titles...`} />}
      {categoryResults.categoryId === category.id && categoryResults.error && (
        <ErrorMessage
          message="Could not load this category from the catalog API. Showing available titles."
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      )}
      <p className="collection-page__count" aria-live="polite">
        {categoryMovies.length} {categoryMovies.length === 1 ? 'title' : 'titles'}
      </p>
      <MovieGrid movies={categoryMovies} emptyMessage={`No ${category.name} titles are available yet.`} />
    </main>
  )
}