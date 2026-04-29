const NuevaEtiqueta = (props: any) => {
    
    const botonOnClick = () => {
        if(props.index === 0){
            props.onClick(props.index, "");
        }else{
            props.onClick(props.index, props.nombreBoton);   
        }
    }
    
    return <input type="text"
        className={props.className}
        onClick={botonOnClick}
    >{props.nombreBoton}</input>
}

export default NuevaEtiqueta;