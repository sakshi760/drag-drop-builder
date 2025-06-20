const draggables = document.querySelectorAll('.draggable');
const canvas = document.getElementById('canvas');
const editForm = document.getElementById('editForm');

// Desktop Drag Events
draggables.forEach(el => {
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });
});

canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  createElement(type);
});

// Touch support (for mobile)
draggables.forEach(el => {
  el.addEventListener('click', () => {
    const type = el.dataset.type;
    createElement(type);
  });
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
  newEl.classList.add('canvas-element');
  newEl.style.margin = '10px';
  canvas.appendChild(newEl);

  newEl.addEventListener('click', () => openEditor(newEl));
}

function openEditor(el) {
  editForm.innerHTML = '';

  if (el.tagName === 'P') {
    editForm.innerHTML = `
      <label>Text:</label>
      <input type="text" value="${el.textContent}" oninput="this.element.textContent = this.value">
      <label>Font Size:</label>
      <input type="number" value="${parseInt(window.getComputedStyle(el).fontSize)}" oninput="this.element.style.fontSize = this.value + 'px'">
      <label>Color:</label>
      <input type="color" value="${rgbToHex(window.getComputedStyle(el).color)}" oninput="this.element.style.color = this.value">
    `;
  }

  if (el.tagName === 'IMG') {
    editForm.innerHTML = `
      <label>Image URL:</label>
      <input type="text" value="${el.src}" oninput="this.element.src = this.value">
      <label>Width (px):</label>
      <input type="number" value="${el.width}" oninput="this.element.style.width = this.value + 'px'">
    `;
  }

  if (el.tagName === 'BUTTON') {
    editForm.innerHTML = `
      <label>Button Text:</label>
      <input type="text" value="${el.textContent}" oninput="this.element.textContent = this.value">
      <label>Background:</label>
      <input type="color" value="${rgbToHex(window.getComputedStyle(el).backgroundColor)}" oninput="this.element.style.background = this.value">
    `;
  }

  const inputs = editForm.querySelectorAll('input');
  inputs.forEach(input => {
    input.element = el;
  });
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return "#" + result.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
}
