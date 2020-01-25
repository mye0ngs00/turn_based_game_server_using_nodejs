const queueSocket = require('../models/queue-socket');
const gameQueue = new (require('../models/queue'));

exports = module.exports = () => {
    queueSocket.on('connection', (clientSocket)=>{
        // 나중에 채널도 추가.
        clientSocket.roomNo = 0;
        gameQueue.getNames().then( names => {
            clientSocket.emit('addUser', names);
        });

        clientSocket.on('enqueue', username=>{
            clientSocket.username = username;
            gameQueue.enqueue( clientSocket );
            clientSocket.broadcast.emit('addUser', [ username ] );
        });

        clientSocket.on('exit', username=>{
            gameQueue.exit( username );
            clientSocket.broadcast.emit('removeUser', [ username ] );
            clientSocket.disconnect();
        });

        clientSocket.on('disconnect', ()=>{
            gameQueue.exit( clientSocket.username );
            clientSocket.broadcast.emit('removeUser', [ clientSocket.username ] );
            clientSocket.disconnect();
        });

    });
};