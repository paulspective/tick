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
    <span>${text}</span>
    <button class="delete-btn">&times;</button>
  `;

  // delete button
  const delBtn = li.querySelector('.delete-btn');
  delBtn.addEventListener('click', () => {
    li.classList.add('fade-out');
    setTimeout(() => {
      li.remove();
      updateEmptyMessage();
    }, 250);
  });

  tasks.append(li);
  updateEmptyMessage();
}

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const inputText = addInput.value.trim();
  if (!inputText) return;

  createTask(inputText);
  addInput.value = '';
});

updateEmptyMessage();