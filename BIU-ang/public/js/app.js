angular.module('ytListApp', ['ngRoute', 'appRoutes', 'listCtrl', 'editCtrl', 'playCtrl'])
.factory('socket', function () {
    var socket = io.connect('http://' + location.host);

    return socket;
})
.factory('Data', function () {
    Data = {
        playList : []
    };
    return Data;
}) ;

