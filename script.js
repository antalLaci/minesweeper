var matrix = [];
var size = 15;
var mines = 30;
var revealedCells = 0;
var cellFontSize = (540 / size) * 0.5;
var firstClick = true;
var difficultyChange = false;
var flagsLeft = mines;
var startTime;
var finishTime;
var infiniteTime = false;
var clickSound = new Audio('audio/tileClick.mp3');
var difficultySound = new Audio('audio/difficultySelect.mp3');
var winSound = new Audio('audio/winSound.mp3');
var flagSound = new Audio('audio/flagDown.mp3');
var loseSound = new Audio('audio/loseSound.mp3');
var restartSound = new Audio('audio/restartSound.mp3');
var timeSound = new Audio('audio/timeChange.mp3');
var muted = false;

function createMatrix(){
    for(let i = 0; i < size; i++){
        let temp = [];
        for(let j = 0; j < size; j++){
            temp.push(0);
        }
        matrix.push(temp);
    }
}

function placeMines(){
    let i = 0;
    do{
        var x = Math.floor(Math.random() * size);
        var y = Math.floor(Math.random() * size);
        if(matrix[x][y] != -1){
            matrix[x][y] = -1;
            i++;  
        }
         

    } while(i < mines && matrix[x][y] == -1);
}

function setValues(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(matrix[i][j] != -1){
                if(i > 0 && j > 0){
                    if(matrix[i-1][j-1] < 0){
                        matrix[i][j]++;
                    }
                }
                if(i > 0){
                    if(matrix[i-1][j] < 0){
                        matrix[i][j]++;
                    }
                } 
                if(i > 0 && j < size-1){
                    if(matrix[i-1][j+1] < 0){
                        matrix[i][j]++;
                    }
                } 
                if(j > 0){
                    if(matrix[i][j-1] < 0){
                        matrix[i][j]++;
                    }
                }    
                if(j < size-1){
                    if(matrix[i][j+1] < 0){
                        matrix[i][j]++;
                    }
                }                     
                if(i < size-1 && j > 0){
                    if(matrix[i+1][j-1] < 0){
                        matrix[i][j]++;
                    }
                }                         
                if(i < size-1){
                    if(matrix[i+1][j] < 0){
                        matrix[i][j]++;
                    }
                }      
                if(i < size-1 && j < size-1){
                    if(matrix[i+1][j+1] < 0){
                        matrix[i][j]++;
                    }
                }
            }
                                           
        }
    }
}

function reveal(x, y){
    let elementId = x.toString()+"x"+y.toString();
    const element = document.getElementById(elementId);
    var value = matrix[x][y];
    clickSound.play();
    if(element.className == "hidden" && value != -1) {
        element.setAttribute("class","revealed");
        element.removeAttribute("oncontextmenu");
        element.innerText = value;
        
        revealedCells++;
        if(value == 0 ){
            if(x > 0 && y > 0){
                reveal(x-1,y-1);
            }
            if(x > 0){
                reveal(x-1,y);
            }                        
            if(x > 0 && y < size-1){
                reveal(x-1,y+1);
            }
            if(y > 0){
                reveal(x,y-1);
            }   
            if(y < size-1){
                reveal(x,y+1);
            }    
            if(y > 0 && x < size-1){
                reveal(x+1,y-1);
            }    
            if(x < size-1){
                reveal(x+1,y);
            }    
            if(x < size-1 && y < size-1){
                reveal(x+1,y+1);
            }
             
        }
        else{
            element.style.color =  "white"; 
        }
    }
    if(revealedCells == size*size-mines){
        win();
    }
    if(firstClick){
        firstClick = false;
        Time();
        if(secs != 0){
            startTime = secs;
        }
        else{
            infiniteTime = true;
        }
    }

}

function disableClick(){
    var unClicked = document.getElementsByClassName("hidden");
    for(let i = 0; i < unClicked.length; i++){
        unClicked[i].removeAttribute("onclick");
    }
}

function win(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(matrix[i][j] == -1){
                let elementId = i.toString()+"x"+j.toString();
                const element = document.getElementById(elementId);
                element.setAttribute("class", "won");;
                element.innerHTML = "🎉";
                console.log("win");
            }
        }
    }
    finishTime = secs;
    if(infiniteTime){
        document.getElementById("idoText").innerText = document.getElementById("time").innerText;
    }
    else{
        let roundTime = startTime-finishTime;
        document.getElementById("idoText").innerText = "";
        if (roundTime / 60 < 10)
            document.getElementById("idoText").innerText = "0";
        document.getElementById("idoText").innerText += Math.floor(roundTime / 60) + ":";
        if (roundTime % 60 < 10)
            document.getElementById("idoText").innerText += "0";
        document.getElementById("idoText").innerText += roundTime % 60;
    }
    winSound.play();
    document.getElementById("gyozelemText").innerText = "Győzelem";
    document.getElementById("gyozelemText").style.color = "lightgreen";
    document.getElementById("nevText").style.display = "inline";
    document.getElementById("nameinput").style.display = "block";
    document.getElementById("idoText").style.display = "block";
    difficultyChange = false;
    finishTime = secs;
    loseOrWin = 2;
    disableClick();
    Downward();
    Stop();
}

function revealMines(x,y){
    let clickedElementId = x.toString()+"x"+y.toString();
    if(document.getElementById(clickedElementId).className != "flaged"){
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(matrix[i][j] == -1){
                    let elementId = i.toString()+"x"+j.toString();
                    const element = document.getElementById(elementId);
                    element.style.color = "white";
                    element.innerHTML = "💥";
                //    element.setAttribute("style", "background-color: orange;");
                    element.removeAttribute("oncontextmenu");
                    console.log("rip");
                    element.setAttribute("class","revealed");
                }
            }
        }
        loseSound.play();
        document.getElementById("gyozelemText").innerText = "Vereség";
        document.getElementById("gyozelemText").style.color = "LightCoral";
        document.getElementById("nevText").style.display = "none";
        document.getElementById("nameinput").style.display = "none";
        document.getElementById("idoText").style.display = "none";
        difficultyChange = false;
        loseOrWin = 1;
        disableClick();
        Downward();
        Stop();
    }
    
}

function flag(x,y){             
    const element = document.getElementById(x.toString()+"x"+y.toString());
    flagSound.play();
    if(element.className == "flaged"){
        element.innerText = "";
        element.setAttribute("class","hidden");
        flagsLeft++;
    }
    else{
        element.style.color = "white";
        element.innerText = "🚩";
        element.setAttribute("class","flaged");
        flagsLeft--;
    }
    document.getElementById("flagsLeftText").innerText = flagsLeft + "🚩 maradt"; 
}


function createTable(tableData) {
    var table = document.createElement('table');
    table.setAttribute("id","gameTable")
    var tableBody = document.createElement('tbody');
    var rowNumber = 0;
    tableData.forEach(function(rowData) {
        var cellNumber = 0;
        var row = document.createElement('tr');
        rowData.forEach(function(cellData) {                        
            var cell = document.createElement('td');
            cell.setAttribute("id",rowNumber.toString()+"x"+cellNumber.toString());
            
            cell.style.lineHeight = `${540 / size}px`;
            cell.style.minWidth = `${540 / size}px`;
            cell.setAttribute("class","hidden");
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
            if(cellData == -1){
                cell.setAttribute("onclick",`revealMines(${rowNumber}, ${cellNumber})`); 
            }
            else{
               cell.setAttribute("onclick",`reveal(${rowNumber}, ${cellNumber})`); 
            }  
            cell.setAttribute("oncontextmenu",`flag(${rowNumber}, ${cellNumber})`);
            cell.addEventListener('contextmenu', event => event.preventDefault());
           
            cellNumber++;
        });
        tableBody.appendChild(row);
        rowNumber++;
    });

    table.appendChild(tableBody);
    document.getElementById("game").appendChild(table);
}


function restart(){
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[0].length; j++){
            matrix[i][j] = 0;
            let elementId = i.toString()+"x"+j.toString();
            const element = document.getElementById(elementId);
            element.setAttribute("class","hidden");
            element.style.backgroundColor = "black";
            element.innerText = 0;
        }
    }
    time.innerText = "10:00";
    Stop();
    firstClick = true;   
    document.getElementById("gameTable").remove();
    revealedCells = 0;
    matrix = [];
    createMatrix();
    placeMines();
    setValues();
    createTable(matrix);
    if (loseOrWin == 1)
    {
        secs = 600;
        Upward();
        loseOrWin = 0;
    }
    flagsLeft = mines;
    document.getElementById("flagsLeftText").innerText = flagsLeft + "🚩 maradt";
}

createMatrix();
placeMines();
setValues();
createTable(matrix);

console.log(matrix);

//Gombok desingolása
document.getElementById("normal").addEventListener("click", function(){
    difficultyChange = true;
    difficultySound.play();
    this.style.backgroundImage = "url(images/normalActive.png)";
    document.getElementById("easy").style.backgroundImage = "url(images/easy.png)";
    document.getElementById("hard").style.backgroundImage = "url(images/hard.png)";
    size = 15;
    mines = 30;
    document.querySelector(':root').style.setProperty("--numberSize", "25px");
    document.querySelector(':root').style.setProperty("--emojiSize", "20px");
    restart();
    difficulty = 1;
    Scoreboard(recordsnormal);   
});

document.getElementById("easy").addEventListener("click", function(){
    difficultyChange = true;
    difficultySound.play();
    this.style.backgroundImage = "url(images/easyActive.png)";
    document.getElementById("normal").style.backgroundImage = "url(images/normal.png)";
    document.getElementById("hard").style.backgroundImage = "url(images/hard.png)";
    size = 10;
    document.querySelector(':root').style.setProperty("--numberSize", "35px");
    document.querySelector(':root').style.setProperty("--emojiSize", "30px");
    mines = 15;
    restart();
    difficulty = 0;
    Scoreboard(recordseasy);
});

document.getElementById("hard").addEventListener("click", function(){
    difficultyChange = true;
    difficultySound.play();
    this.style.backgroundImage = "url(images/hardActive.png)";
    document.getElementById("easy").style.backgroundImage = "url(images/easy.png)";
    document.getElementById("normal").style.backgroundImage = "url(images/normal.png)";
    size = 20;
    mines = 45;
    document.querySelector(':root').style.setProperty("--numberSize", "18px");
    document.querySelector(':root').style.setProperty("--emojiSize", "13px");
    restart();
    difficulty = 2;
    Scoreboard(recordshard);
});

function mute(){
    if(!muted){
        document.getElementById("soundButton").setAttribute("src","images/soundOff.png");
        clickSound.volume = 0.0;
        difficultySound.volume = 0.0;
        winSound.volume = 0.0;
        flagSound.volume = 0.0;
        loseSound.volume = 0.0;
        restartSound.volume = 0.0;
        timeSound.volume = 0.0;
    }
    else{
        document.getElementById("soundButton").setAttribute("src","images/soundOn.png");
        clickSound.volume = 1.0;
        difficultySound.volume = 1.0;
        winSound.volume = 1.0;
        flagSound.volume = 1.0;
        loseSound.volume = 1.0;
        restartSound.volume = 1.0;
        timeSound.volume = 1.0;
    }
    muted = !muted;
}


//Matyi kódja: idő, scoreboard, gameover tábla
let secs = 600;
let infinitetemp;
let counting;
let record;
let starttime;
var difficulty = 1;
var loseOrWin = 0;
const time = document.getElementById("time");
const scores = document.getElementById("scores");
const gameover = document.getElementById("gameover");


// !! meg kell akadályozni hogy használhatóak legyenek miközbe megy
//időgombok és végtelen
function Plus(){
    timeSound.play();
    if(firstClick){
       secs += 10;
        WriteTime(); 
    }
    
}
function Infinite() {
    timeSound.play();
    if (firstClick) {
        if (secs != 0) {
            infinitetemp = secs;
            secs = 0;
        }
        else
            secs = infinitetemp;
        WriteTime();
    }
}

function Minus(){
    timeSound.play();
    if (secs-10 >= 0 && firstClick)
        secs -= 10;
    WriteTime();
}

//idő kiírása
function WriteTime(){
    time.innerText = "";
    if (secs / 60 < 10)
        time.innerText = "0";
    time.innerText += Math.floor(secs / 60) + ":";
    if (secs % 60 < 10)
        time.innerText += "0";
    time.innerText += secs % 60;
}

//!! kell trigger
//időzítő 0 - végtelen, több mint 0 - számol le
function Time(){
    starttime = secs;
    if (secs == 0) {
        counting = setInterval(StopWatch, 1000);
    }
    else {
        counting = setInterval(Timer, 1000);
    }
}

//0-tól számol fel
function StopWatch(){
    ++secs;
    WriteTime();
}

//számol le
function Timer(){
    --secs;
    WriteTime();           
    if (secs == 0){
        clearInterval(counting); 
        revealMines();   
    } 
}

//!! kell trigger
//megállítja az időt
function Stop(){
    clearInterval(counting);
}

//lekéri az időt, és megállítja az időt
function GetMe(){
    Stop();
    if (secs < starttime)
        record = starttime - secs;
    else
        record = secs;
    return record;
}

//alap rekordot tároló 2d tömbök
//a neveket átírhatjátok és az időt
let recordseasy = [
    ['Bob', 300],
    ['Joe', 360],
    ['Lily', 420],
    ['Jack', 480],
    ['James', 540]
];
let recordsnormal = [
    ['Jessie', 300],
    ['Lily', 360],
    ['Joe', 420],
    ['Amanda', 480],
    ['Bob', 540]
];
let recordshard = [
    ['Lily', 300],
    ['Sam', 360],
    ['Amanda', 420],
    ['Jessie', 480],
    ['Bob', 540]
];
        
//rekord hozzáadás
function Hozzaad(name, recordtime){
    if (difficulty == 0)
    {
        recordseasy.push(new Array(name, recordtime));
        window.localStorage.setItem('recordseasy',window.localStorage.getItem('recordseasy') + "+" + name + "+" + recordtime);
    }
    if (difficulty == 1)
    {
        recordsnormal.push(new Array(name, recordtime));
        window.localStorage.setItem('recordsnormal',window.localStorage.getItem('recordsnormal') + "+" + name + "+" + recordtime);
    }
    if (difficulty == 2)
    {
        recordshard.push(new Array(name, recordtime));
        window.localStorage.setItem('recordshard',window.localStorage.getItem('recordshard') + "+" + name + "+" + recordtime);
    }
}

//scoreboard rendezése és kiírása 
function Scoreboard(records){
    let temp;
    let place = 0;
    let order = new Array(5);
    let scorespart = scores.querySelectorAll("#scores td");
            
    //sorrend megállapítása
    for (let j = 0; j < 5; j++)
    {
        temp = 600;
        duplicate = 0;
        for (let i = 0; i < records.length; i++)
        {
        //legelső a sorrendben
        if (j == 0 && records[i][1] < temp)
        {
            temp = records[i][1];
            place = i;
        }
        //ha már azonos értékű szerepel
        if (j != 0 && records[order[j-1]][1] == records[i][1])
        {
            for (let k = 0; k < j; k++)
            {
            if (order[k] == i)
            {
                duplicate = 1;
            }
            }
            if (duplicate != 1)
            {
            place = i;
            break;
            }
            duplicate = 0;
        }
        //átlagos
        if (j != 0 && records[order[j-1]][1] < records[i][1] && records[i][1] < temp)
        {
            temp = records[i][1];
            place = i;
        }
        }
        order[j] = place;
    }
            
    //táblázatba írása
    for (let i = 0; i < 5; i++)
    {
        scorespart[2 * i].innerText = records[order[i]][0];
        
        scorespart[2 * i + 1].innerText = "";
        if (records[order[i]][1] / 60 < 10)
        scorespart[2 * i + 1].innerText = "0";
        scorespart[2 * i + 1].innerText += Math.floor(records[order[i]][1] / 60) + ":";
        if (records[order[i]][1] % 60 < 10)
        scorespart[2 * i + 1].innerText += "0";
        scorespart[2 * i + 1].innerText += records[order[i]][1] % 60;
    }
}

document.getElementsByTagName("form")[0].addEventListener("submit", function(e){e.preventDefault();})

//név és idő bevétele, ellenőrzése, tömbbe rakása, idő visszaállítása
document.getElementById("restartButton").addEventListener("click", function(){
    let name = document.getElementById("nameinput").value;
    document.getElementById("nameinput").value = '';
    if (/^([a-zA-Z0-9]){3,12}$/.test(name)){
        let recordtime = GetMe();
        Hozzaad(name, recordtime);
        if (difficulty == 0)
            Scoreboard(recordseasy);
        if (difficulty == 1)
            Scoreboard(recordsnormal);
        if (difficulty == 2)
            Scoreboard(recordshard);
        secs = 600;
        WriteTime();
        Upward();
        loseOrWin = 0;
    }
    else if (loseOrWin == 2) {
        document.getElementById("nameinput").value = "Nem megfelelő";
    }
});


const dark = document.getElementById('container');
//!! kell trigger
//gameover megjelenítése!!
function Downward(){
    gameover.classList.add("animdown");
    document.getElementById("darkBackground").style.display = "inline";
    setTimeout(function() {
        gameover.style.top = "0px";
        gameover.classList.remove("animdown");
    }, 950);
}



//gameover eltüntetése
function Upward(){
    if(!difficultyChange){
        gameover.classList.add("animup");
        document.getElementById("darkBackground").style.display = "none";
        gameover.style.top = "-50vh";
        setTimeout(function() {
            gameover.classList.remove("animup");
        }, 1950);
        difficultyChange = false; 
    }
}

//lokál sto
//lusta vagyok ezt eltávolítnai, de hagyd itt, kell jelenleg
if (window.localStorage.getItem('recordseasy') == null){
    window.localStorage.setItem('recordseasy',"név1+300");
    window.localStorage.setItem('recordseasy',window.localStorage.getItem('recordseasy') + "+név2+360");
    window.localStorage.setItem('recordseasy',window.localStorage.getItem('recordseasy') + "+név3+420");
    window.localStorage.setItem('recordseasy',window.localStorage.getItem('recordseasy') + "+név4+480");
    window.localStorage.setItem('recordseasy',window.localStorage.getItem('recordseasy') + "+név5+540");
}
if (window.localStorage.getItem('recordsnormal') == null){
    window.localStorage.setItem('recordsnormal',"név1+300");
    window.localStorage.setItem('recordsnormal',window.localStorage.getItem('recordsnormal') + "+név2+360");
    window.localStorage.setItem('recordsnormal',window.localStorage.getItem('recordsnormal') + "+név3+420");
    window.localStorage.setItem('recordsnormal',window.localStorage.getItem('recordsnormal') + "+név4+480");
    window.localStorage.setItem('recordsnormal',window.localStorage.getItem('recordsnormal') + "+név5+540");
}
if (window.localStorage.getItem('recordshard') == null){
    window.localStorage.setItem('recordshard',"név1+300");
    window.localStorage.setItem('recordshard',window.localStorage.getItem('recordshard') + "+név2+360");
    window.localStorage.setItem('recordshard',window.localStorage.getItem('recordshard') + "+név3+420");
    window.localStorage.setItem('recordshard',window.localStorage.getItem('recordshard') + "+név4+480");
    window.localStorage.setItem('recordshard',window.localStorage.getItem('recordshard') + "+név5+540");
}

if (window.localStorage.getItem('recordseasy') != null){
    let temprecords = window.localStorage.getItem('recordseasy').split("+");
    for (let i = 10; i < temprecords.length*2; i += 2)
    {
        recordseasy.push(new Array(temprecords[i], parseInt(temprecords[i+1])));
        //console.log(temprecords[i+1]);
    }
    //window.localStorage.removeItem("recordseasy");
}
if (window.localStorage.getItem('recordsnormal') != null){
    let temprecords = window.localStorage.getItem('recordsnormal').split("+");
    for (let i = 10; i < temprecords.length*2; i += 2)
    {
        recordsnormal.push(new Array(temprecords[i], parseInt(temprecords[i+1])));
        //console.log(temprecords[i+1]);
    }
    //window.localStorage.removeItem("recordsnormal");
}
if (window.localStorage.getItem('recordshard') != null){
    let temprecords = window.localStorage.getItem('recordshard').split("+");
    for (let i = 10; i < temprecords.length*2; i += 2)
    {
        recordshard.push(new Array(temprecords[i], parseInt(temprecords[i+1])));
        //console.log(temprecords[i+1]);
    }
    //window.localStorage.removeItem("recordshard");
}

//normal scoreboard kiírás lap megnyitásakor
Scoreboard(recordsnormal);