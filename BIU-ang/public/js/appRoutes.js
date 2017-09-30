angular.module('appRoutes', []).config(['$routeProvider',
    function($routeProvider) {

        $routeProvider
        .when('/list', {
            templateUrl: 'views/edit.html',
            controller: 'editController'
        })
        .when('/play/:link', {
            templateUrl: 'views/play.html',
            controller: 'playController'
        })
        .when('/', {
            templateUrl: 'views/edit.html',
            controller: 'listController'
        })
        .otherwise({redirectTo: '/'});
    }]);
