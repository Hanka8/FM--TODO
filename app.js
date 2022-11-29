const themeSwitchBtn = document.querySelector("[data-theme-switcher]");
const bodyElement = document.querySelector(".body");
const filteringButtons = document.querySelectorAll("[data-filtering-btn]");
const tasksContainer = document.querySelector("[data-tasks-container]");
const formElement = document.querySelector("[data-form]");
const filterActiveBtn = document.querySelector("[data-btn-active]");
const filterCompletedBtn = document.querySelector("[data-btn-completed]");
const filterAllBtn = document.querySelector("[data-btn-all]");
const clearCompletedBtn = document.querySelector("[data-btn-clear-completed]");
const numberOfTasksLeftSpan = document.querySelector("[data-tasks-left");
const numberOfTasksLeftDescpSpan = document.querySelector("[data-tasks-left-descp");
const tasksDiv = document.querySelector(".tasks");

class UI {
    static showTasksContainer() {
        tasksDiv.style.display = "block";
    }

    static hideTasksContainer() {
        tasksDiv.style.display = "none";
    }

    static changeTheme(e) {
        if (e.target.dataset.mode == "dark") {
            e.target.style.backgroundImage = 'url("images/icon-moon.svg")';
            document.documentElement.style.setProperty(`--text`, "#494C6B");
            document.documentElement.style.setProperty(`--text-light`, "#9495A5");
            document.documentElement.style.setProperty(`--shadow`, "hsla(237, 20%, 80%, 0.5)");
            document.documentElement.style.setProperty(`--bg`, "#fafafa");
            document.documentElement.style.setProperty(`--bg-box`, "#ffffff");
            document.documentElement.style.setProperty(`--text-crossed`, "#D1D2DA");
            document.documentElement.style.setProperty(`--border`, "#E3E4F1");
            e.target.dataset.mode = "light"
            if (window.innerWidth > 600) {
                bodyElement.style.backgroundImage = 'url("images/bg-desktop-light.jpg")';
            } else {
                bodyElement.style.backgroundImage = 'url("images/bg-mobile-light.jpg")';
            }
        } else {
            e.target.style.backgroundImage = 'url("images/icon-sun.svg")';
            document.documentElement.style.setProperty(`--text`, "#C8CBE7");
            document.documentElement.style.setProperty(`--text-light`, "#767992");
            document.documentElement.style.setProperty(`--shadow`, "hsla(240, 4%, 16%, 0.5)");
            document.documentElement.style.setProperty(`--bg`, "#171823");
            document.documentElement.style.setProperty(`--bg-box`, "#25273D");
            document.documentElement.style.setProperty(`--text-crossed`, "#4D5067");
            document.documentElement.style.setProperty(`--border`, "#393A4B");
            e.target.dataset.mode = "dark"
            if (window.innerWidth > 600) {
                bodyElement.style.backgroundImage = 'url("images/bg-desktop-dark.jpg")';
            } else {
                bodyElement.style.backgroundImage = 'url("images/bg-mobile-dark.jpg")';
            }
        }
    }

    static highlightButton(btn) {
        btn.addEventListener("click", (evt) => {
            filteringButtons.forEach((e) => {
                e.classList.remove("selected");
            });
            btn.classList.add("selected");
        });
    }

    static removeErrorMessage() {
        if (formElement.querySelector(".error--message") != null) {
            let errorMessage = formElement.querySelector(".error--message");
            formElement.removeChild(errorMessage);
        }
    }

    static showErrorMessage(message) {
        let errorMessage = document.createElement("p");
        errorMessage.classList.add("error--message");
        errorMessage.textContent = message;
        formElement.appendChild(errorMessage);
    }

}

class Tasks {
    static updateTasksLeftDescription() {
        let tasksLeft = Array.from(document.querySelectorAll("[data--active]")).filter(arr => arr.dataset.Active == 1).length
        numberOfTasksLeftSpan.textContent = tasksLeft;
        if (tasksLeft < 2) {
            numberOfTasksLeftDescpSpan.textContent = " item left";
        } else {
            numberOfTasksLeftDescpSpan.textContent = " items left";
        }
    }

    // @param {condition}: 1 - active; 0 - inactive; else - all
    static filterTasks(condition) {
        let tasks = tasksContainer.querySelectorAll("[data--active]");
        tasks.forEach((task) => {
            if (task.dataset.Active == condition) {
                task.style.display = "none";
            } else {
                task.style.display = "flex";
            }
        });
    }

    static clearCompleted() {
        let tasks = tasksContainer.querySelectorAll("[data--active]");
        tasks.forEach((task) => {
            if (task.dataset.Active == 0) {
                tasksContainer.removeChild(task);
            }
        });
    }

    static createNewTask() {
        let tasksList = [];
        document.querySelectorAll(".container__text").forEach(obj => tasksList.push(obj.textContent));
        if (tasksList.includes(formElement.querySelector("input").value)) {
            UI.showErrorMessage("Already on the list");
            return;
        }
        if (formElement.querySelector("input").value == "") {
            UI.showErrorMessage("Please enter text");
            return;
        }
        UI.showTasksContainer();
        let task = document.createElement("div");
        task.dataset.Active = 1;

        //drag and drop
        task.addEventListener("mousedown", (e) => {
            console.log("d&d");
        });
        //drag and drop
        
        task.classList.add("container__task");

        let btn = document.createElement("button");
        btn.classList.add("container__btn");
        btn.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn--done")) {
                e.target.classList.remove("btn--done");
                e.target.parentNode.querySelector(".container__text").classList.remove("text--done");
                e.target.parentNode.dataset.Active = 1;
            } else {
                e.target.classList.add("btn--done");
                e.target.parentNode.querySelector(".container__text").classList.add("text--done");
                e.target.parentNode.dataset.Active = 0;
            }
            Tasks.updateTasksLeftDescription();
        });
        task.appendChild(btn);

        let text = document.createElement("p");
        text.classList.add("container__text");
        text.textContent = formElement.querySelector("input").value;
        task.appendChild(text);

        let close = document.createElement("button");
        close.addEventListener("click", (e) => {
            tasksContainer.removeChild(e.target.parentNode);
            Tasks.updateTasksLeftDescription();
            if (document.querySelectorAll(".container__text").length == 0) {
                UI.hideTasksContainer();
                UI.removeErrorMessage();
            }
        });
        close.classList.add("container__close");

        task.appendChild(close);
        tasksContainer.appendChild(task);
    }
}

filteringButtons.forEach((btn) => UI.highlightButton(btn));
filterActiveBtn.addEventListener("click", () => Tasks.filterTasks(0));
filterCompletedBtn.addEventListener("click", () => Tasks.filterTasks(1));
filterAllBtn.addEventListener("click", () => Tasks.filterTasks(2));

clearCompletedBtn.addEventListener("click", () => {
    Tasks.clearCompleted();
    if (document.querySelectorAll(".container__text").length == 0) {
        UI.hideTasksContainer();
        UI.removeErrorMessage();
        }
    }
);

themeSwitchBtn.addEventListener("click", (e) => UI.changeTheme(e));

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    UI.removeErrorMessage();
    Tasks.createNewTask();
    Tasks.updateTasksLeftDescription();
});

