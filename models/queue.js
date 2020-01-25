const join = require('../controllers/join');

exports = module.exports = class Queue{
    constructor(){
        this._queue = [];
        this.enqueue = ( item )=>{
            this._queue.unshift( item );

            // matching
            if( this._queue.length > 1 ){
                join( this._queue.pop(), this._queue.pop() );
            }
        }

        this.dequeue = ()=>{
            return this._queue.pop();
        }

        this.exit = (username)=>{
            this._queue.forEach((socket)=>{
                if( socket.username === username ){
                    const idx = this._queue.indexOf(socket);
                    if ( idx > -1 ) this._queue.splice(idx, 1);
                }
            });
        }

        this.length = ()=>{
            return this._queue.length;
        }
        
        this.getNames = ()=>{
            let retNames = [];
            let cnt = 0;
            return new Promise( (res, rej)=>{
                this._queue.forEach((socket)=>{
                    retNames.push( socket.username );
                    if( ++cnt === this._queue.length) {
                        res(retNames);
                    }
                });
            });
        }
    }
}
