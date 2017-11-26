var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    title: String,
    company: String,
    body: String
},{collection: 'Document'});


module.exports = mongoose.model('Document', schema);