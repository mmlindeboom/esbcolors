var express = require('express'),
	http = require('http');
	fs = require('fs'),
	exec = require('child_process').exec,
	_ = require('lodash'),
	path = require('path'),
	request = require('request'),
	cheerio = require('cheerio'),
	format = require('dateformat'),
	colorsArr = require('./colors.js'),
	app     = express();
	
var useDefaultImage;


//App configurations
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/')));


//Helper functions
function matchColors(description, colors) {
	var des = description.toLowerCase().replace(/\.|\,/g, '').split(' ');

	return _.intersection(des, colors);
}

(function getImageOnLoad() {
	var url = 'http://www.esbnyc.com/explore/tower-lights';
	request(url, function(err, res, html){
		var $ = cheerio.load(html),
			img = $('.view-tower-lighting').find('img');
			if(_.isUndefined(img[2])) {
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
			});
		});
	});
})();

function scrape(url, done) {

	request(url, function(err, res, html){
		if (err) throw err;

		var $ = cheerio.load(html),
			color,
			colors,
			reason, 
			date = new Date(),
			description,
			json = {};

		json.date = format(date, 'dddd, mmmm dS, yyyy');

		if(useDefaultImage) {
			json.useDefaultImage = useDefaultImage;
		}

		$('.calendar-results').find('.lighting-desc').filter(function(){
			var data = $(this);
			json.description = data.text();
		});
		colors = matchColors(json.description, colorsArr);
		if (colors.length > 1) {
			colors.splice(colors.length-1, 0, 'and');
			json.color = colors.join(', ').replace('and,', 'and');
		} else {
			json.color = colors.join('');
		}
		done(json);
	});

}

app.get('/', function(req, res){
	var url = 'http://www.esbnyc.com/explore/tower-lights/calendar';
	
	scrape(url, function(data){

		res.render('index', {
			color: data.color,
			description: data.description,
			date: data.date,
			useDefaultImage: data.useDefaultImage
		});
	});
});

// app.get('/postreceive', function(req, res){
// 	var child = exec('git pull', function(error, stdout, stderr){
// 		if (error) throw error;
// 		console.log(stdout);
// 	});
// });

app.listen('8000');

console.log('Magic happens on port 8000');

exports = module.exports = app;