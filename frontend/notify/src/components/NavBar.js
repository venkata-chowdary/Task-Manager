import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faL, faTimes, faSort } from '@fortawesome/free-solid-svg-icons'
const { Link } = require("react-router-dom");


function NavBar(props) {

    console.log(props)
    function sideBarToggle(){
        props.setToggleSideBar((toggle)=> !toggle)
    }

    const toggle=props.toggleSideBar

    return (
        <div className="navbar">
            <button onClick={sideBarToggle} className={`toggle-btn ${toggle ? 'open' : 'closed'}`}>
                {toggle ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
            </button>
            <Link to='/profile'>Profile</Link>
        </div>

    )
}

export default NavBar