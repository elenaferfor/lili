import { useRef, type RefObject } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import BotonAtras from "./botones/BotonAtras.tsx";
import BotonSiguiente from "./botones/BotonSiguiente.tsx";
import "./Carrusel.css"


const Carrusel = (props) => {
    
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };

    var settings = {
        dots: true,
        appendDots: dots => (
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
        slidesToShow: 5,
        slidesToScroll: 5,

        prevArrow: <BotonAtras/>,
        nextArrow: <BotonSiguiente/>,
    };
    
    return <>
        <Slider
            ref={(slider: RefObject<null>) => {
                sliderRef = slider;
            }}
            {...settings}>
            {props.libros}
        </Slider>
    </>
}

export default Carrusel;