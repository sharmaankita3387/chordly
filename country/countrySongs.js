/*
Student: shashatm (Maria Shashati); shara248 (Ankita Sharma)
Team: Thurs-09

Code Description: This javaScript file has all the functions which 
                  work together to determine when a chord image should
                  be displayed and when a chord audio should be played 
                  according to the user interaction.

Contributors:
- shara248: Coded JavaScript functions(rewind and forward), buttons(mute/unmute,exit), 
            and overall front-end interactivity for the website.
- shashatm: Developed the song database and implemented the song play logic for country songs, 
            managing the song data and playback functionality.
*/


//retreiveing the selected song from the session storage
const selectedSong = sessionStorage.getItem("selectedSong");

//Getting the container element in HTML webpage where the chordImg will be displayed.
const imageBox = document.getElementById('chordImageBox');

document.addEventListener('DOMContentLoaded', function() {

    //initializing the variables
    let currentSong = selectedSong;
    let processedChords = [];
    let currentChordIndex = 0;
    let playInterval = null;
    let isPlaying = false;
    let isMuted = false;//initially set to flase = unmute


    //DOM elements
    const muteButton = document.getElementById("muteButton");
    const playButton = document.getElementById("playButton");
    const exitButton = document.getElementById("exitButton");
    const rewindButton = document.getElementById("rewindButton");
    const forwardButton = document.getElementById("forwardButton");

    //Song database
    const songs = {
        bbr:{
            chords:[["C","G","Am","F","G","C"],["C","G","Am","F","G","C"],["Am","G"],["F","C"],["C","G","Am","F","G","C"],["F","C","G","C"],["F","Am","F","G"],["F","C","G","Am"],["F"],["C","G","Am","F","G","C"],["C","G","Am","F","G","C"],["C","G","Am","F","G","C"],

            ["C","G","Am","F","G","C"],["C","G","Am","F","G","C"],["Am","G"],["F","C"],
            
            ["C","G","Am","F","G","C"],["F","C","G","C"],["F","Am","F","G"],["F","C","G","Am"],            ["F"],["C","G","Am","F","G","C"],["F","C","G","C","F","C","G","C"],["F","C","G","C"],       ["F","C"],["C","G","Am","F","G","C","F","G","C"],["C","G","Am","F","G","C","F","F","G","C"],
            
            ["C","G","Am","F","G","C"]],
        bpm:164,
        beatsPerBar:4
        },///bbr = bless_broken_road

        cmu:{
            chords:[["D","G","D"],["D","G","D"],["Bm","G","D"],["D","G","D"],["D","G","D"],["D","G","D"],
            ["Em","G","Bm"],["D","G","D"],["D","G","D"],["D","G","D"],["Bm","G","D"],["D","G","D"],
            ["D","G","D"],["D","G","D"],["Em","G","Bm"],["D","G","D"],["D","G","D"],["D","G","D"]],
        bpm:128,
        beatsPerBar:3
        },//cmu = cover_Me_Up

        dawns:{ 
            chords:[["F","Am","G","C"],["F"],["Am"],["G"],["C"],["F"],["Am"],["G"],["C"],["F"],["Am"],["G"],["C"],
            ["F"],["C"],["G"],["Am"],["F"],["C"],["G"],["Am"],["F"],["C"],["G"],["Am"],["F"],["C"],["G"],["Am"],
            ["F","C","G","Am"],["F"],["Am"],["G"],["C"],["F"],["C"],["G"],["Am"],["F"],["C"],["G"],["Am"],["F"],["C"],
            ["G"],["Am"],["F"],["C"],["G"],["Am"],["F","C","G","Am"],["F"],["Am"],["G"],["C"]],
        bpm:123,
        beatsPerBar:1
        },//dawns

        girl:{//NOT WORKING
            chords:[["F","Bb","F"],["F","Bb","F"],["F","Bb","F"],["C","Bb","F"],["Bb","F"], ["G","C"],

            ["G","C"],["G","C"],["G","C","Bb"],["F","Bb","F"],["F","Bb","F"],["F","Bb","F"],            ["F","Bb","F"],["Bb","F"],["G","C"],["G","C"],["G","C"],["G","C","Bb"],["F","Bb","F"],
            
            ["F","Bb","F"],["C","Bb","F"],["F","Bb","F"]],
            bpm:91,
            beatsPerBar:3
        },//girl=gone_girl

        night:{ //NOT WORKING 
            chords:[["C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em","C","D","Em"],
            ["C","D","-"],["Em","-","-"],["C","D","-"],["Em","-","-"],["C","D","Em"],["-","-","C"],["D","Em","-"],
            ["C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em","C","D","Em"],
            ["-","C","D"],["Em","-","-"],["C","D","-"],["Em","-","-"],["C","D", "Em"],["-","-","C"],["D","Em","-"],
            ["C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D","Em","C","D","Em"],
            ["-","C","D","Em"],["C","D","Em"],["-","C","D","Em"],["-","C","D","Em"],["-","C","D, Em"],
            ["-","C","D, Em"]],
            bpm:128,
            beatsPerBar:3
        },//night = last_Night

        north:{
            chords:[["D","F#m"],["Bm","G"],["D","F#m"],["Bm"],["G"],["D","Bm"],["F#m","G"],
            ["D","Bm"],["F#m","Bm"],["D","G","A","G"],["D","G"],["_", "A"],["_","G"],["-"]
            ["D","G"],["_","A"],["_","G"],["_","D"],["D","F#m"],["Bm","G"],["D","F#m"],
            ["Bm","G"],["D","Bm"],["F#m","G"],["D","Bm"],["F#m","Bm"],["D","G","A","G"],
            ["D","G"],["_", "A"],["_","G"],["-"],["D","F#m"],["D","F#m"],["D","F#m"],["D","F#m"],
            ["D","G"],["_", "A"],["_","G"],["-"],["D","G"],["_","A"],["_","G"],["_","D"]],
            bpm:164,
            beatsPerBar:4
        },//north = northern_attitude

        revival:{
            chords:[["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],["Em","G","C","G"],
            ["Em","G","C","G"],["Em","G","C","G"]],
            bpm:68,
            beatsPerBar:4
        },//revival 

        orange:{
            chords:[["Em7","D/F#","G"],["G","D/F#","Em7"],["Em7","D/F#","G"],["G","D/F#","Em7"],
            ["Em7","D/F#","G"],["G","D/F#","Em7"],["Em7","D/F#","G"],["G","D/F#","Em7"],
            ["C","G"],["D","Em7"],["C","-"],["G","D"],["C","G","-"],["D","-","Em7"],["C","G"],["D","Em7"],
            ["C","G","D","Em7"],["C","G","D","Em7"],["Em7","D/F#","G"],["G","D/F#","Em7"],
            ["C","G","-"],["D","-","Em7"],["C","-"],["G","D","Em7"],["C","G","-"],["D","-","Em7"],
            ["C","G","-"],["D","-","Em7"],["C","G","D","Em7"],["C","G","-"],["D","-","Em7"],["C","-"],
            ["G","D","Em7"],["C","G","-"],["D","-","Em7"], ["C","G","-"],["D","-","Em7"]],
            bpm:175,
            beatsPerBar:3
        },//orange = something_In_The_Orange

        thome:{
            chords:[["A","F#m"],["E","D","A"],["F#m"],["E"],["D","A"],["A","F#m"],["E","D","A"],
            ["F#m"],["E"],["D","A"],["A","E"],["F#m","D"],["A","E"],["D","A"],["F#m","E","A"],["D","A","E"],
            ["F#m","G","D"],["A","E","E7"],["A","E"],["F#m","D"],["A","E"],["D","A"],["A","E"],["F#m","D"],["A","E"],
            ["F#m","D"],["A","E"],["D","A"],["E","A"],["E","A"]],
            bpm:164,
            beatsPerBar:4
        },//thome = take_Me_Home

        every:{
            chords: [["C/G"],["C/G"],["C/G","G"],["_","C/G"],["_","G"],["C/G","G"],["_","C/G"],["_","G"],
            ["Em","G","C/G"],["Em","G","C/G"],["G"],["G","Em","C/G"],["Em","G","C/G"],
            ["-","-","G","Em","C/G"],["-","-","G","Em","C/G"],["G","Em","C/G","-"],["-","G","Em","C/G"],
            ["-", "-","G","Em","C/G"],["-", "-","G","Em","C/G"],["G", "-"],["G","C/G"],["_","G"],["_","C/G"],
            ["_","G"],["_","C/G"],["_","G"],["_","C/G"],["Em","G","C/G"],["Em","G","C/G"],["G"],
            ["G","Em","C/G"],["Em","G","C/G"],["-","-","G","Em","C/G"],["-", "-","G","Em","C/G"],
            ["G","Em","C/G","-"],["-","G","Em","C/G"],["-","-","G","Em","C/G"],["-","-","G","Em","C/G"],
            ["G","Em","C/G","-"],["-","G","Em","C/G"],["-","-","G","Em","C/G"],["-","-","G","Em","C/G"]],
            bpm:180,
            beatsPerBar:4
        }//every = everywhere_everything

    };//songs


    function playChordAudio(chord){

        if (isMuted) return;  // If muted, don't play audio

        let audio = new Audio();
        switch (chord){
            case "A":
                audio.src = '../audio/dhruv/A.m4a';
                break;
            case "A#m":
                audio.src = '../audio/dhruv/A_m.m4a';
                break;
            case "A/D":
                audio.src = '../audio/dhruv/A.D.m4a';
                break;
            case "A7":
                audio.src = '../audio/dhruv/A7.m4a';
                break;
            case "Am":
                audio.src = '../audio/dhruv/Am.m4a';
                break;
            case "Am7":
                audio.src = '../audio/dhruv/Am7.m4a';
                break;
            case "Am7/G":
                audio.src = '../audio/dhruv/Am7.G.m4a';
                break;
            case "Amaj7":
                audio.src = '../audio/dhruv/Amaj7.m4a';
                break;
            case "B":
                audio.src = '../audio/dhruv/B.m4a';
                break;
            case "B7":
                audio.src = '../audio/dhruv/B7.m4a';
                break;
            case "Bb":
                audio.src = '../audio/dhruv/Bb.m4a';
                break;
            case "Bm":
                audio.src = '../audio/dhruv/Bm.m4a';
                break;
            case "Bm7":
                audio.src = '../audio/dhruv/Bm7.m4a';
                break;
            case "Bsus3":
                audio.src = '../audio/dhruv/Bsus3.m4a';
                break;
            case "C#m":
                audio.src = '../audio/dhruv/C_m.m4a';
                break;
            case "C/G":
                audio.src = '../audio/dhruv/C.G.m4a';
                break;
            case "C":
                audio.src = '../audio/dhruv/C.m4a';
                break;
            case "C7":
                audio.src = '../audio/dhruv/C7.m4a';
                break;
            case "D#m":
                audio.src = '../audio/dhruv/D_m.m4a';
                break;
            case "D":
                audio.src = '../audio/dhruv/D.m4a';
                break;
            case "D6sus2":
                audio.src = '../audio/dhruv/D6sus2.m4a';
                break;
            case "D7sus4/G":
                audio.src = '../audio/dhruv/D7sus4.G.m4a';
                break;
            case "Db7":
                audio.src = '../audio/dhruv/Db7.m4a';
                break;
            case "Dm/C":
                audio.src = '../audio/dhruv/Dm.C.m4a';
                break;
            case "Dm":
                audio.src = '../audio/dhruv/Dm.m4a';
                break;
            case "Dm7":
                audio.src = '../audio/dhruv/Dm7.m4a';
                break;
            case "E":
                audio.src = '../audio/dhruv/E.m4a';
                break;
            case "E7":
                audio.src = '../audio/dhruv/E7.m4a';
                break;
            case "Em":
                audio.src = '../audio/dhruv/Em.m4a';
                break;
            case "Em7":
                audio.src = '../audio/dhruv/Em7.m4a';
                break;
            case "F#":
                audio.src = '../audio/dhruv/F_.m4a';
                break;
            case "F#m":
                audio.src = '../audio/dhruv/F_m.m4a';
                break;
            case "F/E":
                audio.src = '../audio/dhruv/F.E.m4a';
                break;
            case "F":
                audio.src = '../audio/dhruv/F.m4a';
                break;
            case "F6":
                audio.src = '../audio/dhruv/F6.m4a';
                break;
            case "F7":
                audio.src = '../audio/dhruv/F7.m4a';
                break;
            case "Fmaj7":
                audio.src = '../audio/dhruv/Fmaj7.m4a';
                break;
            case "G#":
                audio.src = '../audio/dhruv/G_.m4a';
                break;
            case "G#5":
                audio.src = '../audio/dhruv/G_m.m4a';
                break;
            case "G/D":
                audio.src = '../audio/dhruv/G.D.m4a';
                break;
            case "G/F":
                audio.src = '../audio/dhruv/G.F.m4a';
                break;
            case "G":
                audio.src = '../audio/dhruv/G.m4a';
                break;
            case "G6":
                audio.src = '../audio/dhruv/G6.m4a';
                break;
            case "G7":
                audio.src = '../audio/dhruv/G7.m4a';
                break;
            case "Gm":
                audio.src = '../audio/dhruv/Gm.m4a';
                break;
            case "Gmaj7":
                audio.src = '../audio/dhruv/Gmaj7.m4a';
                break;
            }//switch
        audio.play();
    }//playChordAudio

    //function to choose Chord Display img on HTML webpage
    function displayChord(chord){

        //if-else chain for choosing the display img.
        if(chord === "-")return;//maintains the previous chord

         //Remove the previous image from display
        while (imageBox.firstChild){
            imageBox.removeChild(imageBox.firstChild);
        }//while

        //creating a new <img> element
        let imgElement = document.createElement('img');

        if (chord === "A"){
            imgElement.src = "../images/A.png";
        }else if (chord === "A#m"){
            imgElement.src = "../images/A_m.png";
        }else if (chord === "A/D"){
            imgElement.src = "../images/A.D.png";
        }else if (chord === "A7"){
            imgElement.src = "../images/A7.png";
        }else if (chord === "Am7"){
            imgElement.src = "../images/Am7.png";
        }else if (chord === "Am"){
            imgElement.src = "../images/Am.png";
        }else if (chord === "Am7/G"){
            imgElement.src = "../images/Am7.G.png";
        }else if (chord === "Amaj7"){
            imgElement.src = "../images/Amaj7.png";
        }else if (chord === "B"){
            imgElement.src = "../images/B.png";
        }else if (chord === "B7"){
            imgElement.src = "../images/B7.png";
        }else if (chord === "Bb"){
            imgElement.src = "../images/Bb.png";
        }else if (chord === "Bm"){
            imgElement.src = "../images/Bm.png";
        }else if (chord === "Bm7"){
            imgElement.src = "../images/Bm7.png";
        }else if (chord === "Bsus3"){
            imgElement.src = "../images/Bsus3.png";
        }else if (chord === "C#m"){
            imgElement.src = "../images/C_m.png";
        }else if (chord === "C/G"){
            imgElement.src = "../images/C.G.png";
        }else if (chord === "C"){
            imgElement.src = "../images/C.png";
        }else if (chord === "C7"){
            imgElement.src = "../images/C7.png";
        }else if (chord === "D#m"){
            imgElement.src = "../images/D_m.png";
        }else if (chord === "D"){
            imgElement.src = "../images/D.png";
        }else if (chord === "D6sus2"){
            imgElement.src = "../images/D6sus2.png";
        }else if (chord === "D7sus4/G"){
            imgElement.src = "../images/D7sus4.G.png";
        }else if (chord === "Db7"){
            imgElement.src = "../images/Db7.png";
        }else if (chord === "Dm/C"){
            imgElement.src = "../images/Dm.C.png";
        }else if (chord === "Dm"){
            imgElement.src = "../images/Dm.png";
        }else if (chord === "Dm7"){
            imgElement.src = "../images/Dm7.png";
        }else if (chord === "E"){
            imgElement.src = "../images/E.png";
        }else if (chord === "E7"){
            imgElement.src = "../images/E7.png";
        }else if (chord === "Em"){
            imgElement.src = "../images/Em.png";
        }else if (chord === "Em7"){
            imgElement.src = "../images/Em7.png";
        }else if (chord === "F#"){
            imgElement.src = "../images/F_.png";
        }else if (chord === "F#m"){
            imgElement.src = "../images/F_m.png";
        }else if (chord === "F/E"){
            imgElement.src = "../images/F.E.png";
        }else if (chord === "F"){
            imgElement.src = "../images/F.png";
        }else if (chord === "F6"){
            imgElement.src = "../images/F6.png";
        }else if (chord === "F7"){
            imgElement.src = "../images/F7.png";
        }else if (chord === "Fmaj7"){
            imgElement.src = "../images/Fmaj7.png";
        }else if (chord === "G#"){
            imgElement.src = "../images/G_.png";
        }else if (chord === "G#m"){
            imgElement.src = "../images/G_m.png";
        }else if (chord === "G/D"){
            imgElement.src = "../images/G.D.png";
        }else if (chord === "G/F"){
            imgElement.src = "../images/G.F.png";
        }else if (chord === "G"){
            imgElement.src = "../images/G.png";
        }else if (chord === "G6"){
            imgElement.src = "../images/G6.png";
        }else if (chord === "G7"){
            imgElement.src = "../images/G7.png";
        }else if (chord === "Gm"){
            imgElement.src = "../images/Gm.png";
        }else if (chord === "Gmaj7"){
            imgElement.src = "../images/Gmaj7.png";
        }else{
            imgElement.src = '../images/exit.png';
        }//if-else chain

        //Setting the alt text for img.
        imgElement.alt = 'CHORD IMG';

        //Appending the image element to the image container
        //basically sending the img to heml pg for display
        imageBox.appendChild(imgElement);

         // Trigger the "pop" effect after appending the new image
        setTimeout(() => {
        imgElement.classList.add('show');  // This will trigger the scaling and fade-in
        }, 10); // A small delay to ensure the image is added before the transition starts

        //Play the audio for the current chord.
       playChordAudio(chord);
    };//displayChord

    //process chord lists with spaces
    function processChords(chordList){
        const songList = [];
        for (let bar of chordList){
            const chordsPerBar = bar.length;
            for (let i = 0; i < chordsPerBar; i++){
                songList.push(bar[i]);
                const restTime = 4/chordsPerBar;
                for (let j=0; j < Math.floor(restTime) - 1; j++){
                    songList.push("-");
                }
            }
        }
        return songList;
    };//processChords


    //Initializing the player
    function initPlayer(){
        const selectedSong = sessionStorage.getItem("selectedSong");
        
        //checking if the selected song exists in the database
        if(selectedSong && songs[selectedSong]){
            currentSong = songs[selectedSong];

            //processing the song by including rest time("-") using
            //the processChords function
            processedChords = processChords(currentSong.chords);
            
            //calling displayChord to display the veryfirst chordimg on webpage.
            displayChord(processedChords[0]);
        } else{
            //No song selected, redirect to selection page
            window.location.href = 'countrySongs.html';
        }//if-else

    };//initPlayer


    //Play Song
    function playSong(){

        if(playInterval) clearInterval(playInterval);

        const chordTime = ((60/currentSong.bpm)*1000)/(4/currentSong.beatsPerBar);
        let adjustedChordTime = chordTime * 1.5;

        isPlaying = true;
        playButton.src = "../images/pause.png";

        playInterval = setInterval(() => {
            if (currentChordIndex >= processedChords.length){
                stopSong();
                return;
            }
            displayChord(processedChords[currentChordIndex]);
            currentChordIndex++;
        }, adjustedChordTime);

    };//playSong


    //Pause the Song
    function pauseSong(){
        clearInterval(playInterval);
        isPlaying = false;
        playButton.src = "../images/play.png";
    }//pauseSong


    //Event listeners

    //coding the function for playButton
    playButton.addEventListener('click', () => {
        if (isPlaying){
            pauseSong();
        }else{
            playSong();
        }
    });//playButton

    //coding the exitButton
    exitButton.addEventListener('click', () => {
        stopSong();
    });//exitButton

    //logic for rewind button
    rewindButton.addEventListener('click', () => {
        if (currentChordIndex <= 0) return; //if at the start of the song
        
        //to find the biginning of the current bar
        let barStart = false;
        let beatCount = 0;

        for (let i = currentChordIndex - 1; i >=0 ; i--){
            if (processedChords[i] !== "-"){
                beatCount++;
            }
            
            //4 beats = 1bar
            if (beatCount >= 4){
                currentChordIndex = i + 1; //moving to the start of current bar
                barStart = true;
                break;
            }
        }
        
        //Go to start of current/previous bar
        if (!barStart){
            currentChordIndex = 0;
        }
        displayChord(processedChords[currentChordIndex]);
    });
    
    //Logic for forward button
    forwardButton.addEventListener('click', () => {
        if (currentChordIndex >= processedChords.length -1) return; //if at the end of the song

        let beatCount = 0;
        let newPosition = currentChordIndex;

        //Walk forward to count beats
        for (let i = currentChordIndex; i < processedChords.length; i++){
            if(processedChords[i] !== "-"){
                beatCount++;
            }

            //4 beats = 1 bar
            if (beatCount >= 4){
                newPosition = i+1;
                break;
            }
        }
        
        //if at end of the song, stay at last chord
        if (newPosition >= processedChords.length){
            newPosition >= processedChords.length - 1;
        }

        currentChordIndex = newPosition;
        displayChord(processedChords[currentChordIndex]);   
    });

    
    // Mute or Unmute audio
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;  // Toggle mute state

        // Change mute button image based on mute state
        if (isMuted) {
            muteButton.src = '../images/mute.png'; // Mute icon
        } else {
            muteButton.src = '../images/unmute.png'; // Unmute icon
        }
    });

    //Initialize the player
    initPlayer();

});//document.addEventListener