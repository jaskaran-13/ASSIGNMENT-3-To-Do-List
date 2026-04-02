// ===============================
// TaskBloom To-Do App JavaScript
// ===============================

// Select important DOM elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskStatus = document.getElementById("task-status");
const pendingStatus = document.getElementById("pending-status");
const completedStatus = document.getElementById("completed-status");
const errorMessage = document.getElementById("error-message");
const completeSound = document.getElementById("complete-sound");

// Store tasks in memory
let tasks = [];

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem("taskbloom-tasks", JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    const storedTasks = localStorage.getItem("taskbloom-tasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        tasks = [];
    }
}

/**
 * Count how many tasks are completed
 * @returns {number}
 */
function getCompletedTaskCount() {
    return tasks.filter(task => task.completed).length;
}

/**
 * Update task summary values
 */
function updateTaskStatus() {
    const taskCount = tasks.length;
    const completedCount = getCompletedTaskCount();
    const pendingCount = taskCount - completedCount;

    taskStatus.textContent = `Total Tasks: ${taskCount}`;
    pendingStatus.textContent = `Pending: ${pendingCount}`;
    completedStatus.textContent = `Completed: ${completedCount}`;
}

/**
 * Show an inline validation message
 * @param {string} message
 */
function showError(message) {
    errorMessage.textContent = message;
}

/**
 * Clear validation message
 */
function clearError() {
    errorMessage.textContent = "";
}

/**
 * Play the completion sound
 */
function playCompletionSound() {
    completeSound.currentTime = 0;
    completeSound.play().catch(() => {
        // Ignore playback errors caused by browser autoplay restrictions
    });
}

/**
 * Create a task object
 * @param {string} text
 * @returns {{id: number, text: string, completed: boolean}}
 */
function createTaskObject(text) {
    return {
        id: Date.now(),
        text: text,
        completed: false
    };
}

/**
 * Create a new task element
 * @param {{id: number, text: string, completed: boolean}} task
 * @returns {HTMLElement}
 */
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "todo-item adding";
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    li.innerHTML = `
        <label class="task-left">
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.text}</span>
        </label>
        <button class="delete-btn">Delete</button>
    `;

    return li;
}

/**
 * Render all tasks to the page
 */
function renderTasks() {
    todoList.innerHTML = "";

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const orderedTasks = [...activeTasks, ...completedTasks];

    orderedTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        todoList.appendChild(taskItem);
        attachTaskEvents(taskItem);
    });

    requestAnimationFrame(() => {
        document.querySelectorAll(".todo-item.adding").forEach(item => {
            item.classList.remove("adding");
        });
    });

    updateTaskStatus();
}

/**
 * Toggle a task's completed state
 * @param {number} taskId
 * @param {boolean} isCompleted
 */
function toggleTaskCompletion(taskId, isCompleted) {
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: isCompleted } : task
    );

    if (isCompleted) {
        playCompletionSound();
    }

    saveTasks();
    renderTasks();
}

/**
 * Delete a task by id with animation
 * @param {HTMLElement} taskItem
 * @param {number} taskId
 */
function deleteTask(taskItem, taskId) {
    taskItem.classList.add("removing");

    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }, 300);
}

/**
 * Attach event listeners to an individual task item
 * @param {HTMLElement} taskItem
 */
function attachTaskEvents(taskItem) {
    const checkbox = taskItem.querySelector(".task-checkbox");
    const deleteBtn = taskItem.querySelector(".delete-btn");
    const taskId = Number(taskItem.dataset.id);

    checkbox.addEventListener("change", function () {
        toggleTaskCompletion(taskId, checkbox.checked);
    });

    deleteBtn.addEventListener("click", function () {
        deleteTask(taskItem, taskId);
    });
}

/**
 * Add a task to the list
 */
function addTask() {
    const taskText = todoInput.value.trim();

    if (taskText === "") {
        showError("Please enter a task before adding.");
        return;
    }

    clearError();

    const newTask = createTaskObject(taskText);
    tasks.push(newTask);

    saveTasks();
    renderTasks();

    todoInput.value = "";
    todoInput.focus();
}

/* Add task on button click */
addBtn.addEventListener("click", addTask);

/* Add task when Enter key is pressed */
todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

/* Clear error as user starts typing */
todoInput.addEventListener("input", clearError);

/* Initial page load */
loadTasks();
renderTasks();