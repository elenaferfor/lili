const BotonAtras = (props) => {
    
    const { className, style, onClick } = props;
    
    return <div
        className={className}
        style={{ ...style, display: "none" }}
        onClick={onClick}
    />
}
export default BotonAtras;