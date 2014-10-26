var express = require('express'),
	app	= express(),
	port = process.env.PORT || 8000;

require('./config/express')(app);
require('./config/routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;