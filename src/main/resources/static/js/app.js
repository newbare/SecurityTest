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
			when('/articleList/:category', {
				templateUrl : 'partials/article-list.html',
				controller  : 'articleListController'
			}).
			when('/article/:category/:articleId', {
				templateUrl : 'partials/article.html',
				controller  : 'articleController'
			}).
			when('/createArticle/:category', {
				templateUrl : 'partials/create-article.html',
				controller  : 'createArticleController'
			}).
			when('/updateArticle/:category/:articleId', {
				templateUrl : 'partials/edit-article.html',
				controller  : 'updateArticleController'
			}).
			when('/userList/:userType', {
				templateUrl : 'partials/user-list.html'
			}).
			when('/user/:userId', {
				templateUrl : 'partials/user.html',
				controller  : 'userController'
			}).
			otherwise({
				redirectTo : '/test'
			});

		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);

eCharmApp.run(function($rootScope) {
	// $rootScope.serverUrl = "https://localhost:9000/";
	$rootScope.serverUrl = "https://local.sevenloltest.com:9000/";
});

eCharmApp.controller('authController',
	function($scope, $rootScope, $http, $location, $window) {

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

		$scope.fbSignIn = function() {
			$window.location.href = $rootScope.serverUrl + 'auth/facebook';
		};

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

			$http.post($rootScope.serverUrl + 'accounts', accountData).success(function() {
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

		var testAuthentication = function() {
			$http.get($rootScope.serverUrl + 'user').success(function(data) {
      			if (data.name) {
        			$rootScope.authenticated = true;
      			} else {
        			$rootScope.authenticated = false;
      			}
    		}).error(function() {
      			$rootScope.authenticated = false;
    		});
		};

		$scope.test = function() {
			$http.get($rootScope.serverUrl + 'user').success(function(){
				$scope.success = true;
				$rootScope.authenticated = true;
			}).error(function(data) {
				$scope.fail = true;
				$rootScope.authenticated = false;
			});
		};

		testAuthentication();

	});

eCharmApp.controller("articleListController",
	function($scope, $rootScope, $routeParams, $http, $location, $route) {
		$scope.success = false;
		$scope.fail = false;
		$scope.category = $routeParams.category;
		$scope.articleList = [];
		$scope.errorStatus = -1;

		$scope.deleteArticle = function(category, articleId) {
			if (category == null || articleId == null)
				return;

			$http.delete($rootScope.serverUrl + 'articles/' + category + "/" + articleId).success(function(data, status, headers, config) {
				// $location.path("/articleList/" + category);
				$route.reload();
			}).error(function(data, status, headers, config) {
				// delete error
				alert("Delete-article failed. HTTP Status: " + status)
			});
		}

		$scope.deleteArticleInCategory = function() {
			$http.delete($rootScope.serverUrl + 'articles/' + $scope.category).success(function(data, status, headers, config) {
				$route.reload();
			}).error(function(data, status, headers, config) {
				// delete error
				alert("Delete-category failed. HTTP Status: " + status)
			});
		};

		$scope.deleteAllArticle = function() {
			$http.delete($rootScope.serverUrl + 'articles').success(function(data, status, headers, config) {
				$route.reload();
			}).error(function(data, status, headers, config) {
				// delete error
				alert("Delete-all failed. HTTP Status: " + status)
			});
		};

		var readArticleInCategory = function() {
			$http.get($rootScope.serverUrl + 'articles/' + $scope.category).success(function(data, status, headers, config) {
				$scope.success = true;
				if (data && data.length > 0) {
					$scope.articleList = data;
				}
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		};

		var readAllArticle = function() {
			$http.get($rootScope.serverUrl + 'articles').success(function(data, status, headers, config) {
				$scope.success = true;
				if (data && data.length > 0) {
					$scope.articleList = data;
				}
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		};

		if ($scope.category === "all")
			readAllArticle();
		else
			readArticleInCategory();
	});

eCharmApp.controller('articleController',
	function($scope, $rootScope, $routeParams, $http, $location, $route, $filter) {
		$scope.articleService = {
			success : false,
			faile   : false,
			errorStatus : -1
		};
		$scope.category = $routeParams.category;
		$scope.articleId = $routeParams.articleId;
		$scope.article = {};

		$scope.commentService = {
			success : false,
			faile   : false,
			errorStatus : -1
		};
		$scope.commentList = [];
		$scope.comment = {
			commenter_id : "test_commenter_id",
			author_response_text : "default_response_text",
			responded_at : "respond time"
		};

		var readArticle = function() {
			$http.get($rootScope.serverUrl + 'articles/' + $scope.category + "/" + $scope.articleId
			 ).success(function(data, status, headers, config) {
				$scope.articleService.success = true;
				if (data) {
					$scope.article = data;
				}
			}).error(function(data, status, headers, config) {
				$scope.articleService.fail = true;
				$scope.articleService.errorStatus = status;
			});
		};

		var readCommentList = function() {
			$http.get($rootScope.serverUrl + 'articles/' + $scope.category + "/" +
				      $scope.articleId + "/comments"
			 ).success(function(data, status, headers, config) {
				$scope.commentService.success = true;
				if (data && data.length > 0) {
					$scope.commentList = data;
				}
			}).error(function(data, status, headers, config) {
				$scope.commentService.fail = true;
				$scope.commentService.errorStatus = status;
			});
		};

		$scope.createComment = function() {
			var date = new Date();
			var parsedDate = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss Z', '+0800');
			$scope.comment.created_at = parsedDate;
			$scope.comment.updated_at = parsedDate;
			
			$http.post($rootScope.serverUrl + 'articles/' + $scope.category + "/" +
				      $scope.articleId + "/comments", $scope.comment)
			.success(function(data, status, headers, config) {
				$route.reload();
			}).error(function(data, status, headers, config) {
				alert("Create Comment Failed (HTTP Status: " + status + ")");
			});
		};

		readArticle();
		readCommentList();
	});

eCharmApp.controller('createArticleController',
	function($scope, $rootScope, $routeParams, $http, $location, $filter) {
		$scope.success = false;
		$scope.fail = false;
		$scope.category = $routeParams.category;
		$scope.errorStatus = -1;

		if ($scope.category === 'default')
			$scope.category = 'Category_1';

		$scope.article = {
			title : 'Title',
			author_id : 'Author ID',
			content_text : 'Content',
			image_arr : [],
			tag_arr : [],
			rating : 0,
			rating_count : 0
		};

		$scope.createArticle = function() {
			var date = new Date();
			var parsedDate = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss Z', '+0800');
			$scope.article.created_at = parsedDate;
			$scope.article.updated_at = parsedDate;

			$http.post($rootScope.serverUrl + 'articles/' + $scope.category, $scope.article
			 ).success(function(data, status, headers, config) {
				$scope.success = true;
				alert("Create Article Successfully!");
				$location.path("/articleList/" + $scope.category);
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		};
	});

eCharmApp.controller('updateArticleController',
	function($scope, $rootScope, $routeParams, $http, $location, $filter) {
		$scope.success = false;
		$scope.fail = false;
		$scope.category = $routeParams.category;
		$scope.articleId = $routeParams.articleId;
		$scope.article = {};
		$scope.errorStatus = -1;

		var readArticle = function() {
			$http.get($rootScope.serverUrl + 'articles/' + $scope.category + "/" + $scope.articleId
			 ).success(function(data, status, headers, config) {
				$scope.success = true;
				if (data) {
					$scope.article = data;
				}
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		}

		$scope.updateArticle = function() {
			$http.put($rootScope.serverUrl + 'articles/' + $scope.category + "/" + $scope.article.article_id, $scope.article
			 ).success(function(data, status, headers, config) {
				$scope.success = true;
				if (data) {
					$scope.article = data;
				}
				$location.path("/article/" + $scope.category + "/" + $scope.article.article_id);
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		};

		$scope.partiallyUpdateArticle = function() {
			$http.patch($rootScope.serverUrl + 'articles/' + $scope.category + "/" + $scope.article.article_id, $scope.article
			 ).success(function(data, status, headers, config) {
				$scope.success = true;
				if (data) {
					$scope.article = data;
				}
				$location.path("/article/" + $scope.category + "/" + $scope.article.article_id);
			}).error(function(data, status, headers, config) {
				$scope.fail = true;
				$scope.errorStatus = status;
			});
		};

		readArticle();
	});

eCharmApp.controller('userController', 
	function($scope, $rootScope, $routeParams, $http, $location){
		$scope.isEditMode = false
		$scope.userType = 'doctor';	
	});