var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var player_names = [];
var players = {};
players['player1'] = {};
players['player2'] = {};

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  //gets the users address from when connected
  if (players['player1'] === {}){
    players['player1']['id'] = socket.handshake.query.name
    console.log(players['player1']['id'])
  }
    else if (players['player2'] === {}){
    players['player2']['id'] = socket.handshake.query.name
  }
    else {
      io.emit('chat message', 'error: two players have already entered')
    }
    //sends "user connected" to page
    io.emit('chat message', 'a user has connected')
    //sends "user connected" to console
    console.log('a user connected');
    //when a message is sent
    socket.on('chat message',function(msg){
      //sends message to page
      io.emit('chat message', msg);
      //sends message to conosole
      console.log('message: ' + msg);
    });
    socket.on('ready',function(name){
    	console.log(name);
      if (players['player1'] === {}){
        players['player1']['name'] = name.handshake.query.names
      }
      else if (players['player2']['name'] === {}){
        players['player2']['name'] = name.handshake.query.names
      }
      else{
        io.emit('chat message', 'error: two players have already entered')
      }

	//player_names.append(name);
	//console.log(player_names);
    });
    socket.on('disconnect', function(){
      io.emit('chat message', 'a user has disconnected')
      //sends disconnect message to console
      console.log('user disconnected');
    });
});
//listens on the port heroku sets or 3000
http.listen((process.env.PORT||3000), function(){
  console.log('listening on *:3000');
});
