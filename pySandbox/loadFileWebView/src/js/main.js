// import eruda from "https://esm.sh/eruda@3.0.1"
// eruda.init()

console.log(1);

//document.title = `js top title title title title title title title title title title`;

function addElement() {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id","logDiv");

  const newContent = document.createTextNode("みなさん、こんにちは!2025-04-22 14:37:42.770852");

  newDiv.appendChild(newContent);

  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log(2);
  addElement()
});


window.addEventListener("load", (event) => {
  console.log(3);
  //document.title = `js load titletitle title title title title title title title title title`;
  const logDiv = document.getElementById("logDiv");
  const textContent = logDiv.textContent;
  console.log(textContent);
});

console.log(4);
    