'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


var product_routes = require("./src/routes/productoRoutes");
var cuenta_routes = require("./src/routes/cuentaRoutes");
var user_routes = require("./src/routes/usuarioRoutes");
var category_routes = require("./src/routes/categoriaRoutes");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.use('/api',product_routes,user_routes,
category_routes,cuenta_routes )

module.exports = app;