var socketio = require('socket.io');
exports.socketServer = function(server) {
    var io = socketio.listen(server);
    var list = [];
    var del = function(elem) {
        var n = list.indexOf(elem);
        list.splice(n, 1);
    };
    io.sockets.on('connection', function(socket) {
        socket.emit('list', list);
        socket.on('addSong', function(data) {
            console.log(data);
            list.push(data);
            socket.broadcast.emit('addSong', data);
        });
        socket.on('delSong', function(data) {
            console.log(data);
            del(data);
            socket.broadcast.emit('delSong', data);
        });
    });
};
