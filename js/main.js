document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('task-form');
    const tasksList = document.getElementById('tasks-list');
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

    // Fetch and display tasks
    async function fetchTasks() {
        try {
            const response = await fetch(apiUrl);
            const tasks = await response.json();
            tasks.forEach(task => displayTask(task));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Display a single task
    function displayTask(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.dataset.id = task.id;
        if (task.completed) taskElement.classList.add('completed');

        taskElement.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
            </div>
            <div>
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        tasksList.appendChild(taskElement);
    }

    // Add new task with validation
    taskForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!title || !description) {
            alert("Both title and description are required.");
            return;
        }

        const newTask = {
            title: title,
            description: description,
            completed: false
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            const task = await response.json();
            displayTask(task);
            taskForm.reset();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Toggle task completion
    window.toggleTask = async function(taskId) {
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        const completed = !taskElement.classList.contains('completed');

        try {
            await fetch(`${apiUrl}/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: completed })
            });
            taskElement.classList.toggle('completed');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Delete task
    window.deleteTask = async function(taskId) {
        try {
            await fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' });
            const taskElement = document.querySelector(`[data-id="${taskId}"]`);
            taskElement.remove();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Search tasks
    document.getElementById('search').addEventListener('input', function(event) {
        const query = event.target.value.toLowerCase();
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            const title = task.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });
    });

    fetchTasks();
});
