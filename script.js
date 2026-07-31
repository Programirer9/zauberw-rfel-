let startTime;
let timerInterval;
let isTiming = false;
let readyToStart = false;

// Tasten-Status speichern
let keys = { s: false, l: false };

// Zeiten aus dem Speicher laden
let records = JSON.parse(localStorage.getItem('cubeRecords')) || [];

// HTML Elemente
const timerDisplay = document.getElementById('timer');
const pbDisplay = document.getElementById('personal-best');
const historyList = document.getElementById('history-list');

// Initiales Laden der Rekorde
updateRecordsUI();

// Millisekunden in ein schönes Format umwandeln (Sekunden.Millisekunden)
function formatTime(ms) {
    return (ms / 1000).toFixed(3);
}

// Timer starten
function startTimer() {
    isTiming = true;
    readyToStart = false;
    timerDisplay.classList.remove('ready');
    
    startTime = Date.now();
    
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerDisplay.innerText = formatTime(elapsedTime);
    }, 10); // Update alle 10ms für flüssige Anzeige
}

// Timer stoppen
function stopTimer() {
    isTiming = false;
    clearInterval(timerInterval);
    
    const finalTime = Date.now() - startTime;
    timerDisplay.innerText = formatTime(finalTime);
    
    saveRecord(finalTime);
}

// Zeit speichern und UI updaten
function saveRecord(time) {
    records.push(time);
    localStorage.setItem('cubeRecords', JSON.stringify(records));
    updateRecordsUI();
}

// UI für Rekorde und Historie aktualisieren
function updateRecordsUI() {
    if (records.length === 0) return;

    // Persönlichen Rekord berechnen (kleinste Zeit)
    const personalBest = Math.min(...records);
    pbDisplay.innerText = formatTime(personalBest);

    // Letzte 5 Zeiten anzeigen
    historyList.innerHTML = '';
    const recentRecords = [...records].reverse().slice(0, 5);
    recentRecords.forEach(time => {
        const li = document.createElement('li');
        li.innerText = formatTime(time);
        historyList.appendChild(li);
    });
}

// Event Listener für gedrückte Tasten
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') keys.s = true;
    if (e.key.toLowerCase() === 'l') keys.l = true;

    // Wenn Leertaste gedrückt wird und der Timer läuft -> Stoppen
    if (e.code === 'Space') {
        e.preventDefault(); // Verhindert, dass die Seite nach unten scrollt
        if (isTiming) {
            stopTimer();
        }
    }

    // Wenn S und L gedrückt sind, wir aber noch nicht timen -> Bereitmachen
    if (keys.s && keys.l && !isTiming) {
        readyToStart = true;
        timerDisplay.innerText = "0.000";
        timerDisplay.classList.add('ready'); // Macht den Text Neon-Grün
    }
});

// Event Listener für losgelassene Tasten
window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 's') keys.s = false;
    if (e.key.toLowerCase() === 'l') keys.l = false;

    // Wenn wir bereit waren und eine der Tasten (S oder L) losgelassen wird -> Start!
    if (readyToStart && (!keys.s || !keys.l)) {
        startTimer();
    }
});
