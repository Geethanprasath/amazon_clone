export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite" aria-busy="true">
      <span className="loading-state__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}