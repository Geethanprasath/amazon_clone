import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'

export default function ProtectedRoute() {
  const { user, authLoading } = useAppContext()
  const location = useLocation()

  if (authLoading) {
    return (
      <main className="protected-route-loading" role="status">
        Checking your session...
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}