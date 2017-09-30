$(function () {
	var requestAnimation = (function() {
		return window.requestAnimationFrame 
		|| window.webkitRequestAnimationFrame 
		|| window.mozRequestAnimationFrame 
		|| window.oRequestAnimationFrame 
		|| window.msRequestAnimationFrame 
		|| function(callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	'use strict';
	var my_id,
		playersize=30,
		socket = io.connect('http://localhost:3000'),
		players=[],
		map_objects=[];
	var round = function round(n){
			return (n + (n > 0 ? .5 : -.5)) << 0;
	};
	var abs = function abs(n) {
            return (n < 0) ? -n : n;
    };	//w oparciu o jsperf, math jest powolne
	var MapObject = function(classid, nr, posx, posy, width, height){
		varself = this;
		this.classid = classid,
		this.nr = nr,
		this.posx = posx,
		this.posy = posy,
		this.width = width,
		this.height = height,
		this.hide = function(){
			$('#' + this.nr + '.' + this.classid).remove();
			}
	};
	var Player = function(nr, posx, posy, hp){
		var self = this;
		this.hp = 1,
		this.items = [],
		this.nr = nr,
		this.posx = posx,
		this.posy = posy,
		this.count = hp,
		this.stop = function(){ 
			this.count+=1;
			console.log('stop', this.nr);
			},
		this.death = function(){ 
			this.count+=1;
			console.log('death', this.nr);
			socket.emit('game_event',{event_name: 'death', damage: hp });
			this.hp -=this.hp;
			$('#' + this.nr + '.player').remove();
			},
		this.place = function(left, top) {
			var myleft = $('.map').offset().left - left;
			var mytop = $('.map').offset().top - top;
			
			$('#' + this.nr + '.player').css({left: myleft, top:mytop});
		},
		this.move = function(left, top, speed){
			if(self.hp <= 0){
				console.log('canot move when dead');
				return 0;
			}
			
			var startt = Date.now();
			this.count+= 1;//ma sluzyc do zrywania funkcji po otrzymaniu nowego polecenia
			var mycount = this.count;
			var movex = this.posx-left;
			var movey = this.posy-top;
			var draw = function(timestamp){//zarazzaraz... ten algorytm jest glupi(i powolny
				var drawStart = (timestamp || Date.now());
				var diff = drawStart - startTime;

				if (diff>speed){
					var stepx = round((movey === 0) ? movex : (movey > 0) ? movex/movey : -movex/movey);
					
					stepx=stepx/abs(stepx);
					if(mycount<self.count){
						return 0;
					}else
					if(movex === 0 && movey === 0){
						return 0;
					} else if(abs(stepx) >= 1){
						movex -= stepx;
						var stepy = round((movex === 0) ? movey : (movex > 0) ? movey/movex : -movey/movex);
						stepy = stepy/abs(stepy);
						if(abs(stepy) >= 1){
							movey-= stepy;
							$('#' + self.nr + '.player').css({left: '+=' + stepx, top: '+=' + stepy});
							self.posx -= stepx;
							self.posy -= stepy;
						} else {
							$('#' + self.nr + '.player').css({left: '+=' + stepx});
							self.posx -= stepx;
						}
					}else{
						var stepy = round((movex === 0) ? movey : (movex > 0) ? movey/movex : -movey/movex);
						stepy = stepy/abs(stepy);
						movey -= stepy;
						$('#' + self.nr + '.player').css({top: '+=' + stepy});
						self.posy -= stepy;
						
					}
					//movement emit
					socket.emit('move',{posx: self.posx, posy: self.posy});
					startTime = drawStart;
				}
				if(movex !== 0 && movey !== 0){
					requestAnimation(draw, $('#' + self.nr));
				}
			}
			var startTime = window.mozAnimationStartTime || Date.now();
			requestAnimation(draw, $('#' + self.nr));

		};
	};

	var placeobj = function(classid, nr, left, top, width, height) {
		var posx = $('.map').offset().left + left;
		var posy = $('.map').offset().top + top;
		$('#' + nr + '.' + classid).css({left: posx, top:posy, width: width, height:height});
	};
	
	var clearMap = function(){
		console.log('clear map');
		$('.map').empty();
	};
	

    socket.on('connect', function () {
		console.log('connected');
	});


	socket.on('remove_object', function(data){
		if(map_objects[data.nr]){
			map_objects[data.nr].hide();
			map_objects[data.nr]=undefined;
		}
	});

	
	socket.on('add_object', function(data){
		if(data.type === 'player_char'){

			if(players[data.nr] === undefined){
				players[data.nr] = new Player(data.nr, data.posx, data.posy, data.hp);
				players[data.nr].count += 1;
			} 
			console.log(data.nr, data.posx, data.posy, data.hp);
			if(data.hp >0){
				$('.map').append("<div class='player' id='" + data.nr + "'>" + data.nr + '<div class="center"><div></div>');
				players[data.nr].place(data.posx, data.posy);
			}
			if(my_id === undefined){ 
				my_id = data.nr;
				$('#' + data.nr + '.player').addClass('me');
			}
		}else if(data.type === 'map_object'){
			$('.map').append("<div class='" + data.classid + "' id='" + data.nr + "'>" + data.classid + '</div>');
			map_objects[data.nr] = new MapObject(data.classid, data.nr, data.posx, data.posy, data.width, data.height);
			placeobj(data.classid, data.nr, data.posx, data.posy, data.width, data.height);
			console.log(map_objects[data.nr]);
		}
		
	});
	
	socket.on('game_event', function(data){
		console.log(data.event_name);
		switch(data.event_name){
			case 'death' : players[data.nr].death();break;
			case 'stop' : players[data.nr].stop();break;
			case 'item' : 

				players[data.nr].items.push(data.object_name);
				socket.emit('remove_object', {nr: data.object_nr});
				break;
			case 'gate' : 
				if(players[data.nr].items.indexOf('key')!==-1){
					socket.emit('stage_passed');
					clearMap();
				}else{
					console.log('you need a key');
					respawnAll();
				}
				break;
		}
	});
	respawnAll = function(){
	
	};
	
	socket.on('player_dc', function(player){
		$('#' + player.nr + '.player').remove();
	});
	

	socket.on('move', function(data) {
		players[data.nr].posx = data.newx;
		players[data.nr].posy = data.newy;
		players[data.nr].place(data.newx, data.newy);
		//players[data.nr].move(data.newx, data.newy, 5);
	});
	

	
	$('.map').click(function(v) {
		var posx = $(this).offset().left - v.pageX;
		var posy = $(this).offset().top - v.pageY;
		//socket.emit('move',{posx: posx, posy: posy});
		players[my_id].move(posx, posy, 5);

	});


	
});

