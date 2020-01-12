/**
 *  created by sonmeyongsoo. 09 Jan, 2020.
 *  content: 게임 큐 돌리는 모듈.
 * 참조하는 모듈: /app.js
 */
const join = require('./join');
const gameQueue = new (require('../data_structures/queue'));

exports = module.exports = ()=>{
    return ( userSocket )=>{
        gameQueue.enqueue( userSocket );
        console.log( userSocket.username );

        // 매칭
        if( gameQueue.length() > 2 ){
            join( gameQueue.dequeue(), gameQueue.dequeue() );
        }
    }
}