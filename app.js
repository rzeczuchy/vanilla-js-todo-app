"use strict";

class Todo {
  constructor(name, done = false) {
    this.name = name;
    this.done = done;
  }
  onClick() {
    this.done = !this.done;
  }
}

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

  const newTodo = document.createElement("li");
  newTodo.classList.add("todo");
  newTodo.onclick = (e) => {
    todoOnClick(newTodo);
  };
  if (done) {
    newTodo.classList.add("done");
  }

  const todoLabel = document.createElement("p");
  todoLabel.textContent = name;
  todoLabel.classList.add("todo-label");
  newTodo.appendChild(todoLabel);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "✖";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = (e) => {
    deleteTodo(deleteButton);
  };

  newTodo.appendChild(deleteButton);
  todoList.appendChild(newTodo);

  updateToDoListInStorage();
}

function localStorageEmpty() {
  const todo0 = localStorage.getItem("todo0");
  console.log(todo0);

  return todo0 == null;
}

function populateInitialTodosFromLocalStorage() {
  initialTodos = [];
  let iterating = true;
  let i = 0;

  while (iterating) {
    const todoAtIndex = localStorage.getItem(`todo${i}`);

    if (todoAtIndex === null) {
      iterating = false;
      return;
    } else {
      const todoName = todoAtIndex.substring(0, todoAtIndex.lastIndexOf(" "));
      const doneString = todoAtIndex.split(" ").pop();
      let done = doneString === "true";

      initialTodos.push(new Todo(todoName, done));
      i++;
    }
  }
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
