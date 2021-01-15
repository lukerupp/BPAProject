$(function () {
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

    var login_data = { email: email, password: password };

    $.ajax({
      type: "POST",
      url: "login",
      data: login_data,
      success: function (res) {
        console.log("logged in");
      },
    });
  });
  $("button#signup-button").click(function () {
    // handle signup form
    var firstName = $("input#first-name").val();
    var lastName = $("input#last-name").val();
    var email = $("input#signup-email").val();
    var password = $("input#signup-password").val();

    var signup_data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    $.ajax({
      type: "POST",
      url: "signup",
      data: signup_data,
      success: function (res) {
        console.log("signed up");
      },
    });
  });
});
