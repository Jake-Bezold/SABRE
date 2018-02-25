var WebSocketServer = require('websocket').server; var http = require('http');

//initializing global variables
var clients = [];
var objects = [];
var commands = [];
var player_names = [];
var player_pos_gps = [];
var player_pos_game = [];
var scaleLatm = .0000139479;
var scaleLongm = .00000899;
var scaleMU = 2.5;

//////////////
//objects.push(['player 1', 0.0, 0.0, 20, .5, 1, 2, 2.0, 1]);
//objects.push(['player 2', 4.0, 4.0, 20, .5, 1, 2, 2.0, 2]);
//commands.push(["move", 0, 10, [0,0], [4,4], true]);
//commands.push([null]);
//for (testiter = 0; testiter <= 20; testiter++){
//  var objectsJSON = JSON.stringify(objects);
//  console.log(testiter + ": " + objectsJSON);
//  console.log("commands: " + commands);
//  tick();
//}

//player_names.push('player1');
//player_names.push('player2');
//player_pos_gps.push([40.2721204424553, -74.7773093646938]);
//player_pos_game.push([0.0, 75.0]);
//player_pos.push([40.2731204424553, -74.7763093646938]);
//playerNum = 0;
//coords = [40.2722204424553, -74.7772093646938];

//player_pos_game[playerNum][1] = ((coords[1] - player_pos_gps[playerNum][1]) / scaleLongm / scaleMU) + player_pos_game[playerNum][1];
//player_pos_game[playerNum][0] = ((coords[0] - player_pos_gps[playerNum][0]) / scaleLatm / scaleMU) + player_pos_game[playerNum][0];
//player_pos_gps[playerNum][1] = coords[1];
//player_pos_gps[playerNum][0] = coords[0];

//console.log(player_pos_gps[playerNum]);
//console.log(player_pos_game[playerNum]);

//gameStart();

////////////////



var server = http.createServer(function(request, response) {
   console.log((new Date()) + ' Received request for ' + request.url);
   response.writeHead(404);
   response.end();
});
server.listen(process.env.PORT, function() {
   console.log((new Date()) + ' Server is listening on port ' + process.env.PORT);
});

wsServer = new WebSocketServer({
   httpServer: server,
   // You should not use autoAcceptConnections for production
   // applications, as it defeats all standard cross-origin protection
   // facilities built into the protocol and the browser.  You should
   // *always* verify the connection’s origin and decide whether or not
   // to accept it.
   autoAcceptConnections: false
});

function originIsAllowed(origin) {
 // put logic here to detect whether the specified origin is allowed.
 return true;
}
//sends the updates of every tick to the client as a json file
 function sendUpdates(){
   var objectsJSON = JSON.stringify(objects);
   console.log("Sending broadcast to " + clients.length + " clients.");
   clients.forEach(function(client) {
     if (client !== wsServer/* && client.readyState === WebSocket.OPEN*/) {
        console.log("Sent update");
        client.send(objectsJSON);
      }
   });
  }
wsServer.on('request', function(request) {
   if (!originIsAllowed(request.origin)) {
     // Make sure we only accept requests from an allowed origin
     request.reject();
     console.log((new Date()) + ' Connection from origin ' +
request.origin + ' rejected.');
     return;
   }

   var connection = request.accept("sabre", request.origin);
   clients.push(connection);
   console.log((new Date()) + ' Connection accepted.');
   var playerNum = player_names.length;
   player_names.push("");
   player_pos_gps.push([]);
   player_pos_game.push([]);



   connection.on('message', function(message) {
       if (message.type === 'utf8') {
           console.log('Received Message: ' + message);
           //var data = JSON.parse(buffer.toString('utf8'));
           //player_names[playerNum] = data.userName;
           //console.log("userName: " + player_names[playerNum])
           gameStart();
       }



       else if (message.type === 'binary') {
           console.log('Received Binary Message of ' +
message.binaryData.length + ' bytes');
           connection.sendBytes(message.binaryData);
       }
   connection.on('close', function(reasonCode, description) {
       console.log((new Date()) + ' Peer ' + connection.remoteAddress +
       ' disconnected.');
       clients.splice(clients.indexOf(connection), 1);
   });

 //trying start connection identifier thingy
  wsServer.on('newPlayer', function(name){
    console.log('Player name: ' + name);
    player_names[playerNum] = name;
  });
  wsServer.on('latlong', function(strcoords){
    var coords = JSON.parse(strcoords);
    if (player_pos_gps[playerNum] != null){
    player_pos_game[playerNum][1] = ((coords[1] - player_pos_gps[playerNum][1]) / scaleLongm / scaleMU) + player_pos_game[playerNum][1];
    player_pos_game[playerNum][0] = ((coords[0] - player_pos_gps[playerNum][0]) / scaleLatm / scaleMU) + player_pos_game[playerNum][0];
  }
    player_pos_gps[playerNum][1] = coords[1];
    player_pos_gps[playerNum][0] = coords[0];
    console.log(player_pos_gps[playerNum]);
    console.log(player_pos_game[playerNum]);

  });
 ////end that thingy
   });
});
   function gameStart() {
     // Calculate distance between both players

     // Create player game objects

     //(player_pos[0][0] * scaleLatm * scaleMU), (player_pos[0][1] * scaleLongm * scaleMU),
     //(player_pos[1][0] * scaleLatm * scaleMU), (player_pos[1][1] * scaleLongm * scaleMU)
     objects.push(['player 1', 0.0, -75.0, 20, .5, 1, 2, 2.0, 1]);
     objects.push(['player 2', 0.0, 75.0, 20, .5, 1, 2, 2.0, 1]);
     //console.log(objects);
     //console.log(scale);
     // Create capture point game objects
     objects.push(['capture 1', -10.0, -75.0, 20, .5, 1, 2, 2.0, 1]);
     objects.push(['capture 2', 10.0, -75.0, 20, .5, 1, 2, 2.0, 1]);
     objects.push(['capture 3', -10.0, 75.0, 20, .5, 1, 2, 2.0, 1]);
     objects.push(['capture 4', 10.0, 75.0, 20, .5, 1, 2, 2.0, 1]);

     setInterval(function () {sendUpdates()}, 1000);

   }

//runs continously to run ticks and send updates of all the units
//back to the client
   function gameLoop() {
       sendUpdates();
   }

//ticks contiously and executes commands when needed
   function tick() {
     for (i = 0 ; i < commands.length; i++){
       if (commands[i] != null) {
         execute(commands[i])
       }
     }
   }

//calls whatever function is needed based on command type
   function execute(cmd) {
     if (cmd[0] == null){
       return;
     } else if (cmd[0] == "move") {
       move(cmd)
     } else if (cmd[0] == "battle"){
       battle(cmd)
     } else if (cmd[0] == "idle"){
     } else {
       console.log("invalid command: " + cmd[0]);
     }
   }

//move function moves units the units to the "to" and if encounters enemy units
//calls the battle function

   function move(cmd){
     var cur_obj;
     cur_obj = objects[cmd[1]];
     console.log("cmd[2]: " + cmd[2] + ", objects[cmd[1]][2]: " + objects[cmd[1]][3] + ", first?: " + cmd[5]);
     if (cmd[5] == true && cmd[2] == objects[cmd[1]][3]){
       commands[cmd[1]][5] = false;
     }
     else if (cmd[5] == true){
       //console.log(commands);

       objects.push(cur_obj.slice());

       objects[objects.length-1][3] = cmd[2];

       objects[cmd[1]][3] -= cmd[2];

       cur_obj = objects[objects.length-1];

       commands.push(commands[cmd[1]]);
       //console.log(commands);

       commands[commands.length-1][5] = false;

       commands[cmd[1]] = [null];

       commands[commands.length-1][1] = commands.length-1;


       //console.log(commands);
     }

     console.log("Moving obj id: " + cur_obj[0]);
     var xi = cur_obj[1];
     var yi = cur_obj[2];
     var xf = cmd[4][0];
     var yf = cmd[4][1];
     var ms = cur_obj[4];
     var dist = 1.0
     if (xi <= xf) {
       if ((xi + ms) > xf) {
         cur_obj[1] = xf;
       } else {
         cur_obj[1] += ms;
       }
     }
     if (xi >= xf) {
       if ((xi - ms) < xf) {
         cur_obj[1] = xf;
       } else {
         cur_obj[1] -= ms;
       }
     }
     if (yi <= yf) {
       if ((yi + ms) > yf) {
         cur_obj[2] = yf;
       } else {
         cur_obj[2] += ms;
       }
     }
     if (yi >= yf) {
       if ((yi - ms) < yf) {
         cur_obj[2] = yf;
       } else {
         cur_obj[2] -= ms;
       }
     }
     var xi = cur_obj[1];
     var yi = cur_obj[2];
     if((objects[objects.length-1][1] == xf) && (objects[objects.length-1][2] == yf)) {
       commands[cmd[1]] = null;
     }
     for(i=0; i < objects.length; i++) {
       if((objects[i][1] - xi <= dist) && (objects[i][2] - yi <= dist)) {
         if(objects[i][8] != cur_obj[8] && i != objects.indexOf(cur_obj)) {
           console.log("Starting battle with objects: " + objects.indexOf(cur_obj) + ", " + i);
           commands[objects.indexOf(cur_obj)] = ["battle", objects.indexOf(cur_obj), i];
           commands[i] = ["idle"];

         }
       }
     }
   }

//causes the two units who interesected to battle each other until one of the
//objects "hp" gets down to 0 and splices the object from both the commands
//and objects array
   function battle(cmd){
     objects[cmd[2]][3] -= objects[cmd[1]][6];
     objects[cmd[1]][3] -= objects[cmd[2]][6];
     if (objects[cmd[2]][3] <= 0 || objects[cmd[1]][3] <= 0){
       commands[cmd[1]] = [null];
       commands[cmd[2]] = [null];
     }
     if (objects[cmd[2]][3] <= 0){
       commands.splice(cmd[2] , 1);
       objects.splice(cmd[2], 1);
     }
     else if (objects[cmd[1]][3] <= 0){
       commands.splice(cmd[1], 1);
       objects.splice(cmd[1], 1);
     }
   }
