// Desktop mouseup, down and mousemove
canvas.addEventListener('mousedown', e => tagMouseDown(e));
canvas.addEventListener('mouseup', e => tagMouseUp(e));
canvas.addEventListener('mousemove', e => tagMouseMove(e));

function TagBox() {
	this.x = 0;
	this.y = 0;
	this.w = 1;
	this.h = 1;
	this.tag = "";
}

// Methods on the Box class
TagBox.prototype = {
	draw: function(context) {
		context.strokeStyle = "#444444";
    context.strokeRect(this.x,this.y,this.w,this.h);
    context.font = "8pt Arial";
    context.fillStyle = "#444444";
    context.fillText(this.tag, (this.x + this.w) + 5, (this.y + this.h) + 20);
	}
}

//Initialize a new Box and add it
function addTag(x, y, w, h, tag, isNew=true) {
  // will not store if tag is undefined
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
    store.push({"x": x,"y": y,"w": w, "h": h, "tag":tag});
    renderTagsToTHtml(tag, currentKey, store.length - 1);
    db.collection('photos').doc(currentKey).update({ tags: store });
  }
}

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

tagMouseDown = function(e) {
	getMousePosition(e);

	isDrawTagging = true;

	rectX = mx;
	rectY = my;
};

tagMouseMove = function(e){
	if (isDrawTagging){
    getMousePosition(e);

    var x = Math.min(mx, rectX),
      y = Math.min(my, rectY),
      w = Math.abs(mx - rectX),
      h = Math.abs(my - rectY);

    mainDraw(x, y, w, h);  // This function draws the box at intermediate steps
  }
}

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


      context.clearRect(0, 0, imageCanvasWidth, imageCanvasHeight);
      context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
      drawBoxes(boxes);

      isDrawTagging = false;
  }
 }

function mainDraw(x, y, w, h) {

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
  drawBoxes(boxes);

	if (!w || !h){
		return;
	}

  context.fillStyle = "rgb(67, 155, 249, 0.3)";
  context.fillRect(x, y, w, h);
  context.lineWidth = 1;
  context.strokeStyle = "rgb(67, 155, 249)";
  context.strokeRect(x, y, w, h);
}

function drawBoxes(tags) {
  if(tags.length > 0) {
    tags.forEach(function(tag) {
      tag.draw(context);
    })
  }
}

// Set photo in canvas
function currentPhotoInCanvas (photo, key) {
  canvas.width = 650;
  canvas.height = 400;
  
  // reset 
  boxes = [];
  store = [];
  renderTagsToTHtml(null, null, 0, true);

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
          renderTagsToTHtml(tag.tag, key, index);
        });

        drawBoxes(boxes);
      }
    })

    context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
  }


  currentKey = key;
  canvasImage.src= photo;
  canvas.setAttribute("key", key);
}


function removeTag(index) {
  renderTagsToTHtml(null, null, 0, true);
  store.splice(index,1);
  boxes.splice(index,1);

  db.collection('photos').doc(currentKey).update({ tags: store }).then(function(response) {
    store.forEach(function(tag, index) {
      renderTagsToTHtml(tag.tag, currentKey, index);
    });
  });

  context.drawImage(canvasImage, 0, 0, imageCanvasWidth, imageCanvasHeight);
  drawBoxes(boxes);
}



