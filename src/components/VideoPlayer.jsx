import { useRef, useEffect, useState } from 'react'
import Hls from 'hls.js'
import OverlayCanvas from './OverlayCanvas'

function VideoPlayer({ overlays, onOverlayUpdate }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [hlsUrl, setHlsUrl] = useState('http://localhost:8000/api/v1/streams/output/stream.m3u8')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(videoRef.current)
       hls.startLoad();

      return () => {
        hls.destroy()
      }
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = hlsUrl
    }
  }, [hlsUrl])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4">
        <label className="block mb-2">HLS Stream URL:</label>
        <input
          type="text"
          value={hlsUrl}
          onChange={(e) => setHlsUrl(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
        />
      </div>

      <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          className="w-full h-full"
          controls={false}
        />
        
        <OverlayCanvas 
          overlays={overlays} 
          onUpdate={onOverlayUpdate}
          containerRef={containerRef}
        />
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className="flex items-center gap-2">
          <span>Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-32"
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
