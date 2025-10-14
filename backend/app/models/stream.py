from datetime import datetime
from bson import ObjectId

class Stream:
    @staticmethod
    def create(db, stream_data):
        stream = {
            'label': stream_data.get('label'),
            'rtspUrl': stream_data.get('rtspUrl'),
            'transcoding': stream_data.get('transcoding', {'type': 'hls', 'hlsPath': '/streams/main.m3u8'}),
            'defaultOverlays': stream_data.get('defaultOverlays', []),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        result = db.streams.insert_one(stream)
        stream['_id'] = result.inserted_id
        return stream
    
    @staticmethod
    def find_all(db):
        streams = list(db.streams.find())
        for stream in streams:
            stream['_id'] = str(stream['_id'])
            if 'rtspUrl' in stream:
                stream['rtspUrl'] = '***MASKED***'
        return streams
    
    @staticmethod
    def find_by_id(db, stream_id, mask_url=True):
        stream = db.streams.find_one({'_id': ObjectId(stream_id)})
        if stream:
            stream['_id'] = str(stream['_id'])
            if mask_url and 'rtspUrl' in stream:
                stream['rtspUrl'] = '***MASKED***'
        return stream
    
    @staticmethod
    def update(db, stream_id, update_data):
        update_data['updatedAt'] = datetime.utcnow()
        result = db.streams.update_one(
            {'_id': ObjectId(stream_id)},
            {'$set': update_data}
        )
        if result.modified_count > 0:
            return Stream.find_by_id(db, stream_id)
        return None
    
    @staticmethod
    def delete(db, stream_id):
        result = db.streams.delete_one({'_id': ObjectId(stream_id)})
        return result.deleted_count > 0
