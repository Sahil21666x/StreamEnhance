import subprocess
import os
import threading

transcoding_process = None

def start_transcoding(rtsp_url, output_path, is_webcam=False):
    """
    Start live transcoding to HLS.

    Parameters:
    - rtsp_url: RTSP stream URL or local video file path
    - output_path: Path to output .m3u8 file
    - is_webcam: Set True if using local webcam
    """
    global transcoding_process

    print("Starting live transcoding...", output_path)

    # Stop previous process if running
    if transcoding_process and transcoding_process.poll() is None:
        stop_transcoding()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # FFmpeg command
    cmd = [
        "ffmpeg",
    ]

    # Input source
    if is_webcam:
        # Example: Windows webcam (use "video=Integrated Camera" or list with ffmpeg -list_devices true -f dshow -i dummy)
        cmd += [
            "-f", "dshow",
            "-i", "video=Integrated Camera"
        ]
    else:
        # RTSP source
        cmd += [
            "-rtsp_transport", "tcp",
            "-i", rtsp_url
        ]

    # Encoding + HLS output
    cmd += [
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-c:a", "aac",
        "-f", "hls",
        "-hls_time", "2",  # 2s segments
        "-hls_list_size", "6",  # Keep last 6 segments (live)
        "-hls_flags", "delete_segments+append_list+omit_endlist",
        "-hls_segment_filename", os.path.join(os.path.dirname(output_path), "stream%d.ts"),
        output_path
    ]

    # Run FFmpeg in a background thread
    def run_ffmpeg():
        global transcoding_process
        transcoding_process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        # Print FFmpeg logs for debugging
        for line in transcoding_process.stderr:
            print(line.decode(), end='')

    thread = threading.Thread(target=run_ffmpeg)
    thread.daemon = True
    thread.start()

def stop_transcoding():
    global transcoding_process
    if transcoding_process:
        transcoding_process.terminate()
        transcoding_process = None
