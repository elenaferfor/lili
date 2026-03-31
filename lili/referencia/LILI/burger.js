/* FUNCIÓN MENÚ */
/* El menú siempre está en display: flex en pantallas de más de 600px */

const header = document.getElementById("header");
if(window.innerWidth > 600){
  setMas600();
}else{
  setMenos600();
}


window.onresize = () => {
  if(window.innerWidth > 600){
    setMas600();
  }else{
    setMenos600();
  }
}


/* Cuando la pantalla es de menos de 600px, funciona con el botón de menú */
const btn_menu = document.getElementById("menu_burger");
btn_menu.addEventListener("touchend", openNav);

const btn_close = document.getElementById("menu_close");
btn_close.addEventListener("touchend", closeNav);


function openNav() {
  header.style.width = "100vw";
  for(elem of header.children){
    elem.style.opacity = "1";
  }
  for(elem of header.querySelectorAll("nav a")){
    elem.style.opacity = "1";
    elem.style.width = "18rem";
  }
  for(elem of header.querySelectorAll("nav a.submenu")){
    elem.style.opacity = "1";
    elem.style.width = "16rem";
  }
  //header.style.display = "flex";
  console.log("abrir");
  header.style.pointerEvents = "initial";
}

function closeNav() {
  header.style.width = "0";
  for(elem of header.children){
    elem.style.opacity = "0";
  }
  for(elem of header.querySelectorAll("nav a")){
    elem.style.opacity = "0";
    elem.style.width = "0";
  }
  for(elem of header.querySelectorAll("nav a.submenu")){
    elem.style.opacity = "0";
    elem.style.width = "0";
  }
  //header.style.display = "none";
  console.log("cerrar");
  header.style.pointerEvents = "none";
}

function setMenos600(){
  header.style.width = "0";
  for(elem of header.children){
    elem.style.opacity = "0";
  }
  for(elem of header.querySelectorAll("nav a")){
    elem.style.opacity = "0";
    elem.style.width = "0";
  }
  for(elem of header.querySelectorAll("nav a.submenu")){
    elem.style.opacity = "0";
    elem.style.width = "0";
  }
  header.style.pointerEvents = "none";
}

function setMas600(){
  header.style.width = "18rem";
  for(elem of header.children){
    elem.style.opacity = "1";
  }
  for(elem of header.querySelectorAll("nav a")){
    elem.style.opacity = "1";
    elem.style.width = "13rem";
  }
  for(elem of header.querySelectorAll("nav a.submenu")){
    elem.style.opacity = "1";
    elem.style.width = "10rem";
  }
  header.style.pointerEvents = "initial";
}