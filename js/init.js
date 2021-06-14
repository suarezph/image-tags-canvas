/** @global */
const db = new Localbase('DBCanvas'); // indexDB Name
const filesInput = document.querySelector("#files");  // element name for file upload
const elementTags = document.querySelector("#tags");  // element name for list of tags
const elementThumbnails = document.querySelector("#thumbnails");  // element name for list of photos

let images = []; // local state of images (store images temporarily)
let selectedImageIndex = 0; // local state for selected images (get image index)
let currentKey = null; // get the key ID of the image (set by indexDB.: For delete image functionality.

let canvasImage = new Image(); // creates a new HTMLImageElement instance and will be set to canvas
let isDrawTagging = false; // set condition if drawing in canvas is already started
let activeTagIndex = null; // it is where when you hover the tag drawing in canvas, it will highlight the tag name. (set the tag index)
let activeDragIndex = null;  // it is where when you do the dragging, needs to get temporarily the tag index . (set the drag index)
let isDragging = false; // set condition if dragging in canvas is already started
let store = []; // local state: store tags drawing temporarily for saving and deleting in indexDB
let boxes = []; // local state: same with store but already initialise with new Boxes ready to render in canvas. 

const canvas = document.querySelector("#canvas"); // element name for canvas area
const context = canvas.getContext("2d"); // set canvas context into variable
let imageCanvasWidth = 0; // set initial width to 0 for canvas image
let imageCanvasHeight = 0; // set initial height to 0 for canvas image

/**
 * Fetch the data from the indexDB.
 *
 * @function fetchData
 * @return a bunch of renders (renderImageToThumbnails, updateCanvasDataAndIndex & showButtons)
 */
db.collection('photos').get({ keys: true }).then(items => {
  if(items.length > 0) {
    items.map((item, index) => {
      images.push({ 
        key: item.key, 
        data: item.data 
      });
      renderImageToThumbnails(item.data.file, item.key, index);
    });

    updateCanvasDataAndIndex(selectedImageIndex);
    showButtons();
  }
});



