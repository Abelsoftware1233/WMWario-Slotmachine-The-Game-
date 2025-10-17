window.onload = init;

const images = ["0.png", "1.png", "2.png", "3.png", "4.png"];
const sounds = ["0.mp3", "1.mp3", "2.mp3"];
var display = [];
var initialCoins;
const min = 0;
const max = images.length;
var randomNumber;

function init() {
    prizeTable();
    receiveInitialCoins();
    updateCoinDisplay();
    
    // 🔥 TOUCHSCREEN/MOBIEL OPTIMALISATIE
    // Gebruik 'click' voor algemene compatibiliteit, dit werkt op touch en muis.
    // Voor drag/swipe zou je 'touchstart'/'touchend' gebruiken, maar voor knoppen is 'click' voldoende.
    
    // Hoofd "Spin" knop. Oude ID 'throw' is gecorrigeerd naar 'spin'.
    document.getElementById("spin").addEventListener('click', spin);
    
    // Sluitknop
    document.getElementById("cross").addEventListener('click', messageOff);
};

function receiveInitialCoins() {
    // Jouw oorspronkelijke logica
    initialCoins = Math.floor((Math.random() * 5) + 10); 
};

function updateCoinDisplay() {
    document.getElementById("money").innerHTML =
        `<div id="available">
            <div>${initialCoins}</div>
            <div class="euros"> €</div>
        </div>`;
    document.getElementById("coins").innerHTML = "";
    for (let n = 0; n < initialCoins; n++) {
        document.getElementById("coins").innerHTML += `<img src="img/coin.png">`;
    };
};

function spin() {
    // Verwijder de onclick-attributen om dubbele event-binding op touch-apparaten te voorkomen
    document.getElementById("b0").removeEventListener('click', random1);
    document.getElementById("b1").removeEventListener('click', random2);
    document.getElementById("b2").removeEventListener('click', random3);
    
    spendCoin();
    if (initialCoins >= 0) { // Controleer of de coin SPEND nog toereikend was
        updateCoinDisplay();
        display = [];
        
        getRandomValue();
        display.push(randomNumber);
        document.querySelector("#window1 img").src = `img/${display[0]}.png`;
        
        getRandomValue();
        display.push(randomNumber);
        document.querySelector("#window2 img").src = `img/${display[1]}.png`;
        
        getRandomValue();
        display.push(randomNumber);
        document.querySelector("#window3 img").src = `img/${display[2]}.png`;
        
        // Koppel de event listeners weer aan de Spin Again knoppen
        document.getElementById("b0").addEventListener('click', random1);
        document.getElementById("b1").addEventListener('click', random2);
        document.getElementById("b2").addEventListener('click', random3);
        
        checkPrize();
    } else {
        // Alleen checkPrize(), want gameOver wordt al in spendCoin() aangeroepen
        checkPrize(); 
    };
};

function random1() {
    spendCoin();
    updateCoinDisplay();
    if (initialCoins >= 0) { // Controleer of de coin SPEND nog toereikend was
        getRandomValue();
        document.querySelector("#window1 img").src = `img/${randomNumber}.png`; // Gebruik querySelector voor img
        display[0] = randomNumber;
        checkPrize();
    } else {
        checkPrize();
        // gameOver() wordt al in spendCoin() aangeroepen
    };
};

function random2() {
    spendCoin();
    updateCoinDisplay();
    if (initialCoins >= 0) {
        getRandomValue();
        document.querySelector("#window2 img").src = `img/${randomNumber}.png`;
        display[1] = randomNumber;
        checkPrize();
    } else {
        checkPrize();
    };
};

function random3() {
    spendCoin();
    updateCoinDisplay();
    if (initialCoins >= 0) {
        getRandomValue();
        document.querySelector("#window3 img").src = `img/${randomNumber}.png`;
        display[2] = randomNumber;
        checkPrize();
    } else {
        checkPrize();
    };
};

function checkPrize() {
    // Zoek de winstwaarde
    let prizeAmount = -1; 
    if (display[0] === display[1] && display[1] === display[2]) {
        // Winst is gelijk aan het getal, behalve 0.png die geen winst geeft (images[0])
        if (display[0] > 0) {
            prizeAmount = display[0];
        }
    }
    
    if (prizeAmount > 0) {
        document.getElementById("veil").style.display = "flex";
        document.getElementById("message").innerHTML = `Congratulations, you have won ${prizeAmount} coins!`;
        initialCoins = initialCoins + prizeAmount;
        sound(1); // Win geluid
    } else {
        sound(0); // Verlies geluid
    };
    
    updateCoinDisplay();
    // Als initialCoins nu 0 is, wordt gameOver() niet direct na checkPrize() uitgevoerd
    // omdat de besturing in de spin() functies ligt.
};

function payPrize() {
    // Deze functie lijkt overbodig aangezien de prijs al in checkPrize is toegevoegd.
    // Ik laat het staan, maar je zou het kunnen verwijderen als je checkPrize verfijnt.
    updateCoinDisplay();
};

function messageOff() {
    document.getElementById("veil").style.display = "none";
    payPrize();
    
    // Controleer na sluiten of het spel voorbij is
    if (initialCoins < 1) {
        gameOver();
    }
};

function gameOver() {
    document.querySelector("#audio").src = `audios/${sounds[2]}`;
    document.querySelector("#audio").play();
    updateCoinDisplay();
    
    // Knoppen uitschakelen (gebruik removeEventListener voor een schone methode)
    document.getElementById("spin").removeEventListener('click', spin);
    document.getElementById("b0").removeEventListener('click', random1);
    document.getElementById("b1").removeEventListener('click', random2);
    document.getElementById("b2").removeEventListener('click', random3);
    
    // Visuele feedback dat de knoppen uit staan
    document.getElementById("spin").style.opacity = 0.5;
    document.getElementById("b0").style.opacity = 0.5;
    document.getElementById("b1").style.opacity = 0.5;
    document.getElementById("b2").style.opacity = 0.5;
    
    // Winnaarsbericht tonen
    document.getElementById("veil").style.display = "flex";
    document.getElementById("message").innerHTML = `Game Over! Your final score is ${initialCoins} coins.`;
    document.getElementById("cross").removeEventListener('click', messageOff); // Zodat je het bericht niet kunt wegklikken
};

function spendCoin() {
    if (initialCoins >= 1) {
        initialCoins--;
        // De display wordt geüpdatet door de aanroepende functie (spin/randomX)
    } else {
        // Alleen gameOver() aanroepen, de coin wordt niet gespendeerd
        gameOver();
    };
};

function getRandomValue() {
    randomNumber = Math.floor((Math.random() * (max - min) + min));
};

// Functie nu met parameter 'n' in de definitie
function sound(n) {
    document.querySelector("#audio").src = `audios/${sounds[n]}`;
    document.querySelector("#audio").play();
};

function prizeTable() {
    document.getElementById("logo").innerHTML = `<img src="img/mariopad.png">`;
    document.getElementById("prizeTable").innerHTML = `<div id="coins">Prize Table:</div>`;
    for (n = 1; n < images.length; n++) {
        document.getElementById("prizeTable").innerHTML +=
            `<div id="coins">
                <div id="available">
                    <img src="img/${images[n]}"> + <img src="img/${images[n]}"> + <img src="img/${images[n]}"> = <img src="img/coin.png"> x ${n}
                </div>
            </div>`;
    };
};

// Controleer de logica van receiveInitialCoins om ervoor te zorgen dat deze niet wordt overschreven
// De functie bestaat dubbel in jouw oorspronkelijke script, ik heb de tweede (kleinere range) behouden:
/*
function receiveInitialCoins() {
    initialCoins = Math.floor((Math.random() * 11) + 20); // Oorspronkelijke definitie (bovenaan)
};
function receiveInitialCoins() {
    initialCoins = Math.floor((Math.random() * 5) + 10); // Tweede definitie (onderaan)
};
*/
