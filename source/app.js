import Todo from "./todo.js";

let initialTodos = [
  new Todo("I am an example todo"),
  new Todo("You can click on me to mark me as done"),
  new Todo("I am already done - click me again to mark me as active", true),
];

const addTodoButton = document.querySelector("#add-todo-button");

const newTodoInput = document.querySelector("#new-todo-input");

const todoList = document.querySelector("#todo-list");

const storageInfoModal = document.querySelector("#storage-info-modal");

const closeStorageInfoModalButton = document.querySelector(
  "#close-storage-info-modal"
);

function todoOnClick(todo) {
  if (todo.classList.contains("done")) {
    todo.classList.remove("done");
  } else {
    todo.classList.add("done");
  }

  updateToDoListInStorage();
}

function deleteTodo(source) {
  const todo = source.parentElement;

  todo.remove();

  updateToDoListInStorage();
}

function addTodo(name, done = false) {
  if (name == "") {
    return;
  }

  const newTodo = createNewTodo(done);

  const todoLabel = createNewTodoLabel(name);

  newTodo.appendChild(todoLabel);

  const deleteButton = createNewTodoDeleteButton();

  newTodo.appendChild(deleteButton);

  todoList.appendChild(newTodo);

  updateToDoListInStorage();
}

function createNewTodo(done) {
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo");
  newTodo.onclick = (e) => {
    todoOnClick(newTodo);
  };
  if (done) {
    newTodo.classList.add("done");
  }
  return newTodo;
}

function createNewTodoLabel(name) {
  const todoLabel = document.createElement("p");
  todoLabel.textContent = name;
  todoLabel.classList.add("todo-label");
  return todoLabel;
}

function createNewTodoDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "✖";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = (e) => {
    deleteTodo(deleteButton);
  };
  return deleteButton;
}

function localStorageEmpty() {
  const todo0 = localStorage.getItem("todo0");

  return todo0 == null;
}

function populateInitialTodosFromLocalStorage() {
  initialTodos = [];
  let iterating = true;
  let i = 0;

  while (iterating) {
    const localStorageString = localStorage.getItem(`todo${i}`);

    if (localStorageString === null) {
      iterating = false;
      return;
    }

    const newTodo = createTodoFromLocalStorageString(localStorageString);

    initialTodos.push(newTodo);
    i++;
  }
}

function createTodoFromLocalStorageString(localStorageString) {
  if (localStorageString === null) {
    throw new TypeError("localStorageString should not be a null");
  }

  const todoName = localStorageString.substring(
    0,
    localStorageString.lastIndexOf(" ")
  );

  const doneString = localStorageString.split(" ").pop();

  let done = doneString === "true";

  return new Todo(todoName, done);
}

function populateTodoListElement() {
  if (!localStorageEmpty()) {
    populateInitialTodosFromLocalStorage();
  }
  initialTodos.forEach((element) => {
    addTodo(element.name, element.done);
  });
}

function submitNewTodo() {
  const todoName = newTodoInput.value.toString();

  addTodo(todoName);

  newTodoInput.value = "";
}

addTodoButton.onclick = (e) => {
  if (newTodoInput.value === "") {
    return;
  }
  submitNewTodo();
};

newTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    submitNewTodo();
  }
});

function updateToDoListInStorage() {
  localStorage.clear();

  const todoElementsCollection = todoList.children;
  const todoArray = Array.from(todoElementsCollection);

  todoArray.forEach((element, index) => {
    const todoName = element.firstChild.innerText;
    let todoDone = "false";
    const indexString = index.toString();

    if (element.classList.contains("done")) {
      todoDone = "true";
    }

    localStorage.setItem(`todo${indexString}`, `${todoName} ${todoDone}`);
  });
}

closeStorageInfoModalButton.onclick = (e) => {
  storageInfoModal.close();
};

populateTodoListElement();
storageInfoModal.showModal();
