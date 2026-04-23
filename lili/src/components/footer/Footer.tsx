import {Link} from "react-router-dom";
import "./Footer.css"

const Footer = () => {

    return <footer className="footer">
        <p>Las imágenes incluidas en esta web son Copyright © de sus respectivos autores.</p>
        <div className="cc">
            <Link to="https://example.com">Lili</Link> 2025 por <Link to="https://example.com">elenaferfor</Link>.
        </div>
    </footer>
}

export default Footer;