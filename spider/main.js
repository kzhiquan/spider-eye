



/***************** extend for __line ******************/
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});



/****************** main logic *************************/
var profile = require('./profile');
var log = require('./log.js');
var Spider = require('./spider'); 

var path = require('path');



log.info('/*************** spider start *********************');

log.info(path.basename(__filename), __line, 'profile:', profile);

var spider = new Spider(JSON.parse(profile));

spider.start();




/****************** end tackle *************************/
process.on('exit', function(){
	spider.profile();
  spider.report();

	log.info('/*************** spider end *********************');
});


process.on('uncaughtException', function (err) {
  log.error('Caught exception: ' + err);
  process.exit();
});



process.on('SIGINT', function() {
    log.error('got SIGINT');
    process.exit();
});


/* git try */
   

















