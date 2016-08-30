'use strict';

// Specify port
const port = 3001;

// Import Express
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Import Socket.io
const io = require('socket.io')(http);

// Serve the app directory and Bower scripts
app.use('/', express.static(__dirname + '/app'));
app.use('/lib', express.static(__dirname + '/bower_components'));

// Listen for user connections
io.on('connection', (socket) => {
    console.log('A user connected');
    io.emit('message', 'A user has joined the chat.');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        io.emit('message', 'A user has left the chat.');
    });
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});

// Listen on port 3001 - note that we need to use http.listen rather than Express's app.listen here for Socket.io to work
http.listen(port, () => {
    console.log('Listening on port ' + port + '.');
    console.log('Go to http://localhost:' + port + ' to view.');
});
