const config = require('../config/config.js')
var mongoose =require("mongoose")
exports.getRegistration = (jwt,passcode)=>{
	return (req,res,next)=>{
	let username = req.body.username;
	let password  = req.body.password
	if(username == undefined || username == null || password== undefined || password == null)
		 res.json({ statusCode:404, message: 'username/password not provided' }); 
	else{	  
		let user = {username:username,password:password}
		let token = jwt.sign({user:user}, passcode, {
	          expiresIn: 1000
	        });
	
	        // return the information including token as JSON
        res.json({
          statusCode:200,
          message: 'Enjoy your token!',
          token: token,
          user:req.body
        });
	}        
 } 
}

exports.verifyLogin = (jwt,passcode)=>{
	return (req,res,next)=>{
		let token = req.body.token || req.query.token || req.headers['x-access-token'];
		jwt.verify(token,passcode,(err,decoded)=>{
			if(err){
				return res.json({ statusCode:404,message: 'Failed to authenticate token.' });    
			}
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
         next();
		})
	}
}




 exports.analyzeSentimentOfText =function(AnalysisModelSchema) {
 	return function(req,res,next){

 		  const language = require('@google-cloud/language').v1beta2;
const text = req.body.text
  // Creates a v1beta2 client
  const client = new language.LanguageServiceClient();

  /**
   * TODO(developer): Uncomment the following line to run this code.
   */
  // const text = 'Your text to analyze, e.g. Hello, world!';

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  AnalysisModelSchema.findOne({sentimentText:text},function(err,document){
  	if(err){
  		throw err;
  	}
    if(document != null){
    	var timediff = new Date()-document.textTime
    	console.log("document inside update",document.textTime,timediff)	

    	if(timediff>3600000){																																															
  	  	AnalysisModelSchema.update({sentimentText:text},{$inc:{textAnalysisCounter:1}},function(err,doc){
  	  			  	result={
  	  		sentimentText:document.sentimentText,
  	  		sentimentScore:document.sentimentScore,
  	  		sentimentMagnitude:document.sentimentMagnitude,
  	  		previousTextTimestamp:document.textTime,
  	  		message:"Old Message"
  	  	}
  	  	  	console.log("document updated",)

  	  	res.json({"analysisresult":result})
  	  	})
      }  
    }
  })
  // Detects the sentiment of the document
  client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      console.log(`Document sentiment:`,sentiment);
      console.log(`  Score: ${sentiment.score}`);
      console.log(`  Magnitude: ${sentiment.magnitude}`);
      
      const sentences = results[0].sentences;
      res.json({"analysisResult":sentences})

      sentences.forEach(sentence => {
        console.log(`Sentence: ${sentence.text.content}`);
        console.log(`  Score: ${sentence.sentiment.score}`);
        console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
        let date = Date.now()
        let analysisObject = new AnalysisModelSchema({
        	sentimentScore:sentence.sentiment.score,
        	sentimentMagnitude:sentence.sentiment.magnitude,
        	sentimentText:sentence.text.content,
        	textTime:date
        }) 
        analysisObject.save(function(err){
        	if(err){
        		throw err
        	}
        	console.log("doc saved")
        })
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

}
}