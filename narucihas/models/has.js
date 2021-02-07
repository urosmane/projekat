"use strict";
var rethinkdb = require('rethinkdb');
var db = require('./db');
var async = require('async');

class has {
    addNewHas(foodData,callback) {
        async.waterfall([
            function(callback) {
                var foodObject = new db();
                foodObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('food').insert({
                    "hrana" : foodData.hrana
                }).run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while adding new food");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    voteHasOption(foodData,callback) {
        async.waterfall([
            function(callback) {
                var foodObject = new db();
                foodObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('food').get(foodData.id).run(connection,function(err,result) {
                    if(err) {
                        return callback(true,"Error fetching food to database");
                    }
                    for(var foodCounter = 0; foodCounter < result.hrana.length; foodCounter++) {
                        if(result.hrana[foodCounter].option === foodData.option) {
                            result.hrana[foodCounter].vote += 1;
                            break;
                        }
                    }
                    rethinkdb.table('food').get(foodData.id).update(result).run(connection,function(err,result) {
                        connection.close();
                        if(err) {
                            return callback(true,"Error updating the vote");
                        }
                        callback(null,result);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    getAllHas(callback) {
        async.waterfall([
            function(callback) {
                var foodObject = new db();
                foodObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('food').run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching food to database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        callback(null,result)
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    deleteHas(foodData,callback) {
        async.waterfall([
            function(callback) {
                var foodObject = new db();
                foodObject.connectToDb(function(err,connection) {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('food').delete().run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while deleting food");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }
}
module.exports = has;
