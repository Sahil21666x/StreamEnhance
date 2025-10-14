from app import app
from app.database import close_db

app.teardown_appcontext(close_db)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
