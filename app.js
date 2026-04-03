let habits = JSON.parse(localStorage.getItem("habits")) || [];

function save() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function render() {
    const container = document.getElementById("mainScreen");
    container.innerHTML = "";

    habits.forEach((h, i) => {
        let percent = Math.min((h.done / h.goal) * 100, 100);

        const div = document.createElement("div");
        div.className = "habit";

        div.innerHTML = `
            <b>${h.name}</b>
            <div>${h.done}/${h.goal}</div>
            <div class="progress">
                <div class="bar" style="width:${percent}%"></div>
            </div>

            <button onclick="done(${i})">Сделано</button>
            <button onclick="editHabit(${i})">Редактировать</button>
            <button onclick="deleteHabit(${i})">Удалить</button>
        `;

        container.appendChild(div);
    });
}

function addHabit() {
    let name = prompt("Название привычки:");
    let goal = parseInt(prompt("Сколько раз нужно выполнить?"));

    if (!name || !goal) return;

    habits.push({ name, done: 0, goal });
    save();
    render();
}

function done(i) {
    if (habits[i].done >= habits[i].goal) {
        alert("Хватит, ты уже выполнила привычку 😄");
        return;
    }

    habits[i].done++;
    save();
    render();
}

function deleteHabit(i) {
    if (confirm("Удалить привычку?")) {
        habits.splice(i, 1);
        save();
        render();
    }
}

function editHabit(i) {
    let newName = prompt("Новое название:", habits[i].name);
    let newGoal = parseInt(prompt("Новое количество:", habits[i].goal));

    if (!newName || !newGoal) return;

    habits[i].name = newName;
    habits[i].goal = newGoal;

    if (habits[i].done > newGoal) {
        habits[i].done = newGoal;
    }

    save();
    render();
}

function showScreen(screen) {
    document.getElementById("mainScreen").style.display = "none";
    document.getElementById("statsScreen").style.display = "none";
    document.getElementById("settingsScreen").style.display = "none";

    if (screen === "main") {
        document.getElementById("title").innerText = "Мои привычки";
        document.getElementById("mainScreen").style.display = "block";
    }

    if (screen === "stats") {
        document.getElementById("title").innerText = "Статистика";
        document.getElementById("statsScreen").style.display = "block";
        renderStats();
    }

    if (screen === "settings") {
        document.getElementById("title").innerText = "Настройки";
        document.getElementById("settingsScreen").style.display = "block";
        renderSettings();
    }
}

function renderStats() {
    const container = document.getElementById("statsScreen");

    if (habits.length === 0) {
        container.innerHTML = "Нет данных";
        return;
    }

    let total = habits.reduce((sum, h) => sum + h.goal, 0);
    let done = habits.reduce((sum, h) => sum + h.done, 0);

    let percent = Math.round((done / total) * 100);

    container.innerHTML = `
        <h3>Общий прогресс</h3>
        <p>${done} из ${total}</p>
        <div class="progress">
            <div class="bar" style="width:${percent}%"></div>
        </div>
        <p>${percent}% выполнено</p>
    `;
}

function renderSettings() {
    const container = document.getElementById("settingsScreen");

    container.innerHTML = `
        <h3>Настройки</h3>
        <button onclick="resetAll()">Сбросить все привычки</button>
    `;
}

function resetAll() {
    if (confirm("Удалить ВСЕ привычки?")) {
        habits = [];
        save();
        render();
        showScreen('main');
    }
}

render();
