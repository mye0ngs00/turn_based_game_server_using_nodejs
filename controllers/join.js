/**
 * 참조하는 모듈: queue_manager.js
 */
const queueSocket = require('../models/queue-socket.js');
let roomNo = 1;

exports = module.exports = (user1_socket, user2_socket)=>{
    if( !queueSocket.adapter.rooms["room-" + roomNo] ){
        console.dir( user1_socket );
        user1_socket.roomNo = roomNo;
        // user1_socket.turn = 1;
        user2_socket.roomNo = roomNo;
        
        user1_socket.join("room-"+roomNo);
        user2_socket.join("room-"+roomNo);
        
        // game start
        console.log(`room-${roomNo}`);
        queueSocket.to(`room-${roomNo}`).emit('onReady');

        roomNo++;
        if( roomNo > 100 ) roomNo = 1;
        console.log("join success.");
        //소켓 끊기.
    }
}