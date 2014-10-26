var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	_ = require('lodash'),
	request = require('request'),
	cheerio = require('cheerio'),
	Imagemin = require('imagemin'),
	jpegtran = require('imagemin-jpegtran'),
	im = require('imagemagick'),
	imageOpts = require('./imageOpts'),
	url = imageOpts.path,
	useDefaultImage = false,
	writeStream;

module.exports = {
	getImages: function () {
		'use strict';
		
		request(url, function(err, res, html){
			var $ = cheerio.load(html),
				img = $('.view-tower-lighting').find('img');
			if (_.isUndefined(img[2])) {
				console.log('Image doesn\'t exist');
				useDefaultImage = true;
				return;
			}
			writeStream = fs.createWriteStream('images/esb.jpg');
			path  = img[2].attribs.src.split('?')[0];

			http.get({
				host:'www.esbnyc.com',
				port:80,
				path: path
			}, function(res){
				var imageData = '';

				res.on('data', function(chunk){
					writeStream.write(chunk);
				});

				res.on('end', function(){
					writeStream.end();
					var imagemin = new Imagemin()
					.src('images/*.jpg')
					.dest('public/images')
					.use(jpegtran());

					imagemin.run(function (err, files) {
						if (err) {
							console.log(err);
							return;
						}
						console.log('Files optimized successfully!');
						if(!useDefaultImage) {
							im.resize(imageOpts.mobile, function(err, stdout, stderr){
								if(err) {
									console.log(err);
									return;
								}
								console.log('Image resized');
							});
						}
					});
				});
			});
		});
	},
	bustCache: function(){
		exec('gulp sass', function(err, stdout, stderr){
			if(err) {
				console.log(err);
			}
			console.log(stdout);
		});
	},
	useDefaultImage: useDefaultImage
};