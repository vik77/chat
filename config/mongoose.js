var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect("mongodb://localhost/kurs");
module.exports = mongoose;				