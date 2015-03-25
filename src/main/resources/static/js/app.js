var eCharmApp = angular.module('eCharmApp', ['ngRoute']);

eCharmApp.config(['$routeProvider', '$httpProvider',
	function($routeProvider, $httpProvider) {
		$routeProvider.
			when('/signin', {
				templateUrl : 'partials/signin.html',
				controller  : 'authController'
			}).
			when('/signup', {
				templateUrl : 'partials/signup.html',
				controller  : 'registerController'
			}).
			when('/test', {
				templateUrl : 'partials/test.html',
				controller  : 'testController'
			}).
			when('/articleList', {
				templateUrl : 'partials/article-list.html'
			}).
			when('/article', {
				templateUrl : 'partials/article.html'
			}).
			otherwise({
				redirectTo : '/test'
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

eCharmApp.controller('registerController',
	function($scope, $rootScope, $http, $location) {
		$scope.registered = false;
		$scope.error = false;
		$scope.accounts = {};
		$scope.signUp = function() {
			var accountData = {
				username: $scope.accounts.username,
				password: $scope.accounts.password,
				email:    $scope.accounts.email
			}

			$http.post('accounts', accountData).success(function() {
				$scope.registered = true;
			}).error(function(data) {
				$scope.error = true;
			});
		};
	});

eCharmApp.controller("testController",
	function($scope, $rootScope, $http, $location) {
		$scope.success = false;
		$scope.fail = false;
		$scope.test = function() {
			$http.get('test').success(function(){
				$scope.success = true;
			}).error(function(data) {
				$scope.fail = true;
			});
		}
	});
