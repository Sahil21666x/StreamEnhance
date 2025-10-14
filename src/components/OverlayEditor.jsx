import { useState } from 'react'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { createOverlay, updateOverlay, deleteOverlay } from '../services/api'
import 'react-resizable/css/styles.css'

function OverlayEditor({ overlays, onUpdate }) {
  const [selectedOverlay, setSelectedOverlay] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    content: { text: 'Sample Text', src: '' },
    position: { x: 50, y: 50 },
    size: { width: 200, height: 100 },
    zIndex: 10,
    visible: true,
    styles: { fontSize: 24, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' }
  })

  const handleCreate = async () => {
    try {
      await createOverlay(formData)
      onUpdate()
      resetForm()
    } catch (error) {
      console.error('Failed to create overlay:', error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedOverlay) return
    try {
      await updateOverlay(selectedOverlay._id, formData)
      onUpdate()
      resetForm()
    } catch (error) {
      console.error('Failed to update overlay:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteOverlay(id)
      onUpdate()
      if (selectedOverlay?._id === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Failed to delete overlay:', error)
    }
  }

  const resetForm = () => {
    setSelectedOverlay(null)
    setFormData({
      name: '',
      type: 'text',
      content: { text: 'Sample Text', src: '' },
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      zIndex: 10,
      visible: true,
      styles: { fontSize: 24, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' }
    })
  }

  const selectOverlay = (overlay) => {
    setSelectedOverlay(overlay)
    setFormData({
      name: overlay.name,
      type: overlay.type,
      content: overlay.content,
      position: overlay.position,
      size: overlay.size,
      zIndex: overlay.zIndex,
      visible: overlay.visible,
      styles: overlay.styles
    })
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          {selectedOverlay ? 'Edit Overlay' : 'Create New Overlay'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Type:</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          {formData.type === 'text' ? (
            <>
              <div>
                <label className="block mb-1">Text:</label>
                <input
                  type="text"
                  value={formData.content.text}
                  onChange={(e) => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Font Size:</label>
                <input
                  type="number"
                  value={formData.styles.fontSize}
                  onChange={(e) => setFormData({ ...formData, styles: { ...formData.styles, fontSize: parseInt(e.target.value) } })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Text Color:</label>
                <input
                  type="color"
                  value={formData.styles.color}
                  onChange={(e) => setFormData({ ...formData, styles: { ...formData.styles, color: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block mb-1">Image URL:</label>
              <input
                type="text"
                value={formData.content.src}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, src: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">X Position (px):</label>
              <input
                type="number"
                value={formData.position.x}
                onChange={(e) => setFormData({ ...formData, position: { ...formData.position, x: parseInt(e.target.value) } })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Y Position (px):</label>
              <input
                type="number"
                value={formData.position.y}
                onChange={(e) => setFormData({ ...formData, position: { ...formData.position, y: parseInt(e.target.value) } })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Width (px):</label>
              <input
                type="number"
                value={formData.size.width}
                onChange={(e) => setFormData({ ...formData, size: { ...formData.size, width: parseInt(e.target.value) } })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Height (px):</label>
              <input
                type="number"
                value={formData.size.height}
                onChange={(e) => setFormData({ ...formData, size: { ...formData.size, height: parseInt(e.target.value) } })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {selectedOverlay ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreate}
                className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Create Overlay
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Saved Overlays</h2>
        <div className="space-y-2">
          {overlays.map((overlay) => (
            <div key={overlay._id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div>
                <div className="font-semibold">{overlay.name}</div>
                <div className="text-sm text-gray-400">{overlay.type}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => selectOverlay(overlay)}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(overlay._id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {overlays.length === 0 && (
            <p className="text-gray-400">No overlays created yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverlayEditor
