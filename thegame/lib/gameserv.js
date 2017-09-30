var socketio = require('socket.io')
  , cookie  = require('cookie')
  , connect = require('connect');
  
  
var player_nr=0, players=[], handshakes=[], newhand, mapsizex = 1024, mapsizey=768, mapTab = new Array(new Array()), objTab=[], object_nr=0;
var interactions={
	'fire' : 'death',
	'rock' : 'stop',
	'key' : 'item',
	'gate' : 'gate'
	};
var map_1 = [
	['fire', 250, 150, 100, 100],
	['fire', 250, 350, 80, 50],
	['key', 450, 350, 20, 20],
	['rock', 650, 350, 120, 70],
	['rock', 135, 333, 92, 81],
	['gate', 700, 600, 75, 100]
];

var map_2 = [
	['fire', 250, 150, 50, 300],
	['fire', 450, 350, 200, 50],
	['fire', 450, 350, 220, 20],
	['rock', 650, 350, 120, 70],
	['key', 135, 333, 20, 20],
	['gate', 700, 50, 75, 100]
];

function socketConnected(socket){
	//socket.on('logindata', function(data){
	//	if(data.type === 'spectator'){
		
	//		console.log('spectator joined');
			//suscribe all rooms but dont add player
		
	//	} else {
			if(handshakes.indexOf(newhand)!==-1){
				playerReconnect(socket);
			}else{
				newPlayer(socket);
			}
		
	//	}
	//});
}

function playerReconnect(socket){
	var old = players[handshakes.indexOf(newhand)];
	socket.player_nr = old.player_nr;
	socket.player_posx = old.player_posx;
	socket.player_posy = old.player_posy;
	socket.player_hp = old.player_hp;
	players[socket.player_nr]=socket;
	showMe(socket);
	playerPositions(socket);
	drawMap(socket);
	console.log('player reconnected ' + socket.player_nr);
}

function showMe(socket){
	var obj = {
		type: 'player_char',
		nr: socket.player_nr,
		posx: socket.player_posx,
		posy: socket.player_posy,
		hp: socket.player_hp
	} ;
	socket.emit('add_object', obj);
	
	socket.broadcast.emit('add_object', obj);
}

function newPlayer(socket){
	socket.player_nr=player_nr;
	socket.player_posx=0;
	socket.player_posy=0;
	socket.player_hp = 1;
	players.push(socket);
	handshakes[player_nr] = newhand;
	showMe(socket);
	playerPositions(socket);
	player_nr+=1;
	console.log('joined ' + socket.player_nr);
	drawMap(socket);
};


function playerPositions(socket){
	for(i=players.length-1; i>=0; i--){
		if(players[i].disconnected!==true){
			if(i!==socket.player_nr){
				socket.emit('add_object', {
					type: 'player_char',
					nr: players[i].player_nr,
					posx: players[i].player_posx,
					posy: players[i].player_posy,
					hp: players[i].player_hp
				});
			}
		}
	}
};

function startMap(map_id){
		var i,x,y;
		/*	for(x=0; x<mapsizex; x++){
				mapTab[x]=new Array();
				for(y=0; y<mapsizey; y++){
				
					mapTab[x][y]=0;
				}
			}  */
		mapTab = new Array(mapsizex,mapsizey);
		objTab = [];
		for(i=0;i<map_id.length; i++){
			
				objectAdd(map_id[i][0], map_id[i][1], map_id[i][2], map_id[i][3], map_id[i][4]);
			
		}
		console.log('map initiated', map_id);
}

function removeCall(socket){
	socket.on('remove_object', function(data){
		objectRemove(data.nr);
		console.log('remove pls', data.nr);
		socket.emit('remove_object', {nr : data.nr});
		socket.broadcast.emit('remove_object', {nr : data.nr});
	});
}

function objectRemove(nr){
		if(objTab[nr]!==undefined){
			var posx=objTab[nr].posx, posy=objTab[nr].posy, width = objTab[nr].width, height = objTab[nr].height;
			for(x=posx; x<width+posx; x++){
				if (!mapTab[x]) mapTab[x] = []
				for(y=posy; y<height+posy; y++){
					
					mapTab[x][y]=undefined;
				}
			}

			objTab[nr]=undefined;
			console.log('object removed');
			console.log(objTab);
		}
}

function objectAdd(classid, posx, posy, width, height){
		var x, y;
		var obj = {
			type: 'map_object',
			classid:classid,
			nr: object_nr,
			posx: posx,
			posy: posy,
			width: width,
			height:height
		} ;
		
		for(x=posx; x<width+posx; x++){
			if (!mapTab[x]) mapTab[x] = []
			for(y=posy; y<height+posy; y++){
				
				mapTab[x][y]=object_nr;
			}
		}
		
		objTab.push(obj);
		object_nr += 1;
};


function drawMap(socket){
	var i;
	console.log('map loaded', objTab);
	for(i=0;i<objTab.length; i++){
		socket.emit('add_object', objTab[i]);
	}
}


	
function playerGameEvent(socket){
	socket.on('game_event', function(data){
		console.log('player',socket.player_nr,'event',  data.event_name);
		switch(data.event_name){
			case 'death' : socket.player_hp-=data.damage;break;

		}
	});
}

function playerMovement(socket){
	socket.on('move', function(data){
		if(mapTab[-data.posx]!==undefined ){
			if(mapTab[-data.posx][-data.posy]!==undefined){
				if(objTab[mapTab[-data.posx][-data.posy]]===undefined){
					return 0;
				}
				var ev = interactions[objTab[mapTab[-data.posx][-data.posy]].classid];
				var obj_nr = objTab[mapTab[-data.posx][-data.posy]].nr;
				gameEvent(socket, ev, obj_nr);
				console.log(mapTab[-data.posx][-data.posy]);
				return 0;
			}
		}
		

		socket.broadcast.emit('move', {
			nr: socket.player_nr,
			posx: socket.player_posx,
			posy: socket.player_posy,
			newx: data.posx,
			newy: data.posy
			
		});
		socket.player_posx=data.posx;
		socket.player_posy=data.posy;

	});
};

function gameEvent(socket, event_name, obj_nr){
	var obj = {
			nr: socket.player_nr,
			event_name: event_name,
			object_nr: obj_nr,
			object_name: objTab[obj_nr].classid
		}
	socket.broadcast.emit('game_event', obj);
	socket.emit('game_event', obj);
};
function stagePassed(socket){
	socket.on('stage_passed', function() {
		startMap(map_2);
	//	socket.broadcast.emit('player_dc', {nr: socket.player_nr});
		showMe(socket);
		drawMap(socket);
		playerPositions(socket);
	});
};

function playerDisconnected(socket){
	socket.on('disconnect', function() {
		console.log('player disconnected ' + socket.player_nr);
		socket.broadcast.emit('player_dc', {nr: socket.player_nr});
	});
};

exports.listen = function(server) {
    'use strict';
	var io = socketio.listen(server);
	startMap(map_1); //ladujemy 1 mape
    io.set('log level', 1);
	io.set('authorization', function(handshakeData, accept){
		if (handshakeData.headers.cookie) {
			handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
			handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
			newhand = handshakeData.sessionID;
			console.log(handshakeData.cookie['express.sid']);
			console.log(handshakeData.sessionID);
			
		}else{
			console.log('LOL3');
		}
		accept(null, true);
	});
	io.sockets.on('connection', function (socket) {
		socketConnected(socket);
		
		removeCall(socket)
		stagePassed(socket);
		playerGameEvent(socket);
		playerMovement(socket);
		playerDisconnected(socket);
    });
};