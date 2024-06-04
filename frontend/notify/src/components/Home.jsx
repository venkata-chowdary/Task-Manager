import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./SideBar";
import Container from "./Container";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [reRenderSidebar, setreRenderSidebar] = useState(false);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
            }
            const { data } = await axios.post(
                "http://localhost:4000",
                {},
                { withCredentials: true }
            );
            const { status, user } = data;
            setUsername(user);
            if(status){
                navigate('/')
                console.log(status)
                return
            }
            removeCookie('token')
            navigate('/login')
            // return status
            //     ? toast(`Hello ${user}`, {
            //         position: "top-right",
            //     })
            //     : (removeCookie("token"), navigate("/login"));
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);


    const Logout = () => {
        removeCookie("token");
        navigate("/login");
    };

    return (
        <div className="app">
            <SideBar reRenderSidebar={reRenderSidebar} setreRenderSidebar={setreRenderSidebar} />
            <Container logout={Logout} setreRenderSidebar={setreRenderSidebar} username={username} />
        </div>
    );
};

export default Home;
