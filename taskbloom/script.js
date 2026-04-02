// ===============================
// TaskBloom To-Do App JavaScript
// ===============================

// Select important DOM elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskStatus = document.getElementById("task-status");
const errorMessage = document.getElementById("error-message");

// Track total number of tasks currently displayed
let taskCount = 0;

/**
 * Update the text showing how many tasks exist
 */
function updateTaskStatus() {
    if (taskCount === 0) {
        taskStatus.textContent = "You have 0 tasks.";
    } else if (taskCount === 1) {
        taskStatus.textContent = "You have 1 task.";
    } else {
        taskStatus.textContent = `You have ${taskCount} tasks.`;
    }
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
    } else {
        taskItem.classList.remove("completed");
        moveActiveTaskUp(taskItem);
    }
}

/**
 * Delete a task item from the list
 * @param {HTMLElement} taskItem
 */
function deleteTask(taskItem) {
    taskItem.remove();
    taskCount--;
    updateTaskStatus();
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
    li.className = "todo-item";

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