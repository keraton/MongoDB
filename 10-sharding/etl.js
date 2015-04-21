var MongoClient = require('mongodb').MongoClient;

var mongoSrc = "mongodb://localhost:27017/ventas";
var mongoDest = "mongodb://localhost:30999/ventas";
var collectionName = "tickets";



etl();


function etl() {
    console.log("Extract tickets");
    MongoClient.connect(mongoSrc, function (err, db) {
        if (!err) {
            var collection = db.collection(collectionName);
            collection.find({}).toArray(function (err, tickets) {
                transform(tickets);
            });
        } else {
            console.error(err);
        }
    });
}

function transform(tickets){
    var num = 0;
    tickets.forEach(function(ticket) {
        num = num+1;
        load(ticket);
    });
    console.log("Se han trasferido ", num, " tickets");
}


function load(ticket){
  MongoClient.connect(mongoDest, function (err, db) {
      if (!err) {
          var collection= db.collection(collectionName);
          collection.save(ticket);
      } else {
          console.error(err);
      }
  });
}


/// INSTRUCCIONES

// NodeJS preinstalado

// npm install mongodb
// node etl.js
