/*!
 * 向后台发送数据
 * url(String):请求链接
 * type(String):请求类型
 * data(Object):请求参数
 * callback(function):回调方法
 */
function sendQuery(url,type,data,callback){
   $.ajax({
       type: type,
       url: url,
       data: data,
       dataType: "json",
       success:function(result){
           if(result.code == 200){
               callback.success(result);
           }else{
               callback.error(result);
           }
       },
       error:function(error){
           alert("服务器出错");
           callback.error(error);
       }
   })
}
/*!
 *获取租赁列表
 *token(string) :用户标识 必须值
 */
function getRentList(data,callback){
   var url = "http://119.29.141.199/order/rent_list";
   var type = GET;
   sendQuery(url,type,data,callback);
}
