let sketchCode = '';

console.log('s')


window.addEventListener('message', (e) => {

  sketchCode = e.data;
  console.log(sketchCode)
});
console.log(`o:${sketchCode}`)

document.addEventListener('DOMContentLoaded', () => {
  
  console.log('d')
  console.log(`d:${sketchCode}`)
  
});
