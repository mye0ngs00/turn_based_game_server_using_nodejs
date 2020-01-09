exports = module.exports = class Queue{
    constructor(){
        this._queue = [];
        this.enqueue = ( item )=>{
            this._queue.unshift( item );
        }
        this.dequeue = ()=>{
            return this._queue.pop();
        }
        this.length = ()=>{
            return this._queue.length;
        }
    }
}
