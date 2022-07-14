const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const puppeteer = require('puppeteer');
const { response } = require("express");
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();


const PORT = process.env.PORT || 5000
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(express.json());


const ScrapData = require("./models/scrapeData");

const History = require("./models/history");
const MostSearched = require("./models/mostsearched");


const uri =
  "mongodb+srv://hariomk:hariomk@cluster0.ymkw1.mongodb.net/?retryWrites=true&w=majority"

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("connect to db");
  })
  .catch((e) => {
    console.log("error mongo", e);
  });

app.get("/", function (req, res) {
  res.json({ api: "working fine! good to go." });
});





app.get('/',function(req,res){
    res.json({api:'working fine! good to go.'})
})

app.get('/API/scrape' ,function(req,res){
    res.json(" ")})

    // let quH = "";
app.post('/API/scrape',async function(req,res){

    const Title =[];
    const Authors =[];
    const Dates =[];
    const ReadTime =[];
    const Image = [];
    const BlogImage=[];
    const Texts = [];
    const Link = [];
    // const Likes = [];
    // const Comments = [];
    const qu = req.body.data.qu;
    // quH = qu;

    console.log(qu);

    if(await ScrapData.find({search:qu}).count() === 0){

        (async () => {
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.goto('https://medium.com/search?source=home-------------------------------------&q='+qu);
    
            await page.waitForXPath('//div/a[@rel="noopener follow"]/div/h2');  //title
            await page.waitForXPath('//div/a[@rel="noopener follow"]/p');       // author, date and read
            await page.waitForXPath('//div/a[@rel="noopener follow"]/div/img[@src]'); //img
            await page.waitForXPath('//div/a[@rel="noopener follow"]/div/p'); //text
            await page.waitForXPath('//div/a[@aria-label="Post Preview Title"]')//link post
            // await page.waitForXPath('//div[@aria-hidden="false"]/p/button');//like
            // await page.waitForXPath('//div[@aria-hidden="false"]/button/p/span');//comment
    
    
            let elHandleTitle = await page.$x('//div/a[@rel="noopener follow"]/div/h2');
            console.log(elHandleTitle.length);
    
            let elHandleAuthor = await page.$x('//div/a[@rel="noopener follow"]/p');
            
    
            let elHandleImg = await page.$x('//div/a[@rel="noopener follow"]/div/img[@src]');
        
    
            let elHandleText = await page.$x('//div/a[@rel="noopener follow"]/div/p');
    
            let elHandleLink = await page.$x('//div/a[@aria-label="Post Preview Title"]');
    
            // let elHandleLike = await page.$x('//div[@aria-hidden="false"]/p/button');
    
            // let elHandleComment = await page.$x('//div[@aria-hidden="false"]/button/p/span');
    
            for(let ind=0;ind<elHandleTitle.length;ind++){
                const title = await page.evaluate(el => el.textContent, elHandleTitle[ind]);
                Title.push(title);
            }
    
            for(let ind=0;ind<40; ind = ind + 4){
                const Author = await page.evaluate(el => el.textContent, elHandleAuthor[ind]);
                // console.log(Author);
                const unwanted = await page.evaluate(el => el.textContent, elHandleAuthor[ind+1]);
                // console.log(Author);
                const date = await page.evaluate(el => el.textContent, elHandleAuthor[ind+2]);
                // console.log(date);
                const Read = await page.evaluate(el => el.textContent, elHandleAuthor[ind+3]);
                // console.log(Read);
                let slice;
                if(date.slice(0,8)==="·Updated"){
                slice = date.slice(17,21);
                // slice = datee.slice(17,21);
                // console.log(slice + "a");
                }else{
                slice = date.slice(9,13);
                }
                let checkdate = parseInt(slice);
                // console.log(slice + "  " + checkdate);

                let slice2 = unwanted.slice(9,13);
                let checkUnw = parseInt(slice2);
                // console.log(slice2 + "  " + checkUnw);

                let check2 = parseInt(Read);
                // console.log(check2);
                // console.log("-----------");
                // console.log(typeof(unwanted)=== "string");
                // console.log(Number.isInteger(checkdate));
                // console.log(Number.isInteger(check2));
                
                if(Number.isInteger(checkdate) && typeof(unwanted)=== "string"
                && Number.isInteger(check2)){
                  ReadTime.push(Read);
                  Authors.push(Author);
                  Dates.push(date);
                }else if(!Number.isInteger(checkdate) && !Number.isInteger(check2)){
                  Dates.push(unwanted);
                  Authors.push(Author);
                  ReadTime.push(date);
                  ind--;
                }
              }
              // let size = elHandleImg.length;
              // console.log(size);
            for(let ind=0;ind<elHandleImg.length-3;ind = ind + 3){

                const authorImg = await page.evaluate(el => el.currentSrc, elHandleImg[ind]);
                // Image.push(authorImg);
                // console.log(ind);
                const blogImg = await page.evaluate(el => el.currentSrc, elHandleImg[ind+1]);
                // BlogImage.push(blogImg);

                // let matchedImg = "https://miro.medium.com/fit/c/24/24/";
                // let matchedBlogImg = "https://miro.medium.com/fit/c/112/112/";

                let pattern1 = /24/;
                let result1 = pattern1.test(authorImg)
                // console.log(result1);
                let pattern2 = /112/;
                let result2 = pattern2.test(blogImg)
                // console.log(result2);
               
                if(result1 && result2){
                  
                  Image.push(authorImg);
                  BlogImage.push(blogImg);
                }else if(!result2 && result1){
                
                  Image.push(authorImg);
                  BlogImage.push("");
                  ind = ind - 2;
                }


// console.log("-------------------------------------------")
            }
      
    
            for(let ind=0;ind<elHandleText.length;ind++){
                const text = await page.evaluate(el => el.textContent, elHandleText[ind]);
                Texts.push(text);
            }
    
    
            for(let ind=0;ind<elHandleLink.length;ind++){
                const link = await page.evaluate(el => el.href, elHandleLink[ind]);
                Link.push(link);
            }
            
    
            await browser.close();
    
            for(let i=0;i<10;i++){
                const ScrapDatas = new ScrapData({
                    search:qu,
                    title: Title[i],
                    author: Authors[i],
                    dates: Dates[i],
                    readTime: ReadTime[i],
                    image:Image[i],
                    blogImage:BlogImage[i],
                    text: Texts[i],
                    link:Link[i]
                  });
    
    
                console.log(ScrapDatas);
                  try {
                    const data = await ScrapDatas.save();
                  } catch (err) {
                    res.send("error" + err);
                  }
              }
    
              const Data = await ScrapData.find({search:qu});





              let date = new Date().toUTCString().slice(5, 16);
              let countH= await History.find().count();
              console.log(qu + " " + date + " "+ countH);
              const Historys = new History({
                query:qu,
                date: date,
                sort: countH + 1
              });
  // Hist.push(Historys);
          //  console.log(Historys);
                  // if(quH !==""){
                    try {
                    
                      const data = await Historys.save();
                    } catch (err) {
                      res.send("error" + err);
                    }
                  
                 
                    const mostSearched = new MostSearched({
                      text:qu,
                      value: 1
                    });

                    try {
                    
                      const data = await mostSearched.save();
                    } catch (err) {
                      res.send("error" + err);
                    }



              
              res.json(Data);
              
              
    
          })();

    }else{

        const Data = await ScrapData.find({search:qu});
        

        let date = new Date().toUTCString().slice(5, 16);
              let count= await History.find().count();
              console.log(qu + " " + date + " "+ count);
              const Historys = new History({
                query:qu,
                date: date,
                sort: count + 1
              });
  // Hist.push(Historys);
          //  console.log(Historys);
                  // if(quH !==""){
                    try {
                    
                      const data = await Historys.save();
                    } catch (err) {
                      res.send("error" + err);
                    }

                    let timesM = await MostSearched.find({text:qu})
                    
                    let countM = timesM[0].value;
                    // console.log(timesM + qu)
                    await MostSearched.updateOne({ text: qu }, {
                      value: countM + 1
                    });


        res.json(Data);

    } 
   
});



app.get('/API/history',async function(req,res){

  const DataH = await History.find();
  res.json(DataH);
})


app.get('/API/mostSearched',async function(req,res){

  const DataM = await MostSearched.find();
  res.json(DataM);
})



app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
  })