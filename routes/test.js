'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var charset = require('superagent-charset');
var superagent = require('superagent');
charset(superagent);

var fs = require('fs');

router.get('/down', function(req, res, next) {
    //获取当前的app_id
    var data = {
        app_id       : "appid不能为空"
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    // console.log(data);
    var query = new AV.Query(API);

    for(var i in data){
        query.equalTo(i,data[i]);
    }
    query.find().then(function (apiList) {
        var dataArray = [];
        var apiJson = {};
        var apiData = [];
        for(var i = 0; i < apiList.length;i++){
            // console.log(apiList[i].attributes.api_type);
            var api_type = apiList[i].attributes.api_type;
            if(api_type){
                for(var j = 0; j <= dataArray.length;j++){
                    if(dataArray[j] && dataArray[j].api_type == api_type){
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                    if(j == dataArray.length){
                        dataArray[j] = {
                            api_type : api_type,
                            api : []
                        }
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                }
            }
        }
        //创建js文件内容
        var jsText = '';

        var commonMethod = '/*!\n' +
                           ' * 向后台发送数据\n'+
                           ' * url(String):请求链接\n'+
                           ' * type(String):请求类型\n'+
                           ' * data(Object):请求参数\n'+
                           ' * callback(function):回调方法\n'+
                           ' */\n';
        commonMethod += 'function sendQuery(url,type,data,callback){\n'+
                        '   $.ajax({\n'+
                        '       type: type,\n'+
                        '       url: url,\n'+
                        '       data: data,\n'+
                        '       dataType: "json",\n'+
                        '       success:function(result){\n'+
                        '           if(result.code == 200){\n'+
                        '               callback.success(result);\n'+
                        '           }else{\n'+
                        '               callback.error(result);\n'+
                        '           }\n'+
                        '       },\n'+
                        '       error:function(error){\n'+
                        '           alert("服务器出错");\n'+
                        '           callback.error(error);\n'+
                        '       }\n'+
                        '   })\n'+
                        '}\n';
        jsText += commonMethod;
        for(var i = 0; i < dataArray.length;i++){
            //第一层循环遍历api所属类型

            //获取api_type名称，生成备注
            var api = dataArray[i].api;
            var type = '/*!\n *'+dataArray[i].api_type+'\n */\n';
            //第二层循环遍历api
            for(var j = 0; j < api.length; j++){
                var apiData = api[j].attributes;
                //获取所有参数
                var paraText = '';
                for(var k = 0; k < apiData.api_para.length; k++){
                    var paraData = apiData.api_para[k];
                    //生成参数text
                    paraText+= ' *'+paraData.para_name+'('+paraData.para_type+') '+':'+paraData.para_desc+(paraData.para_must? ' 必须值':'')+'\n';
                }
                //生成方法注释
                var apiMethodTip = '/*!\n *'+apiData.api_desc+'\n'+paraText+' */\n';
                //生成方法

                var apiMethod = 'function '+apiData.api_name+'(data,callback){\n'+
                                '   var url = "'+apiData.api_url+'";\n'+
                                '   var type = "'+apiData.api_request+'";\n'+
                                '   sendQuery(url,type,data,callback);\n'+
                                '}\n';

                jsText += apiMethodTip + apiMethod;
            }
        }
        fs.writeFile( "public/files/apimanage."+data.app_id+".js", jsText, function(){
            res.download("public/files/apimanage."+data.app_id+".js");
        });

        // var result = {
        //     code : 200,
        //     data : dataArray,
        //     message : "success"
        // }
        // res.send(result);
    }, function (error) {
        var result = {
            code : 500,
            message : "保存出错"
        }
        res.send(result);
    });
//    fs.writeFile( "test.js", "123", function(){
//        console.log("123")
//    });
});


router.get('/link', function(req, res, next) {
    //获取当前的app_id
    var data = {
        app_id       : "appid不能为空"
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    // console.log(data);
    var query = new AV.Query(API);

    for(var i in data){
        query.equalTo(i,data[i]);
    }
    query.find().then(function (apiList) {
        var dataArray = [];
        var apiJson = {};
        var apiData = [];
        for(var i = 0; i < apiList.length;i++){
            // console.log(apiList[i].attributes.api_type);
            var api_type = apiList[i].attributes.api_type;
            if(api_type){
                for(var j = 0; j <= dataArray.length;j++){
                    if(dataArray[j] && dataArray[j].api_type == api_type){
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                    if(j == dataArray.length){
                        dataArray[j] = {
                            api_type : api_type,
                            api : []
                        }
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                }
            }
        }
        //创建js文件内容
        var jsText = '';

        var commonMethod = '/*!\n' +
                           ' * 向后台发送数据\n'+
                           ' * url(String):请求链接\n'+
                           ' * type(String):请求类型\n'+
                           ' * data(Object):请求参数\n'+
                           ' */\n';
        commonMethod += 'function sendQuery(url,type,data,para){\n'+
                        '   var dfd = $.Deferred(); // 生成Deferred对象\n'+
                        '   //兼容form序列化数据提交\n'+
                        '   if(data.length){\n'+
                        '       var newData = {};\n'+
                        '       for(var i = 0; i < data.length;i++){\n'+
                        '           newData[data[i].name] = data[i].value;\n'+
                        '       }\n'+
                        '       data = newData;\n'+
                        '   }\n'+
                        '   //判断值是否为空\n'+
                        '   for(var i in para){\n'+
                        '       if(para[i] && !data[i]){\n'+
                        '           var result = {\n'+
                        '               code:302,\n'+
                        '               message:"缺少"+i,\n'+
                        '               data:[]\n'+
                        '           }\n'+
                        '           dfd.reject(result);\n'+
                        '           return dfd;\n'+
                        '       }\n'+
                        '   }\n'+
                        '   $.ajax({\n'+
                        '       type: type,\n'+
                        '       url: url,\n'+
                        '       data: data,\n'+
                        '       dataType: "json"\n'+
                        '       }).then(function(result){\n'+
                        '           if(result.code == 200){\n'+
                        '               dfd.resolve(result);\n'+
                        '           }else{\n'+
                        '               dfd.reject(result);\n'+
                        '           }\n'+
                        '       },function(error){\n'+
                        '           var result = {\n'+
                        '               code:404,\n'+
                        '               message:"服务器出错",\n'+
                        '               data:[]\n'+
                        '           }\n'+
                        '           dfd.reject(result);\n'+
                        '       })\n'+
                        '   return dfd;'+
                        '}\n';
        jsText += commonMethod;
        for(var i = 0; i < dataArray.length;i++){
            //第一层循环遍历api所属类型

            //获取api_type名称，生成备注
            var api = dataArray[i].api;
            var type = '/*!\n *'+dataArray[i].api_type+'\n */\n';
            //第二层循环遍历api
            for(var j = 0; j < api.length; j++){
                var apiData = api[j].attributes;
                //获取所有参数
                var paraText = '';
                var paraDesc = ''
                for(var k = 0; k < apiData.api_para.length; k++){
                    var paraData = apiData.api_para[k];
                    //生成参数text
                    paraText+= ' *'+paraData.para_name+'('+paraData.para_type+') '+':'+paraData.para_desc+(paraData.para_must? ' 必须值':'')+'\n';
                    paraDesc +="    "+paraData.para_name+" : "+paraData.para_must+((k == apiData.api_para.length-1) ? "" : ",")+'\n';
                }
                //生成方法注释
                var apiMethodTip = '/*!\n *'+apiData.api_desc+'\n'+paraText+' */\n';
                //生成方法

                var apiMethod = 'function '+apiData.api_name+'(data){\n'+
                                '   var url = "'+apiData.api_url+'";\n'+
                                '   var type = "'+apiData.api_request+'";\n'+
                                '   var para = {\n'+paraDesc+
                                '   }\n'+
                                '   return sendQuery(url,type,data,para);\n'+
                                '}\n';

                jsText += apiMethodTip + apiMethod;
            }
        }

        if(req.query.type == "down"){
            fs.writeFile( "public/files/apimanage."+data.app_id+".js", jsText, function(){
                res.download("public/files/apimanage."+data.app_id+".js");
            });
        }else{
            res.send(jsText);
        }
    }, function (error) {
        var result = {
            code : 500,
            message : "保存出错"
        }
        res.send(result);
    });
});



var API = AV.Object.extend('API');
// 查询 Todo 列表
router.get('/', function(req, res, next) {
  res.render('api');
});

function validate(res,req,type,data){
    for(var i in data){
        if(type == "GET"){
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

// 查询 Todo 列表
router.get('/get_api_result', function(req, res, next) {
    var data = {
        api_id       : "api id不能为空",
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    var query = new AV.Query('API');
    query.get(data.api_id).then(function (api) {
        // 成功获得实例
        if(api){
            //存在
            //获取http请求方式
            var api_request = api.attributes.api_request;
            //获取调用链接
            var api_url = api.attributes.api_url;
            //获取请求链接
            var api_para = JSON.parse(api.attributes.api_para);
            var para = {};
            for(var i = 0; i < api_para.length;i++){
               para[api_para[i].para_name]  = api_para[i].para_remark
            }
            // console.log(para);

            //发送请求
            if(api_request == "GET"){
                superagent.get(api_url)
                    .query(para)
                    .end((err, result) => {
                      if(result.statusCode == 200){
                        var result = JSON.parse(result.text);
                        res.send(result);
                      }else{
                        res.send(err);
                      }
                    });
            }else{
                superagent.post(api_url)
                    .send(para)
                    .end((err, result) => {
                      if(result.statusCode == 200){
                        var result = JSON.parse(result.text);
                        res.send(result);
                      }else{
                        res.send(err);
                      }
                    });
            }
        }else{
            //不存在
            var result = {
                code : "403",
                message:"该api不存在",
                data:[]
            }
            res.send(result);
        }

    }, function (error) {
        // 异常处理
        res.send(error);
    });
})

// 查询 Todo 列表
router.get('/add', function(req, res, next) {
    //获取当前的appid
//    var appid = req.query.appid;
    var data = {
        app_id       : "appid不能为空",
        api_name    : "API名称不能为空",
        api_type    : "API所属类别不能为空",
        api_desc    : "",
        api_url     : "APIURI不能为空",
        api_request : "API请求方式不能为空",
        api_para    : "",
        api_demo    : ""
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    // console.log(data);
    var api = new API();
    for(var i in data){
        api.set(i,data[i]);
    }
    api.save().then(function (api) {
        var result = {
            code : 200,
            data : api,
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

router.get('/addbynode', function(req, res, next) {
    //获取当前的appid
//    var appid = req.query.appid;
    var data = {
        app_id      : "appid不能为空",
        api_name    : "API名称不能为空",
        api_type    : "API所属类别不能为空",
        api_desc    : "",
        api_url     : "APIURI不能为空",
        api_request : "API请求方式不能为空",
        api_para    : "",
        api_demo    : ""
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }

    var query = new AV.Query(API);
    query.equalTo("app_id",data.app_id);
    query.equalTo("api_name",data.api_name);
    query.find().then(function (result) {
        if(result.length){
            // 存在
            var api = AV.Object.createWithoutData('API', result[0].id);
            for(var i in data){
                api.set(i,data[i]);
            }
            api.save().then(function (api) {
                var result = {
                    code : 200,
                    data : api,
                    message : "更新成功"
                }
                res.send(result);
            }, function (error) {
                var result = {
                    code : 500,
                    message : "保存出错"
                }
                res.send(result);
            });
        }else{
            //不存在
            var api = new API();
            for(var i in data){
                api.set(i,data[i]);
            }
            api.save().then(function (api) {
                var result = {
                    code : 200,
                    data : api,
                    message : "创建成功"
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
    }, function (error) {
        var result = {
            code : 500,
            message : "保存出错"
        }
        res.send(result);
    });
});

// 查询 Todo 列表
router.get('/edit', function(req, res, next) {
    //获取当前的appid
//    var appid = req.query.appid;
    var data = {
        api_id      : "api_id不能为空",   
        app_id      : "appid不能为空",
        api_name    : "API名称不能为空",
        api_type    : "API所属类别不能为空",
        api_desc    : "",
        api_url     : "APIURI不能为空",
        api_request : "API请求方式不能为空",
        api_para    : "",
        api_demo    : ""
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    // console.log(data);
    var api = AV.Object.createWithoutData('API', data.api_id);
    for(var i in data){
        api.set(i,data[i]);
    }
    api.save().then(function (api) {
        var result = {
            code : 200,
            data : api,
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

//获取app下所有的api接口
router.get('/list', function(req, res, next) {
    //获取当前的app_id
    var data = {
        app_id       : "appid不能为空"
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    // console.log(data);
    var query = new AV.Query(API);

    for(var i in data){
        query.equalTo(i,data[i]);
    }
    query.find().then(function (apiList) {
        var dataArray = [];
        var apiJson = {};
        var apiData = [];
        for(var i = 0; i < apiList.length;i++){
            // console.log(apiList[i].attributes.api_type);
            var api_type = apiList[i].attributes.api_type;
            if(api_type){
                for(var j = 0; j <= dataArray.length;j++){
                    if(dataArray[j] && dataArray[j].api_type == api_type){
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                    if(j == dataArray.length){
                        dataArray[j] = {
                            api_type : api_type,
                            api : []
                        }
                        apiList[i].set('api_para', JSON.parse(apiList[i].attributes.api_para));
                        dataArray[j].api.push(apiList[i]);
                        break;
                    }
                }
            }
        }
        // console.log(dataArray);

        var result = {
            code : 200,
            data : dataArray,
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

// 查询详情
router.get('/delete', function(req, res, next) {
    var id = req.query.id;

    var data = {
        id   : "api的id不能为空"
    }
    var data = validate(res,req,"GET",data);
    if(!data){
        return;
    }
    var api = AV.Object.createWithoutData('API', data.id);
    api.destroy().then(function (success) {
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
