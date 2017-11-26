var mongoose = require('mongoose');

module.exports.connect = (uri) => {
    mongoose.connect(uri);

    require('../model/Document');
}