
const request = require('request');
const express = require('express');
const app = express();
var cors = require('cors');

let Parser = require('rss-parser');
let parser = new Parser({
    customFields: {
      item: ['contentSnippet','categories'],
    }
  });


app.listen(process.env.PORT || 8080);
app.use(cors());

app.get('/ping',function (req,res) { 
    console.log('pong')
  res.send("pong")    
});
app.get('/medium',function (req,res) {
    
    (async () => {
        let tag=req.query.topic
        console.log(tag)
        let feed = await parser.parseURL(`https://medium.com/feed/faun/tagged/${tag}`);
      
        datas=[]
        let i=0
        feed.items.forEach(item => {
            console.log(item.contentSnippet);
            i=i+1
            if(i>10)
            return
          let title=item.title
          let creator=item.creator
          let link=item.link
          let categories=item.categories
          let contentSnippet=""
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
             contentSnippet
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
       // console.log(tag)
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
              contentSnippet
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
              contentSnippet
          }
          datas.push(data)
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datas, null, 3));
      })();
 });
