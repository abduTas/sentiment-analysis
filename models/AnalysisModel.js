var mongoose = require('mongoose');

var analysismodelschema = new mongoose.Schema({
  sentimentScore:{
    type:String
  },
  sentimentMagnitude:{
      type:String
  },
  textAnalysedCounter:{
      type:Number
  },
  sentimentText:{
      type:String
  },
  textTime:{
   type:Date,
   },
   textAnalysisCounter:{
    type:Number,
    default:1
   }
});

module.exports = mongoose.model('AnalysisModelSchema',analysismodelschema);
