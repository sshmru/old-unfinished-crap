var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cards', server, {safe:false});

var gamedata = {
	player:{
		max: 8,
		cards: []
	},
	ship:{
		max: 6,
		cards:[]
	},
	map1:{
		max: 3,
		cards:[]
	},
	map2:{
		max: 3,
		cards:[]
	}
};

var turn = function(){
	console.log('turn');
};

exports.intro = function(req, res){
	res.render('intro');
}

exports.start = function(req, res){	
	function sendEm(){
	//	console.log(gamedata.player.cards);
		res.render('ui', {data: gamedata});
	}
	function fillAll(callback){
		function fillOne(j){
			db.collection('test', function(err, collection) {
				collection.findOne(function(err, item) {
					if(j>0){
						gamedata.player.cards.push(item);
						j--;
						fillOne(j);
					}else{
						callback();
					}
				});
			});
		}
		fillOne(8);
		
	}
	fillAll(sendEm);
};

/*		var list = [];
		for(a in gamedata){
			list.push(a);
		}
		console.log(list);
		function fillTab(i){
			function fillOne(j){
				db.collection('test', function(err, collection) {
					collection.findOne(function(err, item) {
						if(j>0){
							gamedata[list[i]].cards.push(item);
							j--;
							fillOne(j);
						}else{
							callback();
						}
					});
				});
			}
			fillOne(gamedata[list[i]].cards.max);
			console.log(i);
			console.log(list[i]);
			if(i<list.length-1){
				fillTab(i+1);
			}
				
		}
		fillTab(0)	*/


exports.turn = function(req, res){
	turn();
	res.send('turn ended');
};

exports.exit = function(req, res){
	console.log('exit');
	res.send('exiting');
};

exports.move = function(req, res){
	console.log(gamedata.ship);
	gamedata[req.params.to].cards[req.params.slot2] = gamedata[req.params.from].cards[req.params.slot1];
	var a = gamedata[req.params.from].cards[req.params.slot1] 
	gamedata[req.params.from].cards[req.params.slot1] = {};
	console.log(gamedata.ship);
	res.send(a);
};
