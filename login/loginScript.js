$(function(){
  $(".header").load('header.html')
  $(".footer").load('footer.html')
})
$(function () {
  //switch form with buttons
  $("button#login-switch").click(function () { 
    $("div#login").show();
    $("div#signup").hide();
  });
  $("button#signup-switch").click(function () {
    $("div#login").hide();
    $("div#signup").show();
  });

  $("button#login-button").click(function () {
    //handle login form
    var email = $("input#email-login").val();
    var password = $("input#login-password").val();

    var login_data = { email: email, password: password }; //make json for login

    $.ajax({ //send login data to server
      type: "POST",
      url: "login",
      data: login_data,
      success: function (res) {
        if(res == 'login successful'){
          window.location.href = "/home.html"
        }
        if(res == 'login unsuccessful'){
          $("p#status").html("Check password and email and try again")
        }
        console.log(res);
      },
    });
  });
  $("button#signup-button").click(function () {
    // handle signup form
    var firstName = $("input#first-name").val();
    var lastName = $("input#last-name").val();
    var email = $("input#signup-email").val();
    var password = $("input#signup-password").val();

    var signup_data = { //make json for signup
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    $.ajax({ //send signup data to server
      type: "POST",
      url: "signup",
      data: signup_data,
      success: function (res) {
        if(res == "User registered"){
          $("p#status").html("User registered - please go and sign in!")
          console.log('User created')
        }
        else if(res == "user already exists"){
          $("p#status").html("User already registered - please try another email")
          console.log('User already existed')
        }
        else if(res =="illegal password"){
          $("p#status").html("Your password must have an upper case, a number and be at least 8 characters log")
          console.log("illegal password")
        }
      },
    });
  });
});