var express = require('express'),
	app	= express(),
	imageUtil = require('./config/imager'),
	port = process.env.PORT || 8000;

imageUtil.getImages();
imageUtil.bustCache();

require('./config/express')(app);
require('./config/routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;