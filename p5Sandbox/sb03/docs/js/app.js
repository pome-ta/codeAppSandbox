//import './sketchMain.js';

/*
import('./sketchMain.js').then(module => {
  console.log(module)
});
*/
/*

.then(module => {
      // 動的に読み込まれたSubクラス
      const sub = new module.Sub();
      sub.subMethod();  
    });
*/

const scriptElement = document.createElement('script');


const sketchCode = `
function setup() {
  createCanvas(240, 240);
}

function draw() {
  background(random() * 255);
}`;

const jsBlob = new Blob([sketchCode], { type: 'text/javascript' })
const blobURL=URL.createObjectURL(jsBlob);
//console.log(blobURL)



const button = document.createElement('button');
button.type = 'button';
button.textContent = 'button';

button.addEventListener('click', ()=>{

console.log('button')
scriptElement.src = blobURL;
location.reload(false)
});


document.addEventListener('DOMContentLoaded', () => {
  
  scriptElement.src = "./js/sketchMain.js";
  //scriptElement.src = blobURL;
  document.head.appendChild(scriptElement);
  document.body.appendChild(button);
  console.log(scriptElement)
  
});
