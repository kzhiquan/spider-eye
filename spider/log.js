



var log4js = require('log4js');


log4js.configure({
	appenders:[
		{type : 'console'},
		{type : 'file', filename: './logs/spider.log'}
	]
});



exports = module.exports = log4js.getLogger();