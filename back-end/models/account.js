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