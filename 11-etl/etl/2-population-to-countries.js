var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://localhost:27017/geodata";
var collectionNameSrc = "countries";
var collectionNameDest = "countries2";

//Añadirle population a countries2 dede countries

etl();

function etl() {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (!err) {
            var collectionDest = db.collection(collectionNameDest);
            console.log("Seleccionar countries");
            collectionDest.find({})
                .each(function (err2, entry) {
                    console.log("Por cada country");
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
    if (country === null) {} else {
        var collectionSrc = db.collection(collectionNameSrc);
        collectionSrc.find({
            countryCode: country.cca2
        }).toArray(function (err, result) {
            load(country, collectionDest, result[0]);
        });
    }
}

function load(country, collectionDest, countrySrc) {
    collectionDest.update({
        "cca2": country.cca2
    }, {
        $set: {
            "population": countrySrc.population
        }
    });
}
