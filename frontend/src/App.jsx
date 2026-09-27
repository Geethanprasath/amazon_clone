import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoutePlaceholder from './pages/RoutePlaceholder.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const MoviesPage = lazy(() => import('./pages/MoviesPage.jsx'))
const TvShowsPage = lazy(() => import('./pages/TvShowsPage.jsx'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'))
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'))
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'))
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage.jsx'))
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage.jsx'))

function LazyPage({ Page }) {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
      <Page />
    </Suspense>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LazyPage Page={HomePage} />} />
        <Route path="movies" element={<LazyPage Page={MoviesPage} />} />
        <Route path="tv-shows" element={<LazyPage Page={TvShowsPage} />} />
        <Route path="categories" element={<LazyPage Page={CategoriesPage} />} />
        <Route path="categories/:categorySlug" element={<LazyPage Page={CategoryPage} />} />
        <Route path="search" element={<LazyPage Page={SearchPage} />} />
        <Route path="movie/:id" element={<LazyPage Page={MovieDetailsPage} />} />
        <Route path="watch/:id" element={<LazyPage Page={VideoPlayerPage} />} />
        <Route path="login" element={<LazyPage Page={LoginPage} />} />
        <Route path="signup" element={<LazyPage Page={SignupPage} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="watchlist" element={<LazyPage Page={WatchlistPage} />} />
          <Route path="profile" element={<LazyPage Page={ProfilePage} />} />
        </Route>
        <Route path="*" element={<RoutePlaceholder title="Page not found" />} />
      </Route>
    </Routes>
  )
}

export default App
