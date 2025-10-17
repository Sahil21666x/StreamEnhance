import { useState, useEffect } from 'react'
import { getStreams, createStream, startStream } from '../services/api'

function StreamManager() {
  const [streams, setStreams] = useState([])
  const [formData, setFormData] = useState({
    label: '',
    rtspUrl: '',
    transcoding: { type: 'hls', hlsPath: '/streams/stream.m3u8' }
  })

  useEffect(() => {
    loadStreams()
  }, [])

  const loadStreams = async () => {
    try {
      const data = await getStreams()
      console.log(data,'streams data');
      
      setStreams(data)
    } catch (error) {
      console.error('Failed to load streams:', error)
    }
  }

  const handleCreate = async () => {
    try {
      await createStream(formData)
      loadStreams()
      setFormData({
        label: '',
        rtspUrl: '',
        transcoding: { type: 'hls', hlsPath: '/streams/stream.m3u8' }
      })
    } catch (error) {
      console.error('Failed to create stream:', error)
    }
  }

  const handleStart = async (id) => {
    try {
    const res =  await startStream(id)
    console.log(res);
    
      alert('Stream transcoding started!')
    } catch (error) {
      console.error('Failed to start stream:', error)
      alert('Failed to start stream')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Stream</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Stream Label:</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Main Camera"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">RTSP URL:</label>
            <input
              type="text"
              value={formData.rtspUrl}
              onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
              placeholder="rtsp://username:password@ip:port/path"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
            />
            <p className="text-sm text-gray-400 mt-1">
              Example: rtsp://admin:password@192.168.1.100:554/stream1
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add Stream
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Configured Streams</h2>
        <div className="space-y-3">
          {streams.map((stream) => (
            <div key={stream._id} className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <div className="font-semibold">{stream.label}</div>
                <div className="text-sm text-gray-400">
                  RTSP: {stream.rtspUrl}
                </div>
              </div>
              <button
                onClick={() => handleStart(stream._id)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Start Transcoding
              </button>
            </div>
          ))}
          {streams.length === 0 && (
            <p className="text-gray-400">No streams configured yet.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Quick Test</h2>
        <p className="text-gray-400 mb-4">
          You can test with a sample RTSP stream. Many IP cameras and streaming services provide test RTSP URLs.
        </p>
        <p className="text-sm text-gray-500">
          Note: Make sure your RTSP source is accessible from this server.
        </p>
      </div>
    </div>
  )
}

export default StreamManager
