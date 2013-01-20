


var fs = require('fs');
var path = require('path');
var Site = require('./site');
var Dispatcher = require('./dispatcher');
var log = require('./log');


exports = module.exports = Spider;

/*
var profile = {
    sites:[{
        host:'www.163.com',
        pages:[{
            path: '/',
            status: '0',
            httpStatus:undefined,
            title: '',
            hashcode: undefined,
            html: '',
            parent: undefined
        }],
        dir:"www.163.com",
        hashsize:5000
    }],
    dispatcher : {
        connect_pool_size : 100
    }
};
*/
/* constructor */
function Spider(profile){
    var self = this;

    //log.info(profile);

    var siteprofiles = profile.sites || [];

    //init scrape sites
    self.sites = [];
    siteprofiles.forEach(function(siteprofile, index, siteprofiles){
        var  site = new Site(siteprofile);
        self.sites.push(site);
    });

    //init dispatcher
    self.dispatcher = new Dispatcher(profile.dispatcher);
};



/* start the spider to scrape sites */
Spider.prototype.start = function(){
    log.info(path.basename(__filename), __line, 'start scrape');
    var self = this;
    self.dispatcher.emit('connect', null, self.sites);
    log.info(path.basename(__filename), __line, 'end scrape');
};


// persist to hardware where process exit 
Spider.prototype.profile = function(){

    log.info(path.basename(__filename), __line, 'profile start');

    var self = this;
    var profile = {};

    profile.dispatcher = self.dispatcher.profile();

    profile.sites = [];
    self.sites.forEach(function(site, index, sites){
        profile.sites.push(site.profile());
    });

    var now = new Date();
    var nowstr = now.getFullYear() + '_' + now.getMonth() + '_' + now.getDate() + '_' + 
                    now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

    var file = './profile/' + nowstr + '.js';

    fs.renameSync('./profile.js', file);


    //var fd = fs.openSync('./profile.js', 'w');

    var profileEnd = "\nexports = module.exports = profile;\n";

    //console.log('a');
    var profileJson = "var profile = \n\'" + JSON.stringify(profile);
    //console.log('b');


    var content = profileJson + '\'\n;' + profileEnd;

    fs.writeFileSync('./profile.js', content);

    //fs.writeSync(fd, content, 0, content.length, null);
    //fs.closeSync(fd);

    log.info(path.basename(__filename), __line, 'profile end');

    //log something.
};


// persist to hardware where process exit 
Spider.prototype.report = function(){

    var self = this;
    var profile = {};

    profile.dispatcher = self.dispatcher.profile();

    profile.sites = [];
    self.sites.forEach(function(site, index, sites){
        profile.sites.push(site.profile());
    });

    var now = new Date();
    var nowstr = now.getFullYear() + '_' + now.getMonth() + '_' + now.getDate() + '_' + 
                    now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds();

    var file = './report/' + nowstr + '.txt';



    //var fd = fs.openSync(file, 'w');

    var content = '/*****************spider report ********************/\n';
    content += '================= dispatcher:\n';
    content += 'connect_pool_size:' + profile.dispatcher.connect_pool_size + ' ';
    content += 'connect_used_count:' + profile.dispatcher.connect_used_count + '\n\n';

    content += '================= sites:\n';
    profile.sites.forEach(function(site, index, sites){
        content += 'site' + index + '=>';
        content += 'host:' + site.host + ';  dir:' + site.dir + ';  hashsize:' + site.hashsize + '\n';
        content += 'unscraped_pages:'+ site.unscraped_pages_length + '; scraping_pages:' + site.scraping_pages_length 
                + '; scraped_pages:' + site.scraped_pages_length + '; parsed_pages:'+ site.parsed_pages_length + '\n';

        site.pages.forEach(function(page, index, sites){
            content += index + '=>  status:' + page.status + ';  httpStatus:' + page.httpStatus + ';  hashCode:' + 
                    page.hashCode + ';  title:' + page.title + ';  path:' + page.path + ';  parent:' + page.parent + '\n';
        }); 

        content += '\n';

    });

    fs.writeFileSync(file, content);
    //fs.writeSync(fd, content, 0, content.length, null);

    //fs.closeSync(fd);

    //log something.
};






















