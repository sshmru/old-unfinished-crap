var flatiron = require('flatiron'),
  path = require('path'),
  fs = require('fs'),
  db = require('./lib/db.js'),
  app = flatiron.app;

app.config.file({
  file: path.join(__dirname, 'config', 'config.json')
});

app.use(flatiron.plugins.http);
app.use(flatiron.plugins.static, {
  dir: path.join(__dirname, '/public')
});

app.router.get('/', function() {
  var res = this.res
  fs.readFile(path.join(__dirname, '/public/index.html'), function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

app.router.get('/all', function() {
  var res = this.res
  db.getAll(res.json.bind(res))
});

app.router.get('/one', function() {
  var rules = {
    1: '1,2',
    2: '3',
    3: '1'
  }
  var res = this.res
  db.findAll(rules, res.json.bind(res))
});


app.start(3000);
