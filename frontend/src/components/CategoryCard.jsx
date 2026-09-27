import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/categories/${category.slug}`}>
      {category.image && (
        <img
          className="category-card__image"
          src={category.image}
          alt={category.imageAlt}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="category-card__shade" aria-hidden="true" />
      <span className="category-card__content">
        <span className="category-card__count">{category.count} titles</span>
        <span className="category-card__title">{category.name}</span>
        <span className="category-card__description">{category.description}</span>
      </span>
      <span className="category-card__arrow" aria-hidden="true">
        <ArrowUpRight size={19} />
      </span>
    </Link>
  )
}