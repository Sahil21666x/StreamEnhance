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
- 2025-10-14: Initial project setup and structure created

## User Preferences
- None recorded yet

## Development Notes
- HLS segments stored in backend/streams/
- Overlay positions stored as percentages for responsiveness
- RTSP credentials kept server-side for security
