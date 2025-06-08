// script.js for FocusBooster
console.log("FocusBooster script loaded!");

// Basic DOM elements (will be expanded later)
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const statusMessage = document.getElementById('status-message');

// Initial timer values (example)
let workMinutes = 25;
let breakMinutes = 5;
let isWorkTime = true;
let isPaused = true;
let timerInterval;

let currentTimeInSeconds;
let timerId = null;
let isWorkSession = true; // true for work, false for break
let isTimerRunning = false;

function updateDisplay() {
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isTimerRunning && !isPaused) return; // Already running and not paused

    isPaused = false;
    isTimerRunning = true;
    statusMessage.textContent = isWorkSession ? "作業中..." : "休憩中...";
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;
    workDurationInput.disabled = true;
    breakDurationInput.disabled = true;

    if (timerId) {
        clearInterval(timerId); // Clear any existing interval if resuming
    }

    // If currentTimeInSeconds is not set (e.g., after reset or initial load), set it.
    if (currentTimeInSeconds === undefined || currentTimeInSeconds === 0 && !isPaused) {
        currentTimeInSeconds = (isWorkSession ? parseInt(workDurationInput.value) : parseInt(breakDurationInput.value)) * 60;
    }

    updateDisplay(); // Update display immediately

    timerId = setInterval(() => {
        if (isPaused) return;

        currentTimeInSeconds--;
        updateDisplay();

        if (currentTimeInSeconds <= 0) {
            clearInterval(timerId);
            isWorkSession = !isWorkSession; // Toggle session
            currentTimeInSeconds = (isWorkSession ? parseInt(workDurationInput.value) : parseInt(breakDurationInput.value)) * 60;
            statusMessage.textContent = isWorkSession ? "作業時間です！" : "休憩時間です！";
            // Optionally, play a sound here
            alert(isWorkSession ? "休憩終了！作業を開始します。" : "作業終了！休憩に入ります。");
            isTimerRunning = false; // Reset before starting next session
            startTimer(); // Automatically start the next session
        }
    }, 1000);
}

function pauseTimer() {
    if (!isTimerRunning || isPaused) return;

    isPaused = true;
    clearInterval(timerId);
    statusMessage.textContent = "一時停止中";
    startButton.disabled = false;
    startButton.textContent = "再開";
    pauseButton.disabled = true;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isTimerRunning = false;
    isPaused = true;
    isWorkSession = true; // Default to work session
    currentTimeInSeconds = parseInt(workDurationInput.value) * 60;
    updateDisplay();
    statusMessage.textContent = "作業を開始しましょう！";
    startButton.disabled = false;
    startButton.textContent = "スタート";
    pauseButton.disabled = true;
    pauseButton.textContent = "一時停止";
    resetButton.disabled = true;
    workDurationInput.disabled = false;
    breakDurationInput.disabled = false;
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize display & button states
function initializeTimer() {
    currentTimeInSeconds = parseInt(workDurationInput.value) * 60;
    updateDisplay();
    pauseButton.disabled = true;
    resetButton.disabled = true;
    statusMessage.textContent = "作業を開始しましょう！";
}

workDurationInput.addEventListener('change', () => {
    if (!isTimerRunning) {
        isWorkSession = true; // Assume reset to work session if duration changes
        currentTimeInSeconds = parseInt(workDurationInput.value) * 60;
        updateDisplay();
    }
});

breakDurationInput.addEventListener('change', () => {
    if (!isTimerRunning && !isWorkSession) { // Only update if currently in break setup phase (not common)
        currentTimeInSeconds = parseInt(breakDurationInput.value) * 60;
        updateDisplay();
    }
});

// Initial setup when the script loads
initializeTimer();
