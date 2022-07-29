// Add project button
const addProject = document.querySelector(".add-projects")
// Modal for adding projects
const modalProject = document.querySelector(".modal-project")
// Form consisting of add project button and modal
const newListForm = document.querySelector("[data-new-list-form]")
// Input of modal
const newListInput = document.querySelector("[data-new-list-input]")
// Submit task button
const submitProject = document.querySelector("#submit-project-button")
// Close button of project modal
const closeProjectDialog = document.querySelector("#close-project-button")
// Mroject container
const listsContainer = document.querySelector('[data-lists]')
// Main container for todos
const listDisplayContainer = document.querySelector("[data-list-display-container]")
// Title of project shown in todos container
const listTitleElement = document.querySelector("[data-list-title]")
// Current count of tasks
const listCountElement = document.querySelector("[data-list-count]")
// Tasks container
const tasksContainer = document.querySelector("[data-tasks]")
// Tasks template
const taskTemplate = document.getElementById("task-template")
// Add task button
const addTask = document.querySelector(".add-todo-button")
// Modal for adding tasks
const modalTask = document.querySelector(".modal-task")
// Task input
const newTaskInput = document.querySelector("[data-new-task-input]")
// Submit task button
const submitTask = document.querySelector("#submit-task-button")
// Close button of tasks modal
const closeTaskDialog = document.querySelector("#close-task-button")
// Button for clearing completed tasks
const clearCompleteTasksButton = document.querySelector("[data-clear-complete-tasks-button]")
// Delete list
const deleteListButton = document.querySelector("[data-delete-list-button]")


const LOCAL_STORAGE_LIST_KEY = "task.lists" // Project key
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId" // Selected project key
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


const openNavBar = document.querySelector(".hamburger")
const closeNavbar = document.querySelector(".close-mark")
const activeNavBar = document.querySelector("[data-navbar]")

openNavBar.addEventListener("click", e => {
  activeNavBar.classList.add("active-navbar")
  // openNavBar.style.display = "none"
  // closeNavbar.style.display = "flex"
})

// closeNavbar.addEventListener("click", e => {
//   activeNavBar.classList.remove("active-navbar")
//   closeNavbar.style.display = "none"
//   openNavBar.style.display = "flex"
// })

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    activeNavBar.classList.remove("active-navbar")
  }
  
})




// Target multiple events for lists inside listsContainer
listsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

// Task container
tasksContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})


// Target events for adding project
addProject.addEventListener("click", e => {
  e.preventDefault()
  modalProject.show()
})


// Target events for adding tasks
addTask.addEventListener("click", (e) => {
  e.preventDefault()
  modalTask.show()
}) 


closeProjectDialog.addEventListener("click", e => {
  e.preventDefault()
  modalProject.close()
  newListInput.value = ''
})

closeTaskDialog.addEventListener("click", (e) => {
  e.preventDefault()
  modalTask.close()
  newListInput.value = ''
})

submitProject.addEventListener("click", e => {
  modalProject.close()
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

submitTask.addEventListener("click", e => {
  modalTask.close()
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

clearCompleteTasksButton.addEventListener("click", e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener("click", e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})


function createList(project) {
  return { id: Date.now().toString(), name: project, tasks: [] }
}

function createTask(project) {
  return { id: Date.now().toString(), name: project, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = "none"
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement("li")
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add("active-list")
    }
    listsContainer.appendChild(listElement)
  })
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkBox = taskElement.querySelector("input")
    checkBox.id = task.id
    checkBox.checked = task.complete
    const label = taskElement.querySelector("label")
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `Current ${taskString}: ${incompleteTaskCount}`
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()