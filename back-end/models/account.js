var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	shoeSelection: String,
	shoeSize: String,
	fullName: String,
	address1: String,
	address2: String,
	city: String,
	state: String
})

module.exports = mongoose.model('User', userSchema);