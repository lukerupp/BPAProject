$(function(){
    console.log(localStorage.getItem("isAdmin"))
    if(!localStorage.getItem("isAdmin")){
        window.location.href = "/admin.html"
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
        var reTime = `${hour}:${min} ${param}`
        return reTime;
    }
    var email = localStorage.getItem("email")
    var password = localStorage.getItem("password")
    $.ajax({
        type:"POST",
        url:"getData",
        data:{email:email,password:password},
        success: function (res){
            
            var people = res[0];
            var reservations = res[1];
            for(var i = 0;i<people.length;i++){
                var firstName = people[i].first_name;
                var lastName = people[i].last_name;
                var email = people[i].email;
                var is_admin = people[i].is_admin;
                var contact_id = people[i].contact_id;
                $("table#people").append(`<tr> <td>${firstName}</td> <td>${lastName}</td> <td>${email}</td> <td>${is_admin}</td> <td>${contact_id}</td> </tr>`)
            }
            for(var y=0; y<reservations.length;y++){
                var guestName = reservations[y].guestName;
                var name = reservations[y].rideRestaurantsName;
                var resTime = ConvertTime(reservations[y].time)
                $("table#reservations").append(`<tr> <td>${guestName}</td> <td>${name}</td> <td>${resTime}</td> </tr>`)
            }
        }
    })
})