var WebSocketServer = require('websocket').server; var http = require('http');

//initializing global variables
var objects = [];
var commands = [];
var player_names = [];
var players = {};
players['player1'] = {};
players['player2'] = {};

objects.append(['player 1', 0.0, 0.0, 20, .5, 1, 2, 2.0, 1]);
var objectsJSON = JSON.stringify(objects);
console.log(objectsJSON)



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

wsServer.on('request', function(request) {
   if (!originIsAllowed(request.origin)) {
     // Make sure we only accept requests from an allowed origin
     request.reject();
     console.log((new Date()) + ' Connection from origin ' +
request.origin + ' rejected.');
     return;
   }

   var connection = request.accept("sabre", request.origin);
   console.log((new Date()) + ' Connection accepted.');
   connection.on('message', function(message) {
       if (message.type === 'utf8') {
           console.log('Received Message: ' + message.utf8Data);
           connection.sendUTF(message.utf8Data);
       }

//trying start connection identifier thingy
    wsServer.on('newPlayer', function(name)){
      console.log('Player name: ' + name)
    }
////end that thingy

       else if (message.type === 'binary') {
           console.log('Received Binary Message of ' +
message.binaryData.length + ' bytes');
           connection.sendBytes(message.binaryData);
       }
   });
//not sure if this is right
 wsServer.on('move', function(details)){
    console.log('details: ' + details)
//input details into command array here (thats the goal)
   }
 }

//runs continously to run ticks and send updates of all the units
//back to the client
   function gameLoop() {
     while(true){
       tick();
       sendUpdates();
     }
   }

//ticks contiously and executes commands when needed
   function tick(commands) {
     for (i = 0 , i < commands.length, i++){
       if (commands[i] != nil) {
         execute(commands[i])
       }
     }
   }

//calls whatever function is needed based on command type
   function execute(cmd) {
     if (cmd[0] == "move") {
       move(cmd)
     } else {
       battle(cmd)
     }
   }

//move function moves units the units to the "to" and if encounters enemy units
//calls the battle function
   function move(cmd) {}
     if (cmd[5] == true {
       var cur_obj = objects[cmd[1];
       objects.append(cur_obj);
       objects[-1][3] = cmd[2];
       cur_obj[3] -= cmd[2];
     }
     if (xi < xf) {
       if ((xi + ms) > xf) {
         xi = xf;
       } else {
         xi += ms;
       }
     }
     if (xi > xf) {
       if ((xi - ms) < xf) {
         xi = xf;
       } else {
         xi -= ms;
       }
     }
     if (yi < yf) {
       if ((yi + ms) > yf) {
         yi = yf;
       } else {
         yi += ms;
       }
     }
     if (yi > yf) {
       if ((yi - ms) < yf) {
         yi = yf;
       } else {
         yi -= ms;
       }
     }
     for(i=0; i < objects.len; i++) {
       if((objects[i][1] - xi < dist) && (objects[i][2] - yi < dist)) {
         if(objects[i][8] != curr_obj[8]) {
          commands[cmd[1]] = ["battle", cmd[1], objects.indexOf(objects[i][1])];
         }
       }
     }
     if((xi == xf) && (yi == yf)) {
       cmd = nil;
     }
   }

//causes the two units who interesected to battle each other until one of the
//objects "hp" gets down to 0 and splices the object from both the commands
//and objects array
   function battle(cmd){
     objects[cmd[2]][3] -= objects[cmd[1]][6];
     objects[cmd[1]][3] -= objects[cmd[2]][6];
     if (objects[2][3] <= 0){
       commands.splice(2 , 1);
       objects.splice(2, 1);
     }
     else if (objects[1][3] <= 0){
       commands.splice(1, 3);
       objects.splice(1, 3);
     }
   }

//sends the updates of every tick to the client as a json file
   function sendUpdates(){
     var objectsJSON = JSON.stringify(objects[]);
     ws.broadcast = function broadcast(objectsJSON) {
        ws.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(objectsJSON);
          }
        });
      };
    }

   connection.on('close', function(reasonCode, description) {
       console.log((new Date()) + ' Peer ' + connection.remoteAddress +
       ' disconnected.');
   });
});
