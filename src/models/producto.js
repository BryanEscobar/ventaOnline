'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: String, 
    category: String,
    stock: Number,
    vendido: Number,
})

module.exports = mongoose.model('Product', ProductSchema);