/**
 *  created by sonmeyongsoo. 09 Jan, 2020.
 *  content: 게임 큐 돌리는 모듈.
 * 참조하는 모듈: /app.js
 */
const join = require('./join');

exports = module.exports = gameQueue=>{
    return ()=>{
        if( gameQueue.length() > 2 ){
            join( gameQueue.dequeue(), gameQueue.dequeue() );
        }
    }
}