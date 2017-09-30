var path=require('path');
var express=require('express');
var less=require('less-middleware');
var morgan=require('morgan');

var app=express();

app.use(less(path.join(__dirname, '/public')));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var db = require('./config/db');

var server = app.listen(3000);
console.log('app started on 3000');
var socket = require('./config/socket.js');
socket.socketServer(server);
