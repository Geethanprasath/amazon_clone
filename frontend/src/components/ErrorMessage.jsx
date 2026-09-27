export default function ErrorMessage({ message, onRetry, retryLabel = 'Try again' }) {
  return (
    <section className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="error-message__retry" type="button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </section>
  )
}