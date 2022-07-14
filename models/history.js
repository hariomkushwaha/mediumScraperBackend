const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    query:{
        type: String,
        required: true
    }, 
    date:{
        type:String,
        required:false
    },
    sort:{
        type:Number,
        required: true
    }
})

module.exports = mongoose.model('HistoryData', HistorySchema)