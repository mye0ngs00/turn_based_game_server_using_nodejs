var $ip;
var $alias;
var $character;
var $turn;
var action;

var row;
var col;
var damage;
var HP;
var MP;
var move;
var range;

var enemyRow;
var enemyCol;
var enemyDamage;
var enemyHP = 5;
var enemyMP = 5;
var enemyAlias;

var shield = 0;
var enemyShield = 0;
/* turn variable */
var turnedIter = 1;
var myTurnFixed = false;
var isPlaying = false;

const MAX_ROW = 2;
const MAX_COL = 3;

// 요소를 가져온 것들은 전부 $로 parameter 선언.
window.addEventListener('DOMContentLoaded', (event)=>{
	$ip = document.getElementById('ip').value;
	$alias = document.getElementById('name').value;
	$character = document.getElementById('character').value;
	$turn = document.getElementById('turn').value;
	document.getElementById("myTurn").innerHTML = $turn==0?"선공":"후공";

	action = io('/battle');
	action.on('end', function(){
		action.emit('turn'+$turn, false);
		document.getElementById("myTurn").innerHTML = $turn===0?"선공":"후공";

		turnedIter = 1;
		myTurnFixed = false;
		isPlaying = false;
		// 게임 종료
		if( !enemyHP || !HP ){
			if( enemyHP < 1 ) alert(" You win.");
			else alert("You lose.");
		}
	});
	action.on('connect', function(socket){
		console.log('connect');
		action.emit('join',{
			name: $alias,
			ip: $ip,
		});
	});
	action.on('re', ()=>{
		reset();
	});
	action.on('ready', ()=>{
		isPlaying = true;
	});
	action.on('turnUp', ()=>{
		// 한 턴의 종료 세 턴 끝나야 win lose 표출.
		if( turnedIter > 3 ) action.emit('end');
		else if( isPlaying ){
			turnUp();
			setTimeout(()=>{action.emit('turnUpToServer');}, 1500);
			if( turnedIter == 3){
				if( $turn == 1 ) $turn = 0;
				else $turn = 1;
			}
		}
	  
	});
	action.on('notice', (data)=>{
		document.getElementById('notice').innerHTML = data;
	});
	action.on('disconnect', function(){
		document.write("disconnect..");
		action.close();
	});
	// onLoad.
	action.on('setup', function(socket){
		if( !socket ) return;
		else{
			if( socket.name != $alias){
				enemyHP = socket.HP;
				enemyMP = socket.MP;
				enemyRow = socket.row;
				enemyCol = socket.col;
				enemyAlias = socket.name;
			}
			else{
				HP = socket.HP;
				MP = socket.MP;
				row = socket.row;
				col = socket.col;
			}
		}
		clearField();
		// me
		document.getElementById(''+row + col).innerHTML = document.getElementById('' + row + col).innerHTML + $alias + " ";
		if( enemyAlias != null ){
			// enemy
			document.getElementById(''+enemyRow + enemyCol).innerHTML = document.getElementById('' + enemyRow + enemyCol).innerHTML + enemyAlias + " ";
		}
	})
	action.on('situation', function(socket){
		document.getElementById('currentCard').innerHTML = socket.card;
		if( !socket ) return;
		else{	
			if( socket.name != $alias ){
				if( socket.damage && socket.range ){
					if( socket.range[row+2-enemyRow][col+3-enemyCol] ){
						if( socket.damage - shield > 0 ){
							if( socket.knockback ){
								col = enemyCol + socket.move.col;
								if( col < 0 ) col = 0;
								if( col > MAX_COL ) col = MAX_COL;
							}
							HP = HP - socket.damage + shield;
						}
					}
				}
				if( socket.damage && socket.absoluteRange ){
					if( socket.absoluteRange[row][col] ){
						if( socket.damage - shield > 0 ){
							HP = HP - socket.damage + shield;
						}
					}
				}
				if( socket.move ){
					enemyRow += socket.move.row;
					enemyCol += socket.move.col;
					if( enemyRow < 0 ) enemyRow = 0;
					if( enemyRow > MAX_ROW ) enemyRow = MAX_ROW;
					if( enemyCol < 0 ) enemyCol = 0;
					if( enemyCol > MAX_COL ) enemyCol = MAX_COL;
				}
				if( socket.MP ){
					enemyMP += socket.MP;
					if( enemyMP > 5 ) enemyMP = 5;
				}
				if( socket.HP ){
					enemyHP += socket.HP;
					if( enemyHP > 5 ) enemyHP = 5;
				}
				if( socket.shield ){
					enemyShield = socket.shield;
				}
				shield = 0;
			}else{
				if( socket.damage && socket.range ){
					if( socket.range[enemyRow+2-row][enemyCol+3-col] ){
						if( socket.damage - enemyShield > 0 ){
							if( socket.knockback ){
								enemyCol = col + socket.move.col;
								if( enemyCol < 0 ) enemyCol = 0;
								if( enemyCol > MAX_COL ) enemyCol = MAX_COL;
							}
							enemyHP = enemyHP - socket.damage + enemyShield;
						}
					}
				}
				if( socket.damage && socket.absoluteRange ){
					if( socket.absoluteRange[enemyRow][enemyCol] ){
						if( socket.damage - enemyShield > 0 ){
							enemyHP = enemyHP - socket.damage + enemyShield;
						}
					}
				}
				// move
				if( socket.move ){
					row += socket.move.row;
					col += socket.move.col;
					if( row < 0 ) row = 0;
					if( row > MAX_ROW ) row = MAX_ROW;
					if( col < 0 ) col = 0;
					if( col > MAX_COL ) col = MAX_COL;
				}
				if( socket.MP ){
					MP += socket.MP;
					if( MP > 5 ) MP = 5;
				}
				if( socket.HP ){
					HP += socket.HP;
					if( HP > 5 ) HP = 5;
				}
				// attack
				if( socket.shield ){
					shield = socket.shield;
				}
				enemyShield = 0;
			}
			/* correcting HP and MP */
			document.getElementById('HP').innerHTML = HP;
			document.getElementById('MP').innerHTML = MP;
			document.getElementById('enemyHP').innerHTML = enemyHP;
			document.getElementById('enemyMP').innerHTML = enemyMP;

			clearField();
			// me
			document.getElementById(''+row + col).innerHTML = document.getElementById('' + row + col).innerHTML + $alias + " ";
			if( enemyAlias != null ){
				// enemy
				document.getElementById(''+enemyRow + enemyCol).innerHTML = document.getElementById('' + enemyRow + enemyCol).innerHTML + enemyAlias + " ";
			}
		}
	});
	
	reset();
	
	function reset(){
		if( $turn == 0 ){
			row = 0;
			col = 0;
			HP = 5;
			MP = 5;
			damage = 0;
		}
		else if( $turn == 1 ){
			row = MAX_ROW;
			col = MAX_COL;
			HP = 5;
			MP = 5;
			damage = 0;
		}
		moveTo(row, col);

	}
	function clearField(){
		document.getElementById('00').innerHTML = " ";
		document.getElementById('01').innerHTML = " ";
		document.getElementById('02').innerHTML = " ";
		document.getElementById('03').innerHTML = " ";


		document.getElementById('10').innerHTML = " ";
		document.getElementById('11').innerHTML = " ";
		document.getElementById('12').innerHTML = " ";
		document.getElementById('13').innerHTML = " ";


		document.getElementById('20').innerHTML = " ";
		document.getElementById('21').innerHTML = " ";
		document.getElementById('22').innerHTML = " ";
		document.getElementById('23').innerHTML = " ";
	}

	function moveTo(row, column){
		action.emit('setup', {
			row,
			col : column,
			HP,
			MP,
			damage,
			name : $alias,
			move,
			range,
		});
	}

	function pick1(){
		if( myTurnFixed === false){
			if( document.getElementById('pick1').innerHTML != " " ){
				for( var i = 1; i < 23; i++ ){
					if( document.getElementById('card' + i) ){
						if( document.getElementById('card'+i).innerHTML == "1" ){
							document.getElementById('card'+i).innerHTML = document.getElementById('pick1').innerHTML;
							document.getElementById('pick1').innerHTML = " ";
						}
					}
				}
			}
		}
	}

	function pick2(){
		if( myTurnFixed === false){
			if( document.getElementById('pick2').innerHTML != " " ){
				for( var i = 1; i < 23; i++ ){
					if( document.getElementById('card' + i) ){
						if( document.getElementById('card'+i).innerHTML == "2" ){
							document.getElementById('card'+i).innerHTML = document.getElementById('pick2').innerHTML;
							document.getElementById('pick2').innerHTML = " ";
						}
					}
				}
			}
		}
	}

	function pick3(){
		if( myTurnFixed === false ){
			if( document.getElementById('pick3').innerHTML != " " ){
				for( var i = 1; i < 23; i++ ){
					if( document.getElementById('card' + i) ){
						if( document.getElementById('card'+i).innerHTML == "3" ){
							document.getElementById('card'+i).innerHTML = document.getElementById('pick3').innerHTML;
							document.getElementById('pick3').innerHTML = " ";
						}
					}
				}
			}
		}
	}
	function turnUp(){
		var sendAction = {};
		//socket.
		if( turnedIter == 4 ) return;
		var card = document.getElementById('pick' + turnedIter).innerHTML;
		switch( card ){
			case "위로한칸":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: undefined,
					damage: undefined,
					name : $alias,
					move: {
						row: -1,
						col: 0,
					},
					range: undefined,
					card: "위로한칸",
				};
				break;
			case "왼쪽한칸":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: undefined,
					damage: undefined,
					name : $alias,
					move: {
						row: 0,
						col: -1,
					},
					range: undefined,
					card: "왼쪽한칸",
				};
				break;
			case "오른쪽한칸":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: undefined,
					damage: undefined,
					name : $alias,
					move: {
						row: 0,
						col: 1,
					},
					range: undefined,
					card: "오른쪽한칸",
				};
				break;
			case "아래한칸":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: undefined,
					damage: undefined,
					name : $alias,
					move: {
						row: 1,
						col: 0,
					},
					range: undefined,
					card: "아래한칸",
				};
				break;
			case "(좌)순간이동":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: -2,
					damage: undefined,
					name : $alias,
					move: {
						row: 0,
						col: -4,
					},
					range: undefined,
					card: "(좌)순간이동",
				};
				break;
			case "(우)순간이동":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: -2,
					damage: undefined,
					name : $alias,
					move: {
						row: 0,
						col: 4,
					},
					range: undefined,
					card: "(우)순간이동",
				};
				break;
			case "마나충전":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: 2,
					damage: undefined,
					name : $alias,
					move: undefined,
					range: undefined,
					card: "마나충전",
				};
				break;
			case "기본공격":
				sendAction={
					row,
					col,
					HP: undefined,
					MP: undefined,
					damage: 1,
					name : $alias,
					move: undefined,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 1, 1, 1, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "기본공격",
				};
				break;
			case "수호자의 방패":
				sendAction={
					row,
					col,
					name : $alias,
					MP: -1,
					shield: 3,
					card: "수호자의 방패",
				};
				break;
			case "심판":
				sendAction={
					row,
					col,
					MP: -3,
					damage: 4,
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 1, 1, 1, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "심판",
				};
				break;
			case "방패 던지기":
				sendAction={
					row,
					col,
					MP: -2,
					damage: 2,
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 1, 0, 1, 0, 0],
							[0, 0, 1, 1, 1, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "방패 던지기",
				};
				break;
			case "휘두르기":
				sendAction={
					row,
					col,
					MP: -2,
					damage: 2,
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 1, 0, 0, 0],
							[0, 0, 1, 1, 1, 0, 0],
							[0, 0, 0, 1, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "휘두르기",
				};
				break;
			case "방패돌진":
				let direction;
				if( enemyCol - col >= 0 ) direction = 2;
				else direction = -2;
				//일단 여기 넉백은 본인 위치로
				sendAction={
					row,
					col,
					MP: -2,
					damage: 1,
					knockback: true,
					move: {
						row: 0,
						col: direction,
					},
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 1, 1, 1, 1, 1, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "방패돌진",
				};
				break;
			case "마법사의 계약":
				sendAction={
					row,
					col,
					HP: -1,
					MP: 3,
					name : $alias,
					card: "마법사의 계약",
				};
				break;
			case "파이어월":
				sendAction={
					row,
					col,
					MP: -1,
					damage: 2,
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 1, 0, 0, 0],
							[0, 0, 0, 1, 0, 0, 0],
							[0, 0, 0, 1, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "파이어월",
				};
				break;
			case "파이어볼":
				sendAction={
					row,
					col,
					MP: -3,
					damage: 2,
					name : $alias,
					range: [[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0],
							[1, 1, 1, 0, 1, 1, 1],
							[0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0]],
					card: "파이어볼",
				};
				break;
			case "(홀)메테오":
				sendAction={
					row,
					col,
					MP: -4,
					damage: 2,
					name : $alias,
					absoluteRange: [[1, 0, 1, 0],
									[0, 1, 0, 1],
									[1, 0, 1, 0]],
					card: "(홀)메테오",
				};
				break;
			case "(짝)메테오":
				sendAction={
					row,
					col,
					MP: -4,
					damage: 2,
					name : $alias,
					absoluteRange: [[0, 1, 0, 1],
									[1, 0, 1, 0],
									[0, 1, 0, 1]],
					card: "(짝)메테오",
				};
				break;
			default:
				sendAction=undefined;
				break;
				
		}
		action.emit('action', sendAction);
		turnedIter++;
	}

	/* fix btn event */
	function fix(){
		if( document.getElementById('pick1').innerHTML != " " &&
		document.getElementById('pick2').innerHTML != " " &&
		document.getElementById('pick3').innerHTML != " " ){
			let mp = 0;
			let check = false;
			for( var i=1; i<4; i++){
				if( document.getElementById('pick'+i).innerHTML == "방패돌진" ) mp += 2 ;
				if( document.getElementById('pick'+i).innerHTML == "휘두르기" ) mp += 2 ;
				if( document.getElementById('pick'+i).innerHTML == "방패 던지기" ) mp += 2;
				if( document.getElementById('pick'+i).innerHTML == "심판" ) mp += 3;
				if( document.getElementById('pick'+i).innerHTML == "수호자의 방패" ) mp += 1;
				if( document.getElementById('pick'+i).innerHTML == "(홀)메테오" ) mp += 4;
				if( document.getElementById('pick'+i).innerHTML == "(짝)메테오" ) mp += 4;
				if( document.getElementById('pick'+i).innerHTML == "파이어볼" ) mp += 3;
				if( document.getElementById('pick'+i).innerHTML == "파이어월" ) mp += 1;
				if( document.getElementById('pick'+i).innerHTML == "(좌)순간이동" ) mp += 2;
				if( document.getElementById('pick'+i).innerHTML == "(우)순간이동" ) mp += 2;
				if( document.getElementById('pick'+i).innerHTML == "마나충전" ) mp -= 2;
				if( document.getElementById('pick'+i).innerHTML == "마법사의 계약" ){
					mp -= 3;
					if( HP == 1 ) mp += 100;
				}
				if( MP - mp < 0 ){ check = true; }
			}
			if( !check ){
				action.emit('turn' + $turn, true);
				myTurnFixed = true;
				alert(" ready. ");
			}else{
				alert(" not enough point. ");
			}
		}
		else{
			alert(" you need to have three cards. ");
			myTurnFixed = false;
		}
	}

	function card( element ){
		if( myTurnFixed === false ){
			var breakPoint = false;
			for( var j=1; j<4; j++){
				if( element.target.innerHTML != "1" && element.target.innerHTML != "2" && element.target.innerHTML != "3" ){
					for( var i=1; i < 4; i++ ){
						if( document.getElementById('pick' + i).innerHTML == " " ){
							document.getElementById('pick' + i).innerHTML = element.target.innerHTML;
							element.target.innerHTML = i;
							breakPoint = true;
							break;
						}
					}
				}
				if( breakPoint ) break;
			}
		}
	}
	document.getElementById('pick1').addEventListener('click', pick1, false);
	document.getElementById('pick2').addEventListener('click', pick2, false);
	document.getElementById('pick3').addEventListener('click', pick3, false);
	document.getElementById('fix').addEventListener('click', fix, false);
	for( var i = 1; i < 23; i++){
		if( document.getElementById("card" + i) ){
			document.getElementById("card" + i).addEventListener("click", card, false);
		}
	}

});

