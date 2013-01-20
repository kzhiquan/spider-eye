




var http = require('http');
var events = require('events');
var path = require('path');
var util = require('util');
var log  = require('./log');

exports = module.exports = Connect;


/* constructor */
function Connect(dispatcher){
    this.dispatcher = dispatcher;
};


//req the server.
Connect.prototype.req = function(site){

    log.info(path.basename(__filename), __line, 'connect req start');


    var self = this;
    var options = {
        hostname: '',
        port: 80,
        method: 'GET',
        path: '/',
        headers: {
            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' : 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
            'Connection':'keep-alive',
            'Cache-Control' :  'max-age=0',
            'Host' :   site.host,
            //'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0'
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17',
            'Cookie' : site.cookie
        }
    };


    options.hostname = site.host;

    var page = site.unscraped_pages.shift();
    if(page){
        log.info(path.basename(__filename), __line, 'page req start:', page.path);

        options.path = page.path;
        page.setStatus('scraping');
        site.scraping_pages[page.hashCode] = page;

        var req = http.request(options);

        req.on('response', function(res){
        
            log.trace(path.basename(__filename), __line, 'page request response event start:', site.host, page.path);
            log.trace(path.basename(__filename), __line, site.host, page.path, 'httpstatus:', res.statusCode, res.headers);  // Content-Type    text/html; charset=GBK

            page.httpStatus = res.statusCode;
            page.charset = self.parserResHeadersCharset(res.headers);

            res.setEncoding('binary');//or hex

            res.on('data', function(chunk){
                page.html += chunk;
            });

            res.on('end', function(){
                log.trace(path.basename(__filename), __line, 'page response end event start:', site.host, page.path);
                page.setStatus('scraped');
                site.scraped_pages.push(page);
                delete site.scraping_pages[page.hashCode];
                //page = null;
                //self.emit('connect', self, [site]);
                //log.info(page.html);

                log.info(path.basename(__filename), __line, 'page response end event end:', site.host, page.path);
                self.dispatcher.emit('connect', self, [site]);
            });

            res.on('close', function(){
                //
                log.trace(path.basename(__filename), __line, 'page response close event:', site.host, page.path);
                self.dispatcher.emit('connect', self, [site]);
            });

            log.trace(path.basename(__filename), __line, 'page request response event end:', site.host, page.path);

        });

        req.on('error', function(err){
            log.error(path.basename(__filename), __line, 'page request error event:', site.host, page.path, err);
            self.dispatcher.emit('connect', self, [site]);
        });

        req.end();

        log.info(path.basename(__filename), __line, 'page req end:', page.path);

    }else{
        self.dispatcher.emit('connect', self, [site]);
    }

    log.info(path.basename(__filename), __line, 'connect req end');
};


//res headers Content-type: 
Connect.prototype.parserResHeadersCharset = function(headers){ 
    //'content-type': 'text/html; charset=GBK',
    var charset = '';
 
    //var pattern = /<a href=\"(http:\/\/\S+)(?=\"[ .+>| >|>[.+<\/a>|<\/a>])/g;

    var pattern = /charset=(.+)/g;
    headers['Content-Type'];

    var matches = pattern.exec(headers['content-type']);

    if(matches && matches[1]){
        charset = matches[1];
    }
    

    return charset;
};