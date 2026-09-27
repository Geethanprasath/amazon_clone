import { useState } from 'react'
import { Bookmark, Menu, Play, Search, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import ProfileMenu from './ProfileMenu.jsx'

const navigationItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Movies', to: '/movies' },
  { label: 'TV Shows', to: '/tv-shows' },
  { label: 'Categories', to: '/categories' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="StreamX home">
          <span className="brand__mark" aria-hidden="true">
            <Play size={17} fill="currentColor" strokeWidth={1.5} />
          </span>
          <span className="brand__word">Stream<span>X</span></span>
        </Link>

        <nav
          className={`primary-nav${menuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {navigationItems.map(({ label, to, end }) => (
            <NavLink
              className={({ isActive }) => `primary-nav__link${isActive ? ' is-active' : ''}`}
              end={end}
              key={to}
              onClick={() => setMenuOpen(false)}
              to={to}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) => `primary-nav__mobile-link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
            to="/watchlist"
          >
            <Bookmark size={17} aria-hidden="true" />
            Watchlist
          </NavLink>
        </nav>

        <div className="header-actions">
          <NavLink
            className="header-action"
            onClick={() => setMenuOpen(false)}
            to="/search"
            aria-label="Search"
          >
            <Search size={19} aria-hidden="true" />
            <span>Search</span>
          </NavLink>
          <NavLink
            className="header-action header-action--watchlist"
            onClick={() => setMenuOpen(false)}
            to="/watchlist"
          >
            <Bookmark size={18} aria-hidden="true" />
            <span>Watchlist</span>
          </NavLink>
          <ProfileMenu />
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  )
}