let habits = JSON.parse(localStorage.getItem("habits")) || [];
let selectedDays = [];
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

            <div>
                ${h.days.map(d => week[d]).join(", ") || "Без расписания"}
            </div>

            <div class="progress">
                <div class="bar" style="width:${percent}%"></div>
            </div>

            <button onclick="done(${i})">✔</button>
            <button onclick="editHabit(${i})">✏️</button>
            <button onclick="deleteHabit(${i})">🗑</button>
        `;

        container.appendChild(div);
    });
}

function openModal(edit=false, index=null) {
    document.getElementById("modal").classList.add("active");

    const daysDiv = document.getElementById("days");
    daysDiv.innerHTML = "";

    selectedDays = [];

    week.forEach((d, i) => {
        const btn = document.createElement("button");
        btn.innerText = d;

        btn.onclick = () => {
            if (selectedDays.includes(i)) {
                selectedDays = selectedDays.filter(x => x !== i);
                btn.classList.remove("day-active");
            } else {
                selectedDays.push(i);
                btn.classList.add("day-active");
            }
        };

        daysDiv.appendChild(btn);
    });

    if (edit) {
        editIndex = index;
        let h = habits[index];

        nameInput.value = h.name;
        goalInput.value = h.goal;
        selectedDays = [...h.days];
    } else {
        editIndex = null;
        nameInput.value = "";
        goalInput.value = "";
    }
}

function closeModal() {
    document.getElementById("modal").classList.remove("active");
}

function saveHabit() {
    let name = nameInput.value;
    let goal = goalInput.value;

    if (!/^\d+$/.test(goal)) {
        alert("Буквы с цифрами местами не путаем!");
        return;
    }

    goal = Number(goal);

    if (editIndex !== null) {
        habits[editIndex] = {
            ...habits[editIndex],
            name,
            goal,
            days: selectedDays
        };
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
        alert("Хватит, ты уже сделала");
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
    openModal(true, i);
}

function addHabit() {
    openModal();
}

render();
