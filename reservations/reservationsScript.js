$(function(){
    $("#reservationsHeader").load('header.html')
    $("#reservationsFooter").load('footer.html')

    if(localStorage.getItem("email")){
   
    }
    else{
    //not logged in
    console.log('no log in found')
    }
})