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
    var data = {name:localStorage.getItem("name"),resName:reservationName, time:""}
    $.ajax({
        type:"POST",
        data:data,
        url:"makeReservations",
        success:function(res){
            
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
        if(parsedData[i].type == "ride"){
            $("div#rides").append(`<p>${parsedData[i].name} <button onclick="makeReservations('${parsedData[i].name}')">Reserve</button>  <input  min="09:00" max="18:00" type="time"></p>`)
        }
        else{
            $("div#restaurants").append(`<p>${parsedData[i].name} <button onclick="makeReservations('${parsedData[i].name}')">Reserve</button> <input  min="09:00" max="18:00" type="time"> </p>`)
        }
    }
    console.log(parsedData)
}