angular.module('auth-service', [])
	.controller('home', function($scope, $rootScope) {
		$rootScope.authenticated = false;
		$scope.credentials = {};
		$scope.login = function() {
			$rootScope.authenticated = true;
		}
		$scope.logout = function() {
			$rootScope.authenticated = false;
		}
	})