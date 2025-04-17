
function updateClock() {
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    document.getElementById("clock").innerText = "Current Time: " + timeString;
}
setInterval(updateClock, 1000);
updateClock();

function addTask() {
    let input = document.getElementById("taskInput");
    let messageInput = document.getElementById("taskMessage");
    let timeInput = document.getElementById("taskTime");
    let taskList = document.getElementById("taskList");
    let completedTasks = document.getElementById("completedTasks");

    if (!input || !messageInput || !timeInput || !taskList || !completedTasks) {
        console.error("One or more elements are missing in the HTML.");
        return;
    }

    let taskText = input.value.trim();
    let taskMessage = messageInput.value.trim();
    let taskTime = timeInput.value;

    if (taskText === "") return;

    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="toggleComplete(this)">${taskText} (Due: ${taskTime})</span>
        <button onclick="showMessage(this)">📝 View Note</button>
        <button class="delete" onclick="deleteTask(this)">❌ Delete</button>
        <p class="task-note" style="display:none;">${taskMessage || "No additional notes."}</p>
    `;

    li.classList.add("fade-in");
    taskList.appendChild(li);

    input.value = "";
    messageInput.value = "";
    timeInput.value = "";

    saveTasks();
}

function toggleComplete(taskElement) {
    let li = taskElement.closest("li");
    if (!li) return;
    let completedTasks = document.getElementById("completedTasks");
    let taskList = document.getElementById("taskList");

    if (!completedTasks || !taskList) {
        console.error("Task list elements are missing.");
        return;
    }

    li.classList.toggle("completed");

    if (li.classList.contains("completed")) {
        completedTasks.appendChild(li);
    } else {
        taskList.appendChild(li);
    }

    saveTasks();
}

function showMessage(button) {
    let note = button.nextElementSibling.nextElementSibling;
    if (!note) return;
    note.style.display = (note.style.display === "none" || note.style.display === "") ? "block" : "none";
}

function deleteTask(button) {
    let taskItem = button.parentElement;
    if (!taskItem) return;
    taskItem.classList.add("fade-out");
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
    }, 300);
}

let themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
} else {
    console.error("Theme toggle button is missing.");
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li, #completedTasks li").forEach(li => {
        tasks.push({ html: li.innerHTML, completed: li.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    let completedTasks = document.getElementById("completedTasks");

    if (!taskList || !completedTasks) {
        console.error("Task list elements are missing.");
        return;
    }

    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.html || "";
        if (task.completed) {
            li.classList.add("completed");
            completedTasks.appendChild(li);
        } else {
            taskList.appendChild(li);
        }
    });
}

loadTasks();

document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const voiceInputBtn = document.getElementById("voiceInput");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        voiceInputBtn.addEventListener("click", () => {
            recognition.start();
            voiceInputBtn.innerText = "🎤 Listening...";
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            taskInput.value = transcript;
            voiceInputBtn.innerText = "🎤 Voice Input";
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            voiceInputBtn.innerText = "🎤 Voice Input";
        };

    } else {
        voiceInputBtn.disabled = true;
        voiceInputBtn.innerText = "Voice Input Not Supported";
        console.warn("Browser does not support Speech Recognition.");
    }
});
