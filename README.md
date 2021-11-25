## How to run the project
1. open terminal
2. serve secretlab-exercise

## Limitations
1. Localstorage/Sessionstorage can only store the data upto 3-5mb, only string data can be stored, so JSON.parse and JSON.string should be used all through out when using data objects, which I am having trouble saving the dataURL/Base64 image
2. Internet explorer 11 and less it is not working

## Project Issues (Hotfix)
1. Responsive for canvas image and tags is not there
2. Code is messy, not extendable and redudant codes
2. When draw beyond the canvas and then put the drawing inside afterwards, won't save.

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


### Github Actions
1. https://docs.github.com/en/actions/guides/building-and-testing-nodejs
2. https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule

### Docs
1. https://jsdoc.app/index.html
