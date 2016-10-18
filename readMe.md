#ecommerce site utilizing MEAN stack (node.js, express, mongodb, and angular)
Fresh kicks is a fully functional e-commerce website that features new pairs of custom-selected shoes rotated on a weekly basis. The site is still a work in progress but current features include setting up an account and storing purchase data as well as making a verified purchase using stripe. You can make test payments in stripe and to actually make a purchase with the test credit card # please see the payments section below.

Built using:
* Angular.js
* Javascript/JQuery
* HTML/CSS/SASS
* Bootstrap
* Node.JS
* Express.JS
* MongoDB and Mongoose
* Stripe
* bcrypt

###Functionality and Processes

Key files and folders that will be referenced through this readme:
* [index.js](https://github.com/PirieD704/nodeEcommerce/blob/master/back-end/routes/index.js) houses most of the back-end good stuff.
* [mainController.js](https://github.com/PirieD704/nodeEcommerce/blob/master/js/mainController.js) the angular controller with most of the functional javascript
* [views](https://github.com/PirieD704/nodeEcommerce/tree/master/views) the views folder from our frontend that hold most of the html


This site is a single page application that utilizes angular.js to rotate through four separate views which make up the various stages of the shopping process.  There are two modals that are used for sign up and login which are built with bootstrap and carry separate html files as well.  The app requires just one controller with two dependencies: 
* ngRoute
* ngCookies

The services utilized are: 
* scope
* rootscope
* http
* timeout
* location
* cookies

the main page has some style to it but still needs a better introduction to what the site is about in the lower half of the page.  I put a greater emphasis on making the entire process complete, so for now this remains unfinished.  Some styling troubles were trying to have the main image featured without much content in the div itself and be reasonably dynamic to the screen size. It should not have been as hard as it was at the time but it turns out the top text box on the left needed padding comparable to the actual size of the picture.  This created the hard space needed for the image to live. then a position center and -250px on the top is what it took to get the image to sit properly. Here is the SASS for it.

```SASS
.section-1
	color: #eee
	background:
		image: url("images/nike-background.jpg")
		position: center -250px
		repeat: no-repeat
	-webkit-background:
		position: center
	.text-descript
		font-size: 20px
		padding-bottom: 600px
	.text-descript2
		text-align: right
		font-size: 24px
		padding-bottom: 20px
```
####Login/Logout and Register
Four functions are used to handle the processes of login/logout and register on the front-end in angular.  There are two post requests for the server side, one for login, and one for addAccount.  There's also is also a get request for getUserData tied to checking the user's token to see of they have a valid session stored.

```javascript
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
```
Here in the register function you can see that four properties are sent to the server in JSON from user input: username, password, password2, email.  In truth password2 should not be passed back to the server but should be checked before post request is made to confirm that the correct password was indeed entered. This is on the docket for future impelementation.  Next we have a .then method that handles our promise.  This takes two parameters, the first being our success function, and the second being our error function.  if we get a successful response back from the server, we  






