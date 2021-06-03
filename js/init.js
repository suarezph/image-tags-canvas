// db: init storage
const db = new Localbase('DBCanvas'); // indexDB Name
const filesInput = document.querySelector("#files"); // file upload element

let images = [];
let selectedImageIndex = 0; // 
let canvas, context; // canvas and the canvas context
let isDrawTagging = false; // an indication if drawing in canvas is already started
let canvasImage = new Image(); // creates a new HTMLImageElement instance

let imageCanvasWidth = 0;
let imageCanvasHeight = 0;
let currentKey = null;

let store = [];
let boxes = [];

canvas = document.querySelector("#canvas");
context = canvas.getContext("2d");

db.collection('photos').get({ keys: true }).then(items => {
  if(items.length > 0) {
    items.map((item, index) => {
      images.push({ 
        key: item.key, 
        data: item.data 
      });
      renderImageToThumbnails(item.data.file, item.key, index);
    });

    currentPhotoInCanvas(images[selectedImageIndex].data.file, images[selectedImageIndex].key);
    countItems(images, selectedImageIndex);
    showButtons();
  }
});

document.addEventListener('DOMContentLoaded', (ev) => {
  // Preloader
  document.querySelector(".preloader").style.display = "none";
  document.querySelector(".pages").style.display = "block";

  // Next photo
  document.querySelector(".next").addEventListener("click", function() {
    const current = next(images, selectedImageIndex);

    if(current !== null) {
      setIndex(current);
      currentPhotoInCanvas(images[current].data.file, images[current].key);
      countItems(images, current);
    }
  });

  // Previous photo
  document.querySelector(".prev").addEventListener("click", function() {
    const current = previous(images, selectedImageIndex);

    if(current !== null) {
      setIndex(current);
      currentPhotoInCanvas(images[current].data.file, images[current].key);
      countItems(images, current);
    }
  });

  // Delete photo
  document.querySelector(".delete").addEventListener("click", function() {
    if (confirm("Are you sure you want to delete this photo?")) {
      const key = canvas.getAttribute("key");
      db.collection('photos').doc(key).delete().then(function(response) {
        window.location.reload();
      });
    } 
  });
});


// Update selectedImageIndex
function setIndex(index) {
  selectedImageIndex = index;
}

// Set thumbnail photo in Canvas
function setPhotoByIndex(selectedIndex) {
  currentPhotoInCanvas(images[selectedIndex].data.file, images[selectedIndex].key);
  countItems(images, selectedIndex);
  setIndex(selectedIndex);
}

// Previous functionality
function previous(images, current) {
  if(images.length === 1) { return; }
  if(current <= 0) { return;  }

  current -= 1;

  return current;
}

// Next functionality
function next(images, current) {
  if(images.length === 1) { return; }
  if(current >= images.length - 1) { return; }

  current += 1;

  return current;
}

// Count functionality
function countItems(images, index) {
  // set total and current selected
  document.querySelector(".current").innerHTML = index + 1;
  document.querySelector(".total").innerHTML = images.length;
}

// Show/Hide buttons
function showButtons() {
  document.querySelector(".button-options").style.display = "flex";
}

// File uploads
filesInput.addEventListener('change', function() {
  const files = this.files;

  for(var i = 0; i< files.length; i++){
    let file = files[i];

    // only accepts images
    if(!file.type.match('image'))
        continue;

    let reader = new FileReader();

    reader.addEventListener("load", function() {
      const result = {
        "file": reader.result,
        "tags": null
      };

      db.collection('photos').add(result).then(function(response) {
        const data = JSON.parse(response.match("{(.*)}")[0]);

        if(images.length == 0){
          currentPhotoInCanvas(data.data.file, data.key);
          showButtons();
        }

        images.push(data);
        renderImageToThumbnails(data.data.file, data.key, images.length - 1);
        countItems(images, selectedImageIndex);
      });
    });

    reader.readAsDataURL(file);
  }
}); 

// Render image to thumbnails
function renderImageToThumbnails(image, key, index=null) {
  const div = document.querySelector("#thumbnails");
  div.innerHTML += `<img src="${image}"  key="${key}" onClick="setPhotoByIndex(${index})"  />`;
}

// Render names to tags element
function renderTagsToTHtml(name, key, index=null, empty=false) {
  const div = document.querySelector("#tags");
  if(!empty) {
    div.innerHTML += `
      <div key="${key}" class="tag-item"> 
        <span>${name}</span> 
        <button onClick="removeTag(${index})" >x</button>
      </div>`;
  } else {
    div.innerHTML = "";
  }
}



