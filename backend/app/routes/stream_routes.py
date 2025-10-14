from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app.database import get_db
from app.models.stream import Stream
from app.services.transcoder import start_transcoding, stop_transcoding
from bson import ObjectId
from bson.errors import InvalidId
import os

bp = Blueprint('streams', __name__, url_prefix='/api/v1/streams')

@bp.route('', methods=['GET'])
def get_streams():
    db = get_db()
    streams = Stream.find_all(db)
    return jsonify({'success': True, 'data': streams})

@bp.route('/<stream_id>', methods=['GET'])
def get_stream(stream_id):
    try:
        ObjectId(stream_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid stream ID'}), 400
    
    db = get_db()
    stream = Stream.find_by_id(db, stream_id)
    if stream:
        return jsonify({'success': True, 'data': stream})
    return jsonify({'success': False, 'error': 'Stream not found'}), 404

@bp.route('', methods=['POST'])
def create_stream():
    db = get_db()
    stream_data = request.json
    stream = Stream.create(db, stream_data)
    stream['_id'] = str(stream['_id'])
    stream['rtspUrl'] = '***MASKED***'
    return jsonify({'success': True, 'data': stream}), 201

@bp.route('/<stream_id>', methods=['PUT'])
def update_stream(stream_id):
    try:
        ObjectId(stream_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid stream ID'}), 400
    
    db = get_db()
    update_data = request.json
    stream = Stream.update(db, stream_id, update_data)
    if stream:
        return jsonify({'success': True, 'data': stream})
    return jsonify({'success': False, 'error': 'Stream not found'}), 404

@bp.route('/<stream_id>', methods=['DELETE'])
def delete_stream(stream_id):
    try:
        ObjectId(stream_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid stream ID'}), 400
    
    db = get_db()
    success = Stream.delete(db, stream_id)
    if success:
        return jsonify({'success': True, 'message': 'Stream deleted'})
    return jsonify({'success': False, 'error': 'Stream not found'}), 404

@bp.route('/<stream_id>/start', methods=['POST'])
def start_stream(stream_id):
    try:
        ObjectId(stream_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid stream ID'}), 400
    
    db = get_db()
    stream = Stream.find_by_id(db, stream_id, mask_url=False)
    if stream and 'rtspUrl' in stream:
        output_path = os.path.join(os.path.dirname(__file__), '../../streams/stream.m3u8')
        start_transcoding(stream['rtspUrl'], output_path)
        return jsonify({'success': True, 'message': 'Transcoding started'})
    return jsonify({'success': False, 'error': 'Stream not found'}), 404

@bp.route('/output/<path:filename>', methods=['GET'])
def serve_stream(filename):
    streams_dir = os.path.join(os.path.dirname(__file__), '../../streams')
    return send_from_directory(streams_dir, filename)
