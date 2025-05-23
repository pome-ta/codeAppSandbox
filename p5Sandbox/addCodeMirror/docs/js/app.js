import Editor from './editor.js';


let loadedSource;

/* -- load Source */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}

const fsPath = './js/sketchBook/mainSketch.js';
loadedSource = await fetchSketchFile(fsPath);


const topSource = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport"
    content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />


    <script type="module">
    import eruda from 'https://cdn.skypack.dev/eruda';
    eruda.init();
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.5/lib/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/addons/p5.sound.min.js"></script>
    
  </head>
  <body>
    <script>`;

const bottomSource = `
    </script>
  </body>
</html>
`;


function getBlobURL(sketchSource) {
  //const sourceBlob = new Blob([sketchSource], { type: 'text/javascript' });
  const sourceBlob = new Blob([sketchSource], { type: 'text/html' });
  const blobURL = URL.createObjectURL(sourceBlob);
  return blobURL;
}


const hoge = `
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport"
    content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />


    <script type="module">
    import eruda from 'https://cdn.skypack.dev/eruda';
    eruda.init();
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.5/lib/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/addons/p5.sound.min.js"></script>
        <script crossorigin="anonymous">
      function setup() {
  createCanvas(240, 240);
}

function draw() {
  background(random() * 255);
}
    </script>
    
  </head>
  <body>

  </body>
</html>

`;


// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
//sandbox.loading = 'lazy'
//sandbox.sandbox = '';
//sandbox.srcdoc = topSource + getBlobURL(loadedSource) + bottomSource;
//sandbox.srcdoc = hoge;
//sandbox.src = getBlobURL(hoge);
sandbox.src = getBlobURL(topSource + loadedSource + bottomSource);
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';
document.body.appendChild(sandbox);


document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOMContentLoaded`);
  
  //sandbox.contentWindow.postMessage(loadedSource, '*');
  //loadedSource = await fetchSketchFile(fsPath);
  //scriptElement.src = fsPath;//getBlobURL(loadedSource);
  //document.head.appendChild(scriptElement);
  //document.body.appendChild(scriptElement);
  
});






