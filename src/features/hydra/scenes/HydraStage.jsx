import { useEffect, useRef } from 'react'
import { hydraProgress } from '../animations/hydraProgress'
import { loadProgress } from '../../../shared/animations/loadProgress'
import './HydraStage.css'

export default function HydraStage({ registerEl, onCaptureReady }) {
  const videoRef = useRef(null)

  // Report to LoadGate that the "3D" objects are loaded so it opens
  useEffect(() => {
    loadProgress.report('prefly', 1)
    loadProgress.report('objects', 1)
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
      video.currentTime = targetTime
    }

    const onSeeked = () => {
      isSeeking = false
      // If the target time moved further while we were decoding, seek again immediately
      if (Math.abs(video.currentTime - targetTime) >= 0.01) {
        requestAnimationFrame(updateVideo)
      }
    }

    video.addEventListener('seeked', onSeeked)

    const applyProgress = (p) => {
      if (Number.isNaN(video.duration) || video.duration === 0) return
      // Scrub video time based on scroll progress (0 to 1)
      targetTime = p * video.duration
      requestAnimationFrame(updateVideo)
    }

    const unsubscribe = hydraProgress.subscribe(applyProgress)
    
    // Apply progress immediately when metadata loads (duration is known)
    const onLoadedMetadata = () => {
      applyProgress(hydraProgress.value)
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    // Also attempt applying every time progress changes.
    // Ensure video is paused so it only plays via scrubbing.
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
          src="/assets/video.mp4" 
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
