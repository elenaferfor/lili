import {Link} from "react-router-dom";

const Logo = (props: any) => {
    return <div className="logo">
        <button id="menu_close" onClick={props.onCloseMenu} onTouchEnd={props.closeMenu}><i className="material-symbols-rounded">close</i></button>
        <Link to="/" className="logo_link"><img src="/logo_dark.svg" alt="logo"/></Link>
    </div>
}

export default Logo;