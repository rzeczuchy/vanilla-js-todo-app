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

let todoList = [
  new Todo("I am an example todo"),
  new Todo("You can click on me to mark me as done"),
  new Todo("I am already done - click me again to mark me as active", true),
];

let addTodoButton = document.querySelector("#add-todo-button");

let newTodoInput = document.querySelector("#new-todo-input");

let todoListElement = document.querySelector("#todo-list");

function todoOnClick(todo) {
  if (todo.classList.contains("done")) {
    todo.classList.remove("done");
  } else {
    todo.classList.add("done");
  }
}

function deleteTodo(source) {
  const todo = source.parentElement;

  todo.remove();
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
  todoListElement.appendChild(newTodo);
}

function populateListElement() {
  todoList.forEach((element) => {
    addTodo(element.name, element.done);
  });
}

function submitNewTodo() {
  const todoName = newTodoInput.value.toString();

  addTodo(todoName);

  newTodoInput.value = "";
}

addTodoButton.onclick = (e) => {
  submitNewTodo();
};

newTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    submitNewTodo();
  }
});

populateListElement();
