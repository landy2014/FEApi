var mongoose = require("mongoose");
var db = require("../lib/db");

var Schema = mongoose.Schema;
var ListSchema = new Schema({
	name : { type : String },
	rules : { type: Schema.Types.Mixed },
	rulePath : {type : String},
	method : { type: String, default: "get"},
	sumary : { type: String, default: ""}
});

var List = db.model("List", ListSchema);

module.exports = List;