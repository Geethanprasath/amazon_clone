export default function RoutePlaceholder({ title }) {
  return (
    <main className="route-placeholder">
      <p className="route-placeholder__eyebrow">STREAMX / {title.toUpperCase()}</p>
      <h1>{title}</h1>
      <span className="route-placeholder__rule" aria-hidden="true" />
    </main>
  )
}