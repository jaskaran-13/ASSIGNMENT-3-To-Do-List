// Get important elements from the page
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskStatus = document.getElementById("task-status");

// Track number of tasks
let taskCount = 0;

/**
 * Updates the task status text
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
 * Creates a new task item and adds it to the list
 */
function addTask() {
    const taskText = todoInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Create task list item
    const li = document.createElement("li");
    li.className = "todo-item";

    // Add basic internal structure
    li.innerHTML = `
        <label class="task-left">
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText}</span>
        </label>
        <button class="delete-btn">Delete</button>
    `;

    // Add task to list
    todoList.appendChild(li);

    // Clear input
    todoInput.value = "";

    // Increase task count
    taskCount++;
    updateTaskStatus();
}

// Event listener for add button
addBtn.addEventListener("click", addTask);

// Run on first page load
updateTaskStatus();