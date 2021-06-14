## How to run the project
1. open terminal
2. serve secretlab-exercise

## Process and achievements for 4hrs a day of work in 7 days
1. To be honest, I dont have any experience on canvas, but I accepted the challenge as I know it is an investment for myself and actually I do love learning new things. Anyhow, My first and second day was tough because I need to read the basics on canvas + indexDB as well and parallel with that I am testing it on my local or in my codepen too. I spent the whole two days before working on the exercise.
2. Working on the exercise (3-7 days)
  * 2.1. I worked on html and css for main layouts with mobile responsive except for the canvas
  * 2.2. I integrate multiple uploads and later integrate indexDB to store or retrieve data 
  * 2.3. I worked on next, previous, count and delete functionality
  * 2.4. I worked on canvas drawing, With this guidance and can be found below resources (Canvas #4)
  * 2.5. I worked on listing tags (retrieving data, storing data and clear functionality)
  * 2.5. I worked on drag functionality

## Limitations
1. Localstorage/Sessionstorage can only store the data upto 3-5mb, only string data can be stored, so JSON.parse and JSON.string should be used all through out when using data objects, which I am having trouble saving the dataURL/Base64 image
2. Internet explorer 11 and less it is not working

## Project Issues (Hotfix)
1. Responsive for canvas image and tags is not there
2. Currently my code is quite messy, is not extendable and there are redudant codes, I have to clean this one up as soon as possible.
2. If I draw beyond the canvas and then I properly put the drawing inside afterwards, I still got an error and won't save.
3. The upload button css is not compatible in firefox, need to work around.

## Future Features
1. Add button to remove all photos/images
2. Add button to clear all tags
4. When deleting image should not refresh the page

## Resources
### IndexDB
1. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
2. http://jsfiddle.net/unclelongmao/VrS32/
3. https://github.com/dannyconnell/localbase
4. https://www.youtube.com/watch?v=KJnupY2HPCg

### Canvas 
1. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
2. https://devhints.io/canvas
3. https://www.youtube.com/watch?v=gm1QtePAYTM
4. https://sapandiwakar.in/using-html5-canvas-element-to-create-cool-tagging-interface/

### Test Framework
1. https://jestjs.io/

### Docs
1. https://jsdoc.app/index.html

# TODO
1. Implement IIFE(Immediately Invoked Function Expression) and "use strict"; so all the initialise variable willl be turn local and will not be available globally
  ```(function () {
   "use strict";
   ... code ....
   }());
