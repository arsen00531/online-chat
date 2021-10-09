var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 80;

server.listen(PORT, () => {
	console.log('server started');
});

app.get('/', function (request, respons) {
	respons.end('<h1>Home page</h1>')
	// respons.sendFile(__dirname + '/index.html');
});

users = [];
connections = [];

io.sockets.on('connection', function (socket) {
	console.log("Успешное соединение");
	connections.push(socket);

	socket.on('disconnect', function (data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log("Отключились");
	});

	socket.on('send mess', function (data) {
		io.sockets.emit('add mess', {msg: data});
	});

});