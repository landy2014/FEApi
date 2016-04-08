var express = require('express');
var router = express.Router();
var List = require("../model/list");

// 系统首页，暂时放接口测试
router.get('/', function(req, res, next) {
    var data = "";
    List.find({}, function(err, result) {
        if (!err) {
            data = result;
            res.send(result);
        } else {
        	data = [];
        	res.send("sdf");
        }

        // res.render("index", {
        //     title: "FE接口管理首页",
        //     page: "index",
        //     data : data
        // });
    });

});


module.exports = router;
