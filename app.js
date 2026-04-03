let habits = JSON.parse(localStorage.getItem("habits")) || [];
let editIndex = null;

const week = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

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
            <div>${h.days.join(", ")}</div>

            <div class="progress">
                <div class="bar" style="width:${percent}%"></div>
            </div>

            <button onclick="done(${i})">Сделано</button>
            <button onclick="openModal(${i})">Редактировать</button>
            <button onclick="deleteHabit(${i})">Удалить</button>
        `;

        container.appendChild(div);
    });
}

function done(i) {
    if (habits[i].done >= habits[i].goal) {
        alert("Хватит, ты уже всё сделала");
        return;
    }

    habits[i].done++;
    save();
    render();
}

function deleteHabit(i) {
    if (confirm("Удалить?")) {
        habits.splice(i, 1);
        save();
        render();
    }
}

/* МОДАЛКА */

function openModal(index = null) {
    document.getElementById("modal").style.display = "flex";
    editIndex = index;

    renderDays();

    if (index !== null) {
        let h = habits[index];
        nameInput.value = h.name;
        goalInput.value = h.goal;
    } else {
        nameInput.value = "";
        goalInput.value = "";
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function renderDays(selected = []) {
    const container = document.getElementById("days");
    container.innerHTML = "";

    week.forEach(day => {
        const el = document.createElement("div");
        el.className = "calendar-day";
        el.innerText = day;

        el.onclick = () => {
            el.classList.toggle("active-day");
        };

        container.appendChild(el);
    });
}

function getSelectedDays() {
    return [...document.querySelectorAll(".active-day")]
        .map(el => el.innerText);
}

function saveHabit() {
    let name = nameInput.value.trim();
    let goal = goalInput.value.trim();

    if (!/^\d+$/.test(goal)) {
        alert("Буквы с цифрами местами не путаем!");
        return;
    }

    goal = Number(goal);

    let days = getSelectedDays();

    if (editIndex !== null) {
        habits[editIndex] = {
            ...habits[editIndex],
            name,
            goal,
            days
        };
    } else {
        habits.push({
            name,
            goal,
            done: 0,
            days
        });
    }

    save();
    closeModal();
    render();
}

function showScreen(screen) {
    mainScreen.style.display = "none";
    statsScreen.style.display = "none";
    settingsScreen.style.display = "none";

    if (screen === "main") mainScreen.style.display = "block";
    if (screen === "stats") {
        statsScreen.style.display = "block";
        renderStats();
    }
    if (screen === "settings") {
        settingsScreen.style.display = "block";
        settingsScreen.innerHTML = `
            <button onclick="resetAll()">Сбросить всё</button>
        `;
    }
}

function renderStats() {
    let html = "<h3>Календарь</h3>";

    habits.forEach(h => {
        html += `<p>${h.name}: ${h.done}/${h.goal}</p>`;
    });

    statsScreen.innerHTML = html;
}

function resetAll() {
    if (confirm("ВСЁ удалить?")) {
        habits = [];
        save();
        render();
    }
}

render();
