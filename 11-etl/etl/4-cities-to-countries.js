var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://localhost:27017/geodata";
var collectionNameDest = "countries2";
var collectionNameSrc = "cities_with_countries";
//Añadirle array de cities a countries de cities_with_countries


etl();

function etl() {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (!err) {
            var collectionDest = db.collection(collectionNameDest);
            collectionDest.find({})
                .each(function (err2, entry) {
                    if (!err2) {
                        if (entry === null){}else{
                        transform(entry, db, collectionDest,entry.name.common);
                        }
                    } else {
                        console.error(err);
                    }
                });
            console.log("fin");
        } else {
            console.error(err);
        }
    });
}

function transform(country, db, collectionDest, nameCountry) {
    var population = [];
    if (country === null) {} else {
        var collectionSrc = db.collection(collectionNameSrc);
        collectionSrc.find({"country":nameCountry}, {"_id":0, "country":0}).toArray(function (err, result) {
            if (result === null){} else{
                load(country, collectionDest, result);
            }
        });
    }
}

function load(country, collectionDest, citiesSrc) {
    if (citiesSrc === null) {} else {
        country.cities = citiesSrc;
        collectionDest.save(country);
    }
}


/*collectionSrc.aggregate({$match: {"Country Code": country.cca3}},{$project:       {"Year": 1,"population":"$Value","_id": 0}}).toArray(function (err, result) {
                    load(country, collectionDest, result);
        });     */
