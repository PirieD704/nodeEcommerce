var ecommerceApp = angular.module("ecommerceApp", ['ngRoute', 'ngCookies']);
ecommerceApp.controller('ecommerceController', function($scope, $rootScope, $http, $timeout, $location, $cookies) {


	$(window).resize(function(){
		var W = $(window).width()
		if(W >= 1000){
			$('.section-1').css({"background-position": "center -250px"})
		}else{
			$('.section-1').css({"background-position": "none"})
		}		
	})


	var apiPath = "http://localhost:3000";

	checkToken();
	$scope.$watch(function () {
	    return location.hash
	}, function (value) {
		console.log($scope.userdata)
		if($scope.userdata.document.username != undefined){
			$('#welcome-text').text("Hi " + $scope.userdata.document.username)
	    	console.log($scope.userdata.document.username);
		}
	})


	$scope.register = () => {
		// if($scope.password != $scope.password2){
		// 	console.log()
		// }
		$http.post(apiPath + '/addAccount', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			// console.log(response)
			if(response.data.message == "added"){
				$cookies.put('token', response.data.token) //Will be used for validation
				$cookies.put('username', $scope.username) //Will be used strictly for info purposes
				$location.path('/options');
				$('#register').modal('hide')
			}else{
				console.log(response.data.message)
			}
		}, function errorCallback(response){
			console.log('fail');
			console.log(response);
		});

	};

	function checkToken(){
		if(($cookies.get('token') != undefined)){
			$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'),{})
			.then(function successCallback(response){
				console.log('this ran')
				// response.data.xxxxx = whatever res.json was in express.
				if(response.data.failure == 'badToken'){
					$location.path = '/login' //Goodbye
				}else if(response.data.failure == 'noToken'){
					$location.path = '/login' //No token. Goodbye
				}else{
					//the token is good. Response.data will have their stuff in it.
					$scope.userdata = response.data
					console.log("got something")
				}
			}, function errorCallback(response){
				// console.log(response)
			});
		}
	}
	$scope.login = () => {
		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.success == "userFound"){
				$cookies.put('token', response.data.token)
				console.log($cookies.get('token'))
				$cookies.put('username', $scope.username)
				$location.path('/options');
				$('#login').modal('hide')
			}
		}, function errorCallback(response){
			console.log(response.data);
		})
	}
		

	$scope.payOrder = function(userOptions) {
	    $scope.errorMessage = "";
	    var handler = StripeCheckout.configure({
	        key: publicTestKey,
	        image: 'assets/img/dc_roasters_200x124_lt.png',
	        locale: 'auto',
	        token: function(token) {
	            console.log("The token Id is: ");
	            console.log(token.id);

	            $http.post(apiUrl + '/stripe', {
	                amount: $scope.total * 100,
	                stripeToken: token.id,
	                token: $cookies.get('token')
	                    //This will pass amount, stripeToken, and token to /payment
	            }).then(function successCallback(response) {
	                console.log(response.data);
	                if (response.data.success) {
	                    //Say thank you
	                    $location.path('/receipt');
	                } else {
	                    $scope.errorMessage = response.data.message;
	                    //same on the checkout page
	                }
	            }, function errorCallback(response) {});
	        }
	    });
	    handler.open({
	        name: 'DC Roasters',
	        description: 'A Better Way To Grind',
	        amount: $scope.total * 100
	    });
	};
})

// Set up routes using the routes module
ecommerceApp.config(($routeProvider) => {
	$routeProvider.when('/',{
		templateUrl: 'views/main.html',
		controller: 'ecommerceController'
	}).when('/login',{
		templateUrl: 'views/login.html',
		controller: 'ecommerceController'
	}).when('/register',{
		templateUrl: 'views/register.html',
		controller: 'ecommerceController'
	}).when('/options',{
		templateUrl: 'views/options.html',
		controller: 'ecommerceController'
	}).when('/delivery',{
		templateUrl: 'views/delivery.html',
		controller: 'ecommerceController'
	}).when('/payment',{
		templateUrl: 'views/payment.html',
		controller: 'ecommerceController'
	}).otherwise({
		redirectTo: '/'
	})
})

