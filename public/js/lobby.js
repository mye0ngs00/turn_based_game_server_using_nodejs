window.addEventListener('DOMContentLoaded', ()=>{
    let socket = null;

    $ip = document.getElementById('ip').value;
	$username = document.getElementById('name').value;
	$character = document.getElementById('character').value;
	/*<!-- $turn = document.getElementById('turn').value; -->*/

    document.getElementById('finder').addEventListener('click', (event)=>{
        let T = event.target;
        
        if( T.classList.value === "enqueue" ){
            T.classList.remove('enqueue');
            T.classList.add('exit');
            T.innerHTML = "취소";
            console.log('enqueue'); //debug.
            document.getElementById('users').style.visibility = "visible";

            /*
                나중에 채널 별 서버식 구성으로 부하 클러스터링.
            */
            socket = io('/queue');
            // append user.
            socket.emit('enqueue', $username ); //나중에는 여기에 MMR 추가해서 emit.
            // params,, socket.username 으로 변경예정.
            addUser( $username );
            // 소켓으로 다른사람 이름 받으면 참가자 목록에 추가하기.
            socket.on('addUser', ( othernames )=>{
                if( !othernames ) return;
                othernames.forEach( name => {
                    addUser( name );
                });
            });

            socket.on('removeUser', ( othernames )=>{
                if( !othernames ) return;
                othernames.forEach( name => {
                    removeUser( name );
                });
            });

            socket.on('onReady', ()=>{
                console.log('ready');
                window.location.href="/room";
            })
        }
        else if( T.classList.value === "exit" ){
            T.classList.remove('exit');
            T.classList.add('enqueue');
            T.innerHTML = "게임찾기";
            console.log('exit'); //debug.
            document.getElementById('users').innerHTML = '';
            document.getElementById('users').style.visibility = "hidden";
            /*
                목록에서 본인 삭제 구현.
            */
            socket.emit('exit', $username );
            //removeUser( $username );
            socket.close();
        }
        return;
    }, false);

    addUser = ( username )=>{
        let paragraph = document.createElement("span");
        paragraph.innerHTML = username;
        paragraph.classList.add('user');
        document.getElementById('users').appendChild(paragraph);
    }

    removeUser = ( username )=>{
        let $users = document.getElementsByClassName('user');
        for( let doc of $users){
            if( doc.innerHTML === username ){
                doc.parentNode.removeChild(doc);
            }
        };
    }
});