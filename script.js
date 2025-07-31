const addForm = document.querySelector('.add-todo');
const addInput = addForm.querySelector('.add');
const searchInput = document.querySelector('.search');
const list = document.querySelector('.todos');
const noTodosMsg = document.querySelector('.no-todos');
const randomBtn = document.querySelector('.random-picker-btn');
const addIcon = document.querySelector('.add-wrapper i');

let todoBeingEdited = null;

function toggleNoTodosMessage() {
  if (list.children.length === 0) {
    noTodosMsg.textContent = "No todos yet. Add one!";
    noTodosMsg.style.display = 'block';
  } else {
    noTodosMsg.style.display = 'none';
  }
}

toggleNoTodosMessage();

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const todo = addInput.value.trim();

  if (todo && todoBeingEdited) {
    const span = todoBeingEdited.querySelector('span');
    if (span.textContent !== todo) {
      span.textContent = todo;
    }
    todoBeingEdited = null;
    addForm.reset();
    addIcon.classList.remove('fa-check');
    addIcon.classList.add('fa-plus');
    addInput.classList.remove('editing');
    toggleNoTodosMessage();
  } else if (todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    const span = document.createElement('span');
    span.textContent = todo;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete');

    li.appendChild(span);
    li.appendChild(deleteIcon);
    list.appendChild(li);

    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    addInput.classList.remove('editing');
    addForm.reset();
    toggleNoTodosMessage();
  }
});

list.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    const todoItem = e.target.parentElement;
    todoItem.classList.add('removing');
    setTimeout(() => {
      todoItem.remove();
      toggleNoTodosMessage();
    }, 600);
  }

  if (e.target.tagName === 'SPAN') {
    const parent = e.target.parentElement;
    if (parent.classList.contains('filtered')) return;

    todoBeingEdited = parent;
    const currentText = e.target.textContent.trim();
    addInput.value = currentText;
    addInput.focus();
    addIcon.classList.remove('fa-plus');
    addIcon.classList.add('fa-check');
    addInput.classList.add('editing');
  }
});

const filterTodos = (term) => {
  if (list.children.length === 0) {
    noTodosMsg.textContent = "No todo to search through.";
    noTodosMsg.style.display = 'block';
    return;
  }

  let matchFound = false;

  Array.from(list.children).forEach((todo) => {
    const match = todo.textContent.toLowerCase().includes(term);
    todo.classList.toggle('filtered', !match);
    if (match) matchFound = true;
  });

  noTodosMsg.style.display = matchFound ? 'none' : 'block';
  if (!matchFound) noTodosMsg.textContent = "No matching todo found.";
};

searchInput.addEventListener('keyup', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterTodos(term);
  addInput.classList.remove('editing');
});

searchInput.addEventListener('blur', () => {
  noTodosMsg.textContent = 'No todos yet. Add one!';
});

randomBtn.addEventListener('click', () => {
  const pickableTodos = Array.from(list.children).filter(todo => !todo.classList.contains('filtered'));

  if (pickableTodos.length === 0) {
    alert("Nothing to surprise you with. Add a todo first!");
    return;
  }

  pickableTodos.forEach(todo => todo.classList.remove('glow'));

  const randomTodo = pickableTodos[Math.floor(Math.random() * pickableTodos.length)];

  randomTodo.classList.add('glow');

  randomTodo.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const diceIcon = randomBtn.querySelector('i');
  diceIcon.classList.add('dice-shake');

  setTimeout(() => {
    diceIcon.classList.remove('dice-shake');
  }, 1000);
});

document.body.addEventListener('click', e => {
  const clickedInsideInput = addInput.contains(e.target);
  const clickedOnSpan = e.target.tagName === 'SPAN';

  if (todoBeingEdited && !clickedInsideInput && !clickedOnSpan) {
    addForm.reset();
    todoBeingEdited = null;
    addIcon.classList.remove('fa-check');
    addIcon.classList.add('fa-plus');
    addInput.classList.remove('editing');
  }
});