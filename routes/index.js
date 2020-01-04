var express = require('express');
var router = express.Router();
var numOfPlayers = 0;
var players = [];

/* GET home page. */
router.get('/', (req, res, next)=>{
  // log 추가
  let ip = req.headers['x-forwarded-for'] ||
  	req.connection.remoteAddress ||
  	req.socket.remoteAddress ||
  	(req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // dont have session.
  if( !req.session.username ) res.redirect('/login');
  else res.render('index', { ip });
});

// send data
router.post('/', (req, res)=>{
  let ip = req.headers['x-forwarded-for'] ||
  	req.connection.remoteAddress ||
  	req.socket.remoteAddress ||
  	(req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  console.log("%s entrance trying...", ip);
  // play game when number of the players less than 2
  // req.app.get = app.get of parent router. (app.js)
  numOfPlayers = req.app.get('numOfPlayers');
  players = req.app.get('players');
  // 빈칸 찾기.
  if( players[0] == null ) emptyIdx = 0;
  else emptyIdx = 1;

  if( numOfPlayers < 2 ){
  	res.render('game', {
		ip,
		name: req.body.name,
		character: req.body.character,
		turn: emptyIdx,
	});
  }
  else res.send("방이 꽉찼습니다.");
});

module.exports = router;
