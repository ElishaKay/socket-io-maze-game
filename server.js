var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("connected: % of sockets connected", connections.length);

    //Message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //mouse up
    socket.on('mouse up', function(data){
        console.log('this is the mouseup data: ',data);
        io.sockets.emit('send coordinates', {msg: data, user: socket.username});
    });
    
    // new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users)
    } 
});