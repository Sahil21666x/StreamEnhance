import subprocess
import os
import threading

transcoding_process = None

def start_transcoding(rtsp_url, output_path):
    global transcoding_process
    
    if transcoding_process and transcoding_process.poll() is None:
        stop_transcoding()
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    cmd = [
        'ffmpeg',
        '-rtsp_transport', 'tcp',
        '-i', rtsp_url,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '3',
        '-hls_flags', 'delete_segments',
        '-hls_allow_cache', '0',
        output_path
    ]
    
    def run_ffmpeg():
        global transcoding_process
        transcoding_process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    
    thread = threading.Thread(target=run_ffmpeg)
    thread.daemon = True
    thread.start()

def stop_transcoding():
    global transcoding_process
    if transcoding_process:
        transcoding_process.terminate()
        transcoding_process = None
