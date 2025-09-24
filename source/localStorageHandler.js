import Todo from "./todo.js";

export default class LocalStorageHandler {
  constructor() {}
  updateLocalStorage(todoList) {
    localStorage.clear();
    this.updateToDoListInStorage(todoList);
  }
  updateToDoListInStorage(todoList) {
    const todoArray = Array.from(todoList.children);

    todoArray.forEach((element, index) => {
      const todoName = element.firstChild.innerText;
      const todoDone = element.classList.contains("done").toString();
      const indexString = index.toString();

      localStorage.setItem(`todo${indexString}`, `${todoName} ${todoDone}`);
    });
  }
  localStorageHasTodos() {
    const todo0 = localStorage.getItem("todo0");

    return typeof todo0 === "string" || todo0 instanceof String;
  }
  createTodoFromString(todoString) {
    if (!this.isString(todoString)) {
      throw new TypeError("localStorageString must be a string");
    }

    const todoName = this.getTodoName(todoString);
    const done = this.getTodoDone(todoString);

    return new Todo(todoName, done);
  }
  getTodoName(todoString) {
    return todoString.substring(0, todoString.lastIndexOf(" "));
  }
  getTodoDone(todoString) {
    const doneString = todoString.split(" ").pop();

    return doneString === "true";
  }
  isString(value) {
    return typeof value === "string" || value instanceof String;
  }
  getTodoString(index) {
    const localStorageValue = localStorage.getItem(`todo${index}`);

    if (this.isString(localStorageValue)) {
      return localStorage.getItem(`todo${index}`);
    } else return false;
  }
  getTodosFromLocalStorage() {
    const todos = [];
    let iterating = true;
    let i = 0;

    while (iterating) {
      const todoString = this.getTodoString(i);

      if (todoString) {
        const newTodo = this.createTodoFromString(todoString);

        todos.push(newTodo);
        i++;
      } else {
        iterating = false;
        return todos;
      }
    }
  }
}
