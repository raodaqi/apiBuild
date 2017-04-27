'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var fs = require("fs");
var buf = new Buffer(1024*1024);

function doo(res){
// 异步打开文件
console.log("准备打开文件！");
fs.open('app.js', 'r+', function(err, fd) {
   if (err) {
       return console.error(err);
   }
  console.log("文件打开成功！"); 

  console.log("准备读取文件：");
   fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
      if (err){
         console.log(err);
      }
      console.log(bytes + "  字节被读取");
      
      // 仅输出读取的字节
      if(bytes > 0){
         // console.log(buf.slice(0, bytes).toString());
        var filetext = buf.slice(0, bytes).toString();
        console.log(filetext);
        filetext = filetext.replace("module.exports = app;","console.log('123');\nmodule.exports = app;")
        fs.writeFile('app.js',filetext,  function(err) {
           if (err) {
               return console.error(err);
           }
           res.send("生成成功123");
        });
      }
      
      // 关闭文件
      fs.close(fd, function(err){
         if (err){
            console.log(err);
         } 
         console.log("文件关闭成功");
      });
   });
});
}


router.get('/do', function(req, res, next) {
  doo(res);
})


function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

function validate(res,req,type,data){
    for(var i in data){
        if(req.method == "GET"){
            var value = req.query[i];
        }else{
            var value = req.body[i];
        }
        if(data[i]){
            //必须值
            if(!value){
                var result = {
                    code : "302",
                    message : data[i],
                    data : []
                }
                res.send(result);
                return "";
            }
        }
        data[i] = value;
    }
    return data;
}

var APP = AV.Object.extend('APP');

// //动态生成初始化
// var query = new AV.Query(APP);
// query.find().then(function(results) {

// }, function(err) {
//   //保存一次
//   var App = new APP();
//   App.save().then(function (app) {});
// });

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  res.render('app');
});


// 查询 Todo 列表
router.get('/create', function(req, res, next) {
	var app_name = req.query.app_name;
	var app_desc = req.query.app_desc;
  var api_manage_id = req.query.api_manage_id;

  //获取当前用户
  var currentUser = AV.User.current();

  var query = new AV.Query(APP);
  //去除空格
  app_name = app_name.replace(/(^\s+)|(\s+$)/g,"");
  app_name = app_name.replace(/\s/g,"");

  //将name的首字母设置为小写
  app_name = app_name.slice(0, 1).toLowerCase()+app_name.slice(1);

  //判断名字是否符合格式
  var patt1=new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
  if(!patt1.test(app_name)){
    var result = {
      code    : 402,
      message : "项目名称格式出错",
      data    : []
    }
    res.send(result);
    return;
  }


  query.equalTo('app_name',app_name);

  query.find().then(function(results) {
    //判断是否存在
    if(results.length){
    		//存在
    		var result = {
			   	code : 601,
			    message : "项目已存在"
			}
			res.send(result);
    	}else{
    		//不存在
    		//创建应用
    		var App = new APP();
    		App.set("app_name",app_name);
    		App.set("app_desc",app_desc);
        App.set("api_manage_id",api_manage_id);

        if(currentUser){
          //私有用户
          App.set("author",currentUser.id);
          App.set("type","private");
        }else{
          //共有用户
          App.set("author","");
          App.set("type","public");
        }

    		App.save().then(function (app) {
			    var result = {
			    	code : 200,
			    	data : app,
			    	message : "success"
			    }
			    res.send(result);
			}, function (error) {
			    var result = {
			    	code : 500,
			    	message : "保存出错"
			    }
			    res.send(result);
			});                                              
    	}
  	}, function(err) {
    	if (err.code === 101) {
			  // res.send(err);
        //没有创建class
        //创建应用
        var App = new APP();
        App.set("app_name",app_name);
        App.set("app_desc",app_desc);
        App.set("api_manage_id",api_manage_id);

        if(currentUser){
          //私有用户
          App.set("author",currentUser.id);
          App.set("type","private");
        }else{
          //共有用户
          App.set("author","");
          App.set("type","public");
        }

        App.save().then(function (app) {
          var result = {
            code : 200,
            data : app,
            message : "success"
          }
          res.send(result);
        }, function (error) {
            var result = {
              code : 500,
              message : "保存出错"
            }
            res.send(result);
        }); 
	    } else {
	      next(err);
	    }
	}).catch(next);
});

// 编辑内容
router.post('/edit', function(req, res, next) {
    var data = {
        app_id            : "appid不能为空",
        edit_app_desc     : "",
        api_manage_id     : ""
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }

    //获取当前用户
    var currentUser = AV.User.current();

    var app = AV.Object.createWithoutData('APP', data.app_id);
    app.set("app_desc",data.edit_app_desc);
    app.set("api_manage_id",data.api_manage_id);

    // if(currentUser){
    //   //私有用户
    //   app.set("type","private");
    // }else{
    //   app.set("type","public");
    // }

    app.save().then(function (app) {
        var result = {
            code : 200,
            data : app,
            message : "success"
        }
        res.send(result);
    }, function (error) {
        var result = {
            code : 500,
            message : "保存出错"
        }
        res.send(result);
    });
});

// 查询 Todo 列表
router.get('/list', function(req, res, next) {

    //获取当前链接
    // console.log(req.baseUrl+req.path);
    //判断是什么请求方式
    // console.log(req.method);
    //获取当前用户
    var currentUser = AV.User.current();

  	var query = new AV.Query(APP);
  	query.descending('createdAt');
    //将私有和公有的方法

    if(currentUser){
      query.equalTo("type","public");
      var privateQuery = new AV.Query(APP);
      privateQuery.equalTo("author",currentUser.id);
      var query = AV.Query.or(query, privateQuery);
    }else{
      query.equalTo("type","public");
    }

  	query.find().then(function(results) {
//    	console.log(results);
    	//判断是否存在
    	var result = {
			code : 200,
			data : results,
			message : "success"
		}
		res.send(result);
  	}, function(err) {
    	if (err.code === 101) {
      //判断是否存在
        var result = {
            code : 200,
            data : [],
            message : "success"
        }
        res.send(result);
	    } else {
	      next(err);
	    }
	}).catch(next);
});

// 查询详情
router.get('/detail', function(req, res, next) {
    var id = req.query.id;
    if(!id){
        sendError(res,457,"缺少项目id");
        return;
    }
    var query = new AV.Query(APP);
    query.get(id).then(function(results) {
//    	console.log(results);
        //判断是否存在
        var result = {
            code : 200,
            data : results,
            message : "success"
        }
        res.send(result);
    }, function(err) {
        if (err.code === 101) {
            // res.send(err);
            //没有创建class
            //判断是否存在
            var result = {
                code : 200,
                data : [],
                message : "success"
            }
            res.send(result);
        } else {
            next(err);
        }
    }).catch(next);
});

// 查询详情
router.get('/delete', function(req, res, next) {
    var id = req.query.id;
    var app_name = req.query.app_name;
    var app_desc = req.query.app_desc;

    if(!id){
        sendError(res,457,"缺少项目id");
        return;
    }
    var todo = AV.Object.createWithoutData('APP', id);
    todo.destroy().then(function (success) {
        // 删除成功
        //判断是否存在
        var result = {
            code : 200,
            data : [],
            message : "success"
        }
        res.send(result);
    }, function (error) {
        // 删除失败
        res.send(error);
    });
});



module.exports = router;
