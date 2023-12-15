from flask import Flask, render_template
from flask_socketio import SocketIO

class FlaskSocketIO:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = 'secret!'
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")

        # Verknüpfen der Routen und Event-Handler mit der Flask-Instanz
        self.app.add_url_rule('/', 'index', self.index)
        self.socketio.on('message')(self.handle_message)

    def run(self):
        self.socketio.run(self.app)

    # Definieren Sie die Methoden innerhalb der Klasse
    def index(self):
        # Pfad zu Ihrer index.html angeben, wenn sie sich in einem anderen Verzeichnis befindet
        return render_template('index.html')

    def handle_message(self, data):
        print('received message: ' + data)
        
    def handle_connect(self):
        self.socketio.emit('message', {'data': 'Server connected'})

# Erstellen und Ausführen der FlaskSocketIO-Instanz
if __name__ == '__main__':
    server = FlaskSocketIO()
    server.run()