import "./Carrusel.css"
import {useEffect, useState} from "react";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";


const Carrusel = (props) => {

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        slidesToScroll: "auto",
        align: "start",

    });

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [selectedSnap, setSelectedSnap] = useState(0);

    const scrollTo = (index: number) => emblaApi?.scrollTo(index);
    const setupSnaps = (emblaApi: EmblaCarouselType) => setScrollSnaps(emblaApi.scrollSnapList());
    const setActiveSnap = (emblaApi: EmblaCarouselType) => setSelectedSnap(emblaApi.selectedScrollSnap());

    useEffect(() => {
        if(!emblaApi) return;

        setupSnaps(emblaApi);
        setActiveSnap(emblaApi);

        emblaApi.on("reInit", setupSnaps);
        emblaApi.on("reInit", setActiveSnap);
        emblaApi.on("select", setActiveSnap);

    }, [emblaApi]);
    
    return <>

        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {props.libros}
                </div>
            </div>
            
            <div className="controls">
                <button className="embla__prev" onClick={scrollPrev}><i className="material-symbols-rounded arrow">arrow_left</i></button>
                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <button
                            className={"embla__dot".concat(
                                index === selectedSnap ? ' embla__dot--selected' : ''
                            )}
                            key={index}
                            onClick={() => scrollTo(index)}
                        >
                            <i className="material-symbols-rounded icon_fill dot">circle</i>
                        </button>
                    ))}
                </div>
                <button className="embla__next" onClick={scrollNext}><i className="material-symbols-rounded arrow">arrow_right</i></button>
            </div>
        </div>
    </>
}

export default Carrusel;