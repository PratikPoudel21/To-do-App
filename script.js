class todoApp {
    constructor() {
        this.root = document.querySelector(".to-dos ul");
        this.fetchTodos();
        this.displayTodos()
        this.handleEvents();
        this.updateProgress();
    }

    fetchTodos() {
        this.todos = JSON.parse(localStorage.getItem("todos")) || {};
        this.todos = new Map(Object.entries(this.todos)); 
    }

    displayTodos(todos = this.todos) {
        this.root.innerHTML = todos.size !== 0 ? "" : "No tasks";
    
        for (let [id, todo] of todos.entries()) {
            let task = `
                <li class="to-do">
                    <input type="checkbox" id="${id}" ${todo.completed ? "checked" : ""}>
                    <label for="${id}">${todo.task}</label>
                    <i class="fa-solid fa-xmark" data-id="${id}"></i>               
                </li>
            `;
            this.root.innerHTML += task;
        }
    
        this.attachTaskEventListeners();
        this.updateProgress();
    }

    attachTaskEventListeners() {
        this.root.querySelectorAll(".to-do input[type='checkbox']").forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                let id = checkbox.id;
                if (this.todos.has(id)) {
                    this.todos.get(id).completed = checkbox.checked;
                    this.updateProgress();
                    this.saveTodos();
                    this.setFilter(null, document.querySelector(".selected").classList[0]);
                }
            });
        });
    
        this.root.querySelectorAll(".to-do .fa-xmark").forEach((btn) => {
            btn.addEventListener("click", () => {
                let id = btn.getAttribute("data-id");
                this.todos.delete(id);
                this.displayTodos();
                this.saveTodos();
                this.setFilter(null, document.querySelector(".selected").classList[0]);
            });
        });
    }
    
    updateProgress() {
        this.progressCounter = document.querySelector(".progress .progress-right .progress-count");
        this.progress = document.querySelector(".progress .progress-left .progres");
        this.totalTodos = this.todos.size;
        this.progresSize = this.totalTodos == 0 ? 0 : (this.todosCompleted() / this.totalTodos) * 12;
        this.progressCounter.innerHTML = `${this.todosCompleted()}/${this.totalTodos}`;
        this.progress.style.width = `${this.progresSize}em`;

        if(this.totalTodos == 0) { document.querySelector(".progress .progress-left p").innerHTML = "Start by adding some tasks" }
        else if(this.todosCompleted() == this.totalTodos) { document.querySelector(".progress .progress-left p").innerHTML = "Great job!" }
        else { document.querySelector(".progress .progress-left p").innerHTML = "Keep it up!"; }
    }

    handleEvents() {
        document.querySelector(".all").addEventListener("click", (e) => {
            this.setFilter(e.target, "all");
        });
    
        document.querySelector(".pending").addEventListener("click", (e) => {
            this.setFilter(e.target, "pending");
        });
    
        document.querySelector(".completed").addEventListener("click", (e) => {
            this.setFilter(e.target, "completed");
        });
    
        document.querySelector(".clear").addEventListener("click", () => {
            this.todos.clear();
            this.displayTodos();
            this.saveTodos();
        });

        document.querySelector(".add").addEventListener("click", () => {
            this.addTodo()
            this.setFilter(null, document.querySelector(".selected").classList[0]);
        });
    
        document.querySelector(".add-Todo input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.addTodo();
                this.setFilter(null, document.querySelector(".selected").classList[0]);
            }
        });
    }

    addTodo() {
        let input = document.querySelector(".add-Todo input");
        let todoValue = input.value.trim();
    
        if (todoValue === "") return;
    
        let newId = Date.now().toString();
        this.todos.set(newId, { task: todoValue, completed: false });
    
        input.value = "";
        this.displayTodos();
        this.saveTodos();
    }
    

    setFilter(target, type) {
        if(target) {
            document.querySelectorAll(".control span").forEach(span => span.classList.remove("selected"));
            target.classList.add("selected");
        }
    
        let filteredTodos = new Map([...this.todos].filter(([id, todo]) => {
            return type === "all" || (type === "pending" && !todo.completed) || (type === "completed" && todo.completed);
        }));
    
        if(filteredTodos.size !== 0) { this.displayTodos(filteredTodos); }
        else if (type === "completed") { this.root.innerHTML = "You haven't completed any tasks yet."; }
        else if (type === "pending") { this.root.innerHTML = "No pending tasks."; }
    }  
    
    setDefault() {

    }
    
    todosCompleted() {
        let num = 0;
            this.todos.forEach(todo => {
                if(todo.completed) {
                    num++;
                }
            });
            return num;
    }

    saveTodos() {
        localStorage.setItem("todos", JSON.stringify(Object.fromEntries(this.todos)));
    }

    deleteTodos(id) {
        this.todos.delete(id);
    }
}

todo = new todoApp();