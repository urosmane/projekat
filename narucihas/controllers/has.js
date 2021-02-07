var express = require('express');
var router = express.Router();
// require model file.
var foodModel = require('../models/has');

router.route('/')
    .get(function(req,res) {
        // Code to fetch the food.
        var foodObject = new foodModel();
        // Calling our model function.
        foodObject.getAllHas(function(err,foodResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : foodResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : foodResponse});
        });
    })
    .post(function(req,res) {
        // Code to add new food.
        var foodObject = new foodModel();
        // Calling our model function.
        // We nee to validate our payload here.
        foodObject.addNewHas(req.body,function(err,foodResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : foodResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success","data" : foodResponse});
        });
    })
    .delete(function(req,res) {
        // Code to delete food.
        var foodObject = new foodModel();
        // Calling our model function.
        // We nee to validate our payload here.
        foodObject.deleteHas(req.body,function(err,foodResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : foodResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success","data" : foodResponse});
        });
    })
    .put(function(req,res) {
        // Code to update checked food.
        var foodObject = new foodModel();
        // Calling our model function.
        // We need to validate our payload here.
        foodObject.voteHasOption(req.body,function(err,foodResponse) {
            if(err) {
                return res.json({"responseCode" : 1, "responseDesc" : foodResponse});
            }
            res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : foodResponse});
        });
    });

module.exports = router;