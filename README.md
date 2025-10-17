Overview
This application allows you to view RTSP livestreams in the browser and manage custom overlays (text/images) over the live video. The system transcodes RTSP streams to HLS for browser compatibility and provides an interactive overlay editor.

Tech Stack
Backend: Flask (Python 3.11), MongoDB, PyMongo
Frontend: React, Vite, Tailwind CSS, hls.js
Streaming: FFmpeg for RTSP to HLS transcoding
Database: MongoDB for persistent overlay storage
Installation Guide
Prerequisites
Python 3.11 or higher
Node.js 20 or higher
MongoDB (running instance)
FFmpeg installed on your system
Step 1: Install System Dependencies
For Ubuntu/Debian:

sudo apt update
sudo apt install ffmpeg mongodb
For macOS:

brew install ffmpeg mongodb-community
brew services start mongodb-community
For Windows:

Download and install FFmpeg from ffmpeg.org
Download and install MongoDB from mongodb.com
Step 2: Install Backend Dependencies
# Navigate to backend directory
cd backend
# Install Python dependencies
pip install -r requirements.txt
Backend requirements:

flask==3.0.0
flask-cors==4.0.0
pymongo==4.6.0
python-dotenv==1.0.0
Step 3: Configure Environment Variables
Create a .env file in the backend directory:

cd backend
cp .env.example .env
Edit .env with your settings:

MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=rtsp_overlay_manager
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
Step 4: Install Frontend Dependencies
# Navigate to project root
cd ..
# Install Node.js dependencies
npm install
Frontend dependencies:

react, react-dom
vite
hls.js
react-draggable, react-resizable
axios
tailwindcss, @tailwindcss/postcss
autoprefixer
Running the Application
Start MongoDB
Ensure MongoDB is running:

# On Linux/macOS
mongod
# On Windows
net start MongoDB
Start the Backend Server
cd backend
python run.py
The backend will start on http://localhost:8000

Start the Frontend Development Server
# In a new terminal, from project root
npm run dev
The frontend will start on http://localhost:5173

Access the Application
Open your browser and navigate to:

http://localhost:5000
Using the Application
1. Stream Manager (Add RTSP Streams)
Click on the "Stream Manager" tab
Enter a descriptive label for your stream (e.g., "Main Camera")
Enter your RTSP URL in the format:
rtsp://username:password@ip:port/path
Example: rtsp://admin:password123@192.168.1.100:554/stream1
Click "Add Stream"
Click "Start Transcoding" to begin converting the RTSP stream to HLS
Note: Your RTSP credentials are stored securely on the server and masked in API responses.

2. Overlay Editor (Create Custom Overlays)
Click on the "Overlay Editor" tab

Fill in the overlay details:

Name: Descriptive name (e.g., "Logo", "Live Badge")
Type: Choose "Text" or "Image"
For Text Overlays:

Enter the text content
Set font size and color
Adjust position (x, y coordinates in pixels)
Set dimensions (width, height in pixels)
For Image Overlays:

Enter the image URL
Adjust position and size
Click "Create Overlay" to save

Your overlay will appear in the "Saved Overlays" list

Use "Edit" to modify or "Delete" to remove overlays

3. Video Player (View & Manipulate Overlays)
Click on the "Player" tab
The HLS stream URL is pre-configured (default: http://localhost:8000/api/v1/streams/output/stream.m3u8)
Click "Play" to start the video
Adjust volume using the slider
Interactive Overlay Editing:

Toggle "Edit Mode: ON" to enable interactive editing
Drag overlays to reposition them
Resize overlays using the handles at the corners
Changes are automatically saved to the database
Toggle "Edit Mode: OFF" to lock overlays in place


# API Endpoints
Overlay Management
GET /api/v1/overlays - List all overlays
GET /api/v1/overlays/:id - Get specific overlay
POST /api/v1/overlays - Create new overlay
PUT /api/v1/overlays/:id - Update overlay
DELETE /api/v1/overlays/:id - Delete overlay
Stream Management
GET /api/v1/streams - List all streams
GET /api/v1/streams/:id - Get specific stream
POST /api/v1/streams - Create new stream
PUT /api/v1/streams/:id - Update stream
DELETE /api/v1/streams/:id - Delete stream
POST /api/v1/streams/:id/start - Start transcoding
GET /api/v1/streams/output/:filename - Serve HLS files

Troubleshooting
Video Not Playing
Check FFmpeg: Ensure FFmpeg is installed (ffmpeg -version)
Check RTSP URL: Verify your RTSP stream is accessible
Check HLS Path: Ensure the stream has been started via "Start Transcoding"
Browser Compatibility: Use Chrome, Firefox, or Safari for best HLS support
Overlays Not Appearing
Check Edit Mode: Toggle Edit Mode ON to see overlay boundaries
Check Visibility: Ensure overlay visibility is set to true
Check Position: Overlays may be positioned outside the video frame
API Connection Errors
Backend Running: Ensure Flask server is running on port 8000
CORS Issues: Check Flask-CORS configuration
MongoDB: Ensure MongoDB service is running
MongoDB Connection Issues
# Check if MongoDB is running
ps aux | grep mongod
# Restart MongoDB (Linux/macOS)
sudo systemctl restart mongod
# Windows
net stop MongoDB
net start MongoDB
Port Already in Use
# Find process using port 8000 (backend)
lsof -i :8000
kill -9 <PID>
# Find process using port 5000 (frontend)
lsof -i :5000
kill -9 <PID>
Development Notes
File Structure
/backend              - Flask API server
  /app
    /models          - MongoDB data models
    /routes          - API endpoints
    /services        - Business logic (transcoding)
  /streams           - HLS output files (.m3u8, .ts)
  run.py             - Server entry point
/src                 - React application
  /components        - React components
  /services          - API client
  App.jsx            - Main app component
  main.jsx           - Entry point
/index.html          - HTML template
/vite.config.js      - Vite configuration
/tailwind.config.js  - Tailwind CSS configuration
Key Features
Drag & Drop: Overlays can be repositioned by dragging
Resizable: Overlays can be resized using corner handles
Real-time Updates: Changes are immediately reflected and persisted
Responsive Design: UI adapts to different screen sizes
Security: RTSP credentials are never exposed to the frontend
Data Models
Overlay Schema:

{
  "_id": ObjectId,
  "name": "string",
  "type": "text" | "image",
  "content": { 
    "text": "string",      // for text overlays
    "src": "url"           // for image overlays
  },
  "position": { "x": number, "y": number },
  "size": { "width": number, "height": number },
  "zIndex": number,
  "visible": boolean,
  "styles": { 
    "fontSize": number,
    "color": "string",
    "backgroundColor": "string"
  },
  "createdAt": ISODate,
  "updatedAt": ISODate
}
Stream Schema:

{
  "_id": ObjectId,
  "label": "string",
  "rtspUrl": "string",
  "transcoding": {
    "type": "hls",
    "hlsPath": "string"
  },
  "defaultOverlays": [ObjectId],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
Production Deployment
Environment Configuration
Set FLASK_ENV=production in .env
Use a production WSGI server (gunicorn):
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
Build Frontend for Production
npm run build
Security Considerations
Use HTTPS for production deployments
Implement authentication for admin endpoints
Secure MongoDB with authentication
Use environment variables for sensitive data
Implement rate limiting on API endpoints
Additional Resources
FFmpeg Documentation: https://ffmpeg.org/documentation.html
HLS.js Documentation: https://github.com/video-dev/hls.js
React Documentation: https://react.dev
Flask Documentation: https://flask.palletsprojects.com
MongoDB Documentation: https://docs.mongodb.com
Support
For issues or questions:

Check the Troubleshooting section above
Review the browser console for error messages
Check backend logs for API errors
Verify MongoDB connection and data
License
This project is provided as-is for educational and development purposes.