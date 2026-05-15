const BotonAtras = (props: { className?: any; style?: any; onClick?: any; }) => {
    
    const { className, style, onClick } = props;
    
    return <div
        className={className}
        style={{ ...style, display: "none" }}
        onClick={onClick}
    />
}
export default BotonAtras;