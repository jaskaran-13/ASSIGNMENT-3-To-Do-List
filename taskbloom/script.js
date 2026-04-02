// Get important elements from the page
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskStatus = document.getElementById("task-status");

// Track number of tasks
let taskCount = 0;

/**
 * Updates the task status text based on task count
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
 * Moves completed tasks to the bottom of the list
 */
function moveCompletedToBottom(taskItem) {
    todoList.appendChild(taskItem);
}

/**
 * Adds checkbox and delete button events to a task item
 * @param {HTMLElement} taskItem
 */
function attachTaskEvents(taskItem) {
    const checkbox = taskItem.querySelector(".task-checkbox");

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            taskItem.classList.add("completed");
            moveCompletedToBottom(taskItem);
        } else {
            taskItem.classList.remove("completed");

            // Move unchecked task above completed tasks
            const allTasks = Array.from(todoList.children);
            const firstCompleted = allTasks.find(task =>
                task.classList.contains("completed")
            );

            if (firstCompleted) {
                todoList.insertBefore(taskItem, firstCompleted);
            } else {
                todoList.appendChild(taskItem);
            }
        }
    });
}

/**
 * Creates a new task item and adds it to the list
 */
function addTask() {
    const taskText = todoInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Create task item
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
        <label class="task-left">
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText}</span>
        </label>
        <button class="delete-btn">Delete</button>
    `;

    // Add task to list
    todoList.appendChild(li);

    // Add behavior to checkbox
    attachTaskEvents(li);

    // Clear input field
    todoInput.value = "";

    // Update task count
    taskCount++;
    updateTaskStatus();
}

// Add button click event
addBtn.addEventListener("click", addTask);

// Initialize task status on page load
updateTaskStatus();