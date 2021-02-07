"use strict";
var rethinkdb = require('rethinkdb');
var async = require('async');

class db {
    setupDb() {
        var self = this;
        async.waterfall([
            function(callback) {
                self.connectToRethinkDbServer(function(err,connection) {
                    if(err) {
                        return callback(true,"Error in connecting RethinkDB");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.dbCreate('hrana').run(connection,function(err, result) {
                    if(err) {
                        console.log("Database already created");
                    } else {
                        console.log("Created new database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.db('hrana').tableCreate('food').run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        console.log("Table already created");
                    } else {
                        console.log("Created new table");
                    }
                    callback(null,"Database is setup successfully");
                });
            }
        ],function(err,data) {
            console.log(data);
        });
    }
    connectToRethinkDbServer(callback) {
        rethinkdb.connect({
            host : 'localhost',
            port : 28015
        }, function(err,connection) {
            callback(err,connection);
        });
    }
    connectToDb(callback) {
        rethinkdb.connect({
            host : 'localhost',
            port : 28015,
            db : 'hrana'
        }, function(err,connection) {
            callback(err,connection);
        });
    }
}
module.exports = db;
