import {Link} from "react-router-dom";

const Logo = () => {
    return <div className="logo">
        <i className="material-symbols-rounded" id="menu_close">close</i>
        <Link to="/" className="logo_link"><img src="/logo_dark.svg" alt="logo"/></Link>
    </div>
}

export default Logo;