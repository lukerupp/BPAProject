$(function() {
    $("header").load('header.html')
    $("footer").load('footer.html')
    if (!localStorage.getItem("email")) {
        window.location.href = "/login.html"
    }

    function ConvertTime(time) {
        var time = Math.round(time * 100) / 100
        time = String(time)
        var split = time.split(".");
        var hour = split[0]
        var min = split[1]
        var param = "AM";
        if (hour > 12) {
            hour = hour - 12;
            param = "PM";
        }
        min = Math.round((min * 60) / 100)
        if (min < 10) {
            min = `0${min}`
        }
        var time = `${hour}:${min} ${param}`
        return time;
    }
    //get all sceduled events
    var email = localStorage.getItem('email')
    var password = localStorage.getItem('password')
    var check_data = { email: email, password: password, checkdata: true }
    $.ajax({
        type: "POST",
        url: "itinerary",
        data: check_data,
        success: function(res) {
            console.log("showing data")
            console.log(res)
            var reservations = res;
            for (var i = 0; i < reservations.length; i++) {
                var time = ConvertTime(reservations[i].time)
                $("table#itinerary").append(`<tr> <td>${reservations[i].rideRestaurantsName}</td> <td>${time}</td> </tr>`)
            }
        }
    })
})