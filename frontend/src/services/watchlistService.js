import { apiClient } from './apiClient.js'

function normalizeMovie(movie) {
  return {
    ...movie,
    releaseYear: movie.release_year,
    duration: `${movie.duration}m`,
    videoUrl: movie.video_url,
    posterAlt: `${movie.title} poster`,
    backdropAlt: `${movie.title} backdrop`,
  }
}

export async function fetchWatchlist() {
  const { data } = await apiClient.get('/watchlist/')
  return data.map((entry) => normalizeMovie(entry.movie_details))
}

export async function addWatchlistItem(movieId) {
  await apiClient.post('/watchlist/', { movie: movieId })
}

export async function removeWatchlistItem(movieId) {
  await apiClient.delete(`/watchlist/${encodeURIComponent(movieId)}/`)
}