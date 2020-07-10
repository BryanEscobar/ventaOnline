'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BillSchema = Schema({
    user: String,
    cuenta: [],
    date: Date,
})

module.exports = mongoose.model('Bill', BillSchema);