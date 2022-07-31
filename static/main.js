alert('hola');
const boton = document.getElementById('sendBtn');
const usuario = document.getElementById('usuario');
const mensaje = document.getElementById('mensaje');
const texto = document.getElementById('texto');
const u1 = document.getElementById('u1');
const u2 = document.getElementById('u2');
const u3 = document.getElementById('u3');
const remitente= document.getElementById('remitente');
const body = document.getElementsByTagName('body');

var destino;
var historial = false;

var socket = io();

socket.on('connect', () =>{
	socket.emit('message', 'se conecto');
});


socket.on('mande', (data) =>{
	if (data[0] == usuario.value) {
		var etiqueta = document.createElement('h3');
		etiqueta.innerHTML = data[1];
		texto.appendChild(etiqueta);
		etiqueta.classList.add('msgMio');

	};
	if (data[2] == usuario.value && data[0] == destino) {
		var etiqueta = document.createElement('p');
		etiqueta.innerHTML = data[1];
		texto.appendChild(etiqueta);
		etiqueta.classList.add('msgOtro');
	};
	if (data[2] == usuario.value && destino != data[0]){
		alert(`${data[0]} te envio un mensaje`);
	};
	texto.scrollTop=9999;
	setTimeout(window.scrollTo(0,500),100);
});

socket.on('carga_chat', (data) =>{
	if (historial == false){
		for (let i = 0; i<data.length; i++){
			var etiquet = document.createElement('h3');
			etiquet.innerHTML = data[i][1];
			texto.appendChild(etiquet);
			if (data[i][0] == usuario.value){
				etiquet.classList.add("msgMio");
			}else{
				etiquet.classList.add("msgOtro");
			};
		};
	};
	texto.scrollTop=9999;
});


boton.addEventListener('click', function(){
	socket.emit('my event', usuario.value, mensaje.value, destino);
	mensaje.value = "";
	mensaje.focus();
});

u2.addEventListener('click', () =>{
	destino = u2.textContent;
	remitente.innerHTML = u2.textContent;
	texto.innerHTML = "";
	socket.emit('obtener', usuario.value, u2.textContent);
});

u1.addEventListener('click', () =>{
	destino = u1.textContent;
	remitente.innerHTML = u1.textContent;
	texto.innerHTML = "";
	socket.emit('obtener', usuario.value, u1.textContent);
});
u3.addEventListener('click', () =>{
	destino = u3.textContent;
	remitente.innerHTML = u3.textContent;
	texto.innerHTML = "";
	socket.emit('obtener', usuario.value, u3.textContent);
});
mensaje.addEventListener('click', () =>{
	body.scrollTop= 99999;
});
