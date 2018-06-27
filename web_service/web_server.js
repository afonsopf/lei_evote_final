const fs = require("fs");
var readline = require('readline');

const https = require('https');
 
const express = require("express");
const app = express();

var candidates = ["Lista A", "Lista B"];

var voters = []
var tokens = []

var rl_voters = readline.createInterface({
    input: fs.createReadStream('u.txt')
});

var line_data, voter;
rl_voters.on("line", function(line){
   line_data = line.split(",");
   voter = new Object();
   voter.uid = line_data[0];
   voter.passwd = line_data[1];
   voter.voted = line_data[2];
   voters.push(voter);
});

app.disable('etag');

 https.createServer({
      key: fs.readFileSync('./tls/key.pem'),
      cert: fs.readFileSync('./tls/certificate.pem')
    }, app).listen(3005);
    

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/token', function (req, response) {

    var voter_id = req.query.voter_id;
    var pwd = req.query.pwd;
    var valid = 0;
    var i;
    
    for(i = 0; i < voters.length; i++){
        if(voters[i].uid == voter_id && voters[i].passwd == pwd && voters[i].voted == 0){
            valid = 1; 
            break;
            
        }
    }
    
    if(valid){
        var token = Math.floor(Math.random() * Math.pow(2,128));
        var res = new Object();
        res.token = token.toString();
        res.opts = candidates;
        
        var token_obj = new Object();
        token_obj.token = token;
        token_obj.time = Date.now();
        token_obj.used = 0;
        tokens.push(token_obj);
        voters[i].voted = 1; 
        response.send(JSON.stringify(res));
    }
    else{
        var token_obj = new Object();
        token_obj.token = "0";
        response.send(JSON.stringify(token_obj));
    }

    
    
});

app.get('/verify_token', function (req, response) {

    var res = 1;
    var token = req.query.token;
    
    for(let i = 0; i < tokens.length; i++){
        if(tokens[i].token == token && tokens[i].used == 0){
            if(Date.now() - tokens[i].time <= 120000){
                res = 0;
                res = res.toString();
                response.send(res);
                tokens[i].used = 1;
                fs.appendFile('tokens.txt', tokens[i].token.toString()+"\n", function (err) {
                    if (err) throw err;
                });
                break;
            }
            else{
                console.log(Date.now());
                console.log(tokens[i].time);
                res = res.toString();
                response.send(res);
                break;
                
            }
        }
        if(i == tokens.length -1){
            res = res.toString();
            response.send(res);
            break;
        }
    }
});