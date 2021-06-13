document.addEventListener('DOMContentLoaded', function(ev){
  // Preloader
  document.querySelector(".preloader").style.display = "none";
  document.querySelector(".pages").style.display = "block";

  // get next photo
  document.querySelector(".next").addEventListener("click", function() {
    const current = next(images, selectedImageIndex);

    if(current !== null) 
      updateCanvasDataAndIndex(current)
  });

  // get previous photo
  document.querySelector(".prev").addEventListener("click", function() {
    const current = previous(images, selectedImageIndex);
    
    if(current !== null) 
      updateCanvasDataAndIndex(current)
  });

  // delete photo
  document.querySelector(".delete").addEventListener("click", function() {
    if (confirm("Are you sure you want to delete this photo?")) {
      const key = canvas.getAttribute("key");

      db.collection('photos').doc(key).delete().then(function(response) {
        window.location.reload();
      });
    } 
  });
});


// update html(canvas in photo, index and x of total) when pressing next, previous
const updateCanvasDataAndIndex = (selectedIndex) => {
  selectedImageIndex = selectedIndex;
  currentPhotoInCanvas(images[selectedIndex].data.file, images[selectedIndex].key);
  renderFromTo(images.length, selectedIndex);
}

// previous function
const previous =  (images, current) => {
  if(images.length === 1 || current <= 0) 
    return current; 
    
  return current -= 1;
}

// next function
const next = (images, current) =>  {
  if(images.length === 1 || current >= images.length - 1) 
    return current; 

  return  current += 1;
}

// (current of total) function
const renderFromTo = (total, current_photo, ) => {
  document.querySelector(".current").innerHTML = current_photo + 1;
  document.querySelector(".total").innerHTML = total;
}

module.exports = {
  next,
  previous
};
