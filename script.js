const emptyMessages = [
  "Nothing here… yet. Let's tick something off?",
  "All clear. Enjoy the calm.",
  "Nothing to do. Maybe that's the point.",
  "Your list is spotless.",
  "A perfect moment for tea.",
  "Empty list, empty mind.",
  "You did it all? Or haven't started yet?"
];

const addForm = document.querySelector('.add-task');
const addInput = document.querySelector('.add-input');
const tasks = document.querySelector('.tasks');
const emptyMsg = document.querySelector('.empty');
const pickBtn = document.querySelector('.pick-btn');

pickBtn.addEventListener('click', pickRandomTask);

function updateEmptyMessage() {
  if (tasks.children.length > 0) {
    emptyMsg.classList.remove('show');
    emptyMsg.textContent = '';
  } else {
    emptyMsg.textContent = emptyMessages[Math.floor(Math.random() * emptyMessages.length)];
    emptyMsg.classList.add('show');
  }
}

function createTask(text) {
  const li = document.createElement('li');
  li.className = 'task';
  li.innerHTML = `
    <input type="checkbox">
    <span title="Double click to edit">${text}</span>
    <button class="delete-btn">&times;</button>
  `;

  // delete button
  const delBtn = li.querySelector('.delete-btn');
  delBtn.addEventListener('click', () => {
    li.classList.add('fade-out');
    setTimeout(() => {
      li.remove();
      updateEmptyMessage();
      saveTasks();
    }, 250);
  });

  tasks.appendChild(li);
  updateEmptyMessage();
  saveTasks();
}

function saveTasks() {
  const taskArray = [];
  tasks.querySelectorAll('.task span').forEach(span => {
    taskArray.push(span.textContent);
  });

  localStorage.setItem('tasks', JSON.stringify(taskArray));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(taskText => {
    createTask(taskText);
  });
}

function pickRandomTask() {
  const taskSpans = tasks.querySelectorAll('.task span');
  if (taskSpans.length === 0) {
    alert('No tasks available to pick from!');
    return;
  }
  const randomIndex = Math.floor(Math.random() * taskSpans.length);
  alert(`How about: "${taskSpans[randomIndex].textContent}"`);
}

tasks.addEventListener('dblclick', e => {
  if (e.target.tagName === 'SPAN') {
    const span = e.target;
    const input = document.createElement('input');
    input.className = 'edit-input';
    input.type = 'text';
    input.value = span.textContent;
    span.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
      span.textContent = input.value.trim() || span.textContent;
      input.replaceWith(span);
      saveTasks();
    });

    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') input.blur();
      if (ev.key === 'Escape') input.replaceWith(span);
    });
  }
});

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const inputText = addInput.value.trim();
  if (!inputText) return;

  createTask(inputText);
  addInput.value = '';
});

updateEmptyMessage();
loadTasks();