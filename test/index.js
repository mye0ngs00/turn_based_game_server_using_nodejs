var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

var roomno = 1;
const room = io.of('/room');
room.on('connection', function(socket) {
   
   //Increase roomno 2 clients are present in a room.
   //if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   //socket.join("room-"+roomno);

   //Send this event to everyone in the room.
   room.emit('connectToRoom', "hi..z")//.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
})

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
