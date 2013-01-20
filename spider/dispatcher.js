
var events = require('events');
var util = require('util');
var path = require('path');
var Connect = require('./connect');
var log = require('./log');

exports = module.exports = Dispatcher;


/* constructor */
function Dispatcher(options){
    log.info(path.basename(__filename), __line, 'options:', options);
    this.connect_pool_size = options.connect_pool_size;

    this.pool = [];
    this.connect_used_count = 0;
    events.EventEmitter.call(this);
    this.dispatch();
};


/* inherits events */
util.inherits(Dispatcher, events.EventEmitter);


/* connect_pool_full */
Dispatcher.prototype.isPoolFull = function(){
    return (this.connect_used_count === this.connect_pool_size) ? true : false;
};

/* profile */
Dispatcher.prototype.profile = function(){
    var profile = {};
    profile.connect_pool_size = this.connect_pool_size;
    profile.connect_used_count = this.connect_used_count;
    //profile.pool = this.pool;
    return profile;
};


// dispatch, listen the connect/task event
Dispatcher.prototype.dispatch = function(){

    var self = this;
    var debugcount = 0;

    self.on('connect', function(conn, sites){

        log.info("###################################################");
        log.trace(path.basename(__filename), __line, 'connect event start');

        //var count = 0;

        if(conn){
            self.pool.unshift(conn);
            self.connect_used_count--;
            log.info(path.basename(__filename), __line, 'an idle connect push pool');
        }

        sites.forEach(function(site, index, sites){

            log.info("--------------------------------------------------");
            log.info(path.basename(__filename), __line, 'dispatch site start:', site.host);

            site.resolve();

            /*debugcount++;
            if(debugcount>=2){
                log.info(path.basename(__filename), __line, 'helloworld', site.host);
                return;
            }*/

            log.info(path.basename(__filename), __line, 'unscraped_pages length:', site.unscraped_pages.length);
            while(site.unscraped_pages.length){

                var conn = self.pool.shift();

                if(conn){
                    log.info(path.basename(__filename), __line, 'an idle connect used');
                    //count++;
                    self.connect_used_count++;
                    conn.req(site);         
                }else if( !self.isPoolFull() ){
                    log.info(path.basename(__filename), __line, 'an new connect used');
                    conn = new Connect(self);
                    self.connect_used_count++;
                    //count++;
                    conn.req(site);
                }else{
                    log.info(path.basename(__filename), __line, 'there is no connect resource');
                    break;
                }
            }

            log.info(path.basename(__filename), __line, 'dispatch site end:', site.host);
            log.info("-----------------------------------------------------");
        });


        //the conn used in this loop.
        /*if(count === 0 && conn){
            log.info(path.basename(__filename), __line, 'an idle connect push pool');
            self.pool.push(conn);
            self.connect_used_count--;
        }*/

        log.info(path.basename(__filename), __line, 'connect event end');
        log.info("###################################################");
    });
};





