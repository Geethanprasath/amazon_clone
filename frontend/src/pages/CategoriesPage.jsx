import CategoryCard from '../components/CategoryCard.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { useAppContext } from '../context/useAppContext.js'

export default function CategoriesPage() {
  const { categories, catalogError, refreshCatalog } = useAppContext()

  return (
    <main className="collection-page">
      <header className="collection-page__header">
        <div>
          <p className="collection-page__eyebrow">FIND YOUR MOOD</p>
          <h1 className="collection-page__title">Categories</h1>
          <p className="collection-page__description">
            Pick a direction. There is always another story waiting.
          </p>
        </div>
      </header>
      {catalogError && <ErrorMessage message={catalogError} onRetry={refreshCatalog} />}
      {categories.length > 0 ? (
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      ) : (
        <p className="collection-empty" role="status">No categories are available yet.</p>
      )}
    </main>
  )
}