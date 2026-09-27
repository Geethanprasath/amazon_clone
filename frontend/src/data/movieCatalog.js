import { featuredMovie } from './featuredMovie.js'
import { movieDetailsById } from './movieDetails.js'
import { tvShowCatalog } from './tvShowCatalog.js'

function posterUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=720&q=82`
}

const supportingMovies = [
  {
    id: 2,
    title: 'The Glass Frontier',
    genre: 'Science Fiction',
    releaseYear: 2025,
    rating: '8.1',
    poster: posterUrl('photo-1519608487953-e999c86e7455'),
    posterAlt: 'Mountain ridge under a field of stars',
  },
  {
    id: 3,
    title: 'Blue Meridian',
    genre: 'Thriller',
    releaseYear: 2025,
    rating: '7.9',
    poster: posterUrl('photo-1518837695005-2083093ee35b'),
    posterAlt: 'Deep blue ocean wave curling toward the shore',
  },
  {
    id: 4,
    title: 'A Map of Silence',
    genre: 'Drama',
    releaseYear: 2024,
    rating: '8.3',
    poster: posterUrl('photo-1470770841072-f978cf4d019e'),
    posterAlt: 'Still lake reflecting a mountain valley',
  },
  {
    id: 5,
    title: 'Copper Sky',
    genre: 'Adventure',
    releaseYear: 2026,
    rating: '7.8',
    poster: posterUrl('photo-1470252649378-9c29740c9fa8'),
    posterAlt: 'Sunset light across a wide open landscape',
  },
  {
    id: 6,
    title: 'The Last Orchard',
    genre: 'Mystery',
    releaseYear: 2025,
    rating: '8.6',
    poster: posterUrl('photo-1500530855697-b586d89ba3ee'),
    posterAlt: 'A lone trail crossing a quiet green landscape',
  },
  {
    id: 7,
    title: 'Borrowed Time',
    genre: 'Drama',
    releaseYear: 2023,
    rating: '7.7',
    poster: posterUrl('photo-1500534623283-312aade485b7'),
    posterAlt: 'Layered mountain peaks in evening light',
  },
  {
    id: 8,
    title: 'Quiet Orbit',
    genre: 'Science Fiction',
    releaseYear: 2026,
    rating: '8.1',
    poster: posterUrl('photo-1534796636912-3b95b3ab5986'),
    posterAlt: 'Bright stars scattered across a deep night sky',
  },
  {
    id: 9,
    title: 'Red City',
    genre: 'Action',
    releaseYear: 2026,
    rating: '8.0',
    poster: posterUrl('photo-1519608487953-e999c86e7455'),
    posterAlt: 'A dramatic night sky above a dark ridgeline',
  },
  {
    id: 10,
    title: 'Low Tide',
    genre: 'Thriller',
    releaseYear: 2024,
    rating: '7.8',
    poster: posterUrl('photo-1518837695005-2083093ee35b'),
    posterAlt: 'A dark ocean swell under a cloudy sky',
  },
  {
    id: 11,
    title: 'Winter Signal',
    genre: 'Science Fiction',
    releaseYear: 2025,
    rating: '8.2',
    poster: posterUrl('photo-1519681393784-d120267933ba'),
    posterAlt: 'Snowy mountain beneath a star-filled sky',
  },
  {
    id: 12,
    title: 'Sunroom',
    genre: 'Comedy',
    releaseYear: 2026,
    rating: '7.9',
    poster: posterUrl('photo-1470252649378-9c29740c9fa8'),
    posterAlt: 'Warm late sunlight over a quiet field',
  },
  {
    id: 13,
    title: 'The Hollow Guest',
    genre: 'Horror',
    releaseYear: 2025,
    rating: '7.6',
    poster: posterUrl('photo-1500530855697-b586d89ba3ee'),
    posterAlt: 'A shadowed trail fading into a remote landscape',
  },
  {
    id: 14,
    title: 'Letters to June',
    genre: 'Romance',
    releaseYear: 2024,
    rating: '7.9',
    poster: posterUrl('photo-1470252649378-9c29740c9fa8'),
    posterAlt: 'Soft evening light across a quiet countryside',
  },
  {
    id: 15,
    title: 'Small Worlds',
    genre: 'Animation',
    releaseYear: 2026,
    rating: '8.2',
    poster: posterUrl('photo-1500534623283-312aade485b7'),
    posterAlt: 'Colorful layers of mountains beneath a bright sky',
  },
  {
    id: 16,
    title: 'The Quiet Canopy',
    genre: 'Documentary',
    releaseYear: 2025,
    rating: '8.5',
    poster: posterUrl('photo-1448375240586-882707db888b'),
    posterAlt: 'Sunlight filtering through a dense green forest',
  },
]

export const movieCatalog = [featuredMovie, ...supportingMovies].map((movie) => ({
  ...movie,
  ...movieDetailsById[movie.id],
  backdrop: movie.backdrop ?? movie.poster,
  backdropAlt: movie.backdropAlt ?? movie.posterAlt,
}))

export const contentCatalog = [...movieCatalog, ...tvShowCatalog]

export const homeMovieRows = [
  {
    id: 'popular',
    title: 'Popular this week',
    movies: movieCatalog.slice(0, 8),
  },
  {
    id: 'new-arrivals',
    title: 'New arrivals',
    movies: movieCatalog.filter((movie) => movie.releaseYear >= 2025),
  },
  {
    id: 'science-fiction',
    title: 'Beyond the known',
    movies: movieCatalog.filter((movie) => movie.genre === 'Science Fiction'),
  },
  {
    id: 'thrillers',
    title: 'After hours',
    movies: movieCatalog.filter((movie) => movie.genre === 'Thriller' || movie.genre === 'Mystery'),
  },
]

export function buildHomeMovieRows(movies) {
  return [
    { id: 'popular', title: 'Popular this week', movies: movies.slice(0, 8) },
    { id: 'new-arrivals', title: 'New arrivals', movies: movies.filter((movie) => movie.releaseYear >= 2025) },
    { id: 'science-fiction', title: 'Beyond the known', movies: movies.filter((movie) => movie.genre === 'Science Fiction') },
    {
      id: 'thrillers',
      title: 'After hours',
      movies: movies.filter((movie) => movie.genre === 'Thriller' || movie.genre === 'Mystery'),
    },
  ]
}