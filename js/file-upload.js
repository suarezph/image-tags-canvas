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


// Render image to thumbnails
function renderImageToThumbnails(image, key, index=null) {
  elementThumbnails.innerHTML += `<img src="${image}"  key="${key}" onClick="setPhotoByIndex(${index})"  />`;
}

// Render names to tags element
function renderTagsToTHtml(name, key, index=null, activeTagIndex=null) {
  elementTags.innerHTML += `
    <div key="${key}" class="tag-item ${activeTagIndex === index ? 'active' : ''}"> 
      <span>${name}</span> 
      <button onClick="removeTag(${index})" >x</button>
    </div>`;
}