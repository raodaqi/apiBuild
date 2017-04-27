'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var AS = require('api-send');
AS.config.APPID = '5901a377da2f60005de72ef9';
AS.config.HOST = 'http://apibuild.leanapp.cn';

function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

function validate(res,req,data){
if(AS.config.APPID && !AS.add(req,data)){
res.send('true');
return;
}
	for(var i in data){
		if(req.method == 'GET'){
			var value = req.query[i];
		}else{
			var value = req.body[i];
		}
		if(data[i]){
			//必须值
			if(!value){
				var result = {
					code : '302',
					message : '缺少'+data[i],
					data : []
				}
				res.send(result);
				return '';
			}
		}
		data[i] = value;
	}
	return data;
}

var Test_snake = AV.Object.extend('Test_snake');

// 新增
router.post('/add', function(req, res, next) {
	var data = {"name":"name","grade":"grade"};
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	//强制转换Number型
	var number = ["grade"];
	for(var i = 0; i < number.length; i++){
		var name = number[i];
		data[name] = isNaN(Number(data[name])) ? 0 : Number(data[name]);
	}
	//创建应用
	var addObj = new Test_snake();
	for(var key in data){
		addObj.set(key,data[key]);
	}
	addObj.save().then(function (addResult) {
		var result = {
			code : 200,
			data : addResult,
			message : '保存成功'
		}
		res.send(result);
	}, function (error) {
		var result = {
			code : 500,
			message : '保存出错'
		}
		res.send(result);
	});
})

// 删除
router.get('/delete', function(req, res, next) {
	var data = {
		id  : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var delObj = AV.Object.createWithoutData('Test_snake', data.id);
	delObj.destroy().then(function (success) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : [],
		    message : '删除成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

// 编辑
router.post('/edit', function(req, res, next) {
	var data = {"name":"name","grade":"grade"};
	data.id = 'id';
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var editObj = AV.Object.createWithoutData('Test_snake', data.id);
	for(var key in data){
		editObj.set(key,data[key]);
	}
	editObj.save().then(function (editResult) {
		var result = {
		    code : 200,
		    data : editResult,
		    message : '更改成功'
		}
		res.send(result);
	}, function (error) {
		var result = {
		    code : 500,
		    message : '保存出错'
		}
		res.send(result);
	}).catch(next);
})

// 查找
router.get('/list', function(req, res, next) {
	var data = {
		limit : '',
		skip  : '',
		asc   : '',
		desc  : ''
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var limit = data.limit ? data.limit : 1000;
	var skip  = data.skip ? data.skip : 0;
	var query = new AV.Query('Test_snake');
	query.skip(skip);
	query.limit(limit);
	if(data.asc){
		query.ascending(data.asc);
	}
	if(data.desc){
		query.descending(data.desc);
	}
	for(var i in req.query){
		if(i == 'skip' || i == 'limit' || i == 'asc' || i == 'desc'){
			continue;
		}
		if(req.query[i].type && req.query[i].value){
			var type = isNaN(req.query[i].type) ? 9 : Number(req.query[i].type);
			//强制转换Number型
			var number = ["grade"];
			var isNum = false;
			for(var j = 0; j < number.length; j++){
				if(number[j] == i)
				isNum = true;
			}
			if(isNum){
				var value = isNaN(Number(req.query[i].value)) ? 0 : Number(req.query[i].value);
			}else{
				var value = req.query[i].value;
			}
			switch(type){
				case 1: query.equalTo(i, value);
						break;
				case 2: query.notEqualTo(i, value);
						break;
				case 3: query.greaterThan(i, value);
						break;
				case 4: query.greaterThanOrEqualTo(i, value);
						break;
				case 5: query.lessThan(i, value);
						break;
				case 6: query.lessThanOrEqualTo(i, value);
						break;
				case 7: query.startsWith(i, value);
						break;
				case 8: query.contains(i, value);
						break;
				case 0: query.exists(i);
						break;
				default: break;
			}
		}
	}
	query.find().then(function (results) {
		// 查询成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(err) {
		if (err.code === 101) {
			//判断是否存在
			var result = {
				code : 200,
				data : [],
				message : 'success'
			}
			res.send(result);
		} else {
			next(err);
		}
	}).catch(next);
})

// 详情
router.get('/detail', function(req, res, next) {
	var data = {
		id  : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var query = new AV.Query('Test_snake');
	query.get(data.id).then(function(results){
		// 删除成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

if(AS.config.APPID)
AS.build('/test_snake',router);
module.exports = router;