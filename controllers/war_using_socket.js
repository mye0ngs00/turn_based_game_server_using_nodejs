const battleSocket = require('../models/battle-socket');

exports = module.exports = (app) => {
    
    let numOfPlayers = 0;
    let datasBeforeJoin = [];
    let players = []; //배열 초기화
    let player0_ready = false;
    let player1_ready = false;
    let isPlaying = false;

    app.set('numOfPlayers', numOfPlayers);
    app.set('players', players);

    battleSocket.on('connection', (clientSocket)=>{
        // 유저가 입장했을 때
        clientSocket.on('join', (data)=>{
            // 동시접속 방지
            numOfPlayers++;
            if( players[0] == null ) players[0] = data.name;
            else players.push(data.name);
        
            app.set('players', players);
            app.set('numOfPlayers', numOfPlayers);
            
            console.log("동시접속자: %d 명", numOfPlayers); 
            clientSocket.name = data.name;
            clientSocket.ip = data.ip;
       
            console.log("["+clientSocket.ip+"]"+ clientSocket.name +" join.");
            clientSocket.broadcast.emit('notice', "야생의 " + clientSocket.name + "가 나타났다.");
            // join 이전 데이터
            // 재접속 구현x
            datasBeforeJoin.forEach((actionData)=>{
                clientSocket.emit('setup', actionData);
            });
        });
        clientSocket.on('setup', (data)=>{
            datasBeforeJoin.push(data);
            battleSocket.emit('setup', data);
        });
        clientSocket.on('end', ()=>{
            isPlaying = false;
            player0_ready = false;
            player1_ready = false;
            battleSocket.emit('end');
        });
        // action
        clientSocket.on('action', (data)=>{
            // traffic 많으면 local처리.
            battleSocket.emit('situation', data);
        });
        // isReady to game?
        clientSocket.on('turn0', (bool)=>{
            console.log( "turn0: " + bool);
            player0_ready = bool;
            if( player0_ready && player1_ready && !isPlaying ){
                console.log('turn0  ready');
                isPlaying = true;
                battleSocket.emit('ready');
                clientSocket.emit('turnUp');
            }
        });
        clientSocket.on('turn1', (bool)=>{
            console.log( "turn1: " + bool);
            player1_ready = bool;
            if( player0_ready && player1_ready && !isPlaying ){
                console.log('turn1  ready');
                isPlaying = true;
                battleSocket.emit('ready');
                clientSocket.broadcast.emit('turnUp');
            }
        });
        clientSocket.on('turnUpToServer', ()=>{
            clientSocket.broadcast.emit('turnUp');
        });
        // destroyed
        clientSocket.on('disconnect', ()=>{
            console.log("A user disconnected");
            clientSocket.broadcast.emit('notice', clientSocket.name + "가 팬티만 입고 도망갔다.");
            clientSocket.broadcast.emit('situation', {});
        
            //나간 경우 배열 초기화
            datasBeforeJoin = [];
            let index = players.indexOf(clientSocket.name);
            if( index !== -1 ){
                players[index] = null;
                numOfPlayers--;
            }
            app.set('numOfPlayers', numOfPlayers);
            app.set('players', players);
            
            console.log("동시접속자: %d 명", numOfPlayers); 
            clientSocket.broadcast.emit('re');
        });
    });
}