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

        // always set the photo to current selected,
        // if not, it will set to a new uploaded photo
        if(images.length == 0){
          currentPhotoInCanvas(data.data.file, data.key);
          showButtons();
        }

        images.push(data);
        renderImageToThumbnails(data.data.file, data.key, images.length - 1);
        renderFromTo(images.length, selectedImageIndex);
      });
    });

    reader.readAsDataURL(file);
  }
}); 

// set thumbnail photo in Canvas
const setPhotoByIndex = (selectedIndex) => updateCanvasDataAndIndex(selectedIndex);

// Show/Hide buttons
const showButtons = () => document.querySelector(".button-options").style.display = "flex";

// Render image to thumbnails
const renderImageToThumbnails = (image, key, index=null)  => elementThumbnails.innerHTML += `<img src="${image}"  key="${key}" onClick="setPhotoByIndex(${index})"  />`;


