import { useNavigate, Link } from "react-router-dom/dist"
import { Event } from "../events/Event"
import "./Navbar.css"

export const Navbar = () => {

    const navigate = useNavigate()

    return <>
        <nav>
            <div className="navBar">
                <img className="logo" src={require("./images/logo.png")} alt="" />
                <ul>
                    <li className="navBar_item"><Link className="navBar_link" to="/aboutUs">About Us</Link></li>
                    <li className="navBar_item"><Link className="navBar_link" to="/map">Directions</Link></li>
                    <li className="navBar_item"><Link className="navBar_link" to="/events">Events</Link></li>
                    <li className="navBar_item"><Link className="navBar_link" to="">My Events</Link></li>
                    <li className="navBar_item"><Link className="navBar_link" to="">Profile</Link></li>

                    {
                        localStorage.getItem("project_user")
                            ?
                            <li className="navBar_item" > <Link className="navBar_link" to="" onClick={
                                () => {
                                    localStorage.removeItem("project_user")
                                    navigate("/", { replace: true })
                                }
                            }>Logout</Link>

                            </li> : ""}
                </ul>
            </div>
        </nav>
        <div className="navSpacer">
        </div>
    </>
}

