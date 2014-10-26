var request = require('request'),
	_ = require('lodash'),
	cheerio = require('cheerio'),
	colorsArr = require('./colors'),
	useDefaultImage = require('./imager').useDefaultImage;

function matchColors(description, colors) {
	'use strict';
	var des = description.toLowerCase().replace(/\.|\,/g, '').split(' ');

	return _.intersection(des, colors);
}

module.exports = function (url, done) {
	'use strict';

	request(url, function(err, res, html){
		if (err) {
			throw err;
		}

		var $ = cheerio.load(html),
			colors,
			json = {};
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

};