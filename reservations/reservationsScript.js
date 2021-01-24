$(function(){
    $("#reservationsHeader").load('header.html')
    $("#reservationsFooter").load('footer.html')

    if(!localStorage.getItem("email")){
        window.location.href = "/login.html"
    }
    //get all Restaurants and rides
    $.ajax({
        type:"GET",
        url:"getRidesRestaurants",
        success:function (res){
            var data = res;
            console.log(res)
            parseAndShow(data)
        }
    });
})

function makeReservations(reservationName){
    var id = reservationName.replaceAll(' ','-')
    var time = $(`#${id}`).val()
    if(time==""){ //checks if time was set
        console.log("no time given")
        return;
    }
    console.log(time)
    var data = {name:localStorage.getItem("name"),resName:reservationName, time:time}
    $.ajax({
        type:"POST",
        data:data,
        url:"makeReservations",
        success:function(res){
            if(res == "reservation made"){$("p#response").html("reservations made")}
            else if(res == "reservation not made"){$("p#response").html("reservations not made")}
        }
    });
}

function parseAndShow(data){
    var parsedData = []
    var dataSplit = data.split("}")
    console.log(dataSplit)
    for(var i=0; i<dataSplit.length-1;i++){
        dataSplit[i] = dataSplit[i] + "}"
        console.log(dataSplit[i])
        parsedData.push(JSON.parse(dataSplit[i]))
        var id = parsedData[i].name.replaceAll(' ','-')
        if(parsedData[i].type == "ride"){
            $("div#rides").append(`<p>${parsedData[i].name}</p> <button onclick="makeReservations('${id}')">Reserve</button>  <input id="${id}" type="time">`)
        }
        else{
            $("div#restaurants").append(`<p>${parsedData[i].name}</p> <button onclick="makeReservations('${id}')">Reserve</button>  <input id="${id}" type="time">`)
        }
    }
    console.log(parsedData)
}