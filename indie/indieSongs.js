/*
Student: farida6 (Alisha Faridi); shara248 (Ankita Sharma)
Team: Thurs-09

Code Description: This javaScript file has all the functions which 
                  work together to determine when a chord image should
                  be displayed and when a chord audio should be played 
                  according to the user interaction.

Contributors:
- shara248: Coded JavaScript functions(rewind and forward), buttons(mute/unmute,exit), 
            and overall front-end interactivity for the website.
- farida6: Developed the song database and implemented the song play logic for indie songs, 
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
        fade:{
            chords:[["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["D"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["D"],["A"],["E"],["Bm"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"],["D"],["A"],["E"],["Bm"],
            ["A"],["E"],["Bm"],["A"],["E"],["Bm"]],
        bpm:157,
        beatsPerBar:4
        },///fade = Fade into You

        aiw:{
            chords:[["C"], ["C"], ["C"], ["C"], ["C"], ["F"], ["C"], ["C"], ["C"],
            ["G"], ["Am"], ["Am"], ["F"], ["C"], ["C"], ["F"], ["C"], ["C"],
            ["C"], ["F"], ["C"], ["C"], ["C"], ["G"], ["Am"], ["Am"], ["F"],
            ["F"], ["C"], ["C"], ["F"], ["F"], ["C"], ["G"], ["G"], ["Am"],
            ["Am"], ["F"], ["F"], ["C"], ["G"], ["Am"], ["Am"], ["F"], ["C"], ["C"],
            ["G"], ["G"], ["C"], ["F"], ["C"], ["C"], ["G"], ["Am"], ["F"], ["C"],
            ["F"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["F"], ["C"], ["C"], ["C"],
            ["G"], ["Am"], ["Am"], ["F"], ["C"], ["C"], ["F"], ["C"], ["C"],
            ["G"], ["G"], ["Am"], ["Am"], ["F"], ["F"], ["C"], ["C"], ["G"], ["G"], 
            ["Am"], ["Am"], ["F"], ["F"], ["C"], ["C"], ["G"], ["G"], ["G"],
            ["Dm"], ["G"], ["Dm"], ["G"],["G"], ["Am"], ["Am"], ["F"], ["F"], 
            ["C"], ["C"], ["G"], ["G"], ["Am"], ["Am"], ["F"], ["F"], ["C"], ["C"], ["G"],
            ["G"], ["Am"], ["F"],["C"], ["G"], ["Am"], ["F"], ["C"], ["G"], 
            ["Am"], ["Am"], ["F"], ["F"], ["C"], ["C"], ["G"], ["G"], ["Am"],
            ["Am"], ["F"], ["F"], ["C"], ["C"], ["G"], ["G"], ["C"], ["F"],
            ["C"], ["C"]],
        bpm:125,
        beatsPerBar:4
        },//aiw = All I Want

        eob:{ 
            chords: [["D"], ["D"], ["Bm"], ["Bm"], ["A"], ["D"], ["D"], ["Bm"], ["Bm"],
            [["Em"],["A"]], [["Em"],["A"]], 
            [["Gmaj7"],["D"]], [["A"],["Gmaj7"]], ["Gmaj7"], [[["Bm"],["A"]]], ["Gmaj7"], 
            [[["D"],["A"]]], ["G"],
            
            ["D"], ["D"], ["Bm"], ["Bm"], ["A"], ["D"], ["D"], ["Bm"], ["Bm"],
            [["Em"],["A"]], [["Em"],["A"]], 
            
            [["Gmaj7"],["D"]], [["A"],["Gmaj7"]], ["Gmaj7"], [[["Bm"],["A"]]], ["Gmaj7"], 
            [[["D"],["A"]]], ["G"], ["G"], ["G"],
            
            ["A"], [["A"], ["B"]], ["A"], [["A"], ["B"]], ["A"], [["A"], ["B"]], ["-"],
            
            [["G"],["D"]], [["A"],["G"]], ["G"], [[["Bm"],["A"]]], [["A"],["G"]], ["G"],
            [["D"],["A"]], ["G"], ["G"]],
        bpm:80,
        beatsPerBar:4
        },//eob = End of Beginning

        light:{
            chords: [["Bm"], ["E"], ["A"], ["Bm"], ["E"], ["A"], ["Bm"], ["E7"], ["A"],
              ["Bm"], ["E"], ["A"], ["D"], ["Bm"], ["E"], ["A"], ["D"], 
              ["Bm"], ["E"], ["A"], ["Bm"], ["E"], ["A"], 
              ["Bm"], ["E"], ["A"], ["D"], ["Bm"], ["E"], ["A"], ["D"], ["Bm"], 
              ["E7"], ["A"], ["D"], ["Bm"], ["E7"], ["A"], ["D"], ["Bm"], ["E"],
              ["A"], ["D"]],
                bpm:66,
                beatsPerBar:4
        },//light = Let the Light in

        room:{ 
            chords:[["D"], ["G"], ["Bm"], ["F#m"], ["A"], ["D"], ["G"], ["D"], ["F#m"],
            ["G"], ["D"], ["A"], ["Bm"], ["G"], ["D"], ["A"], ["Bm"], ["G"],
            ["D"], ["G"], ["D"], ["A"], ["Bm"], ["G"], ["D"], ["A"], ["Bm"],
            ["G"], ["D"], ["G"], ["D"], ["A"], ["Bm"], ["G"], ["A"], ["D"],
            
            ["D"], ["G"], ["Bm"], ["F#m"], ["A"], ["D"], ["G"], ["D"], ["F#m"], ["A"],
            
            
            ["D"], ["G"], ["Bm"], ["F#m"], ["A"], ["Bm"], ["G"], ["D"], ["F#m"], ["A"],
            ["G"], ["D"], ["A"], ["Bm"], ["G"], ["G"], ["D"], ["A"], ["Bm"], ["G"], ["Em"], ["G"],
            ["Bm"], ["G"], ["D"], ["F#m"], ["A"], ["D"], ["G"], ["Bm"], ["A"],
            
            ["Bm"], ["G"], ["D"], ["A"], ["Bm"], ["G"], ["D"], ["A"],  ["Bm"], ["G"], ["D"], ["A"], 
            ["Bm"], ["G"], ["D"], ["A"],  ["Bm"], ["G"], ["D"], ["A"],  ["Bm"], ["G"], ["D"], ["A"], 
            ["Bm"], ["G"], ["D"], ["A"],  ["Bm"], ["G"], ["D"], ["A"]],
            bpm:92,
            beatsPerBar:4
        },//room = Waiting Room

        love:{
            chords: [["Am"], ["C"], ["C"], ["C"], ["Am"], ["C"], ["C"], ["C"], ["Am"],
            ["C"], ["C"], ["C"], ["D6sus2"], ["D6sus2"], ["Am"], [["Am"], ["C"]], ["C"], ["C"],
            ["C"], ["C"], ["Am"], ["C"], ["Am"], ["C"], ["Am"], ["C"], ["D6sus2"],
            ["Am"], ["C"], ["Am"], ["C"], ["Am"], ["C"], ["Am"], ["C"], ["D6sus2"],
            ["Am"], ["C"], ["C"], ["F"], ["C"], ["G"], ["F"], ["C"], ["C"], ["F"],
            ["C"], ["C"], ["F"], ["Am"], ["C"], ["Am"], ["C"], ["Am"], ["C"], ["D6sus2"],
            ["Am"], ["C"], ["C"], ["C"], ["F"], ["C"], ["G"], ["F"], ["C"], ["C"], ["F"], ["C"],
            ["F"], ["C"], ["C"], ["F"], ["C"], ["C"], ["F"], 
            ["Am"], ["C"], ["C"], ["C"], ["Am"], ["C"], ["C"], ["C"], ["Am"],
            ["C"], ["C"], ["C"], ["D6sus2"], ["D6sus2"], ["Am"], [["Am"], ["C"]], ["C"]],
            bpm:150,
            beatsPerBar:4
        },//love = Skinny Love

        you:{
            chords:[["D"], ["D"], ["A"], ["Bm"], ["G"], ["D"], ["A"], ["Bm"], ["G"],
            ["A"], ["D"], ["A"], ["Bm"], ["G"], ["A"], ["D"], ["A"], ["Bm"],
            ["G"], ["A"], ["D"], ["A"], ["Bm"], ["G"], ["A"], ["D"], ["A"],
            ["Bm"], ["G"], ["A"], ["D"], ["A"], ["Bm"], [["G"], ["A"]], ["D"], ["A"],
            ["Bm"], [["G"], ["A"]], ["D"], ["A"], ["Bm"], ["Bm"], ["G"], ["A"], ["D"], ["A"],
            ["Bm"], ["G"], ["D"], ["A"], ["Bm"], ["G"], ["A"]],
            bpm:96,
            beatsPerBar:4
        },//you = About You

        bored:{
            chords: [["B"], ["D#m"], ["F#"], ["B"], ["D#m"], ["F#"], ["B"], ["D#m"], ["F#"],
            ["B"], ["D#m"], ["F#"], ["B"], ["D#m"], ["F#"], ["F#"], ["B"], ["D#m"],
            ["F#"], ["F#"], ["B"], ["D#m"], ["F#"], ["B"], ["D#m"], ["F#"], ["G#m"],
            ["C#"], ["F#"], ["B"], ["F#"], ["G#m"], ["C#"], ["F#"], ["B"], ["G#m"],
            ["C#"], ["F#"], ["B"], ["F#"], ["G#m"], ["C#"], ["F#"], ["F#m"], ["C#"], ["F#"],
            ["B"], ["A#m"], ["G#m"], ["C#"], ["F#"], ["B"], ["A#m"], ["B"], ["D#m"], ["F#"],
            ["C#"], ["B"], ["D#m"], ["F#"], ["C#"]],
            bpm:120,
            beatsPerBar:4
        },//bored = Are You Bored Yet

        bag:{
            chords:[["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"],
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], 
            ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"], ["F#"], ["A#m"], ["G#"],
            ["F#"], ["A#m"], ["G#"]],
            bpm:105,
            beatsPerBar:4
            },//bag = Bags by Clairo

        high:{
            chords: [["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"],
            ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"],
            ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"],
            ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"],
            ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], ["Em"], ["C"], ["Am"], 
            ["Em"], ["C"], ["Am"], ["C"], ["Em"], ["A"], ["C"], ["Em"], ["A"],
            ["C"], ["Em"], ["A"], ["C"], ["Em"], ["A"], ["C"], ["B"], ["B"],
            ["C"], ["Em"], ["C"], ["Em"], ["C"], ["Em"], ["C"], ["Em"], 
            ["C"], ["Em"],  ["C"], ["Em"],  ["C"], ["Em"],  ["C"], ["Em"]],
            bpm:92,
            beatsPerBar:4
        }//high = Why'd You Only Call Me When You're High

    };//songs


    function playChordAudio(chord){

        if (isMuted) return;  // If muted, don't play audio

        let audio = new Audio();
        switch (chord){
            case "A":
                audio.src = '../audio/alisha/A.m4a';
                break;
            case "A#m":
                audio.src = '../audio/alisha/A_m.m4a';
                break;
            case "A/D":
                audio.src = '../audio/alisha/A.D.m4a';
                break;
            case "A7":
                audio.src = '../audio/alisha/A7.m4a';
                break;
            case "Am":
                audio.src = '../audio/alisha/Am.m4a';
                break;
            case "Am7":
                audio.src = '../audio/alisha/Am7.m4a';
                break;
            case "Am7/G":
                audio.src = '../audio/alisha/Am7.G.m4a';
                break;
            case "Amaj7":
                audio.src = '../audio/alisha/Amaj7.m4a';
                break;
            case "B":
                audio.src = '../audio/alisha/B.m4a';
                break;
            case "B7":
                audio.src = '../audio/alisha/B7.m4a';
                break;
            case "Bb":
                audio.src = '../audio/alisha/Bb.m4a';
                break;
            case "Bm":
                audio.src = '../audio/alisha/Bm.m4a';
                break;
            case "Bm7":
                audio.src = '../audio/alisha/Bm7.m4a';
                break;
            case "Bsus3":
                audio.src = '../audio/alisha/Bsus3.m4a';
                break;
            case "C#m":
                audio.src = '../audio/alisha/C_m.m4a';
                break;
            case "C/G":
                audio.src = '../audio/alisha/C.G.m4a';
                break;
            case "C":
                audio.src = '../audio/alisha/C.m4a';
                break;
            case "C7":
                audio.src = '../audio/alisha/C7.m4a';
                break;
            case "D#m":
                audio.src = '../audio/alisha/D_m.m4a';
                break;
            case "D":
                audio.src = '../audio/alisha/D.m4a';
                break;
            case "D6sus2":
                audio.src = '../audio/alisha/D6sus2.m4a';
                break;
            case "D7sus4/G":
                audio.src = '../audio/alisha/D7sus4.G.m4a';
                break;
            case "Db7":
                audio.src = '../audio/alisha/Db7.m4a';
                break;
            case "Dm/C":
                audio.src = '../audio/alisha/Dm.C.m4a';
                break;
            case "Dm":
                audio.src = '../audio/alisha/Dm.m4a';
                break;
            case "Dm7":
                audio.src = '../audio/alisha/Dm7.m4a';
                break;
            case "E":
                audio.src = '../audio/alisha/E.m4a';
                break;
            case "E7":
                audio.src = '../audio/alisha/E7.m4a';
                break;
            case "Em":
                audio.src = '../audio/alisha/Em.m4a';
                break;
            case "Em7":
                audio.src = '../audio/alisha/Em7.m4a';
                break;
            case "F#":
                audio.src = '../audio/alisha/F_.m4a';
                break;
            case "F#m":
                audio.src = '../audio/alisha/F_m.m4a';
                break;
            case "F/E":
                audio.src = '../audio/alisha/F.E.m4a';
                break;
            case "F":
                audio.src = '../audio/alisha/F.m4a';
                break;
            case "F6":
                audio.src = '../audio/alisha/F6.m4a';
                break;
            case "F7":
                audio.src = '../audio/alisha/F7.m4a';
                break;
            case "Fmaj7":
                audio.src = '../audio/alisha/Fmaj7.m4a';
                break;
            case "G#":
                audio.src = '../audio/alisha/G_.m4a';
                break;
            case "G#5":
                audio.src = '../audio/alisha/G_m.m4a';
                break;
            case "G/D":
                audio.src = '../audio/alisha/G.D.m4a';
                break;
            case "G/F":
                audio.src = '../audio/alisha/G.F.m4a';
                break;
            case "G":
                audio.src = '../audio/alisha/G.m4a';
                break;
            case "G6":
                audio.src = '../audio/alisha/G6.m4a';
                break;
            case "G7":
                audio.src = '../audio/alisha/G7.m4a';
                break;
            case "Gm":
                audio.src = '../audio/alisha/Gm.m4a';
                break;
            case "Gmaj7":
                audio.src = '../audio/alisha/Gmaj7.m4a';
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
            window.location.href = 'indieSongs.html';
        }//if-else

    };//initPlayer


    //Play Song
    function playSong(){

        if(playInterval) clearInterval(playInterval);

        const chordTime = ((60 / currentSong.bpm)*1000)/(4/currentSong.beatsPerBar);
        isPlaying = true;
        playButton.src = "../images/pause.png";

        playInterval = setInterval(() => {
            if (currentChordIndex >= processedChords.length){
                stopSong();
                return;
            }
            displayChord(processedChords[currentChordIndex]);
            currentChordIndex++;
        }, chordTime);

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