const listsContainer = document.querySelector(".task-list");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

const LOCAL_STORAGE_LIST_KEY = 'task.lists'; // first key; prevents information from being overridden by our site or other sites
// check if list exists already
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

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

function createList(name) {
    // return an object
    return { id: Date.now().toString(), name: name, tasks: [] };
}

function saveAndRender() {
    save();
    render();
}

// Save list to local storage
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}

/* Refresh the list */
function render() {
    //E.g. list element in HTML: <li class="list-item">Work</li>
    clearElement(listsContainer);
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('list-item');
        listElement.innerText = list.name;
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