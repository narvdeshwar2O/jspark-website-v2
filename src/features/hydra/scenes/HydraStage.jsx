import { useEffect, useRef } from 'react'
import { hydraProgress } from '../animations/hydraProgress'
import { loadProgress } from '../../../shared/animations/loadProgress'
import './HydraStage.css'

export default function HydraStage({ registerEl, onCaptureReady }) {
  const videoRef = useRef(null)

  // Track video buffer progress so LoadGate holds until the hero video is sufficiently buffered (~70%)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Immediately mark objects as ready
    loadProgress.report('objects', 1)

    // iOS WebKit requires play() call or user gesture / load() trigger
    video.muted = true
    video.defaultMuted = true
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('x5-playsinline', 'true')
    video.load()

    // iOS Low-power or background tab video touch-unlock
    const unlockVideo = () => {
      if (video.paused) {
        video.play().then(() => {
          video.pause()
        }).catch(() => {})
      }
      window.removeEventListener('touchstart', unlockVideo)
      window.removeEventListener('scroll', unlockVideo)
    }
    window.addEventListener('touchstart', unlockVideo, { passive: true })
    window.addEventListener('scroll', unlockVideo, { passive: true })

    const checkBuffer = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      if (video.buffered.length === 0) return

      // Calculate total buffered range starting from beginning
      let bufferedEnd = 0
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= 0.5) {
          bufferedEnd = Math.max(bufferedEnd, video.buffered.end(i))
        }
      }

      const ratio = bufferedEnd / video.duration
      // Scale 0.0 - 0.70 ratio to 0.0 - 1.0 of the prefly load progress
      const targetProgress = Math.min(1, ratio / 0.7)
      loadProgress.report('prefly', targetProgress)

      if (ratio >= 0.7) {
        loadProgress.report('prefly', 1)
      }
    }

    const onCanPlay = () => {
      loadProgress.report('prefly', 1)
    }

    const onLoadedData = () => {
      checkBuffer()
      loadProgress.report('prefly', 1)
    }

    video.addEventListener('progress', checkBuffer)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('loadedmetadata', onCanPlay)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onCanPlay)

    // Fallback timer: on iOS low power mode or slow cellular, never let LoadGate hang
    const videoFallback = setTimeout(() => {
      loadProgress.report('prefly', 1)
    }, 2500)

    return () => {
      clearTimeout(videoFallback)
      video.removeEventListener('progress', checkBuffer)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('loadedmetadata', onCanPlay)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('canplaythrough', onCanPlay)
    }
  }, [])

  useEffect(() => {
    // Provide capture hooks to satisfy Hydra.jsx's snapshot logic
    if (onCaptureReady) {
      onCaptureReady({
        capture: () => Promise.resolve(null),
        onTilesQuiet: (cb) => cb(),
        awaitRender: () => Promise.resolve(),
      })
    }
  }, [onCaptureReady])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let targetTime = 0
    let isSeeking = false
    let rafId = null

    // Helper to safely seek across Safari and Chromium
    const updateVideo = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      if (isSeeking) return
      if (Math.abs(video.currentTime - targetTime) < 0.03) return

      isSeeking = true
      try {
        video.currentTime = targetTime
      } catch {
        isSeeking = false
      }
    }

    const onSeeked = () => {
      isSeeking = false
      if (Math.abs(video.currentTime - targetTime) >= 0.03) {
        if (rafId) window.cancelAnimationFrame(rafId)
        rafId = window.requestAnimationFrame(updateVideo)
      }
    }

    video.addEventListener('seeked', onSeeked)

    const applyProgress = (p) => {
      if (Number.isNaN(video.duration) || video.duration === 0) return
      // Clamp effective scrub duration to 49.0s to avoid outro fade-to-black
      const effectiveDuration = Math.min(49.0, Math.max(0, video.duration - 1.4))
      targetTime = p * effectiveDuration
      if (rafId) window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(updateVideo)
    }

    const unsubscribe = hydraProgress.subscribe(applyProgress)

    const onLoadedMetadata = () => {
      applyProgress(hydraProgress.value)
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    // Ensure muted & pause on mobile
    video.muted = true
    video.pause()

    return () => {
      unsubscribe()
      if (rafId) window.cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [])

  return (
    <div className="stage" ref={registerEl('stage')} aria-hidden="true">
      <div className="stage__canvas" ref={registerEl('canvas')}>
        <video
          ref={videoRef}
          src="/assets/1.mp4"
          muted
          autoPlay={false}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="stage__vignette" ref={registerEl('vignette')} />
      <div className="stage__credits" />
    </div>
  )
}
