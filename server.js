const rp = require('request-promise');
const $ = require('cheerio');
const mongoose = require('mongoose');
const {news_lifestyle,news_sports,news_business} = require('./models/news')


const dburl = "mongodb://localhost:27017/scraper";
mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const urls = ['https://indianexpress.com/section/sports/','https://indianexpress.com/section/business/','https://indianexpress.com/section/lifestyle/'];


for(let i=0;i<urls.length;i++){
  
  if(i==0){
    Get_data(urls[i],"news_sports");
  }
  else if(i==1)
  {
    
    Get_data(urls[i],"news_business");
  }
  else{
    Get_data(urls[i],"news_lifestyle");
  }
}

function Api_call(subpageurl,schemaname){
  rp(subpageurl)
         .then(function(html) {
           let Title = $('div.nation > div.articles > h2 ',html).text().trim();
           Title = Title.replace(/^\s+|\s+$/gm,'.').split(".").filter(el => el !== '\n');
           let pages = $('div.nation > div.pagination > ul',html).text().trim();
           pages=pages.replace(/^\s+|\s+$/gm,'.').split(".").filter(el => el !== '\n');   
           for (i = 0; i < Title.length; i++) {
            let linkop = $(` div.nation > div:nth-child(${i}) > div.snaps > a    `,html).attr("href");
            let image = $(` div.nation > div:nth-child(${i}) > div.snaps > a > img`,html).attr("data-lazy-src");
            let sumr = $(` div.nation > div:nth-child(${i}) > p`,html).text();
            let ttl = $(` div.nation > div:nth-child(${i}) > h2`,html).text().split('\t').filter(el => el !== '' && el !== '\n' );
            let dte = $(` div.nation > div:nth-child(${i}) > div.date`,html).text();
            Save_data(schemaname,ttl,linkop,image,sumr,dte);
             }
             })
         .catch(function(err) {
           //handle error
           console.log(err);
         });
}


function Save_data(schemaname,ttl,linkop,image,sumr,dte){
  let sports;
  if(schemaname=="news_lifestyle"){
    sports = new news_lifestyle();
  }
  else if(schemaname=="news_business")
  {
    sports = new news_business();
  }
  else{
    sports = new news_sports();
  }
  
 sports.title=ttl[0];
 sports.link = linkop;
 sports.img=image;
 sports.summary=sumr;
 sports.date=dte;
 sports.save((err, doc) => {
   });
}
async function Get_data(url,schemaname){
  
  rp(url)
  .then(async function(html) {
    
    let Title = $('div.nation > div.articles > h2 ',html).text().trim();
    Title = Title.replace(/^\s+|\s+$/gm,'.').split(".").filter(el => el !== '\n');
    let pages = $('div.nation > div.pagination > ul',html).text().trim();
    pages=pages.replace(/^\s+|\s+$/gm,'.').split(".").filter(el => el !== '\n');
    let pl = parseInt(pages[pages.length-2].replace(/^\s+|\s+$/gm,'').replace(',',''));
    const timer = ms => new Promise(res => setTimeout(res, ms))

    for (let i = 0; i < Title.length; i++) {
      let linkop = $(` div.nation > div:nth-child(${i}) > div.snaps > a    `,html).attr("href");
      let image = $(` div.nation > div:nth-child(${i}) > div.snaps > a > img`,html).attr("data-lazy-src");
      let sumr = $(` div.nation > div:nth-child(${i}) > p`,html).text();
      let ttl = $(` div.nation > div:nth-child(${i}) > h2`,html).text().split('\t').filter(el => el !== '' && el !== '\n' );
      let dte = $(` div.nation > div:nth-child(${i}) > div.date`,html).text();
     
       Save_data(schemaname,ttl,linkop,image,sumr,dte);
      }
             if(pl>=1){
           for (let i = 2; i <= pl; i++) {

           let subpageurl=`${url}page/${i}/`
           await timer(1000);
            Api_call(subpageurl,schemaname);
           
         } 
       }
      })
  .catch(function(err) {
    //handle error
  });


}


