document.addEventListener('DOMContentLoaded', function(ev){
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
const previous =  (images, current) => {
  if(images.length === 1 || current <= 0) 
    return current; 
    
  return current -= 1;
}

// Next functionality
const next = (images, current) =>  {
  if(images.length === 1 || current >= images.length - 1) 
    return current; 

  return  current += 1;
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

module.exports = {
  next,
  previous
};
