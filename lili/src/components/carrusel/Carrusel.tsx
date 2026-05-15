import {useRef, useState, useEffect} from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BotonAtras from "./botones/BotonAtras.tsx";
import BotonSiguiente from "./botones/BotonSiguiente.tsx";
import "./Carrusel.css"

const MIN_LIBRO_WIDTH = 160;
const MAX_DOTS = 4;

const Carrusel = (props: any) => {
    
    let sliderRef = useRef(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [slidesToShow, setSlidesToShow] = useState(5);
    
    useEffect(() => {
        const calcularSlides = () => {
            if(containerRef.current){
                const ancho = containerRef.current.offsetWidth;
                const slides = Math.max(1, Math.floor(ancho / MIN_LIBRO_WIDTH));
                setSlidesToShow(slides);
            }
        };
        
        calcularSlides();
        
        const observer = new ResizeObserver(calcularSlides);
        if(containerRef.current) observer.observe(containerRef.current);
        
        return () => observer.disconnect();
    }, []);

    const next = () => (sliderRef.current as any)?.slickNext();
    const previous = () => (sliderRef.current as any)?.slickPrev();

    const settings = {
        dots: true,
        appendDots: (dots: any) => (
            <div className="dots-wrapper">
                <button className="button" onClick={previous}>
                    <i className="material-symbols-rounded arrow">arrow_left</i>
                </button>
                <ul>{dots}</ul>
                <button className="button" onClick={next}>
                    <i className="material-symbols-rounded arrow">arrow_right</i>
                </button>
            </div>
        ),
        infinite: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: slidesToShow,
        prevArrow: <BotonAtras/>,
        nextArrow: <BotonSiguiente/>,
    };

    const libros = props.libros?.slice(0, MAX_DOTS * slidesToShow) ?? [];
    
    return <div ref={containerRef} style={{ width: "100%" }}>
        <Slider ref={sliderRef} {...settings}>
            {libros}
        </Slider>
    </div>
}

export default Carrusel;