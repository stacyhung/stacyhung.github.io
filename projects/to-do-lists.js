const listsContainer = document.querySelector(".task-list");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListBtn = document.querySelector("[data-delete-list-button]");
const todoList = document.querySelector(".todo-list");
const listTitle = document.querySelector(".todo-title");
const taskCount = document.querySelector(".task-count");
const tasks = document.querySelector(".tasks");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTaskBtn = document.querySelector("[data-clear-complete-tasks-button]");

const LOCAL_STORAGE_LIST_KEY = 'task.lists'; // first key; prevents information from being overridden by our site or other sites
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
// get lists if it exists or start with empty list array
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// When the user clicks a list
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});

// when a user crosses out / uncrosses a task
tasks.addEventListener('click', e => {
    // check if the check box was clicked
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        // update the status of the task (checking or unchecking)
        selectedTask.complete = e.target.checked;
        // save status
        save();
        renderTaskCount(selectedList);
    }
});

// When user clicks the "Clear completed tasks" button
clearCompleteTaskBtn.addEventListener('click', e => {
    // get the selected list
    const selectedList = lists.find(list => list.id === selectedListId);
    // refresh the task list with a new task list based on just the incomplete tasks
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender();
});

// When the user clicks the "Delete list" button
deleteListBtn.addEventListener('click', e => {
    // create "new" list based on all lists except the selected list
    lists = lists.filter(list => list.id !== selectedListId)
    // we no longer have a selected list
    selectedListId = null;
    saveAndRender();
});

/* Functionality for adding new list */
newListForm.addEventListener('submit', e => {
    // default action is to clear input and refresh page (we don't want this)
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName.trim() === "") return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

/* Functionality for adding new task */
newTaskForm.addEventListener('submit', e => {
    // default action is to clear input and refresh page (we don't want this)
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName.trim() === "") return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    // get the selected list
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task);
    saveAndRender();
});

// Create a new task
function createTask(name) {
    // return an object
    return {
        id: Date.now().toString(), name: name, complete: false
    };

}

/**
 * Create a new list
 * Note that each task within the tasks array is an object containing the following properties:
 *      1. id
 *      2. name
 *      3. complete (true/false)
 */
function createList(name) {
    // return an object
    return {
        id: Date.now().toString(), name: name, tasks: []
    };
}

function saveAndRender() {
    save();
    render();
}

// Save to local storage
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));        // save list of lists
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);   // save selected list
}

/* Refresh the list */
function render() {
    //E.g. list element in HTML: <li class="list-item">Work</li>
    clearElement(listsContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);

    //check for selected list
    if (selectedListId == null) {
        // don't display tasks
        todoList.style.display = 'none';
    } else {
        // a list is selected
        todoList.style.display = ''; //reset so that display is on again
        listTitle.innerText = selectedList.name;
        // update task count
        renderTaskCount(selectedList);
        clearElement(tasks);
        renderTasks(selectedList);
    }
}

// update task list
function renderTasks(selectedList) {
    // loop through all our tasks
    selectedList.tasks.forEach(task => {
        //clone the template
        const taskElement = document.importNode(taskTemplate.content, true); // false would return only top-level tag element
        // get the input element (checkbox)
        const checkbox = taskElement.querySelector('input');
        // set the id attribute (e.g. <input type="checkbox" id=${task.id} />)
        checkbox.id = task.id;
        // set the checked attribute (e.g. <input type="checkbox" checked=${task.complete} />)
        checkbox.checked = task.complete;
        // console.log(`${checkbox.id} is complete? ${checkbox.checked}`);

        // get the label element (text associated with checkbox)
        const label = taskElement.querySelector('label');
        // set the "for" attribute inside the label element (e.g. <label for="task-1")>...</label>)
        label.htmlFor = task.id;
        // display the task
        label.append(task.name);
        // tasksContainer.appendChild(taskElement);
        tasks.appendChild(taskElement);
    });
}

// update task count
function renderTaskCount(selectedList) {
    // get number of *incomplete* tasks
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    // if there is only 1 task left, change to singular task
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    // update display of task count
    taskCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

// update lists
function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('list-item');
        listElement.innerText = list.name;
        // check if the current list item is selected
        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
    });

}

/* Clear the list to start */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();