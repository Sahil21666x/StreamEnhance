from flask import Blueprint, request, jsonify
from app.database import get_db
from app.models.overlay import Overlay
from bson import ObjectId
from bson.errors import InvalidId

bp = Blueprint('overlays', __name__, url_prefix='/api/v1/overlays')

@bp.route('', methods=['GET'])
def get_overlays():
    db = get_db()
    user_id = request.args.get('userId')
    overlays = Overlay.find_all(db, user_id)
    return jsonify({'success': True, 'data': overlays})

@bp.route('/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    try:
        ObjectId(overlay_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid overlay ID'}), 400
    
    db = get_db()
    overlay = Overlay.find_by_id(db, overlay_id)
    if overlay:
        return jsonify({'success': True, 'data': overlay})
    return jsonify({'success': False, 'error': 'Overlay not found'}), 404

@bp.route('', methods=['POST'])
def create_overlay():
    db = get_db()
    overlay_data = request.json
    overlay = Overlay.create(db, overlay_data)
    overlay['_id'] = str(overlay['_id'])
    return jsonify({'success': True, 'data': overlay}), 201

@bp.route('/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    try:
        ObjectId(overlay_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid overlay ID'}), 400
    
    db = get_db()
    update_data = request.json
    overlay = Overlay.update(db, overlay_id, update_data)
    if overlay:
        return jsonify({'success': True, 'data': overlay})
    return jsonify({'success': False, 'error': 'Overlay not found'}), 404

@bp.route('/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    try:
        ObjectId(overlay_id)
    except (InvalidId, TypeError):
        return jsonify({'success': False, 'error': 'Invalid overlay ID'}), 400
    
    db = get_db()
    success = Overlay.delete(db, overlay_id)
    if success:
        return jsonify({'success': True, 'message': 'Overlay deleted'})
    return jsonify({'success': False, 'error': 'Overlay not found'}), 404
