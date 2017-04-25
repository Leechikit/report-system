const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let LogSchema = new Schema({
    url: String,
    time: Number,
    reportType: String,
    reportValue: String,
    appVersion: String,
    phoneType: String
});

mongoose.connect('mongodb://127.0.0.1/logs');

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
});

module.exports = mongoose.model('errorreport', LogSchema);