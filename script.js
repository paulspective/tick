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

function updateTitle() {
  const totalTasks = tasks.querySelectorAll('.task').length;
  const incompleteTasks = tasks.querySelectorAll('.task input:not(:checked)').length;

  if (totalTasks === 0) {
    document.title = 'Tick — Your Simple To-Do App';
  } else {
    document.title = `Tick (${incompleteTasks}/${totalTasks}) — Your Simple To-Do App`;
  }
}

tasks.addEventListener('change', updateTitle);

function updateEmptyMessage() {
  if (tasks.children.length > 0) {
    emptyMsg.classList.remove('show');
    emptyMsg.textContent = '';
  } else {
    emptyMsg.textContent = emptyMessages[Math.floor(Math.random() * emptyMessages.length)];
    emptyMsg.classList.add('show');
  }
}

function createTask(text, ticked = false) {
  const li = document.createElement('li');
  li.className = 'task';
  li.innerHTML = `
    <input type="checkbox">
    <span title="Double click to edit">${text}</span>
    <button class="delete-btn">&times;</button>
  `;

  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.checked = ticked;

  if (ticked) checkbox.dispatchEvent(new Event('change'));

  checkbox.addEventListener('change', saveTasks);

  // delete button
  const delBtn = li.querySelector('.delete-btn');
  delBtn.addEventListener('click', () => {
    li.classList.add('fade-out');
    setTimeout(() => {
      li.remove();
      updateEmptyMessage();
      saveTasks();
      updateTitle();
    }, 250);
  });

  tasks.appendChild(li);
  updateEmptyMessage();
  setTimeout(saveTasks, 300);
}

function saveTasks() {
  const taskArray = [];
  tasks.querySelectorAll('.task').forEach(li => {
    const span = li.querySelector('span');
    const checkbox = li.querySelector('input[type="checkbox"]');
    taskArray.push({
      text: span.textContent,
      ticked: checkbox.checked
    });
  });

  localStorage.setItem('tasks', JSON.stringify(taskArray));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => {
    createTask(task.text, task.ticked);
  });
}

function pickRandomTask() {
  const taskSpans = Array.from(tasks.querySelectorAll('.task')).filter(
    li => !li.querySelector('input[type="checkbox"]').checked
  ).map(li => li.querySelector('span'));

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

    const handleBlur = () => input.replaceWith(span);
    input.addEventListener('blur', handleBlur);

    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        input.removeEventListener('blur', handleBlur); // stops the blur from firing
        span.textContent = input.value.trim() || span.textContent;
        input.replaceWith(span);
        saveTasks();
      }
      if (ev.key === 'Escape') input.blur();
    });
  }
});

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const inputText = addInput.value.trim();
  if (!inputText) return;

  createTask(inputText);
  addInput.value = '';
  setTimeout(updateTitle, 0);
});

updateTitle();
updateEmptyMessage();
loadTasks();