var fs = require("fs");
var path = require("path");

var express = require('express');
var router = express.Router();
var Mock = require("mockjs");
// 数据模型 model
var List = require("../model/list");


// 数据列表
router.get("/list", function(req, res) {
    // 查询
    List.find({}, { "__v": 0 })
        .exec(function(err, result) {
            if (!err) {
                res.render("list", {
                    title: "接口列表",
                    page: "list",
                    data: result
                });
            } else {
                res.send("数据库查询出错了");
            }
        });
});

// 渲染更新接口页面
router.get("/edit", function(req, res) {
    var id = req.query.id,
        name = req.query.name,
        msg = "",
        data;

    if (!id.length || !name.length) {
        msg = "id和接口名称不能为空";
        data = [];
        res.render("edit", {
            page: "edit",
            title: "更新API接口",
            msg: msg,
            data: data
        });
    } else {
        msg = "接口正常";
        List.find({ "_id": id }, function(err, result) {

            if (!err) {
                data = result[0];
            } else {
                data = [];
            }

            res.render("edit", {
                page: "edit",
                title: "更新API接口",
                msg: msg,
                data: data
            });
        });
    }
});

// 更新API接口
router.get("/saveEdit", function(req, res) {
    var id = req.query.id;

    var fileName = req.query.name + ".js";

    var filePath = "template/" + fileName;

    var isExists = fs.existsSync(filePath);

    var fileContent = 'module.exports=' + req.query.rules

    if (isExists) {
        // 如果文件存在，写入文件
        fs.writeFile(filePath, fileContent, { encoding: "utf-8" }, function(err) {
            if (err) {
                res.send({ "status": "failed", "msg": "写入文件失败" });
            } else {
                // 如果写入文件错，则更新数据库
                List.update({ "_id": id }, {
                    $set: {
                        "name": req.query.name,
                        "rules": req.query.rules,
                        "method": req.query.method,
                        "sumary": req.query.sumary
                    }
                }, function(err) {
                    if (!err) {
                        res.send({ "status": "succ", "msg": "数据更新成功" });
                    } else {
                        res.send({ "status": "failed", "msg": "数据更新失败" });
                    }

                });
            }
        });

    } else {
        // 如果文件不存在，提示不存在接口
        res.send({ "status": "failed", "msg": "接口不存在" })
    }
});

//渲染添加数据页面
router.get("/add", function(req, res) {
    res.render("add", {
        page: "add",
        title: "添加接口"
    });
});

// 保存数据接口 
router.get("/saveApi", function(req, res) {

    var fileName = req.query.name + ".js";

    var filePath = "template/" + fileName;

    var isExists = fs.existsSync(filePath);

    var fileContent = 'module.exports=' + req.query.rules

    var list = new List({
        "name": req.query.name,
        "rules": req.query.rules,
        "rulePath": filePath,
        "method": req.query.method,
        "sumary": req.query.sumary
    });

    if (!isExists) {
        fs.appendFile(filePath, fileContent, { encoding: "utf-8" }, function(err) {
            if (err) {
                res.send(err);
            } else {
                list.save(function(err) {
                    if (!err) {
                        res.send({ "status": "succ" });
                    } else {
                        res.send({ "status": "faild", "msg": "数据保存失败" });
                    }

                });
            }
        });

    } else {
        res.send({ "status": "faild", "msg": "接口已存在" })
    }
});

// 删除数据
router.get("/delApi", function(req, res) {
    // 执行查询找到需要处理的数据
    List.remove({ "_id": req.query.id }, function(err, result) {
        if (!err) {
            // 返回成功信息
            res.send({ "status": "succ" });
            // 删除文件
            fs.unlinkSync("template/" + req.query.name + ".js");
        } else {
            res.send({ "status": "faild" });
        }
    });
});

/**
 * 查看接口，这里要分开两个方法
 */
router.param("name", function(req, res, next, id) {
    req.name = id;
    next();
});

router.route("/show/:name")
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res, next) {
        List.find({ "name": req.name }, function(err, result) {
            if (!err && result.length) {
                // 要读取的规则文件路径
                var filePath = "../template/" + req.name + ".js"
                // 实例化规则
                var template = require(filePath);
                // 生成数据
                var data = Mock.mock(template);
                // 发送数据
                res.send(data);
            } else {
                res.send('接口不存在,请<A href="/api/add">添加</a>');
            }
        })

    })
    .post(function(req, res) {
        res.send(req.name);
    });


module.exports = router;
