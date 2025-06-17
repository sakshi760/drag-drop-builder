const draggables = document.querySelectorAll('.draggable');
const canvas = document.getElementById('canvas');
const editForm = document.getElementById('editForm');

let draggedType = null;

// Handle desktop drag
draggables.forEach(el => {
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });

  // Mobile drag logic
  el.addEventListener('touchstart', (e) => {
    draggedType = e.target.dataset.type;
  });
});

canvas.addEventListener('dragover', (e) => e.preventDefault());

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  createElement(type);
});

// Mobile drop
canvas.addEventListener('touchend', () => {
  if (draggedType) {
    createElement(draggedType);
    draggedType = null;
  }
});

function createElement(type) {
  let newEl;
  switch (type) {
    case 'text':
      newEl = document.createElement('p');
      newEl.textContent = 'Edit me!';
      break;
    case 'image':
      newEl = document.createElement('img');
      newEl.src = 'https://via.placeholder.com/150';
      newEl.style.maxWidth = '100px';
      break;
    case 'button':
      newEl = document.createElement('button');
      newEl.textContent = 'Click Me';
      break;
  }

  newEl.setAttribute('contenteditable', true);
  newEl.style.margin = '10px';
  newEl.classList.add('canvas-element');
  canvas.appendChild(newEl);
  newEl.addEventListener('click', () => openEditor(newEl));
}

function openEditor(el) {
  editForm.innerHTML = ''; // Clear previous

  if (el.tagName === 'P') {
    editForm.innerHTML = `
      <label>Text:</label>
      <input type="text" value="${el.textContent}" onchange="this.previousElementSibling.nextElementSibling.value = this.value; el.textContent = this.value" />
      <label>Font Size:</label>
      <input type="number" value="16" onchange="el.style.fontSize = this.value + 'px'" />
      <label>Color:</label>
      <input type="color" onchange="el.style.color = this.value" />
    `;
  }

  if (el.tagName === 'IMG') {
    editForm.innerHTML = `
      <label>Image URL:</label>
      <input type="text" value="${el.src}" onchange="el.src = this.value" />
      <label>Width (px):</label>
      <input type="number" value="${el.width}" onchange="el.width = this.value" />
    `;
  }

  if (el.tagName === 'BUTTON') {
    editForm.innerHTML = `
      <label>Button Text:</label>
      <input type="text" value="${el.textContent}" onchange="el.textContent = this.value" />
      <label>Background:</label>
      <input type="color" onchange="el.style.background = this.value" />
    `;
  }
}
