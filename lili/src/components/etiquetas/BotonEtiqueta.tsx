const BotonEtiqueta = (props: any) => {
    
    const botonOnClick = () => {
        if(props.index === 0){
            props.onClick(props.index, "");
        }else{
            props.onClick(props.index, props.nombreBoton);   
        }
    }
    
    return <button
        className={props.className}
        onClick={botonOnClick}
    >{props.nombreBoton}</button>
}

export default BotonEtiqueta;