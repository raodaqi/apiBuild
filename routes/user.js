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

function validate(res,req,data){
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

// 注册
router.post('/signup', function(req, res, next) {
	var data = {
    	name     : '用户名',
    	password : '密码',
    	email    : '邮箱'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	//创建应用
	var user = new AV.User();
	user.setUsername(data.email);
	user.setPassword(data.password);
	user.setEmail(data.email);
	user.set("name",data.name);
	user.signUp().then(function (addResult) {
		var result = {
			code 	: 200,
			data 	: addResult,
			message : '注册成功'
		}
		res.send(result);
	}, function(err) {
		console.log(err.code);
		var result = {
			code : err.code,
			message : err.message,
			data : []
		}
		res.send(result);
	}).catch(next);
})

// 登录
router.get('/login', function(req, res, next) {
	var data = {
    	email : '邮箱',
    	password : '密码'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	AV.User.logIn(data.email, data.password).then(function (loginedUser) {
		// 登录成功
		var result = {
		   	code : 200,
		   	data : loginedUser,
		    message : '登录成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

// 当前用户
router.get('/current', function(req, res, next) {
	var currentUser = AV.User.current();
	var result = {
	    code : 200,
	    data : currentUser,
	    message : "请求成功"
	}
	res.send(result);
})

// 退出登录
router.get('/logout', function(req, res, next) {
	AV.User.logOut();
  	// 现在的 currentUser 是 null 了
  	var currentUser = AV.User.current();
	var result = {
	    code : 200,
	    data : currentUser,
	    message : "请求成功"
	}
	res.send(result);
})

module.exports = router;