
const request = require('request');
const express = require('express');
const app = express();
var cors = require('cors');
const redis = require("redis");
var async = require("async");
const client = redis.createClient(process.env.REDIS_URL);
let Parser = require('rss-parser');
let parser = new Parser({
    customFields: {
      item: ['contentSnippet','categories','image/url','image'],
    }
  });


app.listen(process.env.PORT || 8080);
app.use(cors());

client.on("error", function(error) {
    console.error(error);
  });
client.del("feed['website']");
app.get('/ping',function (req,res) { 
    console.log('pong')
  res.send("pong")    
});

app.get('/hits', function (req, res) {
    var jobs = [];
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);
        if(keys){
            async.map(keys, function(key, cb) {
               client.get(key, function (error, value) {
                    if (error) return cb(error);
                    var job = {};
                    if(value!=null && value!=undefined){
                    job['topic']=key;
                    job['hits']=value;
                    cb(null, job);
                    }
                }); 
            }, function (error, results) {
               if (error) return console.log(error);
               console.log(results);
               res.json({data:results});
            });
        }
    });
});


app.get('/medium',function (req,res) {
    
    (async () => {
        let tag=req.query.topic
        client.incr(tag,redis.print)
        let feed = await parser.parseURL(`https://medium.com/feed/faun/tagged/${tag}`);
        datas=[]
        let i=0
        feed.items.forEach(item => {
            i=i+1
            if(i>10)
            return
          let title=item.title
          let creator=item.creator
          let link=item.link
          let categories=item.categories
          let pubDate=item.pubDate
          let tmp=item['content:encoded']
          let website="medium"
        let contentSnippet=""
        if(tmp!=null || tmp!=undefined){
            let x=tmp.split(".")
            for(let i=0;i<5;i++)
            contentSnippet+=x[i].replace( /(<([^>]+)>)/ig, '')
        }
        
          
         data={
             title,
             creator,
             link,
             categories,
             contentSnippet,
             pubDate,
             website
         }
         datas.push(data)
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datas, null, 3));
      })();
 });
 app.get('/devto',function (req,res) {
    
    (async () => {
        let tag=req.query.topic
        let feed = await parser.parseURL(`https://dev.to/feed/tag/${tag}`);
        
        datas=[]
        let i=0
        feed.items.forEach(item => {
            
            i=i+1
            if(i>10)
            return
          let title=item.title
          let creator=item.creator
          let link=item.link
          let categories=item.categories
          let contentSnippet=""
          let pubDate=item.pubDate
          let website="devto"
          if(item.contentSnippet!=null){
            let x=item.contentSnippet.split(".")
            for(let i=0;i<5;i++)
            contentSnippet+=x[i]
          }
          data={
              title,
              creator,
              link,
              categories,
              contentSnippet,
              pubDate,
              website
          }
          datas.push(data)
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datas, null, 3));
      })();
 });
 app.get('/reddit',function (req,res) {
    
    (async () => {
        let tag=req.query.topic
        let feed = await parser.parseURL(`https://www.reddit.com/r/${tag}/.rss`);
        datas=[]
        let i=0
        feed.items.forEach(item => {
            console.log(item)
            i=i+1
            if(i>10)
            return
          let title=item.title
          let creator=item.author
          let link=item.link
         let categories=""
         let contentSnippet=""
         let pubDate=item.pubDate
         let website="reddit"
         if(item.contentSnippet!=null){
           let x=item.contentSnippet.split(".")
           for(let i=0;i<5;i++)
           contentSnippet+=x[i]
         }
          data={
              title,
              creator,
              link,
              categories,
              contentSnippet,
              pubDate,
              website
          }
          datas.push(data)
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datas, null, 3));
      })();
 });
