'use strict';
var router = require('express').Router();
var AV = require('leanengine');

function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

// 保存
router.get('/add', function(req, res, next) {
	var app_name = req.query.app_name;
	var app_desc = req.query.app_desc;

	if(!app_name){
		sendError(res,456,"项目名称不能为空");
		return;
	}

	
});

module.exports = router;
