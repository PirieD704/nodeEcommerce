#ecommerce site utilizing MEAN stack (node.js, express, mongodb, and angular)
Fresh kicks is a fully functional e-commerce website that features new pairs of custom-selected shoes rotated on a weekly basis. The site is still a work in progress but current features include setting up an account and storing purchase data as well as making a verified purchase using stripe. You can make test payments in stripe and to actually make a purchase with the test credit card # please see the payments section below.

Built using:
* Angular.js
* Javascript/JQuery
* HTML/CSS/SASS
* Bootstrap
* Node.JS
* Express.JS
* MongoDB
* Stripe

###Functionality and Processes
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

* the main page has some style to it but still needs a better introduction to what the site is about in the lower half of the page.  I put a greater emphasis on making the entire process complete, so for now this remains unfinished.  Some styling troubles were trying to have the main image featured without much content in the div itself and be reasonably dynamic to the screen size. It should not have been as hard as it was at the time but it turns out the top text box on the left needed padding comparable to the actual size of the picture.  This created the hard space needed for the image to live. then a position center and -250px on the top is what it took to get the image to sit properly. Here is the SASS for it.

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


