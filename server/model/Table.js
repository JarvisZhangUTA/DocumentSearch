var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    document_id: String,
    tags: String,
    body: String
},{collection: 'Table'});


module.exports = mongoose.model('Table', schema);