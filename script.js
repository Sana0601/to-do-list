let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const count = document.getElementById("count");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");


// Show today's date

const today = new Date();

document.getElementById("date").innerText =
    today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });


// Add task

function addTask() {

    let text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    let task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


// Display tasks

function displayTasks() {

    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        let matchesSearch =
            task.text.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });


    filteredTasks.forEach(function(task) {

        let taskDiv = document.createElement("div");

        taskDiv.className = "task";

        taskDiv.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span class="task-text ${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <button
                class="delete"
                onclick="deleteTask(${task.id})">
                🗑
            </button>
        `;

        taskList.appendChild(taskDiv);
    });


    updateCount();

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// Complete task

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    displayTasks();
}


// Delete task

function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();

    displayTasks();
}


// Filter tasks

function setFilter(filter, button) {

    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
}


// Count active tasks

function updateCount() {

    let activeTasks = tasks.filter(function(task) {
        return !task.completed;
    });

    count.innerText = activeTasks.length;
}


// Save tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Press Enter to add

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Initial display

displayTasks();