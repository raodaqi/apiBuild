$(window).load(function() {
  loadingHide();
});

$(document).on("click",".menu-li,.icon-item",function(){
      var url = $(this).children("a").attr("href");
      var url = url.split("#")[1];
      console.log(url);
      $(".sec-content").hide();
      // $("."+url+" a").css({"color":"#609be3 !important;"});
      $(".menu-li").removeClass("apiactive");
      $("."+url).addClass("apiactive");
      $("#"+url).show();
})

$(document).on("click",".dropdown-menu li",function(){
  $(".dropdown-toggle .dropdown-text").text($(this).text());
})

//向后台发送数据
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
        layer.msg("服务器出错", {icon: 2});
        callback.error(error);
      }
    })
  }


$(function() {
    $('.market a').bind('click', function(event) {
        var $market = $(this);
        var href = $market.attr('href');
        $(".type").hide();

        var height = $("body").height();
        var width = $("body").width();
        if(width < 767){
          setTimeout(function(){
            $(href).show();
              $(".col-lg-3").hide();
          }, 1000);
        }else{
          $(href).show();
        }
        event.preventDefault();
    });

    $(".navbar-bracket a").on("click",function(){
      if($(this).children("li").text() == "退出"){
        // return;
      }else{
        console.log("13");
        loadingShow("正在跳转");
      }
      
    })
})

$(function() {
    $(".edit-passwd").bind("click",function(){
    	$(".edit-passwd").hide();
    	$(".edit-quit").show();
    	$(".passwd-form").show();
    	event.preventDefault();
    })
    $(".edit-quit").bind("click",function(){
    	$(".edit-quit").hide();
    	$(".passwd-form").hide();
    	$(".edit-passwd").show();
    	event.preventDefault();
    })
})

// $(window).scroll(function() {
//     if ($(".navbar").offset().top > 50) {
//         $(".navbar").addClass("top-nav-collapse");
//     } else {
//         $(".navbar").removeClass("top-nav-collapse");
//     }
// });

 function formatTen(num) { 
    return num > 9 ? (num + "") : ("0" + num); 
  } 

  function formatDate(date) { 
    var year = date.getFullYear(); 
    var month = date.getMonth() + 1; 
    var day = date.getDate(); 
    var hour = date.getHours(); 
    var minute = date.getMinutes(); 
    var second = date.getSeconds(); 
    return year + "-" + formatTen(month) + "-" + formatTen(day); 
  }

  function ifLogin(){
    if(!USER || (USER == "noEmailVerified")){
      // alert("没有登录");
      if(USER == "noEmailVerified"){
        tipShow("您的账号没有通过邮箱验证");
      }else{
        tipShow("您没有登录");
      }
      setTimeout(function(){
        loadingShow("正在跳转");
        window.location.href=DOMIN+"/signin";
      }, 1000);
      // window.location.href=DOMIN+"/signin";
      return false;
    }else{
      return true;
    }
  }

  function checkUrl(url){
      var isRight = url.indexOf("http://");
      if(isRight == 0){
        return true;
      }else{
        return false;
      }
    }

    $(".navbar-toggle").on("click",function(){
        var ifExit = $(".navbar-right").hasClass("in");
        var height = $(".navbar-right").height();
        console.log(ifExit);
        console.log(height);
        if(!ifExit){
          $(".navbar-fixed-top").addClass("loading-cover");
          
        }else{
          $(".navbar-fixed-top").removeClass("loading-cover");
        }
      })
    // $(".navbar").on("click",function(){
    //   var ifExit = $(".navbar-right").hasClass("in");
    //   if(ifExit){
    //     $(".navbar-fixed-top").removeClass("loading-cover");
    //     $(".navbar-main-collapse").hide();
    //   }
    // })

    function loadingShow(text){
      $("#loading p").text(text);
      $("#loading").addClass("show");
    }

    function loadingHide(){
      $("#loading").removeClass("show");
    }
    // $("body").on("click",function(){
    //   tipShow();
    // })
    
    function tipShow(text){
      if(text){
        $(".ui-poptips-cnt").text(text);
      }
      $(".ui-poptips").show();
     $(".ui-poptips").css({
        "-webkit-transform":"translateY(0px)"
      });
      setTimeout(function(){
        $(".ui-poptips").css({
          "-webkit-transform":"translateY(-40px)"
        });
      },1000);
    }

    function check(msg, name){
      if (name == '') {
        tipShow(msg)
        return false;
      }else{
        return true;
      }
    }

    function checkEmail(email){
      var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,9}$/;
      if(!reg.test(email)) {
        tipShow("邮箱格式不对");
        return false;
      }else{
        return true;
      }
    }

    function checkPW(password){
      if(password.length < 6){
        tipShow("密码长度太短");
        return false;
      }else{
        return true;
      }
    }

    function dialogShow(text){
      $("#dialog h4").text(text);
      $("#dialog").addClass("show");
    }

    function dialogHide(){
      $("#dialog").removeClass("show");
    }

    $(".delete-cancel").on("click",function(){
      console.log("success");
      dialogHide();
    })

    $(".delete-sub").on("click",function(){
      // AV.User.logOut();
      // var currentUser = AV.User.current();
      // console.log(currentUser);
      dialogHide();
      loadingShow("正在退出");
      window.location.href = "/logout";

    })

    // $(window).scroll(function() {
    //     if ($(".navbar").offset().top > 50) {
    //         $(".navbar-fixed-top").addClass("top-nav-collapse");
    //     } else {
    //         $(".navbar-fixed-top").removeClass("top-nav-collapse");
    //     }
    // });
    
    $(".navbar").on("click",function(){
      var ifExit = $(".navbar-right").hasClass("in");
      var height = $(".navbar-right").height();
      console.log(ifExit);
      console.log(height);
      // if($(".navbar").hasClass("loading-cover")){
      //   console.log("message");
      // }
      if(ifExit){
        // console.log("message");
        // $(".navbar-toggle").click();
        

        // if($(".navbar-collapse").hasClass("in")){
        //    $(".navbar-collapse").removeClass("in"); 
        // }
        setTimeout(function(){
          $(".navbar-fixed-top").removeClass("loading-cover");
          $(".navbar-collapse").removeClass("in"); 
        }, 100);  
      }
    })

    // var test = new Collapse();