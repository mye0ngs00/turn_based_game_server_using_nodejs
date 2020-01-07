exports = module.exports = (app) => {
    let numOfPlayers = 0;
    let datasBeforeJoin = [];
    let players = []; //배열 초기화
    let player0_ready = false;
    let player1_ready = false;
    let isPlaying = false;

    app.set('numOfPlayers', numOfPlayers);
    app.set('players', players);

    app.io.on('connection', (socket)=>{
        // 유저가 입장했을 때
        socket.on('join', (data)=>{
            // 동시접속 방지
            numOfPlayers++;
            if( players[0] == null ) players[0] = data.name;
            else players.push(data.name);
        
            app.set('players', players);
            app.set('numOfPlayers', numOfPlayers);
            
            console.log("동시접속자: %d 명", numOfPlayers); 
            socket.name = data.name;
            socket.ip = data.ip;
      
            console.log("["+socket.ip+"]"+ socket.name +" join.");
            socket.broadcast.emit('notice', "야생의 " + socket.name + "가 나타났다.");
            // join 이전 데이터
            // 재접속 구현x
            datasBeforeJoin.forEach((actionData)=>{
                socket.emit('setup', actionData);
            });
        });
        socket.on('setup', (data)=>{
            datasBeforeJoin.push(data);
            socket.emit('setup', data);
            socket.broadcast.emit('setup', data);
        });
        socket.on('end', ()=>{
            isPlaying = false;
            player0_ready = false;
            player1_ready = false;
            socket.emit('end');
            socket.broadcast.emit('end');
        });
        // action
        socket.on('action', (data)=>{
            // traffic 많으면 local처리.
            socket.emit('situation', data);
            socket.broadcast.emit('situation', data);
        });
        // isReady to game?
        socket.on('turn0', (bool)=>{
            console.log( "turn0: " + bool);
            player0_ready = bool;
            if( player0_ready && player1_ready && !isPlaying ){
                console.log('turn0  ready');
                isPlaying = true;
                socket.emit('ready');
                socket.broadcast.emit('ready');
                socket.emit('turnUp');
            }
        });
        socket.on('turn1', (bool)=>{
            console.log( "turn1: " + bool);
            player1_ready = bool;
            if( player0_ready && player1_ready && !isPlaying ){
                console.log('turn1  ready');
            isPlaying = true;
            socket.emit('ready');
            socket.broadcast.emit('ready');
            socket.broadcast.emit('turnUp');
          }
        });
        socket.on('turnUpToServer', ()=>{
            socket.broadcast.emit('turnUp');
        });
        // destroyed
        socket.on('disconnect', ()=>{
            console.log("A user disconnected");
            socket.broadcast.emit('notice', socket.name + "가 팬티만 입고 도망갔다.");
            socket.broadcast.emit('situation', {});
        
            //나간 경우 배열 초기화
            datasBeforeJoin = [];
            let index = players.indexOf(socket.name);
            if( index !== -1 ){
                players[index] = null;
                numOfPlayers--;
            }
            app.set('numOfPlayers', numOfPlayers);
            app.set('players', players);
            
            console.log("동시접속자: %d 명", numOfPlayers); 
            socket.broadcast.emit('re');
        });
    });
}