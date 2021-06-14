/**
 * Mouse events for creating rectangles in canvas
 * 
 * @mousedown
 * @mouseup
 * @mousemove
 */
canvas.addEventListener('mousedown', e => tagMouseDown(e));
canvas.addEventListener('mouseup', e => tagMouseUp(e));
canvas.addEventListener('mousemove', e => tagMouseMove(e));

/**
 * Initialise variable to create rectangles
 *
 * @class TagBox
 * @param none
 * @return mouse x and y, width and height + tag name
 */
function TagBox() {
	this.x = 0;
	this.y = 0;
	this.w = 1;
	this.h = 1;
	this.tag = "";
}

/**
 * Methods under class TagBox
 *
 * @function draw: draw rectangle
 * @function redraw: redraw rectangle with new x,y coordinates
 * @function isPointInside: check if mouse pointer is inside the rectangle
 * @function highlight: highlight when mouse pointer is inside the rectangle
 */
TagBox.prototype = {
	draw: function(context, fill="#444444") {
		context.strokeStyle = fill;
    context.strokeRect(this.x,this.y,this.w,this.h);
    context.font = "8pt Arial";
    context.fillStyle = fill;
    context.fillText(this.tag, (this.x + this.w) + 5, (this.y + this.h) + 20);
	},
  redraw: function (x, y) {
      this.x = x || this.x;
      this.y = y || this.y;
      this.draw(context);
      return (this);
  },
  isPointInside: function(x, y) {    
    return (x <= this.x && x >= this.x + this.w && y <= this.y && y >= this.y + this.h);
  },
  highlight: function (x, y) {
      this.x = x || this.x;
      this.y = y || this.y;
      this.draw(context, "rgb(67, 155, 249)");
      return (this);
  }
}

/**
 * By calling this function it will create a rectangle
 * 
 * @function addTag
 * @param {float} x - mouse x coordinate
 * @param {float} y - mouse y coordinate
 * @param {float} w - rectangle width
 * @param {float} h - rectangle height
 * @param {string} tag - name of the tag
 * @param {bool} isNew - if created tag is new or not
 * @returns 
 * 
 */
function addTag(x, y, w, h, tag, isNew=true) {
  if(w === undefined || h === undefined)
    return

	var rect = new TagBox;
	rect.x = x;
	rect.y = y;
	rect.w = w
	rect.h = h;
	rect.tag = tag;
	boxes.push(rect);	
  
  if(isNew) {
    /**
     * Update store array
     * Render the new item to tag element
     * Update row item with new created tags
     */
    store.push({"x": x,"y": y,"w": w, "h": h, "tag":tag});
    renderTagListItem(tag, currentKey, store.length - 1);
    db.collection('photos').doc(currentKey).update({ tags: store });
  }
}


/**
 * By calling this function it will update the coordinates of the rectangle when dragging,
 * 
 * @function updateTag
 * @param {float} x - mouse x coordinate
 * @param {float} y - mouse y coordinate
 * @param {float} w - rectangle width
 * @param {float} h - rectangle height
 * @param {string} tag - name of the tag
 * @returns 
 */
function updateTag(x, y, w, h, tag) {
  if(w === undefined || h === undefined)
    return

	var rect = new TagBox;
	rect.x = x;
	rect.y = y;
	rect.w = w;
	rect.h = h;
	rect.tag = tag;

  /**
   * 
   * Update store array with new data and update indexDB
   * Set activeDragIndex to null after updates
   */
	boxes[activeDragIndex] = rect;	
  store[activeDragIndex] = {"x": x,"y": y,"w": w, "h": h, "tag":tag};
  db.collection('photos').doc(currentKey).update({ tags: store });

  activeDragIndex = null;
}

/**
 * Get mouse x and y position
 * 
 * @function getMousePosition
 * @param {element} - dom
 * @returns 
 */
function getMousePosition(e){
	var element = canvas;
	offsetX = 0;
	offsetY = 0;

  // when it goes beyond the canvas
  if (element.offsetParent){
		do{
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		}
		while ((element = element.offsetParent));
	}

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY
}

/**
 * Get rectangle data when dragging starts
 * 
 * @function getDragPosition
 * @param {float} x - mouse x coordinate
 * @param {float} y - mouse y coordinate
 * @param {float} w - rectangle width
 * @param {float} h - rectangle height
 * @param {string} tag - name of the tag
 * @returns 
 */
function getDragPosition(x, y, w, h, tag) {
  xDrag = x;
  yDrag = y;
  wDrag = w;
  hDrag = h;
  tagDrag = tag;
}

/** @global */
let rectX = 0;
let rectY = 0;

/**
 * Draw and Dragging start here
 * 
 * @function tagMouseDown
 * @param {element} - dom
 * @returns 
 * 
 * check mouse pointer:
 * 1. if mouse pointer is inside the box it will be a dragging condition
 * 2. if mouse pointer is outside the box it will be a new tag
 * 
 * extra:
 * 1. get mouse x and y position, and assigned it to rectX and rectY to store data temporarily
 * 2. activeDragIndex set to null if mousedown starts
 */
tagMouseDown = function(e) {
	getMousePosition(e);
  
  activeDragIndex = null;
  rectX = mx;
  rectY = my;

  if(boxes.length > 0) {
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].isPointInside(mx, my)) {
        isDrawTagging = false;
        isDragging = true;
        activeDragIndex = i;
        return
      }
    }
  }

  isDrawTagging = true;
};


/**
 * Mouse move in canvas
 * 
 * @function tagMouseMove
 * @param {element} - dom
 * @returns 
 * 
 * check mouse moving:
 * 1. isDragging
 * 2. isDrawing
 * 3. Highlight tags
 */
tagMouseMove = function(e){
  getMousePosition(e);

  if(!isDragging) {
    if(boxes.length > 0) {
      context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
      activeTagIndex = null;
      renderTaglist(); // @TODO: revisit code, problem: will rerender once mouse is hovering the canvas

      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].isPointInside(mx, my)) {
          activeTagIndex = i;
          boxes[i].highlight();
          renderTaglist();
        } else {
          boxes[i].redraw();
        }
      }
    }
  }

	if (isDrawTagging){
    let x = Math.min(mx, rectX),
      y = Math.min(my, rectY),
      w = Math.abs(mx - rectX),
      h = Math.abs(my - rectY);

    /**
     * This function draws the box at intermediate steps
     */
    tagDraw(x, y, w, h);
  }

  if(isDragging) {
    let xDrag =boxes[activeDragIndex].x,
        yDrag =boxes[activeDragIndex].y,
        wDrag = boxes[activeDragIndex].w,
        hDrag = boxes[activeDragIndex].h;

    /**
     * Calculate the distance the mouse has moved, since the last mousemove
     */
    let dx = mx-rectX;
    let dy = my-rectY;

    /**
     * move each rect that isDragging 
     * by the distance the mouse has moved
     * since the last mousemove
     */
    xDrag += dx;
    yDrag += dy;
    
    getDragPosition(xDrag, yDrag, wDrag, hDrag, boxes[activeDragIndex].tag);
    dragDraw(xDrag, yDrag, wDrag, hDrag, boxes[activeDragIndex].tag); 
  }
}

/**
 * Mouse up in canvas
 * 
 * @function tagMouseUp
 * @param {element} - dom
 * @returns 
 * 
 * check mouse end if creating 
 * 1. create rectangle 
 * 2. create tag
 * 2. move rectangle 
 */
tagMouseUp = function(e){
  if(isDrawTagging) {
    var tag = prompt("Please enter tag name");

    if (tag != null && tag != "") { 
      var rectH = my - rectY;
	    var rectW = mx - rectX;
    }

    if ( rectH > 0) {
				rectY = my;
				rectH = -rectH;
			}
			if (rectW > 0) {
				rectX = mx;
				rectW = -rectW;
			}

      if (rectW == 0 || rectH == 0) {
				alert("Error creating tag! Please specify non-zero height and width");
      } else {
				addTag (rectX, rectY, rectW, rectH, tag);
			}

      
      renderElementsInCanvas();

      isDrawTagging = false;
  }

  if(isDragging) {
    var isDragConfirm = confirm("Are you sure you want to move the tag to this locaiton?");
    if(isDragConfirm) {
      updateTag (xDrag, yDrag, wDrag, hDrag, tagDrag);
    }
    
    renderElementsInCanvas();

    isDragging = false;
  }
 }


 /**
 * Creating new drawing when mouse over
 * 
 * @function tagDraw
 * @param {float} x - mouse x coordinate
 * @param {float} y - mouse y coordinate
 * @param {float} w - rectangle width
 * @param {float} h - rectangle height
 * @returns 
 */
function tagDraw(x, y, w, h) {
  if (!w || !h){
		return;
	}

  renderElementsInCanvas();

  context.fillStyle = "rgb(67, 155, 249, 0.3)";
  context.fillRect(x, y, w, h);
  context.lineWidth = 1;
  context.strokeStyle = "rgb(67, 155, 249)";
  context.strokeRect(x, y, w, h);
}

/**
 * Creating new drawing when dragging
 * 
 * @function dragDraw
 * @param {float} x - mouse x coordinate
 * @param {float} y - mouse y coordinate
 * @param {float} w - rectangle width
 * @param {float} h - rectangle height
 * @param {string} tag - name of the tag
 * @returns 
 */
function dragDraw(x, y, w, h, tag) {
	if (!w || !h){
		return;
	}

  renderElementsInCanvas();

  context.fillStyle = "rgb(238, 245, 42, 0.3)";
  context.fillRect(x, y, w, h);
  context.lineWidth = 1;
  context.strokeStyle = "rgb(238, 245, 42)";
  context.strokeRect(x, y, w, h);
  context.font = "8pt Arial";
  context.fillStyle = "black";
  context.fillText(tag, (x + w) + 5, (y + h) + 20);
}

/**
 * Render image and tags to canvas 
 * 
 * @function currentPhotoInCanvas
 * @param {string} photo - tag name
 * @param {string} key - indexDB id
 * @returns 
 */
function currentPhotoInCanvas (photo, key) {
  canvas.width = 650;
  canvas.height = 400;
  
  // reset 
  boxes = [];
  store = [];
  elementTags.innerHTML = "";

  canvasImage.onload = function() {
    let nw = canvasImage.naturalWidth;
    let nh = canvasImage.naturalHeight;
    let aspect = nw / nh;
    imageCanvasHeight = canvas.width / aspect;
    imageCanvasWidth = canvas.width;

    // set height when image is set to canvas
    canvas.height = imageCanvasHeight;
     
    db.collection('photos').doc(key).get().then(photo => {
      if(photo.tags !== null) {
        photo.tags.forEach(function(tag, index) {
          addTag(tag.x, tag.y, tag.w, tag.h, tag.tag, false);
          store.push(tag);
          renderTagListItem(tag.tag, key, index, null);
        });

        drawTags(boxes);
      }
    })

    context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
  }


  currentKey = key;
  canvasImage.src= photo;
  canvas.setAttribute("key", key);
}

/**
 * Wrapper for tag items
 * 
 * @function renderTaglist
 * @param
 * @returns 
 */
function renderTaglist() {
  elementTags.innerHTML = "";

  store.forEach(function(tag, index) {
    renderTagListItem(tag.tag, currentKey, index, activeTagIndex);
  });

  if(activeTagIndex !== null) {
    elementTags.innerHTML += "<div class='infoTag'><b>Tips:</b> Select and hold the mouse key inside the tag shape and drag it to new location.</div>"
  }
}

/**
 * Render items on the tag element 
 * 
 * @function renderTagListItem
 * @param {string} name - tag name
 * @param {string} key - indexDB id
 * @param {index} index - index for removeTag function
 * @param {int} activeTagIndex - set active class if not null
 * @returns 
 */
function renderTagListItem(name, key, index=null, activeTagIndex=null) {
  return elementTags.innerHTML += `
    <div key="${key}" class="tag-item ${activeTagIndex === index ? 'active' : ''}"> 
      <span>${name}</span> 
      <button onClick="removeTag(${index})" >x</button>
    </div>`;
}

/**
 * Set image in canvas
 * 
 * @function removeTag
 * @param {int} index - index of image to be remove
 * @returns 
 */
function removeTag(index) {
  // remove
  store.splice(index,1);
  boxes.splice(index,1);

  // re-render tags
  db.collection('photos').doc(currentKey).update({ tags: store }).then(function(response) {
    renderTaglist();
  });

  // draw boxes and image again
  renderElementsInCanvas();
}

/**
 * Set image in canvas
 * Render tags
 * 
 * @function renderElementsInCanvas
 * @param
 * @returns 
 */
function renderElementsInCanvas() {
  context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
  drawTags(boxes);
}

/**
 * Draw all the tags from indexDB
 * 
 * @function drawTags
 * @param {array} tags - list of TagBox
 * @returns 
 */
function drawTags(tags) {
  if(tags.length > 0) {
    tags.forEach(function(tag) {
      tag.draw(context);
    })
  }
}





