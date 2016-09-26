var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	shoeSelection1: String,
	shoeSize1: String,
	shoeSelection2: String,
	shoeSize2: String,
	shoeSelection3: String,
	shoeSize3: String,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String
})

module.exports = mongoose.model('User', userSchema);