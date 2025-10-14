import { useState, useEffect } from 'react'
import VideoPlayer from './components/VideoPlayer'
import OverlayEditor from './components/OverlayEditor'
import StreamManager from './components/StreamManager'
import { getOverlays } from './services/api'

function App() {
  const [overlays, setOverlays] = useState([])
  const [activeTab, setActiveTab] = useState('player')

  useEffect(() => {
    loadOverlays()
  }, [])

  const loadOverlays = async () => {
    try {
      const data = await getOverlays()
      setOverlays(data)
    } catch (error) {
      console.error('Failed to load overlays:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">RTSP Livestream Overlay Manager</h1>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-4 py-2 rounded ${activeTab === 'player' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Player
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded ${activeTab === 'editor' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Overlay Editor
          </button>
          <button
            onClick={() => setActiveTab('streams')}
            className={`px-4 py-2 rounded ${activeTab === 'streams' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Stream Manager
          </button>
        </div>
      </header>

      <main className="p-4">
        {activeTab === 'player' && <VideoPlayer overlays={overlays} onOverlayUpdate={loadOverlays} />}
        {activeTab === 'editor' && <OverlayEditor overlays={overlays} onUpdate={loadOverlays} />}
        {activeTab === 'streams' && <StreamManager />}
      </main>
    </div>
  )
}

export default App
