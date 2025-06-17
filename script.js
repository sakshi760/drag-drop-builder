const draggables = document.querySelectorAll('.draggable');
const canvas = document.getElementById('canvas');
const editor = document.getElementById('editor');
const editForm = document.getElementById('editForm');

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
  let newEl;

  switch (type) {
    case 'text':
      newEl = document.createElement('p');
      newEl.textContent = 'Edit me!';
      break;

    case 'image':
      newEl = document.createElement('img');
      newEl.style.width = '150px';
      newEl.alt = 'Uploaded Image';
      newEl.style.margin = '10px';

      // Trigger file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            newEl.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      document.body.appendChild(fileInput);
      fileInput.click();
      break;

    case 'button':
      newEl = document.createElement('button');
      newEl.textContent = 'Click Me';
      newEl.style.padding = '5px 10px';
      break;
  }

  newEl.setAttribute('contenteditable', true);
  newEl.classList.add('canvas-element');
  newEl.style.margin = '10px';

  newEl.addEventListener('click', () => openEditor(newEl));

  canvas.appendChild(newEl);
});

function openEditor(el) {
  editForm.innerHTML = ''; // Clear previous form

  if (el.tagName === 'P') {
    editForm.innerHTML = `
      <label>Text:</label>
      <input type="text" value="${el.textContent}" 
        oninput="this.elementRef.textContent = this.value" />
      
      <label>Font Size (px):</label>
      <input type="number" value="${parseInt(window.getComputedStyle(el).fontSize)}" 
        oninput="this.elementRef.style.fontSize = this.value + 'px'" />
      
      <label>Color:</label>
      <input type="color" value="${rgbToHex(window.getComputedStyle(el).color)}"
        oninput="this.elementRef.style.color = this.value" />
    `;
  }

  if (el.tagName === 'IMG') {
    editForm.innerHTML = `
      <label>Image URL:</label>
      <input type="text" value="${el.src}" 
        oninput="this.elementRef.src = this.value" />
      <label>Width (px):</label>
      <input type="number" value="${el.width}" 
        oninput="this.elementRef.style.width = this.value + 'px'" />
    `;
  }

  if (el.tagName === 'BUTTON') {
    editForm.innerHTML = `
      <label>Button Text:</label>
      <input type="text" value="${el.textContent}" 
        oninput="this.elementRef.textContent = this.value" />
      
      <label>Background Color:</label>
      <input type="color" value="${rgbToHex(window.getComputedStyle(el).backgroundColor)}"
        oninput="this.elementRef.style.backgroundColor = this.value" />
    `;
  }

  // Assign reference of element to every input so "this.elementRef" works
  Array.from(editForm.querySelectorAll('input')).forEach(input => {
    input.elementRef = el;
  });
}

// Helper function to convert RGB to HEX
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return '#000000';
  return "#" + result.slice(0, 3)
    .map(x => ("0" + parseInt(x).toString(16)).slice(-2))
    .join('');
}
