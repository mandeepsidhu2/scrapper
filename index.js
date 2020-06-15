
const request = require('request');
const express = require('express');
const app = express();
let Parser = require('rss-parser');
let parser = new Parser();


app.listen(process.env.PORT || 8080);

app.get('/ping',function (req,res) { 
    console.log('pong')
  res.send("pong")    
});
app.get('/medium',function (req,res) {
    
    (async () => {
        let tag=req.query.topic
        console.log(tag)
        let feed = await parser.parseURL(`https://medium.com/feed/faun/tagged/${tag}`);
        console.log(feed.title);
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
         data={
             title,
             creator,
             link,
             categories
         }
         datas.push(data)
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(datas, null, 3));
      })();
 });
