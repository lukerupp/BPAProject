$(function(){
    $("#1homeheader").load('header.html')
    $("#homefooter").load('footer.html')

    var email = localStorage.getItem('email')
    var password = localStorage.getItem('password')
    var check_data = {email:email,password:password, checkdata:true} 
    if(localStorage.getItem("email")){
    //login exists
    console.log("login found")
    $.ajax({ //check if login data is correct - secures login more
        type: "POST",
        url: "login",
        data: check_data,
        success: function (res) {
          console.log(res)
          localStorage.setItem("name",res);
          $("h2#loginAs").html(`logged in as ${res}`)
          $("button#login-page").hide()
        },
      });
    }
    else{
    //not logged in
    console.log('no log in found')
    }
})