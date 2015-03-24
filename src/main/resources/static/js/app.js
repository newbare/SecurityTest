var eCharmApp = angular.module('eCharmApp', ['ngRoute']);

eCharmApp.config(['$routeProvider', '$httpProvider',
	function($routeProvider, $httpProvider) {
		$routeProvider.
			when('/signin', {
				templateUrl : 'partials/signin.html',
				controller  : 'authController'
			}).
			when('/signup', {
				templateUrl : 'partials/signup.html'
			}).
			otherwise({
				redirectTo : '/signin'
			});

		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);

eCharmApp.controller('authController',
	function($scope, $rootScope, $http, $location) {

		var authenticate = function(credentials, callback) {
			var headers = credentials ? {authorization : "Basic "
        				  + btoa(credentials.username + ":" + credentials.password)
    					  } : {};

			$http.get('user', {headers : headers}).success(function(data) {
      			if (data.name) {
        			$rootScope.authenticated = true;
      			} else {
        			$rootScope.authenticated = false;
      			}
      			callback && callback();
    		}).error(function() {
      			$rootScope.authenticated = false;
      			callback && callback();
    		});
			// if (credentials.username === "user" &&
			// 	credentials.password === "password") {
			// 	$rootScope.authenticated = true;
			// }
		};

		$scope.credentials = {};

		$scope.login = function() {
			authenticate($scope.credentials, function() {
        		if ($rootScope.authenticated) {
          			$location.path("/");
          			$scope.error = false;
        		} else {
          			$location.path("/signin");
          			$scope.error = true;
        		}
      		});
		};

		$scope.logout = function() {
			$http.post('logout', {}).success(function() {
    			$rootScope.authenticated = false;
    			$location.path("/");
  			}).error(function(data) {
    			$rootScope.authenticated = false;
  			});
		}
	});