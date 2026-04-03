let habits = JSON.parse(localStorage.getItem("habits")) || [];
let editIndex = null;
let selectedDays = [];

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

            <div class="calendar">
                ${week.map((d, idx)=>`
                    <div class="day ${h.days.includes(idx) ? 'active' : ''}">${d}</div>
                `).join("")}
            </div>

            <div class="progress">
                <div class="bar" style="width:${percent}%"></div>
            </div>

            <button onclick="done(${i})">Сделано</button>
            <button onclick="openEdit(${i})">Редактировать</button>
            <button onclick="deleteHabit(${i})">Удалить</button>
        `;

        container.appendChild(div);
    });
}

function openModal(edit=false, i=null) {
    document.getElementById("modal").style.display = "flex";

    const daysDiv = document.getElementById("days");
    daysDiv.innerHTML = "";

    selectedDays = [];

    week.forEach((d, idx) => {
        let btn = document.createElement("button");
        btn.innerText = d;

        btn.onclick = () => {
            if (selectedDays.includes(idx)) {
                selectedDays = selectedDays.filter(x => x !== idx);
                btn.style.background = "#EEAAC3";
            } else {
                selectedDays.push(idx);
                btn.style.background = "#83394A";
            }
        };

        daysDiv.appendChild(btn);
    });

    if (edit) {
        editIndex = i;
        let h = habits[i];
        document.getElementById("nameInput").value = h.name;
        document.getElementById("goalInput").value = h.goal;
        selectedDays = [...h.days];
    } else {
        editIndex = null;
        document.getElementById("nameInput").value = "";
        document.getElementById("goalInput").value = "";
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function saveHabit() {
    let name = document.getElementById("nameInput").value;
    let goal = document.getElementById("goalInput").value;

    if (!/^\d+$/.test(goal)) {
        alert("Буквы с цифрами местами не путаем!");
        return;
    }

    goal = Number(goal);

    if (editIndex !== null) {
        habits[editIndex].name = name;
        habits[editIndex].goal = goal;
        habits[editIndex].days = selectedDays;
    } else {
        habits.push({
            name,
            goal,
            done: 0,
            days: selectedDays
        });
    }

    save();
    closeModal();
    render();
}

function done(i) {
    if (habits[i].done >= habits[i].goal) {
        alert("Ты уже всё сделала");
        return;
    }

    habits[i].done++;
    save();
    render();
}

function deleteHabit(i) {
    if (confirm("Удалить?")) {
        habits.splice(i,1);
        save();
        render();
    }
}

function openEdit(i) {
    openModal(true, i);
}

function addHabit() {
    openModal();
}

render();
