$(function(){
    $("#reservationsHeader").load('header.html')
    $("#reservationsFooter").load('footer.html')

    if(!localStorage.getItem("email")){
        window.location.href = "/login.html"
    }
    
})