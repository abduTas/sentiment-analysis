const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const mongoose = require('mongoose')
const request = require('request')
const app = express();
const router = express.Router();
const userController = require('./controllers/users');
const config = require('./config/config.js')
const AnalysisModelSchema = require('./models/AnalysisModel.js')

// Setup Mongoose

mongoose.connect("mongodb://localhost:27017/myproject",function(err){
  if(err){
    console.error(err);
  }
});
var conn = mongoose.connection;
conn.on("connected",function(){
  console.log("connected to db")
})


//Body parser for getting form data

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Define Routes


router.route('/auth')
.post(userController.getRegistration(jwt,config.passcode))

router.route('/login')
	.post(userController.verifyLogin(jwt,config.passcode))


router.route('/analyseSentiment')
	.post(userController.verifyLogin(jwt,config.passcode),userController.analyzeSentimentOfText(AnalysisModelSchema))

app.use('/', router);

app.all('*', function(req, res) {
  res.json({message:"wrong route ERROR 404"});
});
var server = app.listen(8000,function(){
	console.log('Server started on port 8000');
});

module.exports = server