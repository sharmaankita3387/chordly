/*
Student: Ankita Sharma
Team: Thurs-09
Code Description:This javaScript takes the user input for the
                 song selected and passes it down to the play page.
*/

function goToPlayPg(songId){
    sessionStorage.setItem("selectedSong", songId);
    window.location.href = "indiePlay.html";
}



