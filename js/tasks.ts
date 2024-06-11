interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const tasks: Task[] = [];

// Fetch tasks from dummy API
async function fetchTasks(): Promise<void> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data: Task[] = await response.json();
    tasks.push(...data.slice(0, 10)); // Fetch only first 10 tasks for simplicity
    renderTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Render tasks to the DOM
function renderTasks(): void {
  const tasksList = document.getElementById("tasks") as HTMLUListElement;
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
function addTask(event: Event): void {
  event.preventDefault();

  const title = (document.getElementById("title") as HTMLInputElement).value;
  const description = (
    document.getElementById("description") as HTMLTextAreaElement
  ).value;

  if (title && description) {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    tasks.push(newTask);
    renderTasks();
  } else {
    alert("Please fill in both title and description.");
  }
}

// Edit task
function editTask(id: number): void {
  const task = tasks.find((task) => task.id === id);

  if (task) {
    const newTitle = prompt("Edit task title:", task.title);
    const newDescription = prompt("Edit task description:", task.description);
    const newStatus = confirm("Mark task as completed?");

    if (newTitle !== null) task.title = newTitle;
    if (newDescription !== null) task.description = newDescription;
    task.completed = newStatus;

    renderTasks();
  } else {
    alert("Task not found.");
  }
}

// Delete task
function deleteTask(id: number): void {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    renderTasks();
  } else {
    alert("Task not found.");
  }
}

// Initialize event listeners
(document.getElementById("add-task-form") as HTMLFormElement).addEventListener(
  "submit",
  addTask
);

// Filter tasks
function filterTasks(): void {
  const search = (
    document.getElementById("search") as HTMLInputElement
  ).value.toLowerCase();
  const filter = (document.getElementById("filter") as HTMLSelectElement).value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    return matchesSearch && matchesFilter;
  });

  const tasksList = document.getElementById("tasks") as HTMLUListElement;
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
(document.getElementById("search") as HTMLInputElement).addEventListener(
  "input",
  filterTasks
);
(document.getElementById("filter") as HTMLSelectElement).addEventListener(
  "change",
  filterTasks
);

// Initial fetch
fetchTasks();
