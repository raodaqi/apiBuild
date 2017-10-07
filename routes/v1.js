'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var charset = require('superagent-charset');
var superagent = require('superagent');
var LCT = require('./lctbuild');
var request = require('request');
charset(superagent);
var cheerio = require('cheerio')

var fs = require('fs');
var buf = new Buffer(1024*1024);

router.get('/link', function(req, res, next) {
    var url = req.query.url
    console.log(url)
    request(url, function (err, response, body) {
        if (err) {
            res.send({
                code: 500,
                msg: err
            })
        }
        else {
            // console.log(body)
            var $ = cheerio.load(body);
            var html = $("#img-content").html();
            html = html.replace(/data-src/g, 'src');
            html = html.replace(/section/g, 'div');
            html = html.replace(/<img/g, '<img style="max-width: 100%!important;box-sizing: border-box!important;-webkit-box-sizing: border-box!important;word-wrap: break-word!important;"');
            // html = html.replace(/<div/g, '<div style="max-width: 100%!important;box-sizing: border-box!important;-webkit-box-sizing: border-box!important;word-wrap: break-word!important;"');
            // html = html.replace(/<p/g, '<p style="max-width: 100%!important;box-sizing: border-box!important;-webkit-box-sizing: border-box!important;word-wrap: break-word!important;"');
            // console.log(html)
            html = htmlDecode(html)
            res.send(html)
        }
    })
}) 
function htmlDecode(str) { 
  // 一般可以先转换为标准 unicode 格式（有需要就添加：当返回的数据呈现太多\\\u 之类的时）
  str = unescape(str.replace(/\\u/g, "%u"));
  // 再对实体符进行转义
  // 有 x 则表示是16进制，$1 就是匹配是否有 x，$2 就是匹配出的第二个括号捕获到的内容，将 $2 以对应进制表示转换
  str = str.replace(/&#(x)?(\w+);/g, function($, $1, $2) {
    return String.fromCharCode(parseInt($2, $1? 16: 10));
  });

  return str;
}

	var url = "https://mp.weixin.qq.com/s?__biz=MzAxMzM2MjM5Mw==&mid=2655782081&idx=2&sn=d64a639e2bd7f30ddbdf3f9d7ecea221&chksm=801b1177b76c9861f3a684629161c2caf555b1219af71cf42c7ab36aced8b3640099a513e9cb"
    // url = "http://www.jianshu.com/p/98b854322260"
    // superagent.get(url)
    // .buffer(true)
    // .end((err, resu) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //   console.log(resu)
    //   // res.send(resu.text)
    // })

    // var url = "http://blog.csdn.net/u012329294/article/details/74906504"
    // request(url, function (err, response, body) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         // console.log(body)
    //         var $ = cheerio.load(body);
    //         // console.log($)
    //         var html = $("#page-content").html();
    //         html = htmlDecode(html)
    //         // html = html.replace(/data-src/g, 'src');
    //         console.log(html)
    //     }
    // })


module.exports = router;
