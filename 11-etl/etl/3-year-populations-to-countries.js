var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://localhost:27017/geodata";
var collectionNameSrc = "population";
var collectionNameDest = "countries2";
//Añadirle array de populations (population, year) a countries


etl();

function etl() {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (!err) {
            var collectionDest = db.collection(collectionNameDest);
            console.log("Seleccionar countries");
            collectionDest.find({})
                .each(function (err2, entry) {
                    if (!err2) {
                        transform(entry, db, collectionDest);
                    } else {
                        console.error(err);
                    }
                });
        } else {
            console.error(err);
        }
    });
}

function transform(country, db, collectionDest) {
    var population = [];

    if (country === null) {} else {
        var collectionSrc = db.collection(collectionNameSrc);
        collectionSrc.find({
            "Country Code": country.cca3
        }, {"Year":1, "Value" : 1, "_id":0}).toArray(function (err, result) {
            load(country, collectionDest, result);
        });
    }
}


function load(country, collectionDest, populationSrc) {
    var pop = [];
    populationSrc.forEach(function(entry, index){
        var p = { "year" : parseInt(entry.Year), "population" : parseInt(entry.Value)};
        if (p===null){}else{
            pop.push(p);
        }
    });
    country.populations = pop;
    collectionDest.save(country);
}


/*collectionSrc.aggregate({$match: {"Country Code": country.cca3}},{$project:       {"Year": 1,"population":"$Value","_id": 0}}).toArray(function (err, result) {
                    load(country, collectionDest, result);
        });     */
