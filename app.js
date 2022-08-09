const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
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


const ProposalData = require("./models/proposal");

const History = require("./models/history");
const MostSearched = require("./models/mostsearched");


const uri =
  "mongodb+srv://sih2022:sih2022@cluster0.eos0rt8.mongodb.net/?retryWrites=true&w=majority"

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


const result =[];


app.get('/',function(req,res){
    res.json({api:'working fine! good to go.'})
})

app.get('/API/proposal' ,async function(req,res){
      const DataH = await ProposalData.find();
  res.json(DataH);
  })

    // let quH = "";
app.post('/API/proposal',async function(req,res){
   
      // const quality = req.body.quality;
      // const durability=   req.body.durability;
      // const usability=    req.body.usability;
      // const ge=           req.body.ge;
      // const se=           req.body.se;
      // const pmexp=        req.body.pmexp;
      // const dbmexp=       req.body.dbmexp;
      // const coexp=        req.body.coexp;
      // const cost=         req.body.cost;
      // const duration =    req.body.duration;

            
                const PropsalDatas = new ProposalData({
                  quality : req.body.quality,
                   durability:  req.body.durability,
                   usability:    req.body.usability,
                   ge:req.body.ge,
                   se: req.body.se,
                   pmexp:req.body.pmexp,
                   dbmexp:req.body.dbmexp,
                   coexp: req.body.coexp,
                   cost:req.body.cost,
                   duration :req.body.duration
                  });
    
    
                console.log(PropsalDatas);
                  try {
                    const data = await PropsalDatas.save();
                  } catch (err) {
                    res.send("error" + err);
                  }
                  const Data = await ProposalData.find();
  res.json(Data);
                

});



// app.get('/API/history',async function(req,res){

//   const DataH = await History.find();
//   res.json(DataH);
// })


// app.get('/API/mostSearched',async function(req,res){

//   const DataM = await MostSearched.find();
  // res.json(result);
// });



app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
})