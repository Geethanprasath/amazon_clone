import { Search, X } from 'lucide-react'

import { useAppContext } from '../context/useAppContext.js'

export default function SearchBar({ autoFocus = false }) {
  const { searchQuery, setSearchQuery } = useAppContext()

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form className="search-field" role="search" aria-label="Search the catalog" onSubmit={handleSubmit}>
      <Search size={20} aria-hidden="true" />
      <label className="visually-hidden" htmlFor="catalog-search">Search titles and genres</label>
      <input
        id="catalog-search"
        type="search"
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Search titles, genres, or series"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      {searchQuery && (
        <button
          className="search-field__clear"
          type="button"
          aria-label="Clear search"
          title="Clear search"
          onClick={() => setSearchQuery('')}
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </form>
  )
}