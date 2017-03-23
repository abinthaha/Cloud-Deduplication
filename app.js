var express = require('express');
var sql = require("mysql");
var fs = require('fs');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
// import individual service
var AWS = require('aws-sdk');
var s3 = new AWS.S3();


var myBucket = 'my.unique.bucket.name';

var myKey = 'myBucketKey';

s3.createBucket({
    Bucket: myBucket
}, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        params = {
            Bucket: myBucket,
            Key: myKey,
            Body: 'Hello!'
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully uploaded data to myBucket/myKey");
            }
        });
    }

});


/**External JS files*/
var login = require("./partials/login/login.js");

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));


/**Binding SQL Connection - Start*/
var connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'user_details'
});
/**Binding SQL Connection - End*/
// app.post('/loginAction', function(req, res) {
//     // calling.aFunction();
//     console.log('Hai');
//     res.send('A message!');
// });

app.post('/loginAction', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    connection.query('SELECT * FROM user WHERE username="' + username + '" AND password="' + password + '"', function(err, rows, fields) {
        connection.end();
        if (!err) {
            if (rows.length > 0) {
                res.redirect('/home');
            } else {
                res.redirect('/login');
            }
            console.log('The solution is: ', rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});

/**Initiating Connection - Start*/
connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});
/**Initiating Connection - End*/

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));


/**Routing Contents - Start*/
app.get('/login', function(req, res) {
    res.sendFile('login.html', {
        'root': __dirname + '/partials/login'
    });
})
app.get('/', function(req, res) {
    res.sendFile('login.html', {
        'root': __dirname + '/partials/login'
    });
})
app.get('/home', function(req, res) {
    res.sendFile('home.html', {
        'root': __dirname + '/partials/home'
    });
})
/**Routing Contents - End*/


//Binding express app to port 3000
app.listen(3000, function() {
    console.log('Node server running at localhost:3000');
});
