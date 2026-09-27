import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link className="footer-brand" to="/" aria-label="StreamX home">
          Stream<span>X</span>
        </Link>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/movies">Movies</Link>
          <Link to="/tv-shows">TV Shows</Link>
          <Link to="/categories">Categories</Link>
        </nav>
        <p className="footer-copy">A fictional streaming experience | 2026</p>
      </div>
    </footer>
  )
}