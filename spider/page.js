


//var $ = require('jquery');

var fs = require('fs');
var iconv = require('iconv-lite');

var log = require('./log');
var path = require('path');

exports = module.exports = Page;


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
    }]
};
*/

/* constructor */
function Page(profile){
    var self = this;
    self.path = profile.path;
    self.status = profile.status;
    self.httpStatus = profile.httpStatus;
    self.title = profile.title;
    self.hashCode = profile.hashCode;
    self.html = profile.html;
    self.parent = profile.parent;
};


Page.statusDescription = {
    unscraped : '0',
    scraping  : '1',
    scraped   : '2',
    parsed    : '3'
};



/* set HashCode */
Page.prototype.setHashCode = function(hashCode){
    this.hashCode = hashCode;
};


/* profile */
Page.prototype.profile = function(){
    var profile = {};

    profile.path = this.path;
    profile.status = this.status;
    profile.httpStatus = this.httpStatus;
    profile.title = this.title;
    profile.hashCode = this.hashCode;
    profile.parent = this.parent;

    return profile;
};




/* is the page on status */
Page.prototype.isOnStatus = function(status){
    if(this.status == Page.statusDescription[status]){
        return true;
    }else{
        return false;
    }
};


/* set scraping status */
Page.prototype.setStatus = function(status){
    if(Page.statusDescription[status]){
        this.status = Page.statusDescription[status];
    }else{
        // an error happend.
    }
};


/* parse ancher hrefs in the page */
Page.prototype.parseAncherHref = function(fn){
    var self = this;


    /*$(self.html).find('a[href]').attr('href', function(index, href){
        fn(href);
    }); */


    //var pattern = /<a href=\"(.+)\"/g;
    //var pattern = /<a.?href=\"(http:\/\/\S+)(?=\"[ .?>| >|>][.?<\/a>|<\/a>])/g;
    //var pattern = /(?<=<a .?)href=\"(http:\/\/\S+)(?=\"[ .+>| >|>[.+<\/a>|<\/a>]])/g;
    //var pattern = /<a.?href=\"(http:\/\/\S+)(?=\"[.?><\/a>|><\/a>|.?>|>])/g;
    //var pattern = /<a.*href=\"(http:\/\/\S*)(?=\"[ .*>.*<\/a>|>.*<\/a>|><\/a>])/g;
    var pattern = /<a.*href=\"([http:\/\/|]\S*)(?=\"[ .*>.*<\/a>|>.*<\/a>|><\/a>])/g;
    var i = 0;
    var matches = null;
    //var matches = pattern.exec(html);
    //console.log(matches);
    do{
        var matches = pattern.exec(self.html);
        //console.log(i++, matches);
        if(matches && matches[1]){
            //console.log(matches[1]);
            //log.info(path.basename(__filename), __line, matches[1], 'get');
            //hrefs.push(matches[1]);
            fn(matches[1]);
        }
    }while(matches != null);


};


/* parse charset from html */
Page.prototype.parseHtmlCharset = function(){

    var self = this;

    var charset = '';
    //<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    //<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    var pattern = /<meta.+content=\".+charset=([\w|-]*)\".+\/>/gi;

    var matches = pattern.exec(self.html);

    if(matches && matches[1]){
        charset = matches[1];
    }

    return charset;
};



/* page convert html to UTF8 */
Page.prototype.convHtml2UTF8 = function(){

    log.info(path.basename(__filename), __line, 'convert to UTF8 start');

    var self = this;

    log.info(path.basename(__filename), __line, 'charset:', self.charset);

    //log.info(self.html);

    var bodycharset = self.parseHtmlCharset();
    if(bodycharset){
        self.charset = bodycharset;
    }

    log.info(path.basename(__filename), __line, 'charset:', self.charset);

    if(!self.charset){
        self.charset = 'UTF8';
    }

    log.info(path.basename(__filename), __line, 'charset:', self.charset);

    var buf = new Buffer(self.html,'binary'); 
    self.html = iconv.decode(buf, self.charset);
    //self.html = iconv.decode(buf, 'gb2312');
    
    log.info(path.basename(__filename), __line, 'convert to UTF8 end');
};


/* persist to hardware */
Page.prototype.persist = function(dir, fn){

    log.info(path.basename(__filename), __line, this.path, 'persist start');

    var self = this;
    //var file = './mirror/' + dir + (this.path == '/' ? 'index.html' : this.path);
    var file = '../mirror/' + dir + '/' + this.hashCode;

    log.trace(path.basename(__filename), __line, file);

    /*var fd = fs.open(file, 'w', function(err, fd){
        if(err){
            fn(err)
        }else{
            log.info(self.html);

            fs.writeSync(fd, self.html, 0, self.html.length, null, function(err, written, buffer){
                fs.close(fd, function(err){
                    fn(err);
                });
            });

        }
    });*/
    
    fs.writeFile(file, self.html, function(err){
        self.html = null; //import releas the momeroy.
        fn(err);
    });

    log.info(path.basename(__filename), __line, this.path, 'persist end');
};
