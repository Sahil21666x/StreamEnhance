from datetime import datetime
from bson import ObjectId

class Overlay:
    @staticmethod
    def create(db, overlay_data):
        overlay = {
            'name': overlay_data.get('name'),
            'type': overlay_data.get('type'),
            'content': overlay_data.get('content', {}),
            'position': overlay_data.get('position', {'x': 0, 'y': 0}),
            'size': overlay_data.get('size', {'width': 100, 'height': 50}),
            'zIndex': overlay_data.get('zIndex', 10),
            'visible': overlay_data.get('visible', True),
            'styles': overlay_data.get('styles', {}),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        result = db.overlays.insert_one(overlay)
        overlay['_id'] = result.inserted_id
        return overlay
    
    @staticmethod
    def find_all(db, user_id=None):
        query = {}
        if user_id:
            query['userId'] = user_id
        overlays = list(db.overlays.find(query))
        for overlay in overlays:
            overlay['_id'] = str(overlay['_id'])
        return overlays
    
    @staticmethod
    def find_by_id(db, overlay_id):
        overlay = db.overlays.find_one({'_id': ObjectId(overlay_id)})
        if overlay:
            overlay['_id'] = str(overlay['_id'])
        return overlay
    
    @staticmethod
    def update(db, overlay_id, update_data):
        update_data['updatedAt'] = datetime.utcnow()
        result = db.overlays.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': update_data}
        )
        if result.modified_count > 0:
            return Overlay.find_by_id(db, overlay_id)
        return None
    
    @staticmethod
    def delete(db, overlay_id):
        result = db.overlays.delete_one({'_id': ObjectId(overlay_id)})
        return result.deleted_count > 0
