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
    <div className="opsvision__stage" ref={registerEl('stage')} aria-hidden="true">
      {/* Single Unified Card holding both the Video on left and Ontology console on right */}
      <div className="opsvision__video-frame" ref={registerEl('frame')}>
        {/* Subtle corner brackets */}
        {/* <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF5722] z-20 pointer-events-none opacity-80" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FF5722] z-20 pointer-events-none opacity-80" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FF5722] z-20 pointer-events-none opacity-80" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FF5722] z-20 pointer-events-none opacity-80" /> */}

        {/* Top status indicator tag */}
        {/* <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-2 px-2.5 py-1 rounded bg-black/75 border border-white/10 backdrop-blur-md shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider text-zinc-300 font-medium uppercase">OPSVISION // ONTOLOGY FEED</span>
        </div> */}

        {/* Left Video Area with Top Titlebar and Bottom Telemetry Strip */}
        <div className="opsvision__frame-media" ref={registerEl('frameMedia')}>
          {/* Top Titlebar */}
          <div className="opsvision__console-titlebar">
            <span className="font-mono text-[11px] font-semibold text-zinc-300 tracking-wider uppercase">
              OPSVISION · STATEWIDE ONTOLOGY · LIVE
            </span>
            <span className="w-1.5 h-1.5 bg-[#FF5722] shadow-[0_0_8px_#FF5722] animate-pulse" />
          </div>

          {/* Video Canvas */}
          <div className="opsvision__video-canvas" ref={registerEl('canvas')}>
            <video
              ref={videoRef}
              src="/assets/opsvision_long.mp4"
              muted
              playsInline
              preload="auto"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="stage__vignette opacity-20 pointer-events-none" ref={registerEl('vignette')} />

          {/* Bottom Telemetry Strip */}
          <div className="opsvision__console-strip">
            <div className="flex items-center justify-between w-full h-full px-4 text-zinc-300 font-mono text-[11px]">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722] animate-pulse shrink-0" />
                <span className="tracking-wider">
                  DISTRICTS <span className="text-white font-bold">75 LIVE</span>
                </span>
                <span className="text-zinc-600">/</span>
                <span className="tracking-wider">
                  INGEST RATE <span className="text-white font-bold">100K+ / s</span>
                </span>
              </div>
              <div className="text-[#FF5722] font-bold text-[10px] tracking-[0.2em] shrink-0 uppercase">
                SOVEREIGN INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Exact Hydra-style status column */}
        <div className="opsvision__frame-sidebar" ref={registerEl('panel')}>
          <div className="opsvision__single-card-inner">
            {/* Header Badge Box with balanced padding and tactical corner accents */}
            <div className="relative p-3.5 mb-2.5 bg-gradient-to-br from-[#FF5722]/10 via-[#FF5722]/5 to-transparent border border-[#FF5722]/20 rounded-lg">
              {/* Tactical Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5722] opacity-80" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF5722] opacity-80" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5722] opacity-80" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5722] opacity-80" />

              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 bg-[#FF5722] rounded-full shadow-[0_0_8px_#FF5722] animate-pulse shrink-0" />
                <span className="text-[#FF5722] font-mono text-[10px] tracking-widest font-bold">SOVEREIGN INTELLIGENCE</span>
              </div>
              <div className="text-2xl lg:text-[26px] font-black tracking-tight text-white leading-tight">
                OpsVision Ontology
              </div>
              <div className="text-zinc-400 font-mono text-[9.5px] tracking-wider uppercase mt-2">
                STATEWIDE LIVING MODEL · 75 DISTRICTS
              </div>
            </div>

            <hr className="rule my-1.5" style={{ borderColor: 'rgba(255,87,34,0.15)' }} />

            {/* Figures Grid (2x2 layout with rich NCRB and UP112 telemetry details) */}
            <div className="grid grid-cols-2 gap-2.5 my-2">
              {/* UP 112 CAD Real-Time Dispatch Box */}
              <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-lg hover:border-[#FF5722]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">UP 112 CAD</span>
                  <span className="text-[9px] font-mono text-[#FF5722] font-bold px-1 py-0.5 rounded bg-[#FF5722]/10 border border-[#FF5722]/20">LIVE</span>
                </div>
                <div className="text-2xl font-black text-white font-mono leading-none tracking-tight">1.5 L+</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">daily emergency calls</div>
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                  <div className="flex justify-between"><span>DISPATCH:</span> <span className="text-zinc-300 font-bold">&lt; 8 min</span></div>
                  <div className="flex justify-between"><span>MDTS ACTIVE:</span> <span className="text-zinc-300 font-bold">4,800+</span></div>
                </div>
              </div>

              {/* NCRB CCTNS Criminal Intelligence Box */}
              <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-lg hover:border-[#FF5722]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">NCRB / CCTNS</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">SYNC</span>
                </div>
                <div className="text-2xl font-black text-white font-mono leading-none tracking-tight">1 CR+</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">criminal dossiers</div>
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                  <div className="flex justify-between"><span>MATCH TIME:</span> <span className="text-zinc-300 font-bold">&lt; 5 sec</span></div>
                  <div className="flex justify-between"><span>THREAT INDEX:</span> <span className="text-zinc-300 font-bold">99.8%</span></div>
                </div>
              </div>

              {/* Statewide Coverage */}
              <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-lg hover:border-[#FF5722]/40 transition-colors">
                <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">STATEWIDE REACH</div>
                <div className="text-2xl font-black text-white font-mono leading-none tracking-tight mt-1">24 CR+</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">citizens protected</div>
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                  <div className="flex justify-between"><span>JURISDICTION:</span> <span className="text-zinc-300 font-bold">75 Districts</span></div>
                  <div className="flex justify-between"><span>POLICE STATIONS:</span> <span className="text-zinc-300 font-bold">1,526 PS</span></div>
                </div>
              </div>

              {/* High-Velocity Sensor Fusion */}
              <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-lg hover:border-[#FF5722]/40 transition-colors">
                <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">INGEST FUSION</div>
                <div className="text-2xl font-black text-white font-mono leading-none tracking-tight mt-1">100K+</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">events / sec ingested</div>
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                  <div className="flex justify-between"><span>AIR-GAP AUDIT:</span> <span className="text-emerald-400 font-bold">VERIFIED</span></div>
                  <div className="flex justify-between"><span>ENCRYPTION:</span> <span className="text-zinc-300 font-bold">AES-256</span></div>
                </div>
              </div>
            </div>

            <hr className="rule my-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            {/* Event Log Lines */}
            <div className="flex flex-col gap-1.5 font-mono text-[10px] text-zinc-400 py-1">
              <div className="truncate flex items-center justify-between">
                <div><span className="text-[#FF5722]">14:31</span> · UP 112 CAD DISPATCH SYNCED</div>
                <span className="text-[9px] text-zinc-500">75/75 DIST</span>
              </div>
              <div className="truncate flex items-center justify-between">
                <div><span className="text-[#FF5722]">14:35</span> · NCRB CCTNS DOSSIER MATCHED</div>
                <span className="text-[9px] text-emerald-400">1 CR DB</span>
              </div>
              <div className="truncate flex items-center justify-between">
                <div><span className="text-[#FF5722]">14:42</span> · HOTSPOT PREDICTIVE ROUTED</div>
                <span className="text-[9px] text-zinc-500">&lt; 8 MIN</span>
              </div>
              <div className="truncate flex items-center justify-between">
                <div><span className="text-[#FF5722]">14:48</span> · STATEWIDE AIR-GAP AUDIT OK</div>
                <span className="text-[9px] text-emerald-400">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
