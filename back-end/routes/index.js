var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var User = require('../models/account')
mongoose.connect(mongoUrl);
// Include bcrypt to store hashed pass
var bcrypt =  require('bcrypt-nodejs')
var randToken = require('rand-token').uid;
//This is our config mudule. We have access to
//config.secretTestKey
var configVars = require('../config'); 
var stripe = require("stripe")("configVars.secretTestKey");

router.get('/', (req, res, next) => {
	User.find({}, (error,documents) =>{
		if(error){
			res.json(error);
		}else{
			res.json(documents);
		}
	})
	res.render('index', { title: 'Express' });
});

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

router.post('/stripe', (req, res, next) => {

	stripe.charges.create({
		amount: req.body.amount,
		currency: "usd",
		source: req.body.stripeToken,
		description: "Charge for " + req.body.email 
	}).then((charge) => {
		res.json({
			message: "paid"
		})
	}, (err) => {
		res.json({
			message: "failedPayment"
		})
	});
})

router.post('/login', (req, res, next) => {
	User.findOne(
		{username: req.body.username},  // This is the droid we're looking for
		function(error, document){
			//document is the document returned from our Mongo query.. ie, the droid.
			//The document will have a property for each field. WE need to check the password field
			//in the DB against the hashed bcrypt version
			if(document == null){
				//No match
				res.json({failure: "noUser"});
			}else{
				var loginResult = bcrypt.compareSync(req.body.password, document.password);
				if(loginResult){
					//The password is correct. Log them in.
					res.json({
						success: "userFound"
					});
				}else{
					//hashes did not match or the doc wasn't found. Goodbye
					res.json({
						failure: "badPass"
					})
				}
			}
		}
	)
})

router.get('getUserData', (req, res, next) => {
	var userToken = req.query.token; // the XXX in ?token=XXXXX
	if(userToken == undefined){
		//No token was supplied
		res.json({failure: "noToken"})
	}else{
		User.findOne(
			{token: userToken}, // This is the droid we're looking for
			(error, document) => {
				if(document == null){
					//this token is not in the system
					res.json({failure: 'badToken'}); //Angular will need to act on this information
				}else{
					res.json({
						username: document.username,
						grind: document.grind,
						frequency: document.frequency,
						token: document.token
					});
				}
			}
		)
	}
})


module.exports = router;
