class Menue {
  constructor() {
    this.toggleButton = document.querySelector(".toggle-sidebar");
    this.sidebar = document.querySelector(".sidebar");
    this.openMenue = document.querySelector(".open-menue");
    this.toggleTheme = document.querySelector(".toggle-theme");
    this.theme = document.getElementById("theme");
    this.render();
  }

  render() {
    window.addEventListener("scroll", () => {
      this.sidebar.style.position = "fixed";
      this.sidebar.style.top = "0";
      if (window.scrollY === 0) {
        this.sidebar.style.position = "absolute";
        this.sidebar.style.top = "";
      }
    });

    this.openMenue.addEventListener("click", () => {
      this.open();
    });

    let theme;
    let body = document.body;

    this.theme.addEventListener("change", () => {
      body.classList.toggle("dark-mode");
      if (this.theme.checked) {
        theme = "dark";
      } else {
        theme = "light";
      }
      localStorage.setItem("theme", JSON.stringify(theme));
    });

    let get_theme = JSON.parse(localStorage.getItem("theme"));
    if (get_theme == "dark") {
      body.classList.add("dark-mode");
      this.theme.setAttribute("checked", "checked");
    } else {
      body.classList.remove("dark-mode");
      this.theme.removeAttribute("checked", "checked");
    }

    let sidebar_state;
    this.toggleButton.addEventListener("click", () => {
      this.sidebar.classList.toggle("open-sidebar");
      if (this.sidebar.classList.contains("open-sidebar")) {
        sidebar_state = "open";
      } else {
        sidebar_state = "close";
      }

      localStorage.setItem("sidebar_state", JSON.stringify(sidebar_state));
    });

    let get_state = JSON.parse(localStorage.getItem("sidebar_state"));
    if (get_state === "open") {
      this.sidebar.classList.add("open-sidebar");
    } else {
      this.sidebar.classList.remove("open-sidebar");
    }
  }

  open() {
    this.sidebar.classList.toggle("open");
    localStorage.removeItem("sidebar_state");
    if (this.sidebar.classList.contains("open")) {
      document.body.style.overflow = "hidden";
      this.openMenue.classList.remove("fa-bars-staggered");
      this.openMenue.classList.add("fa-xmark");
    } else {
      document.body.style.overflow = "visible";
      this.openMenue.classList.add("fa-bars-staggered");
      this.openMenue.classList.remove("fa-xmark");
    }
  }
}

class Todo {
  constructor(id, title, date, status) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.isCompleted = status;
  }
}

class TodoList {
  constructor(todosContainer) {
    this.todosContainer = todosContainer;
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    this.todoInput = document.querySelector(".todo-input");
    this.addTodoBtn = document.querySelector(".add-todo-btn");
    this.clearBtn = document.querySelector(".clear-todo-btn");
    this.allTodos = document.querySelector(".all-todos");
    this.doneTodos = document.querySelector(".done-todos");
    this.favoriteTodos = document.querySelector(".favorite-todos");
    this.favoriteBadge = document.querySelector(".favorite-badge");
    this.favoriteIcon = document.querySelector(".favorite-icon");
    this.favoriteList = document.querySelector(".favorites");
    this.closeModal = document.querySelector(".close-modal");
    this.modal = document.querySelector(".modal");
    this.modalBody = document.querySelector(".modal-body");
    this.backdrop = document.querySelector(".backdrop");
    this.counter = 1;
    this.render();
  }

  render() {
    this.addTodoBtn.addEventListener("click", () => {
      this.addNewTodo(this.todoInput.value);
      this.todoInput.value = "";
    });

    this.clearBtn.addEventListener("click", () => {
      this.removeAllTodo();
    });

    this.favoriteList.addEventListener("click", () => {
      this.showFavorites();
    });

    this.closeModal.addEventListener("click", () => {
      this.hideFavorites();
    });

    this.backdrop.addEventListener("click", () => {
      this.hideFavorites();
    });

    this.favoriteIcon.addEventListener("click", () => {
      this.addFavoritesToDom();
    });

    this.saveToLocalStorage("todos", this.todos);
    this.saveToLocalStorage("favorites", this.favorites);
    this.addTodosToDom();
  }

  showFavorites() {
    this.modal.classList.add("open-modal");
    document.body.style.overflowY = "hidden";
  }

  hideFavorites() {
    this.modal.classList.remove("open-modal");
    document.body.style.overflowY = "visible";
  }

  addNewTodo(newTodotitle) {
    if (newTodotitle) {
      let date = new Date();
      date = date.toDateString();
      let status = false;
      if (this.todos.length) {
        this.counter = this.todos.length + 1;
      }
      this.todos.push(new Todo(this.counter, newTodotitle, date, status));
      this.counter++;
      this.saveToLocalStorage("todos", this.todos);
      this.addTodosToDom();
    }
  }

  removeAllTodo() {
    this.todos = [];
    this.favorites = [];
    this.counter = 1;
    this.saveToLocalStorage("todos", this.todos);
    this.saveToLocalStorage("favorites", this.favorites);
    this.addTodosToDom();
  }

  addTodosToDom() {
    this.todosContainer.innerHTML = "";
    let dones = this.todos.filter((todo) => {
      return todo.isCompleted == true;
    });
    this.allTodos.innerHTML = this.todos.length;
    this.doneTodos.innerHTML = dones.length;

    this.todos.forEach((todo, todoIndex) => {
      let row = document.createElement("tr");

      let todoId = document.createElement("td");
      todoId.classList.add("todo-id");
      todoId.setAttribute("data-label", "#");
      todoId.innerHTML = todo.id;

      let todoItem = document.createElement("td");
      todoItem.classList.add("todo-item");
      todoItem.setAttribute("data-label", "to do");
      todoItem.innerHTML = todo.title;

      todo.isCompleted ? todoItem.classList.add("completed-todo") : null;

      let todoDate = document.createElement("td");
      todoDate.classList.add("todo-date");
      todoDate.setAttribute("data-label", "Date :");
      todoDate.innerHTML = todo.date;

      let todoStatus = document.createElement("td");
      let tdSpan = document.createElement("span");
      todoStatus.appendChild(tdSpan);
      let statusClass = todo.isCompleted ? "status-success" : "status-danger";
      todoStatus.classList.add("todo-status", statusClass);
      todoStatus.setAttribute("data-label", "status");
      tdSpan.innerHTML = todo.isCompleted ? "Completed" : "Not Completed";

      let todoOperation = document.createElement("td");
      let completed_button = document.createElement("button");
      completed_button.classList.add("todo-operation");
      let complete_icon = document.createElement("i");

      complete_icon.classList.add(
        "fa-regular",
        "fa-square-check",
        "todo-operation-icon",
        "complete-todo"
      );
      if (todo.isCompleted) {
        complete_icon.classList.toggle("complete-todo-icon");
      }
      completed_button.appendChild(complete_icon);

      let favorite_button = document.createElement("button");
      let favorite_icon = document.createElement("i");
      favorite_icon.classList.add(
        "fa-regular",
        "fa-heart",
        "todo-operation-icon",
        "favorite-todo-icon"
      );
      favorite_button.appendChild(favorite_icon);
      favorite_button.classList.add("todo-operation");
      let delete_button = document.createElement("button");
      delete_button.classList.add("todo-operation");
      let delete_icon = document.createElement("i");
      delete_icon.classList.add(
        "fa-regular",
        "fa-trash",
        "todo-operation-icon",
        "delete-todo-icon"
      );
      delete_button.appendChild(delete_icon);
      todoOperation.append(completed_button, favorite_button, delete_button);

      row.append(todoId, todoItem, todoDate, todoStatus, todoOperation);

      this.todosContainer.appendChild(row);

      favorite_icon.addEventListener("click", () => {
        const isAddToFave = this.favorites
          .map((faves) => faves.id)
          .includes(todo.id);
        if (!isAddToFave) {
          this.favorites.push(todo);
          this.saveToLocalStorage("favorites", this.favorites);
          this.addTodosToDom();
        }
      });

      delete_icon.addEventListener("click", () => {
        this.todosContainer.removeChild(row);
        this.removeTodo(todoIndex, this.todos, "todos");
        this.removeTodo(todoIndex, this.favorites, "favorites");
        this.addTodosToDom();
      });

      complete_icon.addEventListener("click", (event) => {
        event.target.parentElement.parentElement.parentElement.children[1].classList.toggle(
          "completed-todo"
        );
        todo.isCompleted = !todo.isCompleted;
        this.saveToLocalStorage("todos", this.todos);
        this.addTodosToDom();
      });
    });

    this.favoriteTodos.innerHTML = this.favorites.length;
    this.favoriteBadge.innerHTML = this.favorites.length;
  }

  removeTodo(id, item, storageName) {
    let removeItem = item.findIndex((item, index) => {
      return index === id;
    });
    item.splice(removeItem, 1);
    this.saveToLocalStorage(storageName, item);
    this.saveToLocalStorage(storageName, item);
    this.addTodosToDom();
  }

  saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  addFavoritesToDom() {
    this.modalBody.innerHTML = "";

    this.favorites.forEach((faves, faves_index) => {
      // favorites
      let favorite_item = document.createElement("div");
      favorite_item.classList.add("favorite-item");

      let favorite_detail = document.createElement("div");

      let todo_title = document.createElement("h3");
      todo_title.classList.add("todo-title");
      todo_title.innerHTML = faves.title;

      let todo_date = document.createElement("p");
      todo_date.classList.add("todo-date");
      todo_date.innerHTML = faves.date;

      let delete_favorite = document.createElement("i");
      delete_favorite.classList.add(
        "fa-regular",
        "fa-trash",
        "todo-operation-icon",
        "delete-favorite"
      );

      favorite_detail.append(todo_title, todo_date);
      favorite_item.append(favorite_detail, delete_favorite);
      this.modalBody.appendChild(favorite_item);

      delete_favorite.addEventListener("click", () => {
        favorite_item.remove();

        let remove_favorite = this.favorites.findIndex((item, index) => {
          return index === faves_index;
        });

        this.favorites.splice(remove_favorite, 1);
        this.saveToLocalStorage("favorites", this.favorites);
        this.addTodosToDom();
      });

      this.addTodosToDom();
    });
  }
}

let newTodo = new TodoList(document.querySelector(".table-body"));

window.document.onload = new Menue();
