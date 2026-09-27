import { useEffect, useState } from 'react'

import { AppContext } from './AppContext.js'
import { categories as demoCategories } from '../data/categories.js'
import { movieCatalog as demoMovies } from '../data/movieCatalog.js'
import {
  clearAuthTokens,
  fetchProfile,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/authService.js'
import { fetchCatalog } from '../services/catalogService.js'

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem('streamx_access')))
  const [movies, setMovies] = useState(demoMovies)
  const [categories, setCategories] = useState(demoCategories)
  const [catalogStatus, setCatalogStatus] = useState('loading')
  const [catalogError, setCatalogError] = useState('')
  const [catalogRevision, setCatalogRevision] = useState(0)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    fetchCatalog(controller.signal)
      .then((catalog) => {
        if (!active) return
        setMovies(catalog.movies)
        setCategories(catalog.categories)
        setCatalogStatus('api')
        setCatalogError('')
      })
      .catch(() => {
        if (!active) return
        setCatalogStatus('demo')
        setCatalogError('The catalog service is unavailable. Showing the demo collection.')
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [catalogRevision])

  useEffect(() => {
    if (!localStorage.getItem('streamx_access')) return undefined

    let active = true
    fetchProfile()
      .then((profile) => {
        if (active) setUser(profile)
      })
      .catch(() => clearAuthTokens())
      .finally(() => {
        if (active) setAuthLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function signIn(credentials) {
    const profile = await loginUser(credentials)
    setUser(profile)
    return profile
  }

  async function signUp(credentials) {
    await registerUser(credentials)
    return signIn({ username: credentials.username, password: credentials.password })
  }

  async function signOut() {
    try {
      await logoutUser()
    } catch {
      clearAuthTokens()
    } finally {
      setUser(null)
      setWatchlist([])
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        signIn,
        signUp,
        signOut,
        watchlist,
        setWatchlist,
        searchQuery,
        setSearchQuery,
        movies,
        categories,
        catalogStatus,
        catalogError,
        refreshCatalog: () => setCatalogRevision((revision) => revision + 1),
      }}
    >
      {children}
    </AppContext.Provider>
  )
}