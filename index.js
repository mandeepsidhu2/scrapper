const cheerio = require('cheerio');
const request = require('request');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.listen(process.env.PORT || 8080);

app.get('/ping',function (req,res) { 
    console.log('pong')
  res.send("pong")    
})

app.get('/medium',function (req,res) {
let datas = [];
    tag=req.query.topic
    console.log(tag)
    request(`https://medium.com/search?q=${tag}`,(err,response,html) => {

     if(response.statusCode === 200){
        const $ = cheerio.load(html);

        $('.js-block').each((i,el) => {
            if(i>9)
            return
            const title = $(el).find('h3').text();
            const article = $(el).find('.postArticle-content').find('a').attr('href');
            const image=$(el).find('.postArticle-content').find('img').attr('src');
            let data = {
                title,
                article,
                image
            }
            
            datas.push(data);
          
        })  
     }

     
    console.log(datas);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(datas, null, 3));
    })
})
