const mongoose = require('mongoose')

// quality: quality,
// durability: durability,
// usability: usability,
// ge: ge,
// se: se,
// pmexp: pmexp,
// dbmexp: dbmexp,
// coexp: coexp,
// cost: cost,
// duration: duration,

const proposalDataSchema = new mongoose.Schema({
    quality:{
        type: String,
        required: false
    },
    durability:{
        type: String,
        required: false
    },
    usability:{
        type:String,
        required:false
    },
    ge:{
        type:String,
        required:false
    },
    se:{
        type:String,
        required:false
    },
    pmexp:{
        type:String,
        required:false
      },
      dbmexp:{
        type:String,
        required:false
      },
      coexp:{
        type:String,
        required:false
      },
      cost:{
        type:String,
        required:false
    },
    duration:{
        type:String,
        required:false
      }
})

module.exports = mongoose.model('ProposalData', proposalDataSchema)