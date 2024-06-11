"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks = [];
// Fetch tasks from dummy API
async function fetchTasks() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        tasks.push(...data.slice(0, 10)); // Fetch only first 10 tasks for simplicity
        renderTasks();
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
    }
}
// Render tasks to the DOM
function renderTasks() {
    const tasksList = document.getElementById("tasks");
    tasksList.innerHTML = "";
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <span>${task.description}</span>
            <span>${task.completed ? "Completed" : "Pending"}</span>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        tasksList.appendChild(taskItem);
    });
}
// Add new task
function addTask(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    if (title && description) {
        const newTask = {
            id: Date.now(),
            title,
            description,
            completed: false,
        };
        tasks.push(newTask);
        renderTasks();
    }
    else {
        alert("Please fill in both title and description.");
    }
}
// Edit task
function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        const newTitle = prompt("Edit task title:", task.title);
        const newDescription = prompt("Edit task description:", task.description);
        const newStatus = confirm("Mark task as completed?");
        if (newTitle !== null)
            task.title = newTitle;
        if (newDescription !== null)
            task.description = newDescription;
        task.completed = newStatus;
        renderTasks();
    }
    else {
        alert("Task not found.");
    }
}
// Delete task
function deleteTask(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTasks();
    }
    else {
        alert("Task not found.");
    }
}
// Initialize event listeners
document.getElementById("add-task-form").addEventListener("submit", addTask);
// Filter tasks
function filterTasks() {
    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search);
        const matchesFilter = filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);
        return matchesSearch && matchesFilter;
    });
    const tasksList = document.getElementById("tasks");
    tasksList.innerHTML = "";
    filteredTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span>${task.title}</span>
            <span>${task.description}</span>
            <span>${task.completed ? "Completed" : "Pending"}</span>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        tasksList.appendChild(taskItem);
    });
}
// Event listeners for search and filter
document.getElementById("search").addEventListener("input", filterTasks);
document.getElementById("filter").addEventListener("change", filterTasks);
// Initial fetch
fetchTasks();
