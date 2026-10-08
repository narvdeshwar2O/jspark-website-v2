import { useEffect, useRef } from 'react'
import { opsvisionProgress } from '../animations/opsvisionProgress'

export default function OpsVisionStage({ registerEl }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let targetTime = 0
    let isSeeking = false

    const updateVideo = () => {
      if (isSeeking || Math.abs(video.currentTime - targetTime) < 0.01) return
      isSeeking = true
      video.currentTime = targetTime
    }

    const onSeeked = () => {
      isSeeking = false
      if (Math.abs(video.currentTime - targetTime) >= 0.01) {
        window.requestAnimationFrame(updateVideo)
      }
    }

    video.addEventListener('seeked', onSeeked)

    const applyProgress = (p) => {
      if (Number.isNaN(video.duration) || video.duration === 0) return
      targetTime = p * video.duration
      window.requestAnimationFrame(updateVideo)
    }

    const unsubscribe = opsvisionProgress.subscribe(applyProgress)

    const onLoadedMetadata = () => {
      applyProgress(opsvisionProgress.value)
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

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
          src="/assets/opsvision_long.mp4"
          muted
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="stage__vignette" ref={registerEl('vignette')} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-black/20 to-black/40 z-[2]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/40 z-[2]" />
    </div>
  )
}
