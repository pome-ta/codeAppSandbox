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


document.addEventListener('DOMContentLoaded', () => {
  const scriptElement = document.createElement('script');
  scriptElement.src = "./js/sketchMain.js";
  document.head.appendChild(scriptElement);
});
