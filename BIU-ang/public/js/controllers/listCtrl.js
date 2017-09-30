angular.module('listCtrl', []).controller('listController', function($scope, socket, Data, $location) {
    $scope.list =Data.playList;

    $scope.formSong='';
    $scope.formArtist ='';
    $scope.formLink='';
    $scope.description = '';
    socket.on('list', function(data){
        $scope.list=data;
        $scope.$digest();
    });

    socket.on('addSong', function(data){
        $scope.list.push(data);
        $scope.$digest();
    });

    socket.on('delSong', function(data){
        $scope.del(data);
        $scope.$digest();
    });

    $scope.play = function(link){ 
       $location.path('/play/' + link);
    };

    var Song = function(song,artist,link){
        var obj = {
            song:song,
            artist:artist,
            link:link
        };
        return obj;
    };

    $scope.del = function(elem) {
        var n = $scope.list.indexOf(elem);
        $scope.list.splice(n, 1);
//        socket.emit('delSong', elem);
    };


    $scope.save = function() {
        var link = $scope.formLink.split('=')[1].split('&')[0];
        var data = new Song($scope.formSong, $scope.formArtist, link);
        data.id= ($scope.list[0])? $scope.list[$scope.list.length-1].id +1 : 0;
        $scope.list.push(data);
        socket.emit('addSong', data);
    };
});

