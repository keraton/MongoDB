/// INSTRUCCIONES
// NodeJS preinstalado
// npm install mongodb
// node etl.js

// Importar el paquete con el driver de Mongo
var MongoClient = require('mongodb').MongoClient;
// Variables con cadenas de conexión y nombres
var mongoSrc = "mongodb://localhost:27017/ventas";
var mongoDest = "mongodb://localhost:27017/ventas2";
var collectionName = "tickets";


extract();


function extract() {
    console.log("Extract tickets");
    // La conexión es una operación independiente
    MongoClient.connect(mongoSrc, onConnected);
    // función callback que se ejecutar al obtener la conexión
    function onConnected(err, db) {
        if (!err) {
            // acceso a la colección equivalente a db.tickets
            var collection = db.collection(collectionName);
            collection.find({}).toArray(transform);
        } else {
            console.error(err);
        }
    }
}

function transform(err, tickets) {
    if (!err) {
        var num = 0;
        tickets.forEach(function (ticket) {
            num = num + 1;
            load(ticket);
        });
        console.log("Se han trasferido ", num, " tickets");
    } else {
        console.error(err);
    }
}

function load(ticket) {
    MongoClient.connect(mongoDest, onConnected);
    function onConnected(err, db) {
        if (!err) {
            var collection = db.collection(collectionName);
            collection.save(ticket, onSaved );
        } else {
            console.error(err);
        }
    }
    function onSaved(err, result){
        if (!err) {
            console.log(JSON.stringify(result));
        } else {
            console.error(err);
        }
    }
}
