var mongoose = require("mongoose");

var conn = mongoose.createConnection("127.0.0.1", "apidb");

conn.on("error", console.error.bind(console, "连接错误："));

conn.once("open", function() {
    console.log("db connect open!");
});


module.exports = conn;
