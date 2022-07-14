const mongoose = require('mongoose')

const MostSearchedSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    }, 
    value:{
        type:Number,
        required:true
    },

})

module.exports = mongoose.model('MostSearchedData', MostSearchedSchema)