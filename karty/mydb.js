var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cards', server, {safe:false});

db.open(function(err, db) {
    if(!err) {
        db.collection('test', {strict:true}, function(err, collection) {
            if (err) {
                populateDB();
            }
        });
    }
});

exports.index = function(req, res) {
	db.collection('test', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.render('mydb', {dblist: items});
		});
	});
};

exports.list = function(req, res) {
	db.collection('test', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};


/* callback inaczej.
exports.count = function(req, res) {
	function getdata(){
		console.log(data);
		res.json(data);
	}
	function getcount (callback){
		db.collection('test', function(err, collection) {
			collection.find().count(function(err, siz) {
				console.log(siz);
				callback();
			});
		})
	}
	getcount(getdata);
};
*/

exports.count = function(req, res) {
	var id = req.params.id;
		db.collection('test', function(err, collection) {
			collection.find().count(function(err, siz) {
				console.log(siz);
				res.json(siz)
			});
		})
};

exports.search = function(req, res) {
	var id = req.params.id;
	db.collection('test', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};
 
exports.add = function(req, res) {
    var item = req.body;
    db.collection('test', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.redirect('/mydb/');
            }
        });
    });
}
 
exports.update = function(req, res) {
    var id = req.params.id;
    var item = req.body;
    db.collection('test', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    db.collection('test', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                res.send(req.body);
            }
        });
    });
}

var populateDB = function(){
	var cards = [
	{
		name: 'red',
		descr: 'red1',
		effect: 'red2'
	}];
	
	db.collection('test', function(err, collection) {
		collection.insert(cards, {safe:true}, function(err, result) {});
	});
	
};