const mongoose = require('mongoose')

const scrapDataSchema = new mongoose.Schema({
    search:{
        type: String,
        required: false
    },
    title:{
        type: String,
        required: false
    },
    author:{
        type:String,
        required:false
    },
    dates:{
        type:String,
        required:false
    },
    readTime:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
      },
    blogImage:{
        type:String,
        required:false
      },
    text:{
        type:String,
        required:false
      },
    link:{
        type:String,
        required:false
    },
    like:{
        type:String,
        required:false
    },  
    comment:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model('ScrapData', scrapDataSchema)