const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskDate = document.getElementById('taskDate');
const tickSound = document.getElementById('tickSound');
const congratsMessage = document.getElementById('congratsMessage');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

taskDate.value = new Date().toISOString().split('T')[0];
loadTasks();

function getTasksForDate(date) {
  return JSON.parse(localStorage.getItem('tasks_' + date)) || [];
}

function saveTasksForDate(date, tasks) {
  localStorage.setItem('tasks_' + date, JSON.stringify(tasks));
}

function loadTasks() {
  taskList.innerHTML = '';
  congratsMessage.style.display = 'none';
  getTasksForDate(taskDate.value).forEach(task => {
    createTaskElement(task.text, task.completed);
  });
  checkAllTasksCompleted();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  const tasks = getTasksForDate(taskDate.value);
  tasks.push({ text, completed: false });
  saveTasksForDate(taskDate.value, tasks);
  createTaskElement(text, false);
  taskInput.value = '';
}

function createTaskElement(text, completed) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  if (completed) taskDiv.classList.add('completed');

  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox';
  if (completed) checkbox.classList.add('checked');

  checkbox.addEventListener('click', () => {
    checkbox.classList.toggle('checked');
    taskDiv.classList.toggle('completed');
    if (navigator.vibrate) navigator.vibrate([50]);
    tickSound.currentTime = 0;
    tickSound.play();

    const tasks = getTasksForDate(taskDate.value);
    const index = Array.from(taskList.children).indexOf(taskDiv);
    tasks[index].completed = checkbox.classList.contains('checked');
    saveTasksForDate(taskDate.value, tasks);

    checkAllTasksCompleted();
  });

  const textNode = document.createElement('span');
  textNode.textContent = text;

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(textNode);
  taskList.appendChild(taskDiv);
}

function checkAllTasksCompleted() {
  const tasks = getTasksForDate(taskDate.value);
  if (tasks.length > 0 && tasks.every(t => t.completed)) {
    congratsMessage.style.display = 'block';
  } else {
    congratsMessage.style.display = 'none';
  }
}
