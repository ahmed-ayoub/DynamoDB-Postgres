var appRouter = function(app) {

app.get("/ping" , function(req, res){
 return res.status(200).json({ success: true});
});

app.get("/", function(req, res) {


        var pg = require('pg');
        var connectionString = 'pg://postgres:postgres@10.0.2.130:5432/mydb';

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

        ////////////////////////////////////////////////////// end my code

        });

app.post("/emp", function(req, res) {

        var pg = require('pg');
        var connectionString = 'pg://postgres:postgres@10.0.2.130:5432/mydb';

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
        var query = client.query("SELECT * FROM emp");

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


