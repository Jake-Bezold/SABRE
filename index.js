var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var player_names = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(game){
    //sends "user connected" to page
    io.emit('chat message', 'a user has connected')
    //sends "user connected" to console
    console.log('a user connected');
    //when a message is sent
    game.on('chat message',function(msg){
      //sends message to page
      io.emit('chat message', msg);
      //sends message to conosole
      console.log('message: ' + msg);
    });
    socket.on('ready',function(name){
	console.log(name);
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
