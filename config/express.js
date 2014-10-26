var express = require('express'),
	path = require('path');


module.exports = function(app){
	'use strict';
	//App configurations
	app.set('views', path.normalize(__dirname + '/../views'));
	app.set('view engine', 'jade');
	app.use(express.static(path.normalize(__dirname + '/..')));
};
