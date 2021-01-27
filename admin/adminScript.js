$(function(){
    $("#submit").click(function(){
        var email = $("#username").val();
        var password = $("#password").val();
        var creds = {email:email,password:password}
        $.post("adminLogin",creds,function(res){
            console.log(res)
            if(res=="successful"){
            localStorage.setItem("isAdmin",true);
            window.location.href = "/adminHome.html"
            
        }
            else if(res == "unsuccessful"){$("p#status").html("Check password and email and try again")}
        })
    })
})