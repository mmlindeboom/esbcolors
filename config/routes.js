var exec = require('child_process').exec,
	scrape = require('./scrape'),
	imageUtil = require('./imager'),
	child;

module.exports = function(app) {
	'use strict';

	app.get('/', function(req, res){
		var url = 'http://www.esbnyc.com/explore/tower-lights/calendar';
		imageUtil.getImages();
		imageUtil.bustCache();
		scrape(url, function(data){
			res.render('index', {
				color: data.color,
				description: data.description,
				date: data.date,
				useDefaultImage: data.useDefaultImage
			});
		});
	});

	app.post('/postreceive', function(req, res){
		res.send(200);
		exec('git pull origin master & gulp sass & forever restart server.js', function(error, stdout, stderr){
			if (error) {
				throw error;
			}

			res.end();
			console.log(stdout);
		});
	});
};

