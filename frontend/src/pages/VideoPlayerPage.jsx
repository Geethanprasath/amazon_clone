import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Captions,
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext.js'
import { tvShowCatalog } from '../data/tvShowCatalog.js'

const demoVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const wholeSeconds = Math.floor(seconds)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${remainingSeconds}`
  }

  return `${minutes}:${remainingSeconds}`
}

export default function VideoPlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const { movies } = useAppContext()
  const contentCatalog = [...movies, ...tvShowCatalog]
  const movie = contentCatalog.find((item) => String(item.id) === id)
  const movieIndex = contentCatalog.findIndex((item) => String(item.id) === id)
  const nextMovie = contentCatalog[(movieIndex + 1) % contentCatalog.length]
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(document.fullscreenElement === playerRef.current)
    }

    document.addEventListener('fullscreenchange', syncFullscreenState)
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState)
  }, [])

  if (!movie) {
    return (
      <main className="movie-not-found">
        <p className="movie-detail__eyebrow">STREAMX / PLAYER UNAVAILABLE</p>
        <h1>We could not find that title.</h1>
        <Link className="hero-button hero-button--play" to="/movies">Browse movies</Link>
      </main>
    )
  }

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => setError('Playback could not start. Try again.'))
    } else {
      video.pause()
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current
    if (!video) return

    setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    video.volume = volume
    const captionTrack = video.textTracks[0]
    if (captionTrack) captionTrack.mode = captionsEnabled ? 'showing' : 'hidden'
  }

  function handleSeek(event) {
    const nextTime = Number(event.target.value)
    if (videoRef.current) videoRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function handleVolumeChange(event) {
    const nextVolume = Number(event.target.value)
    if (videoRef.current) {
      videoRef.current.volume = nextVolume
      videoRef.current.muted = nextVolume === 0
    }
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function toggleCaptions() {
    const nextEnabled = !captionsEnabled
    const captionTrack = videoRef.current?.textTracks[0]
    if (captionTrack) captionTrack.mode = nextEnabled ? 'showing' : 'hidden'
    setCaptionsEnabled(nextEnabled)
  }

  function handlePlaybackRateChange(event) {
    const nextRate = Number(event.target.value)
    if (videoRef.current) videoRef.current.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }

  async function toggleFullscreen() {
    const player = playerRef.current
    if (!player) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await player.requestFullscreen()
      }
    } catch {
      setError('Fullscreen is not available in this browser.')
    }
  }

  function playNextEpisode() {
    if (nextMovie) navigate(`/watch/${nextMovie.id}`)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <main className="video-page">
      <header className="video-page__header">
        <Link className="video-page__back" to={`/movie/${movie.id}`}>
          <ArrowLeft size={17} aria-hidden="true" />
          Back to title
        </Link>
        <div className="video-page__heading">
          <p>NOW PLAYING</p>
          <h1>{movie.title}</h1>
        </div>
      </header>

      <div className="video-player" ref={playerRef}>
        <video
          aria-label={`Demo video for ${movie.title}`}
          className="video-player__media"
          onCanPlay={() => setError('')}
          onDurationChange={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={() => setError('The demo video could not be loaded. Check your connection and retry.')}
          onLoadedMetadata={handleLoadedMetadata}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          poster={movie.backdrop ?? movie.poster}
          preload="metadata"
          playsInline
          ref={videoRef}
          src={movie.videoUrl || demoVideoUrl}
          tabIndex={0}
        >
          <track
            kind="captions"
            label="English"
            src="/demo-captions.vtt"
            srcLang="en"
          />
        </video>

        {error && <p className="video-player__error" role="alert">{error}</p>}

        <div className="video-controlbar" aria-label="Video controls">
          <input
            className="video-controlbar__progress"
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            style={{ '--progress': `${progress}%` }}
            aria-label="Seek video"
            onChange={handleSeek}
          />
          <div className="video-controlbar__bottom">
            <div className="video-controlbar__group">
              <button
                className="video-control"
                type="button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>
              <span className="video-controlbar__time">
                {formatTime(currentTime)} <span>/</span> {formatTime(duration)}
              </span>
              <button
                className="video-control video-control--volume"
                type="button"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
              <input
                className="video-controlbar__volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                aria-label="Volume"
                onChange={handleVolumeChange}
              />
            </div>
            <div className="video-controlbar__group video-controlbar__group--right">
              <select
                className="video-controlbar__select"
                value={playbackRate}
                aria-label="Playback speed"
                onChange={handlePlaybackRateChange}
              >
                {playbackRates.map((rate) => (
                  <option key={rate} value={rate}>{rate === 1 ? '1x' : `${rate}x`}</option>
                ))}
              </select>
              <button
                className={`video-control${captionsEnabled ? ' is-active' : ''}`}
                type="button"
                aria-label={captionsEnabled ? 'Turn captions off' : 'Turn captions on'}
                aria-pressed={captionsEnabled}
                title={captionsEnabled ? 'Captions on' : 'Captions off'}
                onClick={toggleCaptions}
              >
                <Captions size={20} />
              </button>
              <label className="video-controlbar__quality">
                <span className="visually-hidden">Video quality</span>
                <select value="source" aria-label="Video quality" disabled title="The demo clip provides one quality source.">
                  <option value="source">Source</option>
                </select>
              </label>
              <button
                className="video-control video-control--next"
                type="button"
                aria-label={`Play next episode: ${nextMovie?.title ?? 'next title'}`}
                title={`Next episode: ${nextMovie?.title ?? 'next title'}`}
                onClick={playNextEpisode}
                disabled={!nextMovie}
              >
                <SkipForward size={19} />
                <span>Next episode</span>
              </button>
              <button
                className="video-control"
                type="button"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="video-page__details">
        <div>
          <p>{movie.genre} <span>/</span> {movie.releaseYear} <span>/</span> {movie.duration}</p>
          <h2>{movie.title}</h2>
        </div>
        <p>{movie.description}</p>
      </div>
    </main>
  )
}