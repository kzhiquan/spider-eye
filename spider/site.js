


var url = require('url');
var fs = require('fs');
var path = require('path');

var Page = require('./page');
var Hash = require('./hash');

var log = require('./log');



exports = module.exports = Site;

/*
var profile = {
    sites:[{
        host:'www.163.com',
        pages:[{
            path: '/',
            status: '0',
            httpStatus: undefined,
            title: '',
            hashcode: undefined,
            html: '',
            parent: undefined
        }],
        dir:"www.163.com",
        hashsize:5000
    }],

    dispatcher : {
        connect_pool_size: 100
    }
};
*/
function Site(profile){

    log.info(path.basename(__filename), __line, 'site init start');

    var self = this;

    // init basic property.
    self.host = profile.host;
    self.dir  = profile.dir;
    self.cookie = decodeURI(profile.cookie);

    self.unscraped_pages = [];
    self.scraping_pages = {};
    self.scraped_pages  = [];
    self.parsed_pages = [];

    self.hash = new Hash({
        hashsize:profile.hashsize
    });

    var pageprofiles = profile.pages || [];


    //init unscraped_pages, scraped_pages 
    pageprofiles.forEach(function(pageprofile, index, pageprofiles){
        var page = new Page(pageprofile);

        if(profile.rescrape){
            page.setStatus('unscraped');   
        }

        //filter
        if( page.isOnStatus('unscraped') || page.isOnStatus('scraping') 
            || page.isOnStatus('scraped') || page.httpStatus !== 200 ){
            self.unscraped_pages.push(page);
        }else{
            self.parsed_pages.push(page);
        }

        //hash map
        if(page.hashCode){
            self.hash.setHashCode(hashCode);
        }else{
            var hashCode = self.hash.calculateHashCode(page.path);
            self.hash.setHashCode(hashCode);
            page.setHashCode(hashCode);
        }
    });

    //init hash
    self.parsed_pages.forEach(function(page, index, parsed_pages){
        var hashCode = self.hash.calculateHashCode(page.path);
        self.hash.setHashCode(hashCode);
    });

    //init fs system mirror.
    if(!fs.existsSync('../mirror/' + self.dir)){
        fs.mkdirSync('../mirror/' + self.dir);
    };

    log.info(path.basename(__filename), __line, 'site:', self);
    log.info(path.basename(__filename), __line, 'site init start');
};


// is the url among in the site
Site.prototype.isHostNameSame = function(host){
    if( this.host.localeCompare(host) == 0 ){
        return true;
    }else{
        return false;
    }
};


/* profile */
Site.prototype.profile = function(){
    var self = this;

    var profile = {};

    profile.host = self.host;
    profile.hashsize = self.hash.hashsize;
    profile.dir = self.dir;
    profile.cookie = encodeURI(self.cookie);
    profile.pages = [];

    self.unscraped_pages.forEach(function(page, index, unscraped_pages){
        profile.pages.push(page.profile());
    });

    profile.unscraped_pages_length = self.unscraped_pages.length;

    var scraping_pages_count = 0;
    for(var hashCode in self.scraping_pages){
        var page  = self.scraping_pages[hashCode]
        if( page instanceof Page){
            profile.pages.push(page.profile());
            scraping_pages_count++;
        }
    }

    profile.scraping_pages_length = scraping_pages_count;

    self.scraped_pages.forEach(function(page, index, scraped_pages){
        profile.pages.push(page.profile());
    });

    profile.scraped_pages_length = self.scraped_pages.length;


    self.parsed_pages.forEach(function(page, index, parsed_pages){
        profile.pages.push(page.profile());
    });

    profile.parsed_pages_length = self.parsed_pages.length;


    return profile;
};

/* filter url */
Site.prototype.filterUrl = function(page, href){

    var self = this;

    var urlObj = url.parse(href);


    //log.info(path.basename(__filename), __line, 'urlObj:', urlObj);
    //log.info(path.basename(__filename), __line, 'href:', href);

    if(self.isHostNameSame(urlObj.host)){

        var hashCode = self.hash.calculateHashCode(urlObj.path);

        if(self.hash.isHashCodeSet(hashCode)){
            // the path scrapped.
            log.info(path.basename(__filename), __line, 'has scraped', urlObj.path);

        }else{
            self.hash.setHashCode(hashCode);

            var childPage = new Page({
                    path: urlObj.path,
                    hashCode: hashCode,
                    status: '0',
                    httpStatus : undefined,
                    title: '',
                    html : '',
                    parent: page.path
                });

            self.unscraped_pages.push(childPage);
            childPage = null;

            log.info(path.basename(__filename), __line, 'get', urlObj.path);
        }
    }else{
        //log.info(path.basename(__filename), __line, 'diff host', href); 
    }

};

/* parse */
Site.prototype.resolve = function(){

    log.info("************************************************");
    log.info(path.basename(__filename), __line, 'resolve start');

    var self = this;

    var page;
    while( page = self.scraped_pages.shift()){

        log.info(path.basename(__filename), __line, 'page resolove start:', page.path);


        // convUTF8
        page.convHtml2UTF8();


        // parse page url
        page.parseAncherHref(function(href){
            self.filterUrl(page, href);
        });


        // page content parse
        /**********************************/
        /**********************************/


        // save the page
        page.persist(self.dir, function(err){
            if(err){
                log.error(path.basename(__filename), __line, 'page persiste error', err);
            }else{
                log.info(path.basename(__filename), __line, 'page persiste complete', err);
                //page.html = null; // html will be undefined.
            }
        });


        page.setStatus('parsed');
        self.parsed_pages.push(page);

        log.info(path.basename(__filename), __line, 'page resolove end', page.path);
    };

    log.info(path.basename(__filename), __line, 'resolve end');
    log.info("************************************************");
};
