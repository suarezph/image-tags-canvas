// db: init storage
const db = new Localbase('DBCanvas'); // indexDB Name
const filesInput = document.querySelector("#files");  // file upload element
const elementTags = document.querySelector("#tags");  // tags element
const elementThumbnails = document.querySelector("#thumbnails");  // tags element

let images = [];
let selectedImageIndex = 0; // index image selected to be set in canvas
let canvas, context; // canvas and the canvas context
let isDrawTagging = false; // an indication if drawing in canvas is already started
let canvasImage = new Image(); // creates a new HTMLImageElement instance

let activeTagIndex = null;
let activeDragIndex = null;
let imageCanvasWidth = 0;
let imageCanvasHeight = 0;
let currentKey = null;
let isDragging = false;

let store = [];
let boxes = [];

canvas = document.querySelector("#canvas");
context = canvas.getContext("2d");


//  @TODO: Implement IIFE and "use strict"; so initialise variable willl be turn local and will not be available globally
// (function () {
//   "use strict";
//   ... code ....
// }());



