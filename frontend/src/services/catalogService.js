import { apiClient } from './apiClient.js'
import { categories as demoCategories } from '../data/categories.js'

function normalizeMovie(movie) {
  return {
    ...movie,
    mediaType: 'movie',
    releaseYear: movie.release_year,
    duration: `${movie.duration}m`,
    durationMinutes: movie.duration,
    videoUrl: movie.video_url,
    posterAlt: `${movie.title} poster`,
    backdrop: movie.backdrop || movie.poster,
    backdropAlt: `${movie.title} backdrop`,
    cast: Array.isArray(movie.cast) ? movie.cast : [],
    categories: Array.isArray(movie.categories) ? movie.categories : [],
  }
}

function normalizeCategory(category, movies) {
  const definition = demoCategories.find((item) => item.name === category.name)
  const matchingMovies = movies.filter((movie) => movie.categories.includes(category.id))
  return {
    ...category,
    slug: definition?.slug ?? category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    genre: definition?.genre ?? category.name,
    count: matchingMovies.length,
    image: matchingMovies[0]?.poster ?? definition?.image,
    imageAlt: matchingMovies[0]?.posterAlt ?? definition?.imageAlt,
  }
}

export async function fetchCatalog(signal) {
  const [movieResponse, categoryResponse] = await Promise.all([
    apiClient.get('/movies/', { signal }),
    apiClient.get('/categories/', { signal }),
  ])
  const movies = movieResponse.data.map(normalizeMovie)
  const categories = categoryResponse.data.map((category) => normalizeCategory(category, movies))
  return { movies, categories }
}

export async function fetchMoviesSearch(query, signal) {
  const { data } = await apiClient.get('/movies/search/', { params: { q: query }, signal })
  return data.map(normalizeMovie)
}

export async function fetchCategoryMovies(categoryId, signal) {
  const { data } = await apiClient.get(`/categories/${categoryId}/movies/`, { signal })
  return data.map(normalizeMovie)
}

export async function fetchMovie(movieId) {
  const { data } = await apiClient.get(`/movies/${movieId}/`)
  return normalizeMovie(data)
}