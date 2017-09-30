var Db = require('tingodb')().Db,
  assert = require('assert'),
  dbdata = require('./db-data.js');

var db = new Db('./db', {});
var collection = db.collection("trees");
//populate db
//collection.insert(dbdata)


module.exports = {

  getAll: function(cb) {
    collection.find().toArray(function(err, docs) {
      cb(docs)
    })
  },

  findAll: function(rules, cb) {
    collection.find().toArray(function(err, docs) {
      console.log(docs.length)
      var filtered = docs.reduce(function(acc, item) {
        var itemPath = item.path
        for (var value in itemPath) {
          if (String(rules[value]).indexOf(itemPath[value]) === -1) {
            return acc
          }
        }
        return acc.concat(item)
      }, [])
      console.log(filtered.length)
      cb(filtered)
    })
  }
}
