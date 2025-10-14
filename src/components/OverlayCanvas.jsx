import { useState } from 'react'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { updateOverlay } from '../services/api'
import 'react-resizable/css/styles.css'

function OverlayCanvas({ overlays, onUpdate, containerRef }) {
  const [editMode, setEditMode] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [localOverlays, setLocalOverlays] = useState({})

  const handleDragStop = async (overlay, e, data) => {
    const newPosition = { x: data.x, y: data.y }
    setLocalOverlays(prev => ({
      ...prev,
      [overlay._id]: { ...prev[overlay._id], position: newPosition }
    }))
    
    try {
      await updateOverlay(overlay._id, { position: newPosition })
      onUpdate()
    } catch (error) {
      console.error('Failed to update overlay position:', error)
    }
  }

  const handleResize = async (overlay, event, { size }) => {
    const newSize = { width: size.width, height: size.height }
    setLocalOverlays(prev => ({
      ...prev,
      [overlay._id]: { ...prev[overlay._id], size: newSize }
    }))
    
    try {
      await updateOverlay(overlay._id, { size: newSize })
      onUpdate()
    } catch (error) {
      console.error('Failed to update overlay size:', error)
    }
  }
  
  const getOverlayProps = (overlay) => {
    const local = localOverlays[overlay._id]
    return {
      position: local?.position || overlay.position,
      size: local?.size || overlay.size
    }
  }

  if (!overlays || overlays.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-2 right-2 z-50 pointer-events-auto">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1 rounded text-sm ${editMode ? 'bg-green-600' : 'bg-gray-600'}`}
        >
          {editMode ? 'Edit Mode: ON' : 'Edit Mode: OFF'}
        </button>
      </div>
      
      {overlays.filter(overlay => overlay.visible).map((overlay) => {
        const props = getOverlayProps(overlay)
        
        const OverlayContent = () => {
          if (overlay.type === 'text') {
            return (
              <div 
                style={{
                  ...overlay.styles,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {overlay.content.text}
              </div>
            )
          } else {
            return (
              <img 
                src={overlay.content.src} 
                alt={overlay.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )
          }
        }

        if (!editMode) {
          return (
            <div
              key={overlay._id}
              style={{
                position: 'absolute',
                left: props.position.x,
                top: props.position.y,
                width: props.size.width,
                height: props.size.height,
                zIndex: overlay.zIndex,
                pointerEvents: 'none'
              }}
            >
              <OverlayContent />
            </div>
          )
        }

        return (
          <Draggable
            key={overlay._id}
            defaultPosition={props.position}
            onStop={(e, data) => handleDragStop(overlay, e, data)}
            bounds="parent"
          >
            <div
              className="absolute pointer-events-auto"
              style={{ zIndex: overlay.zIndex }}
              onClick={() => setSelectedId(overlay._id)}
            >
              <ResizableBox
                width={props.size.width}
                height={props.size.height}
                onResizeStop={(e, data) => handleResize(overlay, e, data)}
                minConstraints={[50, 30]}
                maxConstraints={[800, 600]}
                className={`${selectedId === overlay._id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  border: editMode ? '2px dashed rgba(255,255,255,0.5)' : 'none',
                  cursor: 'move'
                }}
              >
                <OverlayContent />
              </ResizableBox>
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}

export default OverlayCanvas
