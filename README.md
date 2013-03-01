An simple spider programmed by node.js.

It could grab web data from site, which you could configure by profile.js in the spider directory.
And then, after you run the spider, the data/file grabbed from the site would save in mirror diretory.
when the site has no url to crawl, the spider would stop, and it would save the current profile.js in 
profile directory, also would output the report about the page grabbed in the report directory.
If you are interested, run the code and have a fun.

====
1. spider directory: the spider code, the file main.js is the start file, you can run the spider as follows:
 
                       >node main.js
                     
2. mirror directory: the data/file grabbed from the site. the file named by url encode under some order.

3. digest directory: the part have not be completed, it would digest special information from the data the spider
                     crawled from site.


=====

The end.
