let numOfPlayers = 0;
let players = [];

module.exports = (req, res)=>{
  // play game when number of the players less than 2
  // req.app.get = app.get of parent router. (app.js)
  numOfPlayers = req.app.get('numOfPlayers');
  players = req.app.get('players');
  // 빈칸 찾기.
  if( players[0] == null ) emptyIdx = 0;
  else emptyIdx = 1;

  if( numOfPlayers < 2 ){
    res.render('lobby',{
      ip: res.locals.ip,
      name: req.body.name,
      character: req.body.character,
      turn: emptyIdx,
    });
  }
  else res.send("방이 꽉찼습니다.");
}