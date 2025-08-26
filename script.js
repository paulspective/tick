const addForm = document.querySelector('.add-todo');
const addInput = addForm.querySelector('.add');
const searchInput = document.querySelector('.search');
const list = document.querySelector('.todos');
const noTodosMsg = document.querySelector('.no-todos');
const randomBtn = document.querySelector('.random-picker-btn');
const addIcon = document.querySelector('.add-wrapper i');
const menu = document.querySelector('.context-menu');

let todoBeingEdited = null;

function createTodoElement(todoText) {
  const li = document.createElement('li');
  li.classList.add('todo-item');

  const span = document.createElement('span');
  span.textContent = todoText;

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete');

  li.appendChild(span);
  li.appendChild(deleteIcon);
  list.appendChild(li);

  saveTodos();
  return li;
};

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const todo = addInput.value.trim();
  if (!todo) return;

  if (todoBeingEdited) {
    const span = todoBeingEdited.querySelector('span');
    if (span.textContent !== todo) span.textContent = todo;
    stopEditing();
    saveTodos();
  } else {
    createTodoElement(todo);
  }

  addForm.reset();
  toggleNoTodosMessage();
});

function deleteTodo(todoItem) {
  todoItem.classList.add('removing');
  setTimeout(() => {
    todoItem.remove();
    toggleNoTodosMessage();
    saveTodos();
  }, 600);
}

function startEditing() {
  addIcon.classList.replace('fa-plus', 'fa-check');
  addInput.classList.add('editing');
}

function stopEditing() {
  addIcon.classList.replace('fa-check', 'fa-plus');
  addInput.classList.remove('editing');
  todoBeingEdited = null;
  addForm.reset();
}

function toggleNoTodosMessage(message = 'No todos yet. Add one!') {
  noTodosMsg.style.display = list.children.length === 0 ? 'block' : 'none';
  noTodosMsg.textContent = message;
}

list.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) deleteTodo(e.target.closest('li'));
});

list.addEventListener('contextmenu', e => {
  e.preventDefault();
  const selectedItem = e.target.closest('li.todo-item');
  if (!selectedItem) return;

  menu.style.visibility = 'hidden';
  menu.style.display = 'block';

  todoBeingEdited = selectedItem;
  menu.relatedTodo = selectedItem;

  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let posX = e.clientX;
  let posY = e.clientY;

  if (posX + menuWidth > viewportWidth) posX -= menuWidth;
  if (posY + menuHeight > viewportHeight) posY -= menuHeight;

  posX = Math.max(0, Math.min(posX, viewportWidth - menuWidth));
  posY = Math.max(0, Math.min(posY, viewportHeight - menuHeight));

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
  menu.classList.add('show');
  menu.style.visibility = 'visible';
});

document.addEventListener('click', e => {
  if (!menu.contains(e.target) && !(todoBeingEdited && addForm.contains(e.target))) {
    menu.style.display = 'none';
    menu.relatedTodo = null;
    if (todoBeingEdited) stopEditing();
  }
});

document.querySelector('.menu-edit').addEventListener('click', () => {
  menu.style.display = 'none';
  const todoItem = menu.relatedTodo;
  if (!todoItem) return;

  addInput.value = todoItem.querySelector('span').textContent.trim();
  addInput.focus();
  startEditing();
});

document.querySelector('.menu-delete').addEventListener('click', () => {
  menu.style.display = 'none';
  const todoItem = menu.relatedTodo;
  if (todoItem) deleteTodo(todoItem);
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  randomBtn.style.display = term ? 'none' : 'block';

  if (!term) {
    Array.from(list.children).forEach(li => {
      li.classList.remove('filtered');
      li.style.display = 'flex';
    });
    toggleNoTodosMessage();
    return;
  }

  let matchFound = false;
  Array.from(list.children).forEach(todo => {
    const match = todo.textContent.toLowerCase().includes(term);
    todo.classList.toggle('filtered', !match);
    todo.style.display = match ? 'flex' : 'none';
    if (match) matchFound = true;
  });

  noTodosMsg.style.display = matchFound ? 'none' : 'block';
  if (!matchFound) noTodosMsg.textContent = 'No matching todo found.';
});

randomBtn.addEventListener('click', () => {
  const pickableTodos = Array.from(list.children).filter(
    todo => !todo.classList.contains('filtered')
  );
  if (!pickableTodos.length) return alert('Nothing to surprise you with. Add a todo first!');

  pickableTodos.forEach(todo => todo.classList.remove('border-trace'));
  const randomTodo = pickableTodos[Math.floor(Math.random() * pickableTodos.length)];
  randomTodo.classList.add('border-trace');
  randomTodo.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function saveTodos() {
  const todos = Array.from(list.children).map(li => li.querySelector('span').textContent);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => createTodoElement(todo));
  toggleNoTodosMessage();
}

loadTodos();
