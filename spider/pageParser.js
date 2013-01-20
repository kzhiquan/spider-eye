


//var $ = require('jquery');

exports = module.exports = PageParser;

/* parse */
function PageParser(){};


/* parse anchor href */
PageParser.anchorHref = function(html, fn){
    /*var hrefs = [];
    $(html).find('a[href]').attr('href', function(index, href){
        hrefs.push(href);
    });
    fn(hrefs);*/



    var hrefs = [];
    //var pattern = /<a href=\"(.+)\"/g;
    var pattern = /<a href=\"(http:\/\/\S+)(?=\"[ .+>| >|>[.+<\/a>|<\/a>])/g;
    var i = 0;
    var matches = null;
    //var matches = pattern.exec(html);
    console.log(matches);
    do{
        var matches = pattern.exec(html);
        //console.log(i++, matches);
        if(matches && matches[1]){
            console.log(matches[1]);
            hrefs.push(matches[1]);
        }
    }while(matches != null);

    fn(hrefs);

    //ar matches = document.body.innerHTML.match(pattern);
    //console.log(matches);*/
};



/* parse img src */
/*PageParser.imgSrc = function(html, fn){
    var srcs = [];
    $(html).find('img[src]').attr('src', function(index, src){
        srcs.push(src);
    });

    fn(srcs);
};*/
