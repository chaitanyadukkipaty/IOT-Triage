var mongoose = require('mongoose');

var UID = mongoose.Schema({
	uid:String
	
});


module.exports = mongoose.model('UID', UID);
