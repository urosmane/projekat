var rethinkdb = require('rethinkdb');
var db = require('./db');
var foodObject = new db();

var x;

module.exports = function(socket) {
    foodObject.connectToDb(function(err,connection) {
        if(err) {
            return callback(true,"Error connecting to database");
        }
        rethinkdb.table('food').changes().run(connection,function(err,cursor) {
            if(err) {
                console.log(err);
            }
            cursor.each(function(err,row) {
                console.log(JSON.stringify(row));
                if(Object.keys(row).length > 0) {
                    if((x = row.new_val) === null){
                        console.log("Empty. The base is deleted.");
                    }
                    else{
                        socket.broadcast.emit("changeFeed",{"id" : row.new_val.id,"food" : row.new_val.food});
                    }
                }
            });
        });
    });
};
