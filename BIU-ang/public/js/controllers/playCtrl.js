angular.module('playCtrl', []).controller('playController', function($scope, socket,$http, $sce, $routeParams) {
        $http.get('http://gdata.youtube.com/feeds/api/videos/'+ $routeParams.link +'?v=2&alt=json').success(function(data) {
            var descr = data.entry.media$group.media$description.$t;
            $scope.description = descr;
            $scope.$apply();
        });
        $scope.frameUrl =$sce.trustAsResourceUrl("http://www.youtube.com/embed/" + $routeParams.link) ;

});

