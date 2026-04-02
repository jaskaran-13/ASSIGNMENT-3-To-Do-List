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

// Track total number of tasks currently displayed
let taskCount = 0;

/**
 * Count how many tasks are completed
 * @returns {number}
 */
function getCompletedTaskCount() {
    return document.querySelectorAll(".todo-item.completed").length;
}

/**
 * Update task summary values
 */
function updateTaskStatus() {
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
 * Move a completed task to the bottom of the task list
 * @param {HTMLElement} taskItem
 */
function moveCompletedToBottom(taskItem) {
    todoList.appendChild(taskItem);
}

/**
 * Move an active task above the first completed task
 * @param {HTMLElement} taskItem
 */
function moveActiveTaskUp(taskItem) {
    const allTasks = Array.from(todoList.children);

    const firstCompletedTask = allTasks.find(task =>
        task.classList.contains("completed")
    );

    if (firstCompletedTask) {
        todoList.insertBefore(taskItem, firstCompletedTask);
    } else {
        todoList.appendChild(taskItem);
    }
}

/**
 * Handle checkbox state changes for a task
 * @param {HTMLElement} taskItem
 * @param {HTMLInputElement} checkbox
 */
function handleCheckboxChange(taskItem, checkbox) {
    if (checkbox.checked) {
        taskItem.classList.add("completed");
        moveCompletedToBottom(taskItem);
        playCompletionSound();
    } else {
        taskItem.classList.remove("completed");
        moveActiveTaskUp(taskItem);
    }

    updateTaskStatus();
}

/**
 * Delete a task item from the list with animation
 * @param {HTMLElement} taskItem
 */
function deleteTask(taskItem) {
    taskItem.classList.add("removing");

    setTimeout(() => {
        taskItem.remove();
        taskCount--;
        updateTaskStatus();
    }, 300);
}

/**
 * Attach event listeners to an individual task item
 * @param {HTMLElement} taskItem
 */
function attachTaskEvents(taskItem) {
    const checkbox = taskItem.querySelector(".task-checkbox");
    const deleteBtn = taskItem.querySelector(".delete-btn");

    checkbox.addEventListener("change", function () {
        handleCheckboxChange(taskItem, checkbox);
    });

    deleteBtn.addEventListener("click", function () {
        deleteTask(taskItem);
    });
}

/**
 * Create a new task element
 * @param {string} taskText
 * @returns {HTMLElement}
 */
function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.className = "todo-item adding";

    li.innerHTML = `
        <label class="task-left">
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText}</span>
        </label>
        <button class="delete-btn">Delete</button>
    `;

    return li;
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

    const taskItem = createTaskElement(taskText);
    todoList.appendChild(taskItem);
    attachTaskEvents(taskItem);

    // Trigger entry animation
    requestAnimationFrame(() => {
        taskItem.classList.remove("adding");
    });

    todoInput.value = "";
    taskCount++;
    updateTaskStatus();
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

/* Set the correct status when the page first loads */
updateTaskStatus();