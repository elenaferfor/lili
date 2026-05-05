import "./Section.css"

const Section = (props: { titulo: string; }) => {
    return <section>
        <h1>{props.titulo}</h1>
        <p></p>
    </section>
}

export default Section;