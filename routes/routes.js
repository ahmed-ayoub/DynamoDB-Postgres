var appRouter = function(app) {

//////////////////////// PING ////////////////////////////////////////
app.get("/ping" , function(req, res){
 return res.status(200).json({ success: true});
});

//////////////////////// NoSql item Count ////////////////////////////////////
app.get("/count" , function(req, res){
 var AWS = require("aws-sdk");
    AWS.config.update({
  region: 'us-east-1'
});

var docClient = new AWS.DynamoDB.DocumentClient();

var paramsCount = {
  TableName: 'emp', /* required */
  Select: 'COUNT',
};
docClient.scan(paramsCount, function(err, data) {
  if (err){ console.log(err, err.stack); // an error occurred
      return res.status(500).json({ success: false, data: err});
  }
  else  {   
      console.log(data);           // successful response
      return res.json(data);
  }
});

});

////////////////////////////// Transfer data from Postgres to NoSQL ///////////////////////
app.get("/transfer", function(req, res) {

    var pg = require('pg');
    var connectionString = 'pg://postgres:postgres@10.0.3.231:5432/empdb';

    var client = new pg.Client(connectionString);
    client.connect();

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    
    if(err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM emp;");

    var AWS = require("aws-sdk");
    AWS.config.update({
        region: 'us-east-1'
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "emp";
    
    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
        var params = {
        TableName:table,
        Item:{
            "_id" : row._id ,
            "_fname": row._fname,
            "_lname": row._lname,
            "_age"  : row._age
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    });
        // After all data is returned, close connection and return results
    query.on('end', function() {
        done();
        return res.json(results);
    });

    });
});

/////////////////////////////////////////// add new emp ////////////////////////////////////////////////////
app.post("/test", function(req, res) {

    var pg = require('pg');
    var connectionString = 'pg://postgres:postgres@10.0.3.231:5432/empdb';

    var client = new pg.Client(connectionString);
    client.connect();

    var results = [];
    // Grab data from http request
    var data = {id: req.body.id, fname: req.body.fname, lname: req.body.lname,age: req.body.age};
    console.log(data);
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
    client.query("INSERT INTO emp(_id,_fname,_lname,_age) values($1, $2, $3, $4)", [data.id, data.fname,data.lname, data.age]);

        // SQL Query > Select Data
    var query = client.query("SELECT * FROM emp where _id = " + data.id );

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});
}
module.exports = appRouter;
