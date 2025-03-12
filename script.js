let draggedCard = null;
let rightClickedCard = null;

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
  initializeColumnAnimations();
});

function initializeColumnAnimations() {
  // Add staggered entrance animation to columns
  const columns = document.querySelectorAll('.column');
  columns.forEach((column, index) => {
    column.style.opacity = '0';
    column.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      column.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      column.style.opacity = '1';
      column.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  const taskText = input.value.trim();

  if (taskText === "") {
    shakeElement(input);
    return;
  }

  const taskDate = new Date().toLocaleString("en-IN");
  const taskElement = createTaskElement(taskText, taskDate);
  
  // Add with animation
  taskElement.style.opacity = '0';
  taskElement.style.transform = 'translateY(20px)';
  document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
  
  // Trigger animation after DOM update
  setTimeout(() => {
    taskElement.style.opacity = '1';
    taskElement.style.transform = 'translateY(0)';
  }, 10);
  
  updateTasksCount(columnId);
  saveTasksToLocalStorage(columnId, taskText, taskDate);
  input.value = "";
  
  // Flash column header to show update
  flashElement(document.querySelector(`#${columnId} h2`));
}

function createTaskElement(taskText, taskDate) {
  const element = document.createElement("div");

  element.innerHTML = `
    <span class="task-text">${taskText}</span>
    <small class="time">${taskDate}</small>
  `;
  element.classList.add("card");
  element.setAttribute("draggable", true);
  
  // Add event listeners
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);
  element.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    rightClickedCard = this;
    showContextMenu(e.pageX, e.pageY);
  });
  
  return element;
}

function dragStart() {
  this.classList.add("dragging");
  draggedCard = this;
  
  // Add pulse effect to potential drop zones
  document.querySelectorAll('.tasks').forEach(tasksContainer => {
    tasksContainer.classList.add('highlight-dropzone');
  });
}

function dragEnd() {
  this.classList.remove("dragging");
  draggedCard = null;
  
  // Remove pulse effect from drop zones
  document.querySelectorAll('.tasks').forEach(tasksContainer => {
    tasksContainer.classList.remove('highlight-dropzone');
  });
  
  ["todo", "doing", "done"].forEach((columnId) => {
    updateTasksCount(columnId);
  });
  updateLocalStorage();
}

const columns = document.querySelectorAll(".column .tasks");
columns.forEach((cols) => {
  cols.addEventListener("dragover", dragOver);
  cols.addEventListener("dragenter", (e) => {
    e.preventDefault();
    cols.classList.add('active-dropzone');
  });
  cols.addEventListener("dragleave", () => {
    cols.classList.remove('active-dropzone');
  });
  cols.addEventListener("drop", () => {
    cols.classList.remove('active-dropzone');
    // Flash column header to show update
    const columnId = cols.id.replace('-tasks', '');
    flashElement(document.querySelector(`#${columnId} h2`));
  });
});

function dragOver(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(this, e.clientY);
  if (afterElement === null) {
    this.appendChild(draggedCard);
  } else {
    this.insertBefore(draggedCard, afterElement);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];
  
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Context menu
const contextMenu = document.querySelector(".context-menu");

function showContextMenu(x, y) {
  // Ensure menu appears within viewport
  const menuWidth = 150; // Approximate width of context menu
  const menuHeight = 100; // Approximate height of context menu
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Adjust position if needed
  if (x + menuWidth > windowWidth) x = windowWidth - menuWidth;
  if (y + menuHeight > windowHeight) y = windowHeight - menuHeight;
  
  contextMenu.style.display = "block";
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  
  // Add fade-in animation
  contextMenu.style.opacity = '0';
  contextMenu.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    contextMenu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    contextMenu.style.opacity = '1';
    contextMenu.style.transform = 'scale(1)';
  }, 10);
}

document.addEventListener("click", () => {
  // Add fade-out animation
  if (contextMenu.style.display === 'block') {
    contextMenu.style.opacity = '0';
    contextMenu.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      contextMenu.style.display = "none";
    }, 200);
  }
});

function editTask() {
  if (rightClickedCard !== null) {
    const taskTextElement = rightClickedCard.querySelector('.task-text');
    const currentText = taskTextElement.textContent;
    
    const newTaskText = prompt("Edit Task", currentText);
    
    if (newTaskText !== null && newTaskText.trim() !== "") {
      const newTaskDate = new Date().toLocaleString("en-IN");
      
      // Create animation effect
      rightClickedCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      rightClickedCard.style.transform = 'scale(1.05)';
      rightClickedCard.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
      
      setTimeout(() => {
        taskTextElement.textContent = newTaskText;
        rightClickedCard.querySelector('.time').textContent = newTaskDate;
        
        // Revert animation
        setTimeout(() => {
          rightClickedCard.style.transform = '';
          rightClickedCard.style.boxShadow = '';
        }, 300);
      }, 200);
    }
  }
  updateLocalStorage();
}

function deleteTask() {
  if (rightClickedCard !== null) {
    const columnID = rightClickedCard.parentElement.id.replace("-tasks", "");
    
    // Add fade-out animation
    rightClickedCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    rightClickedCard.style.opacity = '0';
    rightClickedCard.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
      rightClickedCard.remove();
      updateTasksCount(columnID);
      updateLocalStorage();
    }, 300);
  }
}

function updateTasksCount(columnId) {
  const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
  const countElement = document.getElementById(`${columnId}-count`);
  
  // Animate count change
  countElement.style.transition = 'transform 0.3s ease';
  countElement.style.transform = 'scale(1.2)';
  countElement.textContent = count;
  
  setTimeout(() => {
    countElement.style.transform = 'scale(1)';
  }, 300);
}

// Local storage functions
function saveTasksToLocalStorage(columnId, taskText, taskDate) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push({ text: taskText, date: taskDate });
  localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.forEach(({ text, date }) => {
      const taskElement = createTaskElement(text, date);
      document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    });
    updateTasksCount(columnId);
  });
}

function updateLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = [];
    document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
      const taskText = card.querySelector(".task-text").textContent;
      const taskDate = card.querySelector(".time").textContent;
      tasks.push({ text: taskText, date: taskDate });
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
  });
}

// Helper animation functions
function flashElement(element) {
  element.style.transition = 'color 0.3s ease';
  const originalColor = window.getComputedStyle(element).color;
  
  element.style.color = 'var(--accent)';
  setTimeout(() => {
    element.style.color = originalColor;
  }, 500);
}

function shakeElement(element) {
  element.style.transition = 'transform 0.1s ease';
  element.style.transform = 'translateX(5px)';
  
  setTimeout(() => {
    element.style.transform = 'translateX(-5px)';
    setTimeout(() => {
      element.style.transform = 'translateX(3px)';
      setTimeout(() => {
        element.style.transform = 'translateX(-3px)';
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
        }, 100);
      }, 100);
    }, 100);
  }, 100);
}

// Add CSS for dropzone highlighting
const style = document.createElement('style');
style.textContent = `
  .highlight-dropzone {
    transition: background 0.3s ease;
  }
  .active-dropzone {
    background: rgba(56, 189, 248, 0.1);
    box-shadow: inset 0 0 0 2px var(--primary);
    border-radius: var(--card-radius);
  }
`;
document.head.appendChild(style);