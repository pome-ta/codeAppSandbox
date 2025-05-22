let sketchCode = '';

console.log('top')


window.addEventListener('message', (e) => {
console.log('EventListener')
  sketchCode = e.data;
  console.log(`e:${sketchCode}`)
});
console.log(`o:${sketchCode}`)

document.addEventListener('DOMContentLoaded', () => {
  
  console.log('d')
  console.log(`d:${sketchCode}`)
  
});

window.addEventListener('load', ()=>{
  console.log('ページの読み込みが完了しました。');
  console.log(`l:${sketchCode}`)
});
