var mongoose = require('mongoose');

var data = mongoose.Schema({
	uid:String,
	username:String,
	contact:String,
	sex:String,
	age:String,
	bloodgroup:String,
	priority:String,
	prevcond:String,
	currcond:String
})

module.exports = mongoose.model('data', data);
