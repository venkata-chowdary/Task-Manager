import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./SideBar";
import Container from "./Container";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "./NavBar";
import { UserContext } from "../Context/UserContext";

const Home = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [reRenderSidebar, setreRenderSidebar] = useState(false);
    const {userDetails,setUserDetails}=useContext(UserContext)
    const [toggleSideBar,setToggleSideBar]=useState(false)


    useEffect(() => {
        const verifyCookie = async () => {
            try {
                if (!cookies.token) {
                    navigate("/login");
                }
                const { data } = await axios.post(
                    "http://localhost:4000",
                    {},
                    { withCredentials: true }
                );
                const { status, user } = data;
                setUsername(user.username);
                setUserDetails(user)
                console.log('User details:',user.password)
                if (status) {
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error verifying token");
                removeCookie("token");
                navigate("/login");
            }
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);

    const Logout = () => {
        removeCookie("token");
        setUserDetails(null)
        navigate("/login");
    };

    return (
        <div className="app">
            <NavBar toggleSideBar={toggleSideBar} setToggleSideBar={setToggleSideBar}/>
            <SideBar reRenderSidebar={reRenderSidebar} setreRenderSidebar={setreRenderSidebar} toggleSideBar={toggleSideBar}/>
            <Container logout={Logout} setreRenderSidebar={setreRenderSidebar} username={username} />
        </div>
    );
};

export default Home;
