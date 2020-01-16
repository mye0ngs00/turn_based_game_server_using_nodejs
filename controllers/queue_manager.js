const gameQueue = new (require('../models/queue'));

exports = module.exports = (app) => {
    app.io.on('connection', (socket)=>{
        gameQueue.getNames().then( names => {
            socket.emit('addUser', names);
        });

        socket.on('enqueue', username=>{
            socket.username = username;
            gameQueue.enqueue( socket );
            socket.broadcast.emit('addUser', [ username ] );
        });

        socket.on('exit', username=>{
            gameQueue.exit( username );
            socket.broadcast.emit('removeUser', [ username ] );
            socket.disconnect();
        });

        socket.on('disconnect', ()=>{
            gameQueue.exit( socket.username );
            socket.broadcast.emit('removeUser', [ socket.username ] );
            socket.disconnect();
        });

    });
};