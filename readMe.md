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

##Functionality and Processes

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
###Login/Logout and Register
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
Here in the register function you can see that four properties are sent to the server in JSON from user input: username, password, password2, email.  In truth, password2 should not be passed back to the server but should be checked before post request is made to confirm that the correct password was indeed entered. This is on the docket for future impelementation.

One small obstacle is that was a quirk of using angular and bootstrap together is that my modal would not close via the typical attribute given by bootstrap "data-dismiss".  To fix this, I used a little JQuery to target the modal and hide it manually in the event of a successful callback.

Next I have a .then method that handles our promise.  This takes two parameters, the first being our success function, and the second being our error function.  if I get a successful response back from the server, we take the token created in index.js and store it in cookies along with the username. Location.path takes us to the options page so that the customer can get to shopping.  

```javascript
router.post('/addAccount', (req, res, next) => {
	
	var token = randToken(32);
	console.log(token);
    var newUser = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        email: req.body.email,
        token: token,
		// Add tokenExpDate
    });


    newUser.save((error, documentAdded) => {
    	if(error){
    		res.json({
    			message: error    		
    		})
    	}else{
    		res.json({
        		message: "added",
        		token: token
    		});
    	}
    });

});
```
This is the the router post that occurs when the user submits a register form.  I use bcrypt to encrypt the password for storage purposes in the event that the database is breached.  this bcrypt is used again during login to compare the encrypted password so at no point does the user's password get stored, and can therefore not be seen by anyone viewing the database or those who shouldn't be viewing the database.
```javascript
var loginResult = bcrypt.compareSync(req.body.password, document.password);
if(loginResult){
	//The password is correct. Log them in.
	res.json({
		success: "userFound",
		token: document.token,
		username: document.username
	});
}else{
	//hashes did not match or the doc wasn't found. Goodbye
	res.json({
		failure: "badPass"
	})
}
```
All the JSON that is being returned and recieved has proper error-handling for testing and debugging purposes.

I also have a checktoken function that is set to run anytime angular makes a change by being called at the top of the controller. It valid to make sure the user has a valid token and compares it with the token stored in the database.  It checks to see if their token is up to date or if they have a token at all.  Future plans for this include setting up the code so that the user's token expires after 30 minutes of inactivity or so. Although i don't always agree with websites that do this, it could be a good exercise in learning how to implement it.  the checktoken function update a feild called welcome text which either greets the guest by username or asks them to please login or register.
```javascript
function checkToken(){
	if(($cookies.get('token') != undefined)){
		$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'),{})
		.then(function successCallback(response){
			// response.data.xxxxx = whatever res.json was in express.
			if(response.data.failure == 'badToken'){
				$location.path('/') //Goodbye
				$('#welcome-text').text("Please Login or Register")
			}else if(response.data.failure == 'noToken'){
				$('#welcome-text').text("Please Login or Register")
				$location.path('/') //No token. Goodbye
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
```

###Shopping Page
if you would like to view the html for the shopping page you can click here to see it in its entirety
[options.html](https://github.com/PirieD704/nodeEcommerce/blob/master/views/options.html)
the shopping page, I feel, has some neat features to it by making use of transition and hover as well as show-hide. The shopping experience is based off of hover.  I will start by saying that this is not mobile friendly at all and that a (probably mostly bootstrap) version of the page will have to be built in and hidden on larger screen sizes.  For future projects I started to design sites from mobile first to desktop and this site is most of the reason for that.

The shoes expand when hovered on to be the most prominent feature on the page. The transition is at 0.8 seconds and the SASS for this goes as follows:
```SASS
	.feature-shoe-left:hover
		height: 350px
		width: 41%
	.feature-shoe:hover
		height: 450px
		width: 39%
	.center-shoe:hover
		height: 350px
		width: 53%
	.ease
		transition: all 0.8s ease-out
	.feature-shoe-left
		width: 23%
		height: 200px
	.feature-shoe
		width: 23%
		height: 250px
	.center-shoe
		width: 29%
		height: 220px
```
There was a little trial and error to find the right percentages for each shoe so that they did not appear warped on the page.  This also meant that each shoe required its own class defining the specific dimensions.

The best feature, in my humble opinion, about the this page is that the hover feature is also tied to populating the corresponding information to each shoe and that data (including the shoe size selection) can be passed back to Node and stored in mongo.  This is all based off of corresponding boolean values for each pair of shoes. A function runs for each shoe that is hovered over, affecting all three boolean values (making the hovered one True and the other two False):
```javascript
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
```
The sizes are populated in the dropdown using ng-options via this line of html
```HTML
<select ng-model="user_shoe_size" ng-options="size.size for size in sizes" class="btn btn-default dropdown-toggle">
	<option value="?" selected="selected"></option>
	<option label="{size}">{{size}}</option>
</select>
```
This is all leads to our conditional function in angular based off of which boolean is currently selected:
```javascript
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
```
there is probably a pretty way to do this that is a little more dynamic in pulling all the html from the currently selected text with the corresponding boolean value, so that may be in the plans for a future revision, but this is an effective, not too cumbersome solution seen here in coding in the data for the properties in the javascript itself.  You can note that the boolean states of the hoveredits determine what is sent back to the server.

####Sidebar: MongoDB and Mongoose Information
This is probably a time to go over the schema as I have layed it out in mongoose.  For anyone unfamiliar with Mongoose,  MongoDB(our database for this project) is a NoSQL BD and therefore carries no schemas(blueprint if you will) for the data that is being stored in it.  Mongoose allows us to define a Schema in how our JSON will be structured to make for easy access and inerpretation of the data in future pages(namely the payments page).  Here is the account.js file:
```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	order: [{
		"shoeSelection": String,
		"shoeSize": String,
		"price": String
	}],
	shipping: [{
		"fullName": String,
		"address1": String,
		"cityShipping": String,
		"stateShipping": String,
		"zip": String
	}]
})

module.exports = mongoose.model('User', userSchema);
```
To use what we had just talked about in creating our order information, user has a property order that contains an array with currently only one object which, in turn, has three properties of it's own.  The reason for the object within the array is the easy allowance of multiple future orders that would all be retrievable from this one user property order.  The same logic is applied to shipping in case multiple shipping addresses wanted.  It should be noted that the front-end is does not provide the options for multiple shoe selections at once or even multiple pairs for that matter, but I felt it was import to go ahead and plan for it on this side to make it a little easier in any future revisions.
####End Sidebar








