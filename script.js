const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const eggType = document.getElementById('egg-type');
const display = document.getElementById('time-display');
const progressBar = document.querySelector('.progress');
const eggImage = document.getElementById('egg-image');
const doneMessage = document.getElementById('done-message');
const cookAgain = document.getElementById('cook-again');
const recipeContainer = document.getElementById('recipe-container');
const boilSound = document.getElementById('boil-sound');
const notifyToggle = document.getElementById('notify-toggle');
const darkToggle = document.getElementById('dark-toggle');

let timer, timeLeft, totalTime, endTime;

const recipes = {
    240: ["🍞 Soft-boiled egg toast cups", "🥗 Japanese ramen topping", "🍙 Soft egg on rice (Tamago Gohan)"],
    360: ["🥪 Egg sandwich with creamy yolk", "🥢 Korean soft egg rice bowl", "🍜 Miso ramen with 6-min egg"],
    480: ["🍔 Egg burger deluxe", "🍝 Pasta carbonara topping", "🥗 Caesar salad with perfect medium egg"],
    600: ["🍛 Curry rice with medium-hard egg", "🍜 Spicy noodle bowl", "🥘 Indonesian sambal telur setengah keras"],
    720: ["🥗 Hard-boiled egg salad", "🍞 Deviled eggs", "🥪 Egg mayo sandwich classic"]
};

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
eggType.addEventListener('change', updateEggImage);
darkToggle.addEventListener('change', () => document.body.classList.toggle('dark'));

function startTimer() {
    totalTime = parseInt(eggType.value);
    timeLeft = totalTime;
    endTime = Date.now() + totalTime * 1000;

    startBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    doneMessage.classList.add('hidden');
    boilSound.play();

    showRecipes();

    timer = setInterval(() => {
        const now = Date.now();
        timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        updateDisplay();

        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = progress + "%";

        if (timeLeft <= 0) {
            clearInterval(timer);
            boilSound.pause();
            display.textContent = "00:00";
            progressBar.style.width = "100%";
            showDoneMessage();
            playSound();
            if (notifyToggle.checked) showNotification();
        }
    }, 500);
}

function resetTimer() {
    clearInterval(timer);
    display.textContent = "00:00";
    progressBar.style.width = "0%";
    startBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    doneMessage.classList.add('hidden');
    boilSound.pause();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateEggImage() {
    const selected = eggType.options[eggType.selectedIndex];
    eggImage.src = selected.dataset.img;
}

function showDoneMessage() {
    doneMessage.classList.remove('hidden');
}

function playSound() {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg');
    audio.play();
}

function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("🥚 Your egg is ready!", { body: "Time to enjoy your delicious meal 🍳" });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

function showRecipes() {
    const value = eggType.value;
    const list = recipes[value] || [];
    recipeContainer.innerHTML = list.map(r => `<div class="recipe-card">${r}</div>`).join('');
}
