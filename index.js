var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var player_names = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('chat message', 'a user has connected')
    console.log('a user connected');
    socket.on('chat message',function(msg){
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
    socket.on('ready',function(name){
	player_names.append(name);
	console.log(player_names);
    });
    socket.on('disconnect', function(){
      io.emit('chat message', 'a user has disconnected')
      console.log('user disconnected');
    });
});

http.listen((process.env.PORT||3000), function(){
  console.log('listening on *:3000');
});
