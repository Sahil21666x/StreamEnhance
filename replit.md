# RTSP Livestream + Overlay Manager

## Project Overview
A web application that allows users to view RTSP livestreams in the browser and manage custom overlays (logo/text) over the live video. Built with Flask (Python) backend, React frontend, and MongoDB for data persistence.

## Tech Stack
- **Backend**: Flask (Python 3.11), PyMongo
- **Frontend**: React, hls.js, react-draggable, Tailwind CSS
- **Database**: MongoDB
- **Streaming**: FFmpeg (RTSP → HLS transcoding)

## Architecture
- RTSP streams are transcoded to HLS using FFmpeg for browser compatibility
- Overlays are rendered in the browser DOM on top of video player
- REST API for overlay CRUD operations
- MongoDB stores overlay configurations (position, size, styles)

## Key Features (MVP)
- Landing page with HLS video player
- RTSP to HLS transcoding service
- Drag-and-drop overlay editor (text and images)
- Interactive overlay positioning and resizing
- REST API for overlay management
- Stream management interface

## Project Structure
```
/backend         - Flask API server
  /app
    /models      - MongoDB data models
    /routes      - API endpoints
    /services    - Business logic (transcoding, etc.)
  /streams       - HLS output files (.m3u8, .ts)
/frontend        - React application
```

## Recent Changes
- 2025-10-14: Complete RTSP livestream overlay manager implementation
  - Flask backend with MongoDB integration for overlay and stream management
  - REST API with ObjectId validation and proper error handling
  - React frontend with HLS video player using hls.js
  - Drag-and-drop overlay editor with real-time positioning and resizing
  - Stream management interface for RTSP configuration
  - FFmpeg-based RTSP to HLS transcoding service
  - Dynamic API base URL resolution for deployment compatibility

## User Preferences
- None recorded yet

## Development Notes
- HLS segments stored in backend/streams/
- Overlay positions stored as pixel values with drag-drop support
- RTSP credentials kept server-side for security (masked in API responses)
- Frontend uses dynamic host detection for API calls (supports localhost and deployed environments)
- Edit mode toggle in video player enables drag-drop overlay manipulation
- ObjectId validation prevents 500 errors from invalid IDs

## API Endpoints
- GET/POST /api/v1/overlays - List/Create overlays
- GET/PUT/DELETE /api/v1/overlays/:id - Get/Update/Delete overlay
- GET/POST /api/v1/streams - List/Create streams
- GET/PUT/DELETE /api/v1/streams/:id - Get/Update/Delete stream
- POST /api/v1/streams/:id/start - Start RTSP transcoding
- GET /api/v1/streams/output/:filename - Serve HLS files

## Setup Instructions
1. Ensure MongoDB is running (handled automatically in Replit)
2. Backend runs on port 8000
3. Frontend runs on port 5000
4. Add RTSP stream URLs via Stream Manager
5. Create overlays via Overlay Editor
6. Toggle edit mode in Player to drag/resize overlays
