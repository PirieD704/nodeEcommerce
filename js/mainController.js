var ecommerceApp = angular.module("ecommerceApp", ['ngRoute', 'ngCookies']);
ecommerceApp.controller('ecommerceController', function($scope, $rootScope, $http, $timeout, $location, $cookies) {

	// var apiPath = "http://localhost:3000";
	var apiPath = "http://davidapirie.com:3000";


	var hoverEdit1
	var hoverEdit2
	var hoverEdit3

	W = window.width
	H = window.height

	checkToken();
	$scope.$watch(function () {
	    return location.hash
	}, function (value) {
		// if($scope.userdata.document.username != undefined){
		// 	$('#welcome-text').text("Hi " + $scope.userdata.document.username)
	 //    	console.log($scope.userdata.document.username);
		// }
	})

	// windowCheck() => {
	// 	if (W <= 1024) {
	// 		$('options-image')
	// 	}
	// }


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
				$('#register').modal('hide') // this is the manual way to hide the modal for login as the bootstrap dismiss doesnt work
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
				// response.data.xxxxx = whatever res.json was in express.
				if(response.data.failure == 'badToken'){
					$location.path('/login') //Goodbye
				}else if(response.data.failure == 'noToken'){
					$location.path('/login') //No token. Goodbye
				}else{
					//the token is good. Response.data will have their stuff in it.
					$scope.userdata = response.data
					console.log($scope.userdata)
					if($scope.userdata.document.username != undefined){
						$('#welcome-text').text("Hi " + $scope.userdata.document.username)
	    				console.log($scope.userdata.document.username);
	    			}
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
				$('#login').modal('hide') // this is the manual way to hide the modal for login as the bootstrap dismiss doesnt work
			}
		}, function errorCallback(response){
			console.log(response.data);
		})
	}

	// This submits the user selection of their shoes
	$scope.options = () => {
		console.log($cookies.get('token'))
		console.log("this did work")
		if($scope.hoverEdit1){
			console.log("hover1")
			$http.post(apiPath + '/options', {
				token: $cookies.get('token'),
				shoeSelection: 'MARK MCNAIRY KZK X ADIDAS HOOK SHOT 84-LAB',
				shoeSize: $scope.user_shoe_size,
				price: '110'
			}).then(function successCallback(response){
				console.log(response.data);
				if(response.data.message == "submitted"){
					$location.path('/delivery');
				}
			})
		}else if($scope.hoverEdit2){
			console.log("hover2")
			$http.post(apiPath + '/options', {
				token: $cookies.get('token'),
				shoeSelection: '2015 NEWEST NIKE AIR MAX LUNAR90 FLYKNIT',
				shoeSize: $scope.user_shoe_size,
				price: '94'
			}).then(function successCallback(response){
				console.log(response.data);
				if(response.data.message == "submitted"){
					$location.path('/delivery');
				}
			})
		}else if($scope.hoverEdit3){
			console.log("hover3")
			$http.post(apiPath + '/options', {
				token: $cookies.get('token'),
				shoeSelection: 'VANS ACID DENIM OLD SKOOL',
				shoeSize: $scope.user_shoe_size,
				price: '65'
			}).then(function successCallback(response){
				console.log(response.data);
				if(response.data.message == "submitted"){
					$location.path('/delivery');
				}
			})
		}
	}

	$scope.delivery = () => {
		console.log("something happened")
		console.log($scope.stateShipping)
		console.log($scope.zip)
		$http.post(apiPath + '/delivery', {
			token: $cookies.get('token'),
			fullName: $scope.fullName,
			address1: $scope.address1,
			cityShipping: $scope.cityShipping,
			stateShipping: $scope.stateShipping,
			zip: $scope.zip
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data.message == "submitted"){
				$location.path('/payment')
			}
		})
	}

	$scope.payOrder = function(userOptions) {
	    $scope.errorMessage = "";
	    var handler = StripeCheckout.configure({
	        key: "pk_test_uIlmc8NsFKhYPqMmNQHYpm7K",
	        image: 'assets/img/dc_roasters_200x124_lt.png',
	        locale: 'auto',
	        token: function(token) {
	            console.log("The token Id is: ");
	            console.log(token.id);

	            $http.post(apiUrl + '/stripe', {
	                amount: userdata.document.order[0].price * 100,
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

	$scope.myHoverEdit1 = function(){
		$scope.hoverEdit1 = true;
		$scope.hoverEdit2 = false;
		$scope.hoverEdit3 = false;
	}
	$scope.myHoverEdit2 = function(){
		$scope.hoverEdit1 = false;
		$scope.hoverEdit2 = true;
		$scope.hoverEdit3 = false;
	}
	$scope.myHoverEdit3 = function(){
		$scope.hoverEdit1 = false;
		$scope.hoverEdit2 = false;
		$scope.hoverEdit3 = true;
	}

	$scope.sizes = [
		{size: '7.5'},
		{size: '8'},
		{size: '8.5'},
		{size: '9'},
		{size: '9.5'},
		{size: '10'},
		{size: '10.5'},
		{size: '11'},
		{size: '11.5'},
		{size: '12'}
	]

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

