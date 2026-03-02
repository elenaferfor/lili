import {Link} from "react-router-dom";
import "./Footer.css"

const Footer = () => {

    return <footer className="footer">
        <p>Las imágenes incluidas en esta web son Copyright © de sus respectivos autores.</p>
        <div className="cc">
            <Link to="https://example.com">Lili</Link> © 2025 por <a href="https://example.com">elenaferfor</a> está
            licenciada bajo <Link to="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</Link><img
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt=""/><img
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt=""/><img
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt=""/>
        </div>
    </footer>
}

export default Footer;