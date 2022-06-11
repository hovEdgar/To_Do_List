function querySelect(selector) {
    return document.querySelector(selector);
}

const input = querySelect('.container__input input');
const taskBox = querySelect('.task-box');
const clearBtn = querySelect('.btn-clear');
const taskToDo = querySelect('.result')
const filters = document.querySelectorAll(".filters span");

let editId;
let editCheck = false;
let result = 0;
taskToDo.innerHTML = result;

// Creating localstorage
let todos = JSON.parse(localStorage.getItem('todo-list'));

// Show number of non completed tasks
function showNumberOfTAsks() {
   result = todos.filter(elem => elem.status === 'pending').length;
   taskToDo.innerHTML = result;
}

// Show active filter
filters.forEach(elem => {
    elem.addEventListener('click', () => {
        document.querySelector("span.active").classList.remove("active");
        elem.classList.add("active");
        showToDo(elem.id);
        showNumberOfTAsks()
    })
});

// Adding new task by checking active status
function showToDo(elem) {
    let li = '';
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status === 'completed' ? 'checked' : '';
            if (elem === todo.status || elem === 'all') {
                li += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="option">...</i>
                            <ul class="menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><img class="edit" src="./images/pen.png" alt="icon-pen">Edit</li>
                                <li onclick="deleteTask(${id})"><img class="edit" src="./images/recycle.png" alt="icon-recycle">Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }

        });
    }
    taskBox.innerHTML = li || `<span> There is no task here yet ... <span>`;
}

showToDo("all");

function showMenu(task) {
    let taskMenu = task.parentElement.lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', e => {
        if (e.target.tagName !== "I" || e.target !== task) {
            taskMenu.classList.remove('show');
        }
    })
}

function editTask(taskId, taskName) {
    editId = taskId;
    editCheck = true;
    input.value = taskName;
}

function deleteTask(taskId) {
    todos.splice(taskId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showToDo("all");
    showNumberOfTAsks();
}

clearBtn.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showToDo("all");
    showNumberOfTAsks();
});

function updateStatus(task) {
    // get paragraph that contains task name
    let select = task.parentElement.lastElementChild;

    if (task.checked) {
        select.classList.add('checked');
        todos[task.id].status = 'completed';
    } else {
        select.classList.remove('checked');
        todos[task.id].status = 'pending';
    }

    localStorage.setItem('todo-list', JSON.stringify(todos));
    showNumberOfTAsks();
}

input.addEventListener('keyup', e => {
    let task = input.value.trim();
    if (e.key === 'Enter' && task) {
        if (!editCheck) {
            if (!todos) { // if todos isn't exist, pass an empty array
                todos = [];
            }
            let taskInfo = {name: task, status: 'pending'};
            todos.push(taskInfo); // add new task to todos list
        } else {
            editCheck = false;
            todos[editId].name = task
        }

        input.value = '';

        localStorage.setItem('todo-list', JSON.stringify(todos));
        showToDo("all");
        showNumberOfTAsks();
    }
});