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

    const onCanPlayThrough = () => {
      loadProgress.report('prefly', 1)
    }

    video.addEventListener('progress', checkBuffer)
    video.addEventListener('loadeddata', checkBuffer)
    video.addEventListener('canplaythrough', onCanPlayThrough)

    // Fallback timer for the video itself if network is slow
    const videoFallback = setTimeout(() => {
      loadProgress.report('prefly', 1)
    }, 6000)

    return () => {
      clearTimeout(videoFallback)
      video.removeEventListener('progress', checkBuffer)
      video.removeEventListener('loadeddata', checkBuffer)
      video.removeEventListener('canplaythrough', onCanPlayThrough)
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

    const updateVideo = () => {
      // Don't seek if we are currently seeking or already at the right time
      if (isSeeking || Math.abs(video.currentTime - targetTime) < 0.01) return

      isSeeking = true
      if (typeof video.fastSeek === 'function') {
        video.fastSeek(targetTime)
      } else {
        video.currentTime = targetTime
      }
    }

    const onSeeked = () => {
      isSeeking = false
      // If the target time moved further while we were decoding, seek again immediately
      if (Math.abs(video.currentTime - targetTime) >= 0.01) {
        window.requestAnimationFrame(updateVideo)
      }
    }

    video.addEventListener('seeked', onSeeked)

    const applyProgress = (p) => {
      if (Number.isNaN(video.duration) || video.duration === 0) return
      // The video has a fade-to-black outro in its last second (49.5s - 50.4s).
      // Clamp effective scrub duration to 49.0s so the user ends on the crisp, vibrant scenic frame
      const effectiveDuration = Math.min(49.0, Math.max(0, video.duration - 1.4))
      targetTime = p * effectiveDuration
      window.requestAnimationFrame(updateVideo)
    }

    const unsubscribe = hydraProgress.subscribe(applyProgress)

    // Apply progress immediately when metadata loads (duration is known)
    const onLoadedMetadata = () => {
      applyProgress(hydraProgress.value)
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    // Ensure video is paused so it only plays via scrubbing
    video.pause()

    return () => {
      unsubscribe()
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
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="stage__vignette" ref={registerEl('vignette')} />
      <div className="stage__credits" />
    </div>
  )
}
