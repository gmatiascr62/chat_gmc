from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

#config 
app.config['SECRET_KEY'] = 'secret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)

#funciones
def guardar(*args):
    if len(args) == 3:
        origenb = args[0]
        mensajeb = args[1]
        destinob = args[2]
        guardame = Mensajes(origen=origenb, mensaje=mensajeb, destino=destinob)
        db.session.add(guardame)
        db.session.commit()

def obtener_chat(origen, destino):
    lista_a=[origen, destino]
    lista_b=[destino, origen]
    todos = Mensajes.query.all()
    retornar = []
    for i in todos:
        comparar = [i.origen, i.destino]
        if comparar == lista_a or comparar == lista_b:
            retornar.append([i.origen, i.mensaje])
    return retornar


#rutas
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def test_connect(msg):
    print("\n\n",msg,"\n\n")

@socketio.on('obtener')
def obtener(*args):
    print("entro a obtener: ",args)
    chat = obtener_chat(args[0],args[1])
    emit('carga_chat', chat)
    

@socketio.on('my event')
def my_event(*args):
    guardar(*args)
    lista = []
    for i in args:
        lista.append(i)
    print("argumentos: ", lista)
    emit('mande', lista, broadcast=True)

#models
class Mensajes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    origen = db.Column(db.Integer)
    mensaje = db.Column(db.String(64))
    destino = db.Column(db.Integer)

    def __repr__(self):
        return '<User {}>'.format(self.username)

db.create_all()
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
