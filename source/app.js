import Todo from "./todo.js";
import LocalStorageHandler from "./localStorageHandler.js";

const localStorageHandler = new LocalStorageHandler();

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

  localStorageHandler.updateLocalStorage(todoList);
}

function deleteTodo(source) {
  const todo = source.parentElement;

  todo.remove();

  localStorageHandler.updateLocalStorage(todoList);
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

  localStorageHandler.updateLocalStorage(todoList);
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

function populateTodoListElement() {
  if (localStorageHandler.localStorageHasTodos()) {
    initialTodos = localStorageHandler.getTodosFromLocalStorage();
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

closeStorageInfoModalButton.onclick = (e) => {
  storageInfoModal.close();
};

function init() {
  populateTodoListElement();
  storageInfoModal.showModal();
}

init();
