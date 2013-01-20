var profile = JSON.stringify({
    sites:[{
        host:'movie.douban.com',
        pages:[{
            path: '/',
            status: '0',
            httpStatus: undefined,
            title: '',
            hashcode: undefined,
            html: '',
            parent: undefined
        }],
        dir:"movie.douban.com",
        cookie : encodeURI('bid="VKpIE5M+TuQ"; __utma=30149280.1752107507.1351302076.1356832429.1358591647.20; __utmz=30149280.1358591647.20.19.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; viewed="4832825_10540066_20278174_2363876_10586326_5374414_4212172_2308234_1232061_5362856"; ll="118177"; __utma=223695111.548335238.1356357102.1358591681.1358593623.4; __utmz=223695111.1356431753.2.2.utmcsr=dianying.fm|utmccn=(referral)|utmcmd=referral|utmcct=/=hometown-boy; __utmb=30149280.42.9.1358594983500; __utmc=30149280; __utmc=223695111'),
        hashsize:10000,
        rescrape:true
    }],

    dispatcher : {
        connect_pool_size: 100
    }
});
exports = module.exports = profile;
