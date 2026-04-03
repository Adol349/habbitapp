let habits = JSON.parse(localStorage.getItem("habits")) || [];

function save() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function render() {
    const container = document.getElementById("habits");
    container.innerHTML = "";

    habits.forEach((h, i) => {
        const div = document.createElement("div");
        div.className = "habit";

        let percent = (h.done / h.goal) * 100;

        div.innerHTML = `
            <b>${h.name}</b>
            <div>${h.done}/${h.goal}</div>
            <div class="progress">
                <div class="bar" style="width:${percent}%"></div>
            </div>
            <button onclick="done(${i})">Сделано</button>
        `;

        container.appendChild(div);
    });
}

function addHabit() {
    let name = prompt("Название привычки:");
    let goal = prompt("Сколько раз?");

    if (!name || !goal) return;

    habits.push({ name, done: 0, goal: Number(goal) });
    save();
    render();
}

function done(i) {
    habits[i].done++;
    save();
    render();
}

function showScreen(screen) {
    alert("Экран: " + screen);
}

render();