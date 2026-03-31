/* FUNCIÓN MOSTRAR SERIE */
const btn_mostrar = document.getElementById("mostrarSerie");
const listaCadaveres = document.querySelectorAll(".cadaveres");

btn_mostrar.addEventListener("click", mostrarSerie);

function mostrarSerie(){
  if(btn_mostrar.innerText === "Mostrar"){
    for(let libro of listaCadaveres){
      libro.classList.remove("oculto");
    }
    btn_mostrar.innerText = "Ocultar";
  }else{
    for(let libro of listaCadaveres){
      libro.classList.add("oculto");
    }
    btn_mostrar.innerText = "Mostrar";
  }
  
}