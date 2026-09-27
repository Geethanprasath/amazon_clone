import { movieCatalog } from './movieCatalog.js'

const categoryDefinitions = [
  { slug: 'action', name: 'Action', genre: 'Action', description: 'High stakes, close calls, and no time to look back.' },
  { slug: 'comedy', name: 'Comedy', genre: 'Comedy', description: 'Sharp wit and lighter nights, all in one place.' },
  { slug: 'drama', name: 'Drama', genre: 'Drama', description: 'Characters and choices that stay with you.' },
  { slug: 'horror', name: 'Horror', genre: 'Horror', description: 'Unsettling stories for the brave after dark.' },
  { slug: 'sci-fi', name: 'Sci-Fi', genre: 'Science Fiction', description: 'New worlds, strange signals, and bigger questions.' },
  { slug: 'thriller', name: 'Thriller', genre: 'Thriller', description: 'Tense turns and mysteries that refuse to sit still.' },
  { slug: 'romance', name: 'Romance', genre: 'Romance', description: 'Unexpected meetings and stories about finding each other.' },
  { slug: 'animation', name: 'Animation', genre: 'Animation', description: 'Inventive worlds, brought to life frame by frame.' },
  { slug: 'documentary', name: 'Documentary', genre: 'Documentary', description: 'Real places and ideas worth a closer look.' },
]

export const categories = categoryDefinitions.map((category) => {
  const matchingMovies = movieCatalog.filter((movie) => movie.genre === category.genre)
  return {
    ...category,
    count: matchingMovies.length,
    image: matchingMovies[0]?.poster,
    imageAlt: matchingMovies[0]?.posterAlt,
  }
})